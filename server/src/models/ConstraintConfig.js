const mongoose = require('mongoose');

const ConstraintConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Constraint configuration name is required'],
    default: 'Default MCA Constraints'
  },
  // Hard Constraints (Must NEVER be violated in CSP)
  hardConstraints: {
    facultyConflict: {
      type: Boolean,
      default: true,
      description: 'A faculty member cannot teach two classes at the same time.'
    },
    classroomConflict: {
      type: Boolean,
      default: true,
      description: 'A classroom cannot host two classes at the same time.'
    },
    studentGroupConflict: {
      type: Boolean,
      default: true,
      description: 'A student group cannot attend two classes simultaneously.'
    },
    facultyAvailability: {
      type: Boolean,
      default: true,
      description: 'Faculty cannot be assigned during their marked unavailable slots.'
    },
    classroomCapacity: {
      type: Boolean,
      default: true,
      description: 'Classroom capacity must be greater than or equal to student group size.'
    },
    requiredWeeklyPeriods: {
      type: Boolean,
      default: true,
      description: 'Courses must receive their exact designated weekly period allocation.'
    },
    roomTypeCompatibility: {
      type: Boolean,
      default: true,
      description: 'Lab courses must be placed in Computer Labs; Theory in Classrooms.'
    }
  },
  // Soft Constraints (Optimization weights for timetable quality score)
  softConstraints: {
    facultyPreferences: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 10 }
    },
    minimizeStudentGaps: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 20 }
    },
    minimizeFacultyGaps: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 20 }
    },
    balancedDistribution: {
      enabled: { type: Boolean, default: true },
      weight: { type: Number, default: 25 }
    },
    maxConsecutivePeriodsLimit: {
      enabled: { type: Boolean, default: true },
      maxConsecutive: { type: Number, default: 2 },
      weight: { type: Number, default: 15 }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ConstraintConfig', ConstraintConfigSchema);
