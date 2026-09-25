const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: [true, 'Faculty ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Faculty name is required'],
    trim: true
  },
  department: {
    type: String,
    default: 'MCA',
    trim: true
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Guest Faculty'],
    default: 'Assistant Professor'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  maxWeeklyHours: {
    type: Number,
    default: 16,
    min: [1, 'Maximum weekly hours must be at least 1']
  },
  // Structured weekly availability: which periods the faculty is present each day
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
      },
      periods: [
        {
          type: Number,
          min: 1,
          max: 6
        }
      ]
    }
  ],
  // Specific unavailable slots (used by Hard Constraint in CSP)
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
        default: 'Department Duty / Leave'
      }
    }
  ],
  // Soft constraint preferences
  preferences: {
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'any'],
      default: 'any'
    },
    maxConsecutivePeriods: {
      type: Number,
      default: 2,
      min: 1,
      max: 4
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Faculty', FacultySchema);
