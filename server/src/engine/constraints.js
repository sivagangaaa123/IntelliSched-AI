/**
 * IntelliSched AI - Constraint Validation & Objective Scoring Module
 * Evaluates Hard and Soft constraints for CSP Timetable Scheduling
 */

// Helper to check faculty availability based on their marked unavailable slots
function isFacultyAvailable(faculty, day, period) {
  if (!faculty || !faculty.unavailableSlots) return true;
  return !faculty.unavailableSlots.some(slot => slot.day === day && slot.period === period);
}

// Helper to check classroom availability based on maintenance/reserved slots
function isClassroomAvailable(classroom, day, period) {
  if (!classroom || !classroom.unavailableSlots) return true;
  return !classroom.unavailableSlots.some(slot => slot.day === day && slot.period === period);
}

// Check room type compatibility (Hard Constraint)
function isRoomTypeCompatible(course, classroom) {
  if (!course.requiredRoomType || course.requiredRoomType === 'Classroom') {
    // Theory classes can be in regular Classrooms or Seminar Halls if available
    return classroom.type === 'Classroom' || classroom.type === 'Seminar Hall';
  }
  // Lab and Project classes strictly require matching lab types
  return classroom.type === course.requiredRoomType;
}

// Check classroom capacity (Hard Constraint)
function isCapacitySufficient(studentGroup, classroom) {
  return classroom.capacity >= studentGroup.studentCount;
}

// Check for faculty clash at (day, period) in the current partial schedule
function hasFacultyClash(schedule, facultyId, day, period) {
  const fId = facultyId.toString();
  return schedule.some(entry => 
    entry.day === day && 
    entry.period === period && 
    entry.faculty.toString() === fId
  );
}

// Check for classroom clash at (day, period) in the current partial schedule
function hasClassroomClash(schedule, classroomId, day, period) {
  const cId = classroomId.toString();
  return schedule.some(entry => 
    entry.day === day && 
    entry.period === period && 
    entry.classroom.toString() === cId
  );
}

// Check for student group clash at (day, period) in the current partial schedule
// Note: Allows parallel scheduling for elective sub-groups that do not share students
function hasStudentGroupClash(schedule, studentGroupId, isElectiveGroup, parentGroupId, day, period) {
  const gId = studentGroupId.toString();
  const pId = parentGroupId ? parentGroupId.toString() : null;

  return schedule.some(entry => {
    if (entry.day !== day || entry.period !== period) return false;

    const entryGroupId = entry.studentGroup.toString();
    const entryParentId = entry.parentGroupId ? entry.parentGroupId.toString() : null;

    // 1. Direct same group conflict
    if (entryGroupId === gId) return true;

    // 2. Parent group conflicts with its own elective sub-group
    if (pId && entryGroupId === pId) return true;
    if (entryParentId && entryParentId === gId) return true;

    // 3. Both are elective sub-groups of the same parent: ALLOWED in parallel!
    if (isElectiveGroup && entry.isElectiveGroup && pId && entryParentId && pId === entryParentId) {
      return false; // Valid parallel elective!
    }

    return false;
  });
}

/**
 * Validate all Hard Constraints for placing a session at a given slot and room
 * Returns { valid: Boolean, reason: String }
 */
