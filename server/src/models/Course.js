const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 6
  },
  weeklyPeriods: {
    type: Number,
    required: [true, 'Weekly periods count is required'],
    min: [1, 'Weekly periods must be at least 1'],
    max: [10, 'Weekly periods cannot exceed 10']
  },
  courseType: {
    type: String,
    enum: ['Theory', 'Lab', 'Elective', 'Project', 'Seminar'],
    default: 'Theory',
    required: true
  },
  // Assigned faculty (MongoDB reference to Faculty)
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Assigned faculty is required']
  },
  // Target student group (MongoDB reference to StudentGroup)
  studentGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentGroup',
    required: [true, 'Target student group is required']
  },
  // Hard constraint requirement for room matching
  requiredRoomType: {
    type: String,
    enum: ['Classroom', 'Computer Lab', 'Seminar Hall', 'Project Lab'],
    default: 'Classroom'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
