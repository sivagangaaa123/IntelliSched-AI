const express = require('express');
const router = express.Router();
const ConstraintConfig = require('../models/ConstraintConfig');

// GET /api/constraints - Retrieve active constraint configuration
router.get('/', async (req, res) => {
  try {
    let config = await ConstraintConfig.findOne({ isActive: true });
    
    // Fallback to any config if none explicitly marked active
    if (!config) {
      config = await ConstraintConfig.findOne();
    }

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'No constraint configuration found'
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch constraint configuration',
      message: error.message
    });
  }
});

module.exports = router;
