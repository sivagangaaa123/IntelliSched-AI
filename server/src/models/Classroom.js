const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Classroom name is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  type: {
    type: String,
    enum: ['Classroom', 'Computer Lab', 'Seminar Hall', 'Project Lab'],
    default: 'Classroom',
    required: true
  },
  facilities: [
    {
      type: String,
      trim: true
    }
  ],
  // Unavailability slots (e.g. Lab maintenance, exam booking)
  unavailableSlots: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
      },
      period: {
        type: Number,
        min: 1,
        max: 6,
        required: true
      },
      reason: {
        type: String,
        default: 'Maintenance / Reserved'
      }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
