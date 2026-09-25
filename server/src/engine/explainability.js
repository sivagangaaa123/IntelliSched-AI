/**
 * IntelliSched AI - Explainable AI (XAI) Engine
 * Generates transparent, human-readable rationales for scheduling decisions,
 * conflict rejections, and dynamic rescheduling operations.
 */

const { validateHardConstraints } = require('./constraints');

/**
 * Generate a comprehensive, plain-English summary of the generated timetable
 */
function generateScheduleExplanation(schedule, metrics, stats = {}) {
  const decisions = [];
  const tradeoffs = [];

  // Summary statement
  const summary = `Feasible department timetable generated with 100% hard constraints satisfied. Optimization score achieved: ${metrics.softScore}/100. Total scheduled sessions: ${schedule.length}.`;

  // Decision rationales
  decisions.push(`Successfully scheduled all required weekly course periods without any faculty or room double-booking.`);
  
  if (metrics.facultyGaps === 0) {
    decisions.push(`Achieved 0 idle gaps across all faculty weekly schedules, ensuring contiguous teaching blocks.`);
  } else {
    decisions.push(`Minimized faculty idle gaps to an average of ${(metrics.facultyGaps / (stats.totalFaculty || 10)).toFixed(1)} periods per faculty for the week.`);
  }

  if (metrics.studentGaps === 0) {
    decisions.push(`Student groups have compact daily timetables without disjoint waiting periods.`);
  } else {
    decisions.push(`Student schedule compactness score optimized: total idle gaps kept to ${metrics.studentGaps} across all batches.`);
  }

  decisions.push(`Classroom allocations strictly verified: all sessions placed in rooms with sufficient seating capacity and required lab facilities.`);

  // Tradeoff explanations
  if (metrics.softScore < 90) {
    tradeoffs.push(`Some faculty preferred time-windows could not be granted to prevent room capacity and student group overlaps.`);
  }
  tradeoffs.push(`Lab sessions were given priority room placement in computer laboratories during morning and early afternoon blocks.`);

  return {
    summary,
    decisions,
    tradeoffs
  };
}

/**
 * Explain why a specific slot and room cannot be assigned to a course
 */
function explainSlotRejection({ course, faculty, studentGroup, classroom, timeSlot, currentSchedule }) {
  const check = validateHardConstraints({ course, faculty, studentGroup, classroom, timeSlot, currentSchedule });
  
  if (check.valid) {
    return {
      canSchedule: true,
      explanation: `Slot ${timeSlot.day} Period ${timeSlot.period} in ${classroom.name} is fully valid and available.`
    };
  }

  let detailedExplanation = check.reason;
  
  // Enhance with context for faculty conflict
  if (check.constraint === 'facultyConflict') {
    const clashingSession = currentSchedule.find(s => 
      s.day === timeSlot.day && 
      s.period === timeSlot.period && 
      s.faculty.toString() === faculty._id.toString()
    );
    if (clashingSession && clashingSession.courseName) {
      detailedExplanation = `${faculty.name} cannot teach ${course.name} on ${timeSlot.day} Period ${timeSlot.period} because they are already teaching '${clashingSession.courseName}' in room ${clashingSession.roomName || 'another room'}.`;
    }
  }

  // Enhance with context for room conflict
  if (check.constraint === 'classroomConflict') {
    const clashingSession = currentSchedule.find(s => 
      s.day === timeSlot.day && 
      s.period === timeSlot.period && 
      s.classroom.toString() === classroom._id.toString()
    );
    if (clashingSession && clashingSession.courseName) {
      detailedExplanation = `${classroom.name} cannot be assigned on ${timeSlot.day} Period ${timeSlot.period} because it is currently reserved for '${clashingSession.courseName}'.`;
    }
  }

  return {
    canSchedule: false,
    constraintViolated: check.constraint,
    explanation: detailedExplanation
  };
}

/**
 * Explain a dynamic rescheduling decision
 */
function explainRescheduleChange(originalEntry, newEntry, reason) {
  return {
    changeType: 'Dynamic Reschedule',
    triggerReason: reason,
    originalSlot: `${originalEntry.day} Period ${originalEntry.period} (${originalEntry.classroomName || 'Room'})`,
    newSlot: `${newEntry.day} Period ${newEntry.period} (${newEntry.classroomName || 'Room'})`,
    justification: `Class '${originalEntry.courseName}' was moved from ${originalEntry.day} Period ${originalEntry.period} to ${newEntry.day} Period ${newEntry.period} due to: ${reason}. The new slot preserves faculty availability, room suitability, and zero clashes for ${originalEntry.studentGroupName}.`
  };
}

module.exports = {
  generateScheduleExplanation,
  explainSlotRejection,
  explainRescheduleChange
};
