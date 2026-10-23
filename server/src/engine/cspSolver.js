/**
 * IntelliSched AI - Core CSP Scheduling Engine
 * Implements Constraint Satisfaction Problem (CSP) with:
 * - Variable and Domain Formulation (Macro 2-Period Continuous Blocks for Practical Labs)
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
    this.labCourseIds = new Set(courses.filter(c => c.courseType === 'Lab').map(c => (c._id || c).toString()));
  }

  /**
   * Decompose courses into variables:
   * - Lab courses are decomposed into 2-period continuous blocks
   * - Theory & activity courses are decomposed into single-period variables
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

      if (course.courseType === 'Lab') {
        // Schedule labs as 2-period continuous blocks
        const numBlocks = Math.floor(periods / 2);
        for (let b = 1; b <= numBlocks; b++) {
          variables.push({
            varId: `${course.courseCode}_B${b}`,
            sessionIndex: b,
            isBlock: true,
            blockDuration: 2,
            course,
            faculty,
            studentGroup,
            requiredRoomType: course.requiredRoomType || 'Computer Lab'
          });
        }

        // Any leftover odd single period (if applicable)
        for (let p = numBlocks * 2 + 1; p <= periods; p++) {
          variables.push({
            varId: `${course.courseCode}_S${p}`,
            sessionIndex: p,
            isBlock: false,
            blockDuration: 1,
            course,
            faculty,
            studentGroup,
            requiredRoomType: course.requiredRoomType || 'Computer Lab'
          });
        }
      } else {
        // Non-lab courses: standard single-period variables
        for (let p = 1; p <= periods; p++) {
          variables.push({
            varId: `${course.courseCode}_S${p}`,
            sessionIndex: p,
            isBlock: false,
            blockDuration: 1,
            course,
            faculty,
            studentGroup,
            requiredRoomType: course.requiredRoomType || 'Classroom'
          });
        }
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

    if (variable.isBlock) {
      // Build slot lookup: day + period -> slot
      const slotMap = new Map();
      this.timeSlots.forEach(s => slotMap.set(`${s.day}_P${s.period}`, s));

      // Candidate 2-period consecutive pairs on the same day:
      // Standard uninterrupted blocks: (1, 2), (3, 4), (5, 6)
      // Fallback adjacent blocks: (2, 3), (4, 5)
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const candidatePairs = [
        [1, 2],
        [3, 4],
        [5, 6],
        [2, 3],
        [4, 5]
      ];

      days.forEach(day => {
        candidatePairs.forEach(([p1, p2]) => {
          const s1 = slotMap.get(`${day}_P${p1}`);
          const s2 = slotMap.get(`${day}_P${p2}`);
          if (!s1 || !s2) return;

          eligibleRooms.forEach(room => {
            const facultyAvail1 = !variable.faculty.unavailableSlots?.some(
              s => s.day === s1.day && s.period === s1.period
            );
            const facultyAvail2 = !variable.faculty.unavailableSlots?.some(
              s => s.day === s2.day && s.period === s2.period
            );
            const roomAvail1 = !room.unavailableSlots?.some(
              s => s.day === s1.day && s.period === s1.period
            );
            const roomAvail2 = !room.unavailableSlots?.some(
              s => s.day === s2.day && s.period === s2.period
            );

            if (facultyAvail1 && facultyAvail2 && roomAvail1 && roomAvail2) {
              domain.push({
                isBlock: true,
                timeSlot: s1,
                timeSlot2: s2,
                classroom: room
              });
            }
          });
        });
      });
    } else {
      this.timeSlots.forEach(slot => {
        eligibleRooms.forEach(room => {
          const facultyAvail = !variable.faculty.unavailableSlots?.some(
            s => s.day === slot.day && s.period === slot.period
          );
          const roomAvail = !room.unavailableSlots?.some(
            s => s.day === slot.day && s.period === slot.period
          );

          if (facultyAvail && roomAvail) {
            domain.push({
              isBlock: false,
              timeSlot: slot,
              classroom: room
            });
          }
        });
      });
    }

    return domain;
  }

  /**
   * Order domain values using Least Constraining Value / Soft preference heuristic
   */
  orderDomainValues(variable, domain, currentSchedule) {
    if (variable.isBlock) {
      return domain.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // 1. Strongly prefer natural 2-period blocks: [1,2], [3,4], [5,6] over [2,3], [4,5]
        const naturalStarts = [1, 3, 5];
        if (naturalStarts.includes(a.timeSlot.period)) scoreA += 50;
        if (naturalStarts.includes(b.timeSlot.period)) scoreB += 50;

        // 2. Strongly discourage scheduling two blocks of the SAME lab course on the same day
        const aSameCourseDayCount = currentSchedule.filter(
          s => s.course.toString() === variable.course._id.toString() && s.day === a.timeSlot.day
        ).length;
        const bSameCourseDayCount = currentSchedule.filter(
          s => s.course.toString() === variable.course._id.toString() && s.day === b.timeSlot.day
        ).length;
        scoreA -= aSameCourseDayCount * 100;
        scoreB -= bSameCourseDayCount * 100;

        // 3. Balance student group daily lab load: penalize placing more than 2 lab periods (1 block) on the same day
        const targetGroupId = (variable.studentGroup.parentGroupId || variable.studentGroup._id).toString();
        const aGroupLabCount = currentSchedule.filter(
          s => (s.parentGroupId || s.studentGroup).toString() === targetGroupId &&
               s.day === a.timeSlot.day &&
               this.labCourseIds.has(s.course.toString())
        ).length;
        const bGroupLabCount = currentSchedule.filter(
          s => (s.parentGroupId || s.studentGroup).toString() === targetGroupId &&
               s.day === b.timeSlot.day &&
               this.labCourseIds.has(s.course.toString())
        ).length;
        scoreA -= aGroupLabCount * 40;
        scoreB -= bGroupLabCount * 40;

        // 4. Faculty preference
        if (variable.faculty.preferences?.preferredTime === 'morning') {
          if (a.timeSlot.period <= 3) scoreA += 10;
          if (b.timeSlot.period <= 3) scoreB += 10;
        } else if (variable.faculty.preferences?.preferredTime === 'afternoon') {
          if (a.timeSlot.period >= 4) scoreA += 10;
          if (b.timeSlot.period >= 4) scoreB += 10;
        }

        return scoreB - scoreA;
      });
    }

    // Single-period variable ordering
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

      // Day distribution: penalize clustering multiple sessions of same course on the same day
      const aDayCount = currentSchedule.filter(
        s => s.course.toString() === variable.course._id.toString() && s.day === a.timeSlot.day
      ).length;
      const bDayCount = currentSchedule.filter(
        s => s.course.toString() === variable.course._id.toString() && s.day === b.timeSlot.day
      ).length;

      scoreA -= aDayCount * 40;
      scoreB -= bDayCount * 40;

      return scoreB - scoreA;
    });
  }

  /**
   * Main CSP Backtracking Search with MRV Heuristic and Forward Checking
   */
  solve() {
    const rawVariables = this.generateVariables();
    console.log(`🧩 CSP Formulation: ${rawVariables.length} session variables (with 2-period continuous lab blocks) to schedule.`);

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
        if (variable.isBlock) {
          // Validate both consecutive periods against current partial schedule
          const validation1 = validateHardConstraints({
            course: variable.course,
            faculty: variable.faculty,
            studentGroup: variable.studentGroup,
            classroom: val.classroom,
            timeSlot: val.timeSlot,
            currentSchedule: solution
          });

          if (!validation1.valid) continue;

          const validation2 = validateHardConstraints({
            course: variable.course,
            faculty: variable.faculty,
            studentGroup: variable.studentGroup,
            classroom: val.classroom,
            timeSlot: val.timeSlot2,
            currentSchedule: solution
          });

          if (!validation2.valid) continue;

          // Both periods satisfied! Create continuous 2-period assignments
          const assignment1 = {
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
            electiveBucket: variable.studentGroup.electiveBucket || null,
            parentGroupId: variable.studentGroup.parentGroupId || null
          };

          const assignment2 = {
            slot: val.timeSlot2,
            day: val.timeSlot2.day,
            period: val.timeSlot2.period,
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
            electiveBucket: variable.studentGroup.electiveBucket || null,
            parentGroupId: variable.studentGroup.parentGroupId || null
          };

          solution.push(assignment1);
          solution.push(assignment2);

          // Forward Checking: Ensure next variable still has at least 1 valid option
          let domainWipedOut = false;
          if (varIndex + 1 < sortedVariables.length) {
            const nextVar = sortedVariables[varIndex + 1];
            const nextDomain = variableDomains.get(nextVar.varId);
            const hasValidOption = nextDomain.some(nextVal => {
              if (nextVar.isBlock) {
                return validateHardConstraints({
                  course: nextVar.course,
                  faculty: nextVar.faculty,
                  studentGroup: nextVar.studentGroup,
                  classroom: nextVal.classroom,
                  timeSlot: nextVal.timeSlot,
                  currentSchedule: solution
                }).valid && validateHardConstraints({
                  course: nextVar.course,
                  faculty: nextVar.faculty,
                  studentGroup: nextVar.studentGroup,
                  classroom: nextVal.classroom,
                  timeSlot: nextVal.timeSlot2,
                  currentSchedule: solution
                }).valid;
              }
              return validateHardConstraints({
                course: nextVar.course,
                faculty: nextVar.faculty,
                studentGroup: nextVar.studentGroup,
                classroom: nextVal.classroom,
                timeSlot: nextVal.timeSlot,
                currentSchedule: solution
              }).valid;
            });
            if (!hasValidOption) domainWipedOut = true;
          }

          if (!domainWipedOut) {
            const success = backtrack(varIndex + 1);
            if (success) return true;
          }

          // Backtrack both periods
          solution.pop();
          solution.pop();
        } else {
          // Standard single-period variable assignment
          const validation = validateHardConstraints({
            course: variable.course,
            faculty: variable.faculty,
            studentGroup: variable.studentGroup,
            classroom: val.classroom,
            timeSlot: val.timeSlot,
            currentSchedule: solution
          });

          if (validation.valid) {
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
              electiveBucket: variable.studentGroup.electiveBucket || null,
              parentGroupId: variable.studentGroup.parentGroupId || null
            };

            solution.push(assignment);

            // Forward Checking: Ensure next variable still has at least 1 valid option
            let domainWipedOut = false;
            if (varIndex + 1 < sortedVariables.length) {
              const nextVar = sortedVariables[varIndex + 1];
              const nextDomain = variableDomains.get(nextVar.varId);
              const hasValidOption = nextDomain.some(nextVal => {
                if (nextVar.isBlock) {
                  return validateHardConstraints({
                    course: nextVar.course,
                    faculty: nextVar.faculty,
                    studentGroup: nextVar.studentGroup,
                    classroom: nextVal.classroom,
                    timeSlot: nextVal.timeSlot,
                    currentSchedule: solution
                  }).valid && validateHardConstraints({
                    course: nextVar.course,
                    faculty: nextVar.faculty,
                    studentGroup: nextVar.studentGroup,
                    classroom: nextVal.classroom,
                    timeSlot: nextVal.timeSlot2,
                    currentSchedule: solution
                  }).valid;
                }
                return validateHardConstraints({
                  course: nextVar.course,
                  faculty: nextVar.faculty,
                  studentGroup: nextVar.studentGroup,
                  classroom: nextVal.classroom,
                  timeSlot: nextVal.timeSlot,
                  currentSchedule: solution
                }).valid;
              });
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
