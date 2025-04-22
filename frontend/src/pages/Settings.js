import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Slider, 
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import TikTokConnectionForm from '../components/TikTokConnectionForm';

const Settings = () => {
  const { currentUser, updatePreferences, error: authError } = useAuth();
  
  const [preferences, setPreferences] = useState({
    notificationThreshold: currentUser?.preferences?.notificationThreshold || 20,
    inactivityPeriod: currentUser?.preferences?.inactivityPeriod || 30
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePreferenceChange = (name, value) => {
    setPreferences({
      ...preferences,
      [name]: value
    });
    
    // Reset status messages
    setSuccess(false);
    setError('');
  };

  const handleSliderChange = (name) => (event, newValue) => {
    handlePreferenceChange(name, newValue);
  };

  const handleInputChange = (name) => (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      handlePreferenceChange(name, value);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setSuccess(false);
    setError('');
    
    try {
      const success = await updatePreferences(preferences);
      if (success) {
        setSuccess(true);
      } else {
        setError(authError || 'Failed to update preferences');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        {/* TikTok Connection */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            TikTok Account
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {currentUser?.tiktokConnected ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Your TikTok account is connected
              </Alert>
              <Typography variant="body1" gutterBottom>
                Username: @{currentUser?.tiktokCredentials?.username || 'Unknown'}
              </Typography>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {/* Handle disconnect */}}
              >
                Disconnect Account
              </Button>
            </Box>
          ) : (
            <TikTokConnectionForm />
          )}
        </Paper>
        
        {/* Notification Settings */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Batch Unfollow Notification Threshold</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Slider
                value={preferences.notificationThreshold}
                onChange={handleSliderChange('notificationThreshold')}
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                sx={{ mr: 2, flexGrow: 1 }}
              />
              <TextField
                value={preferences.notificationThreshold}
                onChange={handleInputChange('notificationThreshold')}
                type="number"
                InputProps={{ inputProps: { min: 1, max: 100 } }}
                sx={{ width: 80 }}
                size="small"
              />
            </Box>
            <FormHelperText>
              Notify me before unfollowing when more than {preferences.notificationThreshold} accounts are inactive
            </FormHelperText>
          </FormControl>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive email notifications"
          />
        </Paper>
        
        {/* Following Management Settings */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Following Management
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Inactivity Period (Days)</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Slider
                value={preferences.inactivityPeriod}
                onChange={handleSliderChange('inactivityPeriod')}
                min={7}
                max={90}
                step={1}
                valueLabelDisplay="auto"
                sx={{ mr: 2, flexGrow: 1 }}
              />
              <TextField
                value={preferences.inactivityPeriod}
                onChange={handleInputChange('inactivityPeriod')}
                type="number"
                InputProps={{ inputProps: { min: 7, max: 90 } }}
                sx={{ width: 80 }}
                size="small"
              />
            </Box>
            <FormHelperText>
              Recommend unfollowing accounts with no engagement for {preferences.inactivityPeriod} days
            </FormHelperText>
          </FormControl>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Automatically check for inactive accounts daily"
          />
        </Paper>
        
        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {success && (
            <Alert severity="success" sx={{ mr: 2 }}>
              Settings saved successfully
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mr: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            onClick={handleSavePreferences}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : 'Save Settings'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings;
