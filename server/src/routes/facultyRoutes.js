const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// GET /api/faculty - Retrieve all faculty members
router.get('/', async (req, res) => {
  try {
    const facultyList = await Faculty.find().sort({ name: 1 });
    res.json({
      success: true,
      count: facultyList.length,
      data: facultyList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch faculty records',
      message: error.message
    });
  }
});

// GET /api/faculty/:id - Retrieve a specific faculty member by _id or facultyId
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('FAC') ? { facultyId: id.toUpperCase() } : { _id: id };
    const faculty = await Faculty.findOne(query);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: 'Faculty member not found'
      });
    }

    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching faculty details',
      message: error.message
    });
  }
});

module.exports = router;
