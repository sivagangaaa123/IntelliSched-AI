const express = require('express');
const router = express.Router();

const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Classroom = require('../models/Classroom');
const StudentGroup = require('../models/StudentGroup');
const TimeSlot = require('../models/TimeSlot');
const ConstraintConfig = require('../models/ConstraintConfig');
const Timetable = require('../models/Timetable');

const CSPSolver = require('../engine/cspSolver');
const DynamicRescheduler = require('../engine/rescheduler');
const { explainSlotRejection } = require('../engine/explainability');

// Helper to populate timetable entries
const populateTimetable = (query) => {
  return query
    .populate('grid.course', 'courseId courseCode name courseType weeklyPeriods requiredRoomType')
    .populate('grid.faculty', 'facultyId name designation email department')
    .populate('grid.classroom', 'roomId name capacity type facilities')
    .populate('grid.studentGroup', 'groupId name semester studentCount isElectiveGroup');
};

// GET /api/timetable/active - Fetch current active timetable
router.get('/active', async (req, res) => {
  try {
    const timetable = await populateTimetable(
      Timetable.findOne({ status: 'active' }).sort({ updatedAt: -1 })
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'No active timetable found. Click "Generate Timetable" to create one.'
      });
    }

    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active timetable',
      message: error.message
    });
  }
});

// POST /api/timetable/generate - Generate timetable using CSP Engine
router.post('/generate', async (req, res) => {
  try {
    console.log('⚡ Received request to generate timetable via CSP...');

    // 1. Fetch all scheduling data from MongoDB
    const [courses, classrooms, timeSlots, facultyList, studentGroups, config] = await Promise.all([
      Course.find().populate('faculty').populate('studentGroup'),
      Classroom.find({ isActive: true }),
      TimeSlot.find(),
      Faculty.find(),
      StudentGroup.find(),
      ConstraintConfig.findOne({ isActive: true })
    ]);

    if (courses.length === 0 || classrooms.length === 0 || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Incomplete database records. Ensure courses, classrooms, and time slots are seeded.'
      });
    }

    // 2. Initialize and run CSP Solver
    const solver = new CSPSolver({
      courses,
      classrooms,
      timeSlots,
      facultyList,
      studentGroups,
      config: config?.softConstraints || {}
    });

    const result = solver.solve();

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: 'Timetable Generation Failed',
        reason: result.reason,
        stats: result.stats
      });
    }

    // 3. Save or update active Timetable in MongoDB
    const timetableId = `TT-MCA-${Date.now().toString().slice(-6)}`;
    
    // Archive any previous active timetables
    await Timetable.updateMany({ status: 'active' }, { status: 'archived' });

    const newTimetable = await Timetable.create({
      timetableId,
      name: 'MCA Department Master Timetable',
      academicYear: '2026-2027',
      status: 'active',
      grid: result.grid.map(entry => ({
        slot: entry.slot._id || entry.slot,
        day: entry.day,
        period: entry.period,
        course: entry.course,
        faculty: entry.faculty,
        classroom: entry.classroom,
        studentGroup: entry.studentGroup
      })),
      metrics: result.metrics,
      explanation: result.explanation
    });

    // Populate for response
    const populated = await populateTimetable(Timetable.findById(newTimetable._id));

    res.json({
      success: true,
      message: 'Timetable successfully generated with 100% hard constraints satisfied!',
      stats: result.stats,
      data: populated
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      error: 'CSP Solver Internal Error',
      message: error.message
    });
  }
});

// POST /api/timetable/reschedule - Dynamically reschedule on faculty absence
router.post('/reschedule', async (req, res) => {
  try {
    const { facultyId, day, period, reason } = req.body;

    if (!facultyId || !day || !period) {
      return res.status(400).json({
        success: false,
        error: 'facultyId, day, and period are required parameters.'
      });
    }

    const [timetable, classrooms, timeSlots, facultyList, studentGroups] = await Promise.all([
      populateTimetable(Timetable.findOne({ status: 'active' }).sort({ updatedAt: -1 })),
      Classroom.find({ isActive: true }),
      TimeSlot.find(),
      Faculty.find(),
      StudentGroup.find()
    ]);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'No active timetable found to reschedule.'
      });
    }

    const facultyDoc = await Faculty.findOne(
      facultyId.startsWith('FAC') ? { facultyId: facultyId.toUpperCase() } : { _id: facultyId }
    );

    if (!facultyDoc) {
      return res.status(404).json({
        success: false,
        error: `Faculty '${facultyId}' not found.`
      });
    }

    const rescheduler = new DynamicRescheduler({
      timetable,
      classrooms,
      timeSlots,
      facultyList,
      studentGroups
    });

    const result = rescheduler.rescheduleFacultyAbsence({
      facultyId: facultyDoc._id,
      day,
      period: Number(period),
      reason: reason || 'Sudden Faculty Absence'
    });

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: 'Rescheduling Failed',
        reason: result.reason
      });
    }

    if (result.modified) {
      timetable.grid = result.grid.map(entry => ({
        slot: entry.slot._id || entry.slot,
        day: entry.day,
        period: entry.period,
        course: entry.course._id || entry.course,
        faculty: entry.faculty._id || entry.faculty,
        classroom: entry.classroom._id || entry.classroom,
        studentGroup: entry.studentGroup._id || entry.studentGroup
      }));

      await timetable.save();
    }

    const updatedPopulated = await populateTimetable(Timetable.findById(timetable._id));

    res.json({
      success: true,
      modified: result.modified,
      message: result.message,
      auditLogs: result.auditLogs,
      data: updatedPopulated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Dynamic Reschedule Error',
      message: error.message
    });
  }
});

// POST /api/timetable/explain-slot - Explain why a slot can or cannot be chosen
router.post('/explain-slot', async (req, res) => {
  try {
    const { courseId, classroomId, day, period } = req.body;

    const courseQuery = (courseId.startsWith('CRS') || courseId.startsWith('MCA'))
      ? { $or: [{ courseId: courseId.toUpperCase() }, { courseCode: courseId.toUpperCase() }] }
      : { _id: courseId };

    const roomQuery = (classroomId.includes('-') || classroomId.startsWith('CR') || classroomId.startsWith('LAB') || classroomId.startsWith('SEM') || classroomId.startsWith('PROJ'))
      ? { roomId: classroomId.toUpperCase() }
      : { _id: classroomId };

    const [course, classroom, activeTimetable] = await Promise.all([
      Course.findOne(courseQuery).populate('faculty').populate('studentGroup'),
      Classroom.findOne(roomQuery),
      Timetable.findOne({ status: 'active' }).sort({ updatedAt: -1 })
    ]);

    if (!course || !classroom) {
      return res.status(400).json({
        success: false,
        error: 'Course and Classroom must exist'
      });
    }

    const currentSchedule = activeTimetable ? activeTimetable.grid : [];

    const explanation = explainSlotRejection({
      course,
      faculty: course.faculty,
      studentGroup: course.studentGroup,
      classroom,
      timeSlot: { day, period: Number(period) },
      currentSchedule
    });

    res.json({
      success: true,
      data: explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Explainability Error',
      message: error.message
    });
  }
});

module.exports = router;
