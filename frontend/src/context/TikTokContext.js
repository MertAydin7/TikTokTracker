import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TikTokContext = createContext();

export const useTikTok = () => useContext(TikTokContext);

export const TikTokProvider = ({ children }) => {
  const [followingList, setFollowingList] = useState([]);
  const [inactiveAccounts, setInactiveAccounts] = useState([]);
  const [engagementStats, setEngagementStats] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch following list
  const fetchFollowingList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/users/following');
      setFollowingList(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching following list:', err);
      setError(err.response?.data?.message || 'Failed to fetch following list');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch inactive accounts
  const fetchInactiveAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/users/inactive-following');
      setInactiveAccounts(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching inactive accounts:', err);
      setError(err.response?.data?.message || 'Failed to fetch inactive accounts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch engagement statistics
  const fetchEngagementStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/tiktok/engagement-stats');
      setEngagementStats(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching engagement stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch engagement statistics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sync TikTok data
  const syncTikTokData = async () => {
    try {
      setSyncStatus('syncing');
      setError(null);
      const res = await axios.get('/api/tiktok/sync');
      
      // After sync is complete, refresh data
      await fetchFollowingList();
      await fetchInactiveAccounts();
      await fetchEngagementStats();
      
      setSyncStatus('success');
      return true;
    } catch (err) {
      console.error('Error syncing TikTok data:', err);
      setError(err.response?.data?.message || 'Failed to sync TikTok data');
      setSyncStatus('error');
      return false;
    }
  };

  // Unfollow a TikTok account
  const unfollowAccount = async (tiktokUserId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`/api/following/unfollow/${tiktokUserId}`);
      
      // Update local state
      setFollowingList(prevList => 
        prevList.filter(account => account.tiktokUserId !== tiktokUserId)
      );
      setInactiveAccounts(prevList => 
        prevList.filter(account => account.tiktokUserId !== tiktokUserId)
      );
      
      return true;
    } catch (err) {
      console.error('Error unfollowing account:', err);
      setError(err.response?.data?.message || 'Failed to unfollow account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Batch unfollow multiple TikTok accounts
  const batchUnfollow = async (tiktokUserIds) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/api/following/batch-unfollow', { tiktokUserIds });
      
      // Update local state
      setFollowingList(prevList => 
        prevList.filter(account => !tiktokUserIds.includes(account.tiktokUserId))
      );
      setInactiveAccounts(prevList => 
        prevList.filter(account => !tiktokUserIds.includes(account.tiktokUserId))
      );
      
      return true;
    } catch (err) {
      console.error('Error batch unfollowing accounts:', err);
      setError(err.response?.data?.message || 'Failed to unfollow accounts');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Ignore unfollow recommendation
  const ignoreUnfollowRecommendation = async (tiktokUserId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`/api/following/ignore/${tiktokUserId}`);
      
      // Update local state
      setInactiveAccounts(prevList => 
        prevList.filter(account => account.tiktokUserId !== tiktokUserId)
      );
      
      return true;
    } catch (err) {
      console.error('Error ignoring unfollow recommendation:', err);
      setError(err.response?.data?.message || 'Failed to ignore recommendation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    followingList,
    inactiveAccounts,
    engagementStats,
    syncStatus,
    loading,
    error,
    fetchFollowingList,
    fetchInactiveAccounts,
    fetchEngagementStats,
    syncTikTokData,
    unfollowAccount,
    batchUnfollow,
    ignoreUnfollowRecommendation
  };

  return (
    <TikTokContext.Provider value={value}>
      {children}
    </TikTokContext.Provider>
  );
};

export default TikTokContext;
