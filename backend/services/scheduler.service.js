const cron = require('node-cron');
const User = require('../models/user.model');
const Following = require('../models/following.model');
const Notification = require('../models/notification.model');
const { spawn } = require('child_process');
const path = require('path');

// Initialize the scheduler
const initScheduler = () => {
  console.log('Initializing automated following management scheduler');
  
  // Schedule daily check for inactive accounts (runs at 3 AM)
  cron.schedule('0 3 * * *', async () => {
    console.log('Running scheduled check for inactive accounts');
    await checkInactiveAccounts();
  });
  
  // Schedule weekly data sync (runs every Sunday at 4 AM)
  cron.schedule('0 4 * * 0', async () => {
    console.log('Running scheduled TikTok data sync');
    await syncTikTokData();
  });
};

// Check for inactive accounts and create unfollow recommendations
const checkInactiveAccounts = async () => {
  try {
    // Get all users with connected TikTok accounts
    const users = await User.find({ tiktokConnected: true });
    
    console.log(`Checking inactive accounts for ${users.length} users`);
    
    for (const user of users) {
      // Get user's inactivity period preference
      const inactivityPeriod = user.preferences?.inactivityPeriod || 30; // Default 30 days
      
      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactivityPeriod);
      
      // Find inactive accounts
      const inactiveAccounts = await Following.find({
        user: user._id,
        isActive: true,
        unfollowRecommended: false,
        $or: [
          { lastEngagement: { $lt: cutoffDate } },
          { lastEngagement: null }
        ]
      });
      
      if (inactiveAccounts.length > 0) {
        console.log(`Found ${inactiveAccounts.length} inactive accounts for user ${user._id}`);
        
        // Mark accounts as recommended for unfollowing
        await Following.updateMany(
          { _id: { $in: inactiveAccounts.map(account => account._id) } },
          { unfollowRecommended: true }
        );
        
        // Create notification if threshold is reached
        const notificationThreshold = user.preferences?.notificationThreshold || 20;
        
        if (inactiveAccounts.length >= notificationThreshold) {
          await Notification.create({
            user: user._id,
            type: 'batch_unfollow',
            title: 'Inactive Accounts Found',
            message: `We found ${inactiveAccounts.length} accounts you haven't interacted with in ${inactivityPeriod} days.`,
            data: {
              count: inactiveAccounts.length,
              inactivityPeriod
            }
          });
        } else {
          // Create individual notifications for each account
          for (const account of inactiveAccounts) {
            await Notification.create({
              user: user._id,
              type: 'unfollow_suggestion',
              title: 'Inactive Account',
              message: `You haven't interacted with @${account.username} in ${inactivityPeriod} days.`,
              data: {
                username: account.username,
                tiktokUserId: account.tiktokUserId,
                inactivityPeriod
              }
            });
          }
        }
      }
    }
    
    console.log('Completed checking inactive accounts');
  } catch (err) {
    console.error('Error checking inactive accounts:', err);
  }
};

// Sync TikTok data for all users
const syncTikTokData = async () => {
  try {
    // Get all users with connected TikTok accounts
    const users = await User.find({ tiktokConnected: true });
    
    console.log(`Syncing TikTok data for ${users.length} users`);
    
    for (const user of users) {
      try {
        // Call Python script to sync data
        const pythonScriptPath = path.join(__dirname, '../../python_service.py');
        
        const pythonProcess = spawn('python3', [
          pythonScriptPath,
          '--sync',
          '--user_id', user._id.toString(),
          '--ms_token', user.tiktokCredentials.msToken,
          '--session_id', user.tiktokCredentials.sessionId,
          '--username', user.tiktokCredentials.username
        ]);
        
        // Log output from Python script
        pythonProcess.stdout.on('data', (data) => {
          console.log(`Python stdout: ${data}`);
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python stderr: ${data}`);
        });
        
        // Wait for Python process to complete
        await new Promise((resolve, reject) => {
          pythonProcess.on('close', (code) => {
            if (code === 0) {
              console.log(`Successfully synced data for user ${user._id}`);
              resolve();
            } else {
              console.error(`Python process exited with code ${code}`);
              reject(new Error(`Python process exited with code ${code}`));
            }
          });
        });
        
        // Create notification about successful sync
        await Notification.create({
          user: user._id,
          type: 'system_alert',
          title: 'TikTok Data Synced',
          message: 'Your TikTok data has been successfully synced.',
          data: {
            timestamp: new Date()
          }
        });
      } catch (err) {
        console.error(`Error syncing data for user ${user._id}:`, err);
        
        // Create notification about sync failure
        await Notification.create({
          user: user._id,
          type: 'system_alert',
          title: 'TikTok Data Sync Failed',
          message: 'We encountered an error while syncing your TikTok data. Please check your connection settings.',
          data: {
            error: err.message,
            timestamp: new Date()
          }
        });
      }
    }
    
    console.log('Completed syncing TikTok data');
  } catch (err) {
    console.error('Error syncing TikTok data:', err);
  }
};

// Manual trigger functions for testing
const manualCheckInactiveAccounts = async (userId) => {
  try {
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get user's inactivity period preference
      const inactivityPeriod = user.preferences?.inactivityPeriod || 30;
      
      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactivityPeriod);
      
      // Find inactive accounts
      const inactiveAccounts = await Following.find({
        user: user._id,
        isActive: true,
        $or: [
          { lastEngagement: { $lt: cutoffDate } },
          { lastEngagement: null }
        ]
      });
      
      // Mark accounts as recommended for unfollowing
      if (inactiveAccounts.length > 0) {
        await Following.updateMany(
          { _id: { $in: inactiveAccounts.map(account => account._id) } },
          { unfollowRecommended: true }
        );
      }
      
      return {
        success: true,
        count: inactiveAccounts.length,
        inactivityPeriod
      };
    } else {
      await checkInactiveAccounts();
      return { success: true };
    }
  } catch (err) {
    console.error('Error in manual check for inactive accounts:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

const manualSyncTikTokData = async (userId) => {
  try {
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.tiktokConnected) {
        throw new Error('TikTok account not connected');
      }
      
      // Call Python script to sync data
      const pythonScriptPath = path.join(__dirname, '../../python_service.py');
      
      const pythonProcess = spawn('python3', [
        pythonScriptPath,
        '--sync',
        '--user_id', user._id.toString(),
        '--ms_token', user.tiktokCredentials.msToken,
        '--session_id', user.tiktokCredentials.sessionId,
        '--username', user.tiktokCredentials.username
      ]);
      
      // Wait for Python process to complete
      const result = await new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, stdout });
          } else {
            reject(new Error(`Python process exited with code ${code}: ${stderr}`));
          }
        });
      });
      
      return result;
    } else {
      await syncTikTokData();
      return { success: true };
    }
  } catch (err) {
    console.error('Error in manual sync TikTok data:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

module.exports = {
  initScheduler,
  checkInactiveAccounts,
  syncTikTokData,
  manualCheckInactiveAccounts,
  manualSyncTikTokData
};
