const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses - Retrieve all courses with populated faculty & studentGroup
router.get('/', async (req, res) => {
  try {
    const { semester, courseType } = req.query;
    const filter = {};

    if (semester) filter.semester = Number(semester);
    if (courseType) filter.courseType = courseType;

    const courses = await Course.find(filter)
      .populate('faculty', 'facultyId name designation email department')
      .populate('studentGroup', 'groupId name semester studentCount isElectiveGroup')
      .sort({ semester: 1, courseCode: 1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course records',
      message: error.message
    });
  }
});

// GET /api/courses/:id - Retrieve single course by _id or courseCode
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = (id.startsWith('CRS') || id.startsWith('MCA')) 
      ? { $or: [{ courseId: id.toUpperCase() }, { courseCode: id.toUpperCase() }] } 
      : { _id: id };

    const course = await Course.findOne(query)
      .populate('faculty', 'facultyId name designation email')
      .populate('studentGroup', 'groupId name semester studentCount');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching course details',
      message: error.message
    });
  }
});

module.exports = router;
