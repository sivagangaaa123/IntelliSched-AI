const mongoose = require('mongoose');

const StudentGroupSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: [true, 'Group ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be between 1 and 6'],
    max: [6, 'Semester must be between 1 and 6']
  },
  studentCount: {
    type: Number,
    required: [true, 'Student count is required'],
    min: [1, 'Student count must be at least 1']
  },
  program: {
    type: String,
    default: 'MCA',
    trim: true
  },
  // Elective splitting support
  isElectiveGroup: {
    type: Boolean,
    default: false
  },
  parentGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentGroup',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentGroup', StudentGroupSchema);
