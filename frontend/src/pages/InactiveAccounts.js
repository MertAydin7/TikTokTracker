import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction, 
  Avatar, 
  Button, 
  IconButton, 
  Divider, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTikTok } from '../context/TikTokContext';

const InactiveAccounts = () => {
  const { 
    inactiveAccounts, 
    loading, 
    error, 
    fetchInactiveAccounts, 
    unfollowAccount,
    batchUnfollow,
    ignoreUnfollowRecommendation
  } = useTikTok();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInactiveAccounts();
  }, [fetchInactiveAccounts]);

  useEffect(() => {
    if (inactiveAccounts.length > 0) {
      let filtered = [...inactiveAccounts];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(account => 
          account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort by last engagement (oldest first)
      filtered.sort((a, b) => {
        const dateA = a.lastEngagement ? new Date(a.lastEngagement).getTime() : 0;
        const dateB = b.lastEngagement ? new Date(b.lastEngagement).getTime() : 0;
        return dateA - dateB;
      });
      
      setFilteredList(filtered);
    } else {
      setFilteredList([]);
    }
  }, [inactiveAccounts, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUnfollowClick = (account) => {
    setSelectedAccount(account);
    setUnfollowDialogOpen(true);
  };

  const handleUnfollow = async () => {
    if (selectedAccount) {
      setProcessing(true);
      await unfollowAccount(selectedAccount.tiktokUserId);
      setProcessing(false);
      setUnfollowDialogOpen(false);
      setSelectedAccount(null);
    }
  };

  const handleIgnore = async (account) => {
    setProcessing(true);
    await ignoreUnfollowRecommendation(account.tiktokUserId);
    setProcessing(false);
  };

  const handleSelectAccount = (account) => {
    const isSelected = selectedAccounts.some(a => a.tiktokUserId === account.tiktokUserId);
    
    if (isSelected) {
      setSelectedAccounts(selectedAccounts.filter(a => a.tiktokUserId !== account.tiktokUserId));
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredList.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts([...filteredList]);
    }
  };

  const handleBatchUnfollow = async () => {
    if (selectedAccounts.length > 0) {
      setProcessing(true);
      const userIds = selectedAccounts.map(account => account.tiktokUserId);
      await batchUnfollow(userIds);
      setProcessing(false);
      setBatchDialogOpen(false);
      setSelectedAccounts([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateInactiveDays = (dateString) => {
    if (!dateString) return 'N/A';
    const lastEngagement = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - lastEngagement);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Inactive Accounts
          </Typography>
          {filteredList.length > 0 && (
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setBatchDialogOpen(true)}
              disabled={selectedAccounts.length === 0 || processing}
            >
              Unfollow Selected ({selectedAccounts.length})
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by username or display name"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>
          
          {filteredList.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox 
                  checked={selectedAccounts.length === filteredList.length}
                  indeterminate={selectedAccounts.length > 0 && selectedAccounts.length < filteredList.length}
                  onChange={handleSelectAll}
                />
              }
              label="Select All"
            />
          )}
        </Paper>
        
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredList.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1">
                {searchTerm ? 'No inactive accounts match your search.' : 'No inactive accounts found.'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredList.map((account, index) => (
                <React.Fragment key={account.tiktokUserId}>
                  <ListItem>
                    <Checkbox
                      checked={selectedAccounts.some(a => a.tiktokUserId === account.tiktokUserId)}
                      onChange={() => handleSelectAccount(account)}
                    />
                    <ListItemAvatar>
                      <Avatar src={account.profilePicture} alt={account.username}>
                        {account.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {account.displayName}
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                            @{account.username}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            Last engagement: {formatDate(account.lastEngagement)}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span">
                            Inactive for: {calculateInactiveDays(account.lastEngagement)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="ignore"
                        onClick={() => handleIgnore(account)}
                        disabled={processing}
                        sx={{ mr: 1 }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="unfollow"
                        onClick={() => handleUnfollowClick(account)}
                        disabled={processing}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredList.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      
      {/* Unfollow Confirmation Dialog */}
      <Dialog
        open={unfollowDialogOpen}
        onClose={() => setUnfollowDialogOpen(false)}
      >
        <DialogTitle>Unfollow Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unfollow @{selectedAccount?.username}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUnfollowDialogOpen(false)} 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUnfollow} 
            color="error" 
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Unfollow'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Batch Unfollow Confirmation Dialog */}
      <Dialog
        open={batchDialogOpen}
        onClose={() => setBatchDialogOpen(false)}
      >
        <DialogTitle>Batch Unfollow Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unfollow {selectedAccounts.length} accounts?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBatchDialogOpen(false)} 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBatchUnfollow} 
            color="error" 
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : `Unfollow ${selectedAccounts.length} Accounts`}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InactiveAccounts;
