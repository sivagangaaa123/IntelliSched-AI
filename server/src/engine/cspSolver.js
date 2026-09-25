/**
 * IntelliSched AI - Core CSP Scheduling Engine
 * Implements Constraint Satisfaction Problem (CSP) with:
 * - Variable and Domain Formulation
 * - Minimum Remaining Values (MRV) Heuristic
 * - Forward Checking (FC)
 * - Recursive Backtracking Search
 */

const { validateHardConstraints, calculateScheduleMetrics } = require('./constraints');
const { generateScheduleExplanation } = require('./explainability');

class CSPSolver {
  constructor({ courses, classrooms, timeSlots, facultyList, studentGroups, config }) {
    this.courses = courses;
    this.classrooms = classrooms;
    this.timeSlots = timeSlots;
    this.facultyList = facultyList;
    this.studentGroups = studentGroups;
    this.config = config || {};

    // Lookup Maps
    this.facultyMap = new Map(facultyList.map(f => [f._id.toString(), f]));
    this.classroomMap = new Map(classrooms.map(c => [c._id.toString(), c]));
    this.groupMap = new Map(studentGroups.map(g => [g._id.toString(), g]));
  }

  /**
   * Decompose courses into individual period variables
   */
  generateVariables() {
    const variables = [];

    this.courses.forEach(course => {
      const periods = course.weeklyPeriods || 3;
      const faculty = this.facultyMap.get(
        (course.faculty._id || course.faculty).toString()
      );
      const studentGroup = this.groupMap.get(
        (course.studentGroup._id || course.studentGroup).toString()
      );

      for (let p = 1; p <= periods; p++) {
        variables.push({
          varId: `${course.courseCode}_S${p}`,
          sessionIndex: p,
          course,
          faculty,
          studentGroup,
          requiredRoomType: course.requiredRoomType || 'Classroom'
        });
      }
    });

    return variables;
  }

  /**
   * Compute initial domain for a given variable
   */
  computeInitialDomain(variable) {
    const domain = [];

    // Filter suitable classrooms first (Hard constraint: type and capacity)
    const eligibleRooms = this.classrooms.filter(room => {
      if (room.capacity < variable.studentGroup.studentCount) return false;
      if (variable.requiredRoomType === 'Classroom') {
        return room.type === 'Classroom' || room.type === 'Seminar Hall';
      }
      return room.type === variable.requiredRoomType;
    });

    this.timeSlots.forEach(slot => {
      eligibleRooms.forEach(room => {
        // Fast initial check on static availability
        const facultyAvail = !variable.faculty.unavailableSlots?.some(
          s => s.day === slot.day && s.period === slot.period
        );
        const roomAvail = !room.unavailableSlots?.some(
          s => s.day === slot.day && s.period === slot.period
        );

        if (facultyAvail && roomAvail) {
          domain.push({
            timeSlot: slot,
            classroom: room
          });
        }
      });
    });

    return domain;
  }

