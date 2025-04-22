const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/auth.middleware');

// @route   GET api/users/tiktok-status
// @desc    Get user's TikTok connection status
// @access  Private
router.get('/tiktok-status', userController.getTiktokStatus);

// @route   POST api/users/connect-tiktok
// @desc    Connect TikTok account
// @access  Private
router.post(
  '/connect-tiktok',
  [
    check('msToken', 'msToken is required').not().isEmpty(),
    check('sessionId', 'sessionId is required').not().isEmpty(),
    check('username', 'username is required').not().isEmpty()
  ],
  validateRequest,
  userController.connectTiktok
);

// @route   POST api/users/disconnect-tiktok
// @desc    Disconnect TikTok account
// @access  Private
router.post('/disconnect-tiktok', userController.disconnectTiktok);

// @route   GET api/users/following
// @desc    Get user's following list
// @access  Private
router.get('/following', userController.getFollowingList);

// @route   GET api/users/inactive-following
// @desc    Get inactive following accounts
// @access  Private
router.get('/inactive-following', userController.getInactiveFollowing);

// @route   PUT api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put(
  '/preferences',
  [
    check('notificationThreshold', 'notificationThreshold must be a number').optional().isNumeric(),
    check('inactivityPeriod', 'inactivityPeriod must be a number').optional().isNumeric()
  ],
  validateRequest,
  userController.updatePreferences
);

module.exports = router;
