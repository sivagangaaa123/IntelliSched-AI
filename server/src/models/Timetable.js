const mongoose = require('mongoose');

const TimetableGridEntrySchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: true
  },
  period: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  studentGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentGroup',
    required: true
  }
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  timetableId: {
    type: String,
    required: [true, 'Timetable ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Timetable name is required'],
    trim: true,
    default: 'MCA Department Master Timetable'
  },
  academicYear: {
    type: String,
    default: '2026-2027',
    trim: true
  },
  semester: {
    type: Number,
    default: null // null indicates all semesters combined
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'active'
  },
  grid: [TimetableGridEntrySchema],
  metrics: {
    hardViolationsCount: {
      type: Number,
      default: 0
    },
    softScore: {
      type: Number,
      default: 100
    },
    facultyGaps: {
      type: Number,
      default: 0
    },
    studentGaps: {
      type: Number,
      default: 0
    },
    distributionScore: {
      type: Number,
      default: 100
    }
  },
  explanation: {
    summary: {
      type: String,
      default: 'Timetable satisfies 100% of hard constraints.'
    },
    decisions: [String],
    tradeoffs: [String]
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', TimetableSchema);
