/**
 * IntelliSched AI - Dynamic Timetable Rescheduling Engine
 * Repairs schedules dynamically when unforeseen events occur (faculty absence, room maintenance)
 * without re-running the complete timetable from scratch.
 */

const { validateHardConstraints } = require('./constraints');
const { explainRescheduleChange } = require('./explainability');

const getDocId = (val) => {
  if (!val) return '';
  return (val._id || val).toString();
};

class DynamicRescheduler {
  constructor({ timetable, classrooms, timeSlots, facultyList, studentGroups }) {
    this.timetable = timetable;
    this.classrooms = classrooms;
    this.timeSlots = timeSlots;
    this.facultyMap = new Map(facultyList.map(f => [f._id.toString(), f]));
    this.classroomMap = new Map(classrooms.map(c => [c._id.toString(), c]));
    this.groupMap = new Map(studentGroups.map(g => [g._id.toString(), g]));
  }

  /**
   * Reschedule when a faculty member becomes unavailable on a given day & period
   */
  rescheduleFacultyAbsence({ facultyId, day, period, reason = 'Faculty Leave' }) {
    const fId = facultyId.toString();
    // Convert Mongoose document grid to plain JS array of entries
    const currentGrid = this.timetable.grid.map(entry => (entry.toObject ? entry.toObject() : entry));

    // 1. Identify affected classes
    const affectedIndices = [];
    currentGrid.forEach((entry, idx) => {
      const entryFacultyId = getDocId(entry.faculty);
      if (entryFacultyId === fId && entry.day === day && entry.period === period) {
        affectedIndices.push(idx);
      }
    });

    if (affectedIndices.length === 0) {
      return {
        success: true,
        modified: false,
        message: `No classes were affected by faculty absence on ${day} Period ${period}.`,
        grid: currentGrid,
        auditLogs: []
      };
    }

    const auditLogs = [];
    const unaffectedGrid = currentGrid.filter((_, idx) => !affectedIndices.includes(idx));

    // 2. Reschedule each affected session
    for (const idx of affectedIndices) {
      const affectedEntry = currentGrid[idx];
      const course = affectedEntry.course;
      const faculty = this.facultyMap.get(fId);
      const studentGroupId = getDocId(affectedEntry.studentGroup);
      const studentGroup = this.groupMap.get(studentGroupId) || affectedEntry.studentGroup;

      // Filter eligible classrooms
      const eligibleRooms = this.classrooms.filter(room => {
        if (room.capacity < studentGroup.studentCount) return false;
        if (course.requiredRoomType === 'Classroom') {
          return room.type === 'Classroom' || room.type === 'Seminar Hall';
        }
        return room.type === course.requiredRoomType;
      });

      let bestSlot = null;
      let bestRoom = null;

      // Search available domains
      for (const slot of this.timeSlots) {
        // Skip the now-unavailable slot
        if (slot.day === day && slot.period === period) continue;

        for (const room of eligibleRooms) {
          const check = validateHardConstraints({
            course,
            faculty,
            studentGroup,
            classroom: room,
            timeSlot: slot,
            currentSchedule: unaffectedGrid
          });

          if (check.valid) {
            bestSlot = slot;
            bestRoom = room;
            break;
          }
        }
        if (bestSlot) break;
      }

      if (!bestSlot) {
        return {
          success: false,
          modified: false,
          reason: `Could not reschedule '${affectedEntry.course?.name || 'Course'}': No alternative conflict-free slot exists for ${faculty.name} and ${studentGroup.name}.`,
          affectedEntry
        };
      }

      // Create new assignment
      const newEntry = {
        ...affectedEntry,
        slot: bestSlot._id,
        day: bestSlot.day,
        period: bestSlot.period,
        classroom: bestRoom._id,
        classroomName: bestRoom.name,
        courseName: course.name || affectedEntry.courseName,
        studentGroupName: studentGroup.name || affectedEntry.studentGroupName
      };

      unaffectedGrid.push(newEntry);

      const log = explainRescheduleChange(
        {
          ...affectedEntry,
          courseName: course.name || 'Course',
          studentGroupName: studentGroup.name || 'Batch',
          classroomName: affectedEntry.classroom?.name || 'Room'
        },
        newEntry,
        reason
      );
      auditLogs.push(log);
    }

    return {
      success: true,
      modified: true,
      message: `Successfully rescheduled ${auditLogs.length} affected class(es).`,
      grid: unaffectedGrid,
      auditLogs
    };
  }
}

module.exports = DynamicRescheduler;
