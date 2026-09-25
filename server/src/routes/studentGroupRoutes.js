const express = require('express');
const router = express.Router();
const StudentGroup = require('../models/StudentGroup');

// GET /api/student-groups - Retrieve all student groups & elective sub-groups
router.get('/', async (req, res) => {
  try {
    const { semester } = req.query;
    const filter = semester ? { semester: Number(semester) } : {};

    const groups = await StudentGroup.find(filter)
      .populate('parentGroupId', 'groupId name studentCount')
      .sort({ semester: 1, isElectiveGroup: 1, groupId: 1 });

    res.json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student groups',
      message: error.message
    });
  }
});

// GET /api/student-groups/:id - Retrieve single group
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('MCA') ? { groupId: id.toUpperCase() } : { _id: id };

    const group = await StudentGroup.findOne(query)
      .populate('parentGroupId', 'groupId name studentCount');

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Student group not found'
      });
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching student group details',
      message: error.message
    });
  }
});

module.exports = router;
