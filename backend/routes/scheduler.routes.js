const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/auth.middleware');
const schedulerService = require('../services/scheduler.service');

// @route   POST api/scheduler/check-inactive
// @desc    Manually trigger check for inactive accounts
// @access  Private
router.post('/check-inactive', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // If userId is provided, check only for that user
    // Otherwise, check for all users
    const result = await schedulerService.manualCheckInactiveAccounts(userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: userId 
          ? `Found ${result.count} inactive accounts (${result.inactivityPeriod} days threshold)`
          : 'Inactive accounts check triggered for all users'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to check inactive accounts' 
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/scheduler/sync-tiktok
// @desc    Manually trigger TikTok data sync
// @access  Private
router.post('/sync-tiktok', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // If userId is provided, sync only for that user
    // Otherwise, sync for all users
    const result = await schedulerService.manualSyncTikTokData(userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: userId 
          ? 'TikTok data sync completed for user'
          : 'TikTok data sync triggered for all users'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to sync TikTok data' 
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
