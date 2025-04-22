import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Alert, 
  CircularProgress, 
  Typography,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TikTokConnectionForm = () => {
  const [formData, setFormData] = useState({
    msToken: '',
    sessionId: '',
    username: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { connectTikTok, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.msToken) {
      errors.msToken = 'MS Token is required';
    }
    
    if (!formData.sessionId) {
      errors.sessionId = 'Session ID is required';
    }
    
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setAlertMessage('');
    
    const success = await connectTikTok(formData);
    
    setSubmitting(false);
    
    if (!success) {
      setAlertMessage(error || 'Failed to connect TikTok account. Please check your credentials.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="body1" paragraph>
        To connect your TikTok account, you need to provide your authentication tokens.
        These can be found in your browser cookies after logging into TikTok.
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" paragraph>
          <strong>How to find your TikTok tokens:</strong>
          <ol>
            <li>Log in to TikTok in your browser</li>
            <li>Open Developer Tools (F12 or right-click and select "Inspect")</li>
            <li>Go to the "Application" tab</li>
            <li>Select "Cookies" in the left sidebar</li>
            <li>Find the "ms_token" and "sessionid" cookies</li>
            <li>Copy their values into the fields below</li>
          </ol>
        </Typography>
      </Paper>
      
      {alertMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="msToken"
        label="MS Token"
        name="msToken"
        value={formData.msToken}
        onChange={handleChange}
        error={!!formErrors.msToken}
        helperText={formErrors.msToken}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="sessionId"
        label="Session ID"
        name="sessionId"
        value={formData.sessionId}
        onChange={handleChange}
        error={!!formErrors.sessionId}
        helperText={formErrors.sessionId}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="TikTok Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={!!formErrors.username}
        helperText={formErrors.username}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={submitting}
      >
        {submitting ? <CircularProgress size={24} /> : 'Connect TikTok Account'}
      </Button>
    </Box>
  );
};

export default TikTokConnectionForm;
