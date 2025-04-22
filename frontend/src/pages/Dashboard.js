import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTikTok } from '../context/TikTokContext';
import TikTokConnectionForm from '../components/TikTokConnectionForm';
import EngagementChart from '../components/EngagementChart';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    followingList, 
    inactiveAccounts, 
    engagementStats, 
    syncStatus, 
    loading, 
    error,
    fetchFollowingList,
    fetchInactiveAccounts,
    fetchEngagementStats,
    syncTikTokData
  } = useTikTok();
  const navigate = useNavigate();
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await fetchFollowingList();
      await fetchInactiveAccounts();
      await fetchEngagementStats();
    };

    if (currentUser?.tiktokConnected) {
      loadData();
    }
  }, [currentUser, fetchFollowingList, fetchInactiveAccounts, fetchEngagementStats]);

  const handleSync = async () => {
    setSyncError('');
    const success = await syncTikTokData();
    if (!success) {
      setSyncError('Failed to sync TikTok data. Please try again later.');
    }
  };

  if (!currentUser) {
    return <CircularProgress />;
  }

  if (!currentUser.tiktokConnected) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to TikTok Tracker
          </Typography>
          <Typography variant="body1" paragraph>
            Connect your TikTok account to start tracking your For You Page activity and manage your following list.
          </Typography>
          <TikTokConnectionForm />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleSync}
            disabled={syncStatus === 'syncing' || loading}
          >
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync TikTok Data'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {syncError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {syncError}
          </Alert>
        )}

        {syncStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            TikTok data synced successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Following
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={24} /> : followingList.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total accounts you're following
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button size="small" onClick={() => navigate('/following')}>
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonRemoveIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Inactive
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={24} /> : inactiveAccounts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accounts with no engagement in 30 days
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button size="small" onClick={() => navigate('/inactive')}>
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Engagement
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={24} /> : engagementStats?.totalEngagements || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total interactions in the last 30 days
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button size="small" disabled>
                  Details
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Engagement Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Engagement Activity
              </Typography>
              <Box sx={{ height: 300 }}>
                <EngagementChart data={engagementStats?.dailyEngagements || []} loading={loading} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
