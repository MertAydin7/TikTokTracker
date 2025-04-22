const User = require('../models/user.model');
const Following = require('../models/following.model');
const Notification = require('../models/notification.model');

// Get user's TikTok connection status
exports.getTiktokStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('tiktokConnected');
    res.json({ tiktokConnected: user.tiktokConnected });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Connect TikTok account
exports.connectTiktok = async (req, res) => {
  try {
    const { msToken, sessionId, username } = req.body;
    
    // Update user with TikTok credentials
    const user = await User.findById(req.user.id);
    user.tiktokConnected = true;
    user.tiktokCredentials = {
      msToken,
      sessionId,
      username
    };
    
    await user.save();
    
    res.json({ success: true, message: 'TikTok account connected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Disconnect TikTok account
exports.disconnectTiktok = async (req, res) => {
  try {
    // Update user to remove TikTok credentials
    const user = await User.findById(req.user.id);
    user.tiktokConnected = false;
    user.tiktokCredentials = {
      msToken: null,
      sessionId: null,
      username: null
    };
    
    await user.save();
    
    res.json({ success: true, message: 'TikTok account disconnected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user's following list
exports.getFollowingList = async (req, res) => {
  try {
    const following = await Following.find({ 
      user: req.user.id,
      isActive: true
    }).sort({ lastEngagement: 1 });
    
    res.json(following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get inactive following accounts
exports.getInactiveFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const inactivityPeriod = user.preferences.inactivityPeriod || 30; // Default 30 days
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityPeriod);
    
    const inactiveFollowing = await Following.find({
      user: req.user.id,
      isActive: true,
      $or: [
        { lastEngagement: { $lt: cutoffDate } },
        { lastEngagement: null }
      ]
    }).sort({ lastEngagement: 1 });
    
    res.json(inactiveFollowing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { notificationThreshold, inactivityPeriod } = req.body;
    
    // Update user preferences
    const user = await User.findById(req.user.id);
    
    if (notificationThreshold) {
      user.preferences.notificationThreshold = notificationThreshold;
    }
    
    if (inactivityPeriod) {
      user.preferences.inactivityPeriod = inactivityPeriod;
    }
    
    await user.save();
    
    res.json({ success: true, preferences: user.preferences });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
