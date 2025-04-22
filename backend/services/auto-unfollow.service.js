const cron = require('node-cron');
const axios = require('axios');
const Following = require('../models/following.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Automated unfollow service
class AutoUnfollowService {
  constructor() {
    this.isRunning = false;
    this.currentJobs = new Map();
  }

  // Initialize the auto-unfollow service
  initialize() {
    console.log('Initializing automated unfollow service');
    
    // Schedule daily check for auto-unfollow (runs at 2 AM)
    cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled auto-unfollow check');
      await this.processAutoUnfollows();
    });
  }

  // Process auto-unfollows for all eligible users
  async processAutoUnfollows() {
    if (this.isRunning) {
      console.log('Auto-unfollow process already running, skipping');
      return;
    }

    try {
      this.isRunning = true;
      console.log('Starting auto-unfollow process');

      // Get all users with auto-unfollow enabled
      const users = await User.find({ 
        tiktokConnected: true,
        'preferences.autoUnfollowEnabled': true 
      });
      
      console.log(`Found ${users.length} users with auto-unfollow enabled`);
      
      for (const user of users) {
        await this.processUserAutoUnfollow(user);
      }
      
      console.log('Completed auto-unfollow process');
    } catch (err) {
      console.error('Error in auto-unfollow process:', err);
    } finally {
      this.isRunning = false;
    }
  }

  // Process auto-unfollow for a specific user
  async processUserAutoUnfollow(user) {
    try {
      console.log(`Processing auto-unfollow for user ${user._id}`);
      
      // Get user's inactivity period preference
      const inactivityPeriod = user.preferences?.inactivityPeriod || 30; // Default 30 days
      const notificationThreshold = user.preferences?.notificationThreshold || 20;
      
      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactivityPeriod);
      
      // Find inactive accounts that have been recommended for unfollowing
      const inactiveAccounts = await Following.find({
        user: user._id,
        isActive: true,
        unfollowRecommended: true,
        lastEngagement: { $lt: cutoffDate }
      });
      
      if (inactiveAccounts.length === 0) {
        console.log(`No inactive accounts to unfollow for user ${user._id}`);
        return;
      }
      
      console.log(`Found ${inactiveAccounts.length} inactive accounts to unfollow for user ${user._id}`);
      
      // Check if count exceeds notification threshold
      if (inactiveAccounts.length >= notificationThreshold) {
        // Create notification and wait for user action
        await Notification.create({
          user: user._id,
          type: 'auto_unfollow_pending',
          title: 'Auto-Unfollow Pending',
          message: `${inactiveAccounts.length} accounts are scheduled for auto-unfollowing. Review them in the Inactive Accounts section.`,
          data: {
            count: inactiveAccounts.length,
            inactivityPeriod
          }
        });
        
        console.log(`Created notification for ${inactiveAccounts.length} accounts pending auto-unfollow`);
      } else {
        // Process unfollows directly for small batches
        const unfollowedAccounts = [];
        
        for (const account of inactiveAccounts) {
          try {
            // Call TikTok API to unfollow
            await this.unfollowTikTokUser(user, account.tiktokUserId);
            
            // Update database
            await Following.findByIdAndUpdate(account._id, {
              isActive: false,
              unfollowedAt: new Date()
            });
            
            unfollowedAccounts.push(account);
            
            // Add small delay between unfollows to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (err) {
            console.error(`Error unfollowing account ${account.tiktokUserId}:`, err);
          }
        }
        
        // Create notification about completed unfollows
        if (unfollowedAccounts.length > 0) {
          await Notification.create({
            user: user._id,
            type: 'auto_unfollow_complete',
            title: 'Accounts Automatically Unfollowed',
            message: `${unfollowedAccounts.length} inactive accounts were automatically unfollowed.`,
            data: {
              count: unfollowedAccounts.length,
              accounts: unfollowedAccounts.map(a => ({ 
                username: a.username, 
                tiktokUserId: a.tiktokUserId 
              }))
            }
          });
          
          console.log(`Unfollowed ${unfollowedAccounts.length} accounts for user ${user._id}`);
        }
      }
    } catch (err) {
      console.error(`Error processing auto-unfollow for user ${user._id}:`, err);
    }
  }

  // Unfollow a TikTok user
  async unfollowTikTokUser(user, tiktokUserId) {
    try {
      // In a real implementation, this would call the TikTok API
      // For now, we'll simulate the API call
      
      console.log(`Unfollowing TikTok user ${tiktokUserId} for user ${user._id}`);
      
      // Simulate API call to Python service
      const response = await axios.post('http://localhost:5001/api/unfollow', {
        userId: user._id.toString(),
        tiktokUserId,
        msToken: user.tiktokCredentials.msToken,
        sessionId: user.tiktokCredentials.sessionId
      });
      
      return response.data;
    } catch (err) {
      console.error(`Error unfollowing TikTok user ${tiktokUserId}:`, err);
      throw err;
    }
  }

  // Manually trigger auto-unfollow for a specific user
  async manualTriggerAutoUnfollow(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.tiktokConnected) {
        throw new Error('TikTok account not connected');
      }
      
      await this.processUserAutoUnfollow(user);
      
      return {
        success: true,
        message: 'Auto-unfollow process triggered successfully'
      };
    } catch (err) {
      console.error('Error triggering manual auto-unfollow:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }
}

// Create and export singleton instance
const autoUnfollowService = new AutoUnfollowService();
module.exports = autoUnfollowService;