  /**
   * Order domain values using Least Constraining Value / Soft preference heuristic
   */
  orderDomainValues(variable, domain, currentSchedule) {
    // Sort values: prefer slots that distribute classes evenly and match faculty preference
    return domain.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Faculty time preference
      if (variable.faculty.preferences?.preferredTime === 'morning') {
        if (a.timeSlot.period <= 3) scoreA += 5;
        if (b.timeSlot.period <= 3) scoreB += 5;
      } else if (variable.faculty.preferences?.preferredTime === 'afternoon') {
        if (a.timeSlot.period >= 4) scoreA += 5;
        if (b.timeSlot.period >= 4) scoreB += 5;
      }

      // Day distribution: penalize placing more than 2 sessions of same course on same day
      const aDayCount = currentSchedule.filter(
        s => s.course._id.toString() === variable.course._id.toString() && s.day === a.timeSlot.day
      ).length;
      const bDayCount = currentSchedule.filter(
        s => s.course._id.toString() === variable.course._id.toString() && s.day === b.timeSlot.day
      ).length;

      scoreA -= aDayCount * 10;
      scoreB -= bDayCount * 10;

      return scoreB - scoreA;
    });
  }

  /**
   * Main CSP Backtracking Search with MRV Heuristic and Forward Checking
   */
  solve() {
    const rawVariables = this.generateVariables();
    console.log(`🧩 CSP Formulation: ${rawVariables.length} session variables to schedule across ${this.timeSlots.length} timeslots.`);

    // Initialize domains
    const variableDomains = new Map();
    rawVariables.forEach(v => {
      const dom = this.computeInitialDomain(v);
      variableDomains.set(v.varId, dom);
    });

    // Check for immediate unfeasibility
    for (const v of rawVariables) {
      if (variableDomains.get(v.varId).length === 0) {
        return {
          success: false,
          reason: `No feasible initial domain found for ${v.course.name} (${v.varId}). Check room capacity and room type requirements.`,
          unassignedVariable: v
        };
      }
    }

    // Sort variables using MRV (Minimum Remaining Values heuristic: smallest domain first)
    const sortedVariables = [...rawVariables].sort((a, b) => {
      const domLenA = variableDomains.get(a.varId).length;
      const domLenB = variableDomains.get(b.varId).length;
      return domLenA - domLenB;
    });

    const solution = [];
    const maxSteps = 100000;
    let stepsCount = 0;

    const backtrack = (varIndex) => {
      stepsCount++;
      if (stepsCount > maxSteps) {
        console.warn('⚠️ CSP Solver reached maximum recursion depth.');
        return false;
      }

      // Base case: all variables assigned
      if (varIndex >= sortedVariables.length) {
        return true;
      }

      const variable = sortedVariables[varIndex];
      const domain = variableDomains.get(variable.varId);
      const orderedValues = this.orderDomainValues(variable, domain, solution);

      for (const val of orderedValues) {
        // Validate hard constraints against current partial schedule
        const validation = validateHardConstraints({
          course: variable.course,
          faculty: variable.faculty,
          studentGroup: variable.studentGroup,
          classroom: val.classroom,
          timeSlot: val.timeSlot,
          currentSchedule: solution
        });

        if (validation.valid) {
          // Assign
          const assignment = {
            slot: val.timeSlot,
            day: val.timeSlot.day,
            period: val.timeSlot.period,
            course: variable.course._id,
            courseCode: variable.course.courseCode,
            courseName: variable.course.name,
            faculty: variable.faculty._id,
            facultyName: variable.faculty.name,
            classroom: val.classroom._id,
            classroomName: val.classroom.name,
            studentGroup: variable.studentGroup._id,
            studentGroupName: variable.studentGroup.name,
            isElectiveGroup: variable.studentGroup.isElectiveGroup || false,
            parentGroupId: variable.studentGroup.parentGroupId || null
          };

          solution.push(assignment);

          // Forward Checking: Ensure next variables still have at least 1 valid option
          let domainWipedOut = false;
          if (varIndex + 1 < sortedVariables.length) {
            const nextVar = sortedVariables[varIndex + 1];
            const nextDomain = variableDomains.get(nextVar.varId);
            const hasValidOption = nextDomain.some(nextVal => 
              validateHardConstraints({
                course: nextVar.course,
                faculty: nextVar.faculty,
                studentGroup: nextVar.studentGroup,
                classroom: nextVal.classroom,
                timeSlot: nextVal.timeSlot,
                currentSchedule: solution
              }).valid
            );
            if (!hasValidOption) domainWipedOut = true;
          }

          if (!domainWipedOut) {
            const success = backtrack(varIndex + 1);
            if (success) return true;
          }

          // Backtrack
          solution.pop();
        }
      }

      return false;
    };

    const startTime = Date.now();
    const isSolved = backtrack(0);
    const durationMs = Date.now() - startTime;

    if (!isSolved) {
      return {
        success: false,
        reason: 'No feasible timetable found with the current constraints. Consider expanding classroom availability or relaxing faculty leave periods.',
        stats: { steps: stepsCount, durationMs }
      };
    }

    // Calculate quality metrics
    const metrics = calculateScheduleMetrics(
      solution,
      this.facultyList,
      this.studentGroups,
      this.config
    );

    // Generate plain-English explanation
    const explanation = generateScheduleExplanation(solution, metrics, {
      totalFaculty: this.facultyList.length,
      totalRooms: this.classrooms.length,
      totalCourses: this.courses.length
    });

    console.log(`✅ CSP Solved in ${durationMs}ms with ${stepsCount} steps! Soft score: ${metrics.softScore}/100`);

    return {
      success: true,
      grid: solution,
      metrics,
      explanation,
      stats: { steps: stepsCount, durationMs }
    };
  }
}

module.exports = CSPSolver;
