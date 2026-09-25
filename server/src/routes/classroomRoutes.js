const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');

// GET /api/classrooms - Retrieve all classrooms and labs
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const classrooms = await Classroom.find(filter).sort({ type: 1, capacity: -1 });
    res.json({
      success: true,
      count: classrooms.length,
      data: classrooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch classrooms',
      message: error.message
    });
  }
});

// GET /api/classrooms/:id - Retrieve single classroom
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = (id.includes('-') || id.startsWith('CR') || id.startsWith('LAB') || id.startsWith('SEM') || id.startsWith('PROJ'))
      ? { roomId: id.toUpperCase() }
      : { _id: id };

    const classroom = await Classroom.findOne(query);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        error: 'Classroom not found'
      });
    }

    res.json({
      success: true,
      data: classroom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching classroom details',
      message: error.message
    });
  }
});

module.exports = router;
