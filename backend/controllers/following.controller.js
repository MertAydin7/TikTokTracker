const Following = require('../models/following.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Get unfollow recommendations
exports.getUnfollowRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const inactivityPeriod = user.preferences.inactivityPeriod || 30; // Default 30 days
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityPeriod);
    
    const recommendations = await Following.find({
      user: req.user.id,
      isActive: true,
      $or: [
        { lastEngagement: { $lt: cutoffDate } },
        { lastEngagement: null }
      ]
    }).sort({ lastEngagement: 1 });
    
    // Mark accounts as recommended for unfollowing
    if (recommendations.length > 0) {
      await Following.updateMany(
        { _id: { $in: recommendations.map(r => r._id) } },
        { unfollowRecommended: true }
      );
      
      // Create notification if threshold is reached
      if (recommendations.length >= user.preferences.notificationThreshold) {
        await Notification.create({
          user: req.user.id,
          type: 'batch_unfollow',
          title: 'Inactive Accounts Found',
          message: `We found ${recommendations.length} accounts you haven't interacted with in ${inactivityPeriod} days.`,
          data: {
            count: recommendations.length,
            inactivityPeriod
          }
        });
      }
    }
    
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Unfollow a TikTok account
exports.unfollowAccount = async (req, res) => {
  try {
    const { tiktokUserId } = req.params;
    
    // Find the following relationship
    const following = await Following.findOne({
      user: req.user.id,
      tiktokUserId,
      isActive: true
    });
    
    if (!following) {
      return res.status(404).json({ message: 'Following relationship not found' });
    }
    
    // Mark as unfollowed
    following.isActive = false;
    following.unfollowedAt = new Date();
    following.unfollowRecommended = false;
    
    await following.save();
    
    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'unfollow_suggestion',
      title: 'Account Unfollowed',
      message: `You have unfollowed ${following.username}.`,
      data: {
        username: following.username,
        tiktokUserId
      }
    });
    
    res.json({ success: true, message: 'Account unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Batch unfollow multiple TikTok accounts
exports.batchUnfollow = async (req, res) => {
  try {
    const { tiktokUserIds } = req.body;
    
    if (!tiktokUserIds || !Array.isArray(tiktokUserIds) || tiktokUserIds.length === 0) {
      return res.status(400).json({ message: 'Invalid request. tiktokUserIds array is required.' });
    }
    
    // Find all following relationships
    const followings = await Following.find({
      user: req.user.id,
      tiktokUserId: { $in: tiktokUserIds },
      isActive: true
    });
    
    if (followings.length === 0) {
      return res.status(404).json({ message: 'No active following relationships found' });
    }
    
    // Mark all as unfollowed
    const updatePromises = followings.map(following => {
      following.isActive = false;
      following.unfollowedAt = new Date();
      following.unfollowRecommended = false;
      return following.save();
    });
    
    await Promise.all(updatePromises);
    
    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'batch_unfollow',
      title: 'Accounts Unfollowed',
      message: `You have unfollowed ${followings.length} accounts.`,
      data: {
        count: followings.length,
        usernames: followings.map(f => f.username)
      }
    });
    
    res.json({ 
      success: true, 
      message: `${followings.length} accounts unfollowed successfully`,
      unfollowedCount: followings.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Ignore unfollow recommendation
exports.ignoreUnfollowRecommendation = async (req, res) => {
  try {
    const { tiktokUserId } = req.params;
    
    // Find the following relationship
    const following = await Following.findOne({
      user: req.user.id,
      tiktokUserId,
      isActive: true,
      unfollowRecommended: true
    });
    
    if (!following) {
      return res.status(404).json({ message: 'Unfollow recommendation not found' });
    }
    
    // Remove recommendation
    following.unfollowRecommended = false;
    
    // Reset last engagement to current date to prevent immediate re-recommendation
    following.lastEngagement = new Date();
    
    await following.save();
    
    res.json({ success: true, message: 'Unfollow recommendation ignored' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
