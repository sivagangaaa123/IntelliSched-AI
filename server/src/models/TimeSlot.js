const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  slotId: {
    type: String,
    required: [true, 'Slot ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: [true, 'Day is required']
  },
  period: {
    type: Number,
    required: [true, 'Period number is required'],
    min: [1, 'Period must be between 1 and 6'],
    max: [6, 'Period must be between 1 and 6']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    trim: true
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    trim: true
  },
  isLunchBreak: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure (day + period) combination is strictly unique
TimeSlotSchema.index({ day: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