function validateHardConstraints({ course, faculty, studentGroup, classroom, timeSlot, currentSchedule }) {
  const { day, period } = timeSlot;

  // 1. Faculty Availability
  if (!isFacultyAvailable(faculty, day, period)) {
    return {
      valid: false,
      constraint: 'facultyAvailability',
      reason: `${faculty.name} is unavailable on ${day} Period ${period} (Marked leave/duty)`
    };
  }

  // 2. Classroom Availability
  if (!isClassroomAvailable(classroom, day, period)) {
    return {
      valid: false,
      constraint: 'classroomAvailability',
      reason: `${classroom.name} is unavailable on ${day} Period ${period} (Maintenance/Reserved)`
    };
  }

  // 3. Room Capacity Check
  if (!isCapacitySufficient(studentGroup, classroom)) {
    return {
      valid: false,
      constraint: 'classroomCapacity',
      reason: `${classroom.name} capacity (${classroom.capacity}) is less than ${studentGroup.name} student count (${studentGroup.studentCount})`
    };
  }

  // 4. Room Type Compatibility Check
  if (!isRoomTypeCompatible(course, classroom)) {
    return {
      valid: false,
      constraint: 'roomTypeCompatibility',
      reason: `${course.name} requires '${course.requiredRoomType}', but ${classroom.name} is a '${classroom.type}'`
    };
  }

  // 5. Faculty Clash Check
  if (hasFacultyClash(currentSchedule, faculty._id, day, period)) {
    return {
      valid: false,
      constraint: 'facultyConflict',
      reason: `${faculty.name} is already scheduled to teach another class on ${day} Period ${period}`
    };
  }

  // 6. Classroom Clash Check
  if (hasClassroomClash(currentSchedule, classroom._id, day, period)) {
    return {
      valid: false,
      constraint: 'classroomConflict',
      reason: `${classroom.name} is already occupied on ${day} Period ${period}`
    };
  }

  // 7. Student Group Clash Check
  if (hasStudentGroupClash(currentSchedule, studentGroup._id, studentGroup.isElectiveGroup, studentGroup.parentGroupId, day, period)) {
    return {
      valid: false,
      constraint: 'studentGroupConflict',
      reason: `${studentGroup.name} already has another session scheduled on ${day} Period ${period}`
    };
  }

  return { valid: true, reason: 'All hard constraints satisfied' };
}

/**
 * Calculate Soft Constraints Optimization Score for a Complete Schedule
 * Returns score between 0 and 100, plus gap statistics
 */
function calculateScheduleMetrics(schedule, facultyList, groupList, config = {}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let facultyGaps = 0;
  let studentGaps = 0;
  let preferenceBonus = 0;
  let distributionPenalties = 0;

  // 1. Calculate Faculty Gaps and Preferences
  facultyList.forEach(faculty => {
    const fId = faculty._id.toString();
    days.forEach(day => {
      const dayClasses = schedule
        .filter(s => s.faculty.toString() === fId && s.day === day)
        .map(s => s.period)
        .sort((a, b) => a - b);

      if (dayClasses.length > 1) {
        for (let i = 0; i < dayClasses.length - 1; i++) {
          const gap = dayClasses[i + 1] - dayClasses[i] - 1;
          if (gap > 0) facultyGaps += gap;
        }
      }

      // Preference check
      if (faculty.preferences && faculty.preferences.preferredTime) {
        dayClasses.forEach(period => {
          if (faculty.preferences.preferredTime === 'morning' && period <= 3) preferenceBonus += 1;
          if (faculty.preferences.preferredTime === 'afternoon' && period >= 4) preferenceBonus += 1;
        });
      }
    });
  });

  // 2. Calculate Student Group Gaps and Course Daily Distribution
  groupList.forEach(group => {
    const gId = group._id.toString();
    days.forEach(day => {
      const dayClasses = schedule
        .filter(s => s.studentGroup.toString() === gId && s.day === day)
        .map(s => s.period)
        .sort((a, b) => a - b);

      if (dayClasses.length > 1) {
        for (let i = 0; i < dayClasses.length - 1; i++) {
          const gap = dayClasses[i + 1] - dayClasses[i] - 1;
          if (gap > 0) studentGaps += gap;
        }
      }
    });

    // Penalize when the same theory course appears more than 2 times in one day for a group
    const groupEntries = schedule.filter(s => s.studentGroup.toString() === gId);
    days.forEach(day => {
      const courseCounts = {};
      groupEntries
        .filter(s => s.day === day)
        .forEach(s => {
          const cId = s.course.toString();
          courseCounts[cId] = (courseCounts[cId] || 0) + 1;
        });

      Object.values(courseCounts).forEach(cnt => {
        if (cnt > 2) distributionPenalties += (cnt - 2) * 5;
      });
    });
  });

  // Calculate composite soft score (0 - 100)
  let rawScore = 100 - (facultyGaps * 2) - (studentGaps * 2) - distributionPenalties + Math.min(preferenceBonus, 15);
  const softScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    hardViolationsCount: 0,
    softScore,
    facultyGaps,
    studentGaps,
    distributionScore: Math.max(0, 100 - distributionPenalties)
  };
}

module.exports = {
  isFacultyAvailable,
  isClassroomAvailable,
  isRoomTypeCompatible,
  isCapacitySufficient,
  hasFacultyClash,
  hasClassroomClash,
  hasStudentGroupClash,
  validateHardConstraints,
  calculateScheduleMetrics
};
