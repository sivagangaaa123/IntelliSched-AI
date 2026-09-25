const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

// Days ordering helper
const DAY_ORDER = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };

// GET /api/time-slots - Retrieve all academic periods
router.get('/', async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find();
    
    // Sort logically by day then period
    timeSlots.sort((a, b) => {
      const dayDiff = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
      if (dayDiff !== 0) return dayDiff;
      return a.period - b.period;
    });

    res.json({
      success: true,
      count: timeSlots.length,
      data: timeSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time slots',
      message: error.message
    });
  }
});

module.exports = router;
