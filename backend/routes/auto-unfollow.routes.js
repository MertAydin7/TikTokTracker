const express = require('express');
const router = express.Router();
const autoUnfollowService = require('../services/auto-unfollow.service');

// @route   POST api/auto-unfollow/trigger
// @desc    Manually trigger auto-unfollow process for a user
// @access  Private
router.post('/trigger', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    const result = await autoUnfollowService.manualTriggerAutoUnfollow(userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to trigger auto-unfollow process' 
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
