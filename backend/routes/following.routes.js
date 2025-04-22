const express = require('express');
const router = express.Router();
const followingController = require('../controllers/following.controller');

// @route   GET api/following/recommendations
// @desc    Get unfollow recommendations
// @access  Private
router.get('/recommendations', followingController.getUnfollowRecommendations);

// @route   POST api/following/unfollow/:tiktokUserId
// @desc    Unfollow a TikTok account
// @access  Private
router.post('/unfollow/:tiktokUserId', followingController.unfollowAccount);

// @route   POST api/following/batch-unfollow
// @desc    Batch unfollow multiple TikTok accounts
// @access  Private
router.post('/batch-unfollow', followingController.batchUnfollow);

// @route   POST api/following/ignore/:tiktokUserId
// @desc    Ignore unfollow recommendation
// @access  Private
router.post('/ignore/:tiktokUserId', followingController.ignoreUnfollowRecommendation);

module.exports = router;
