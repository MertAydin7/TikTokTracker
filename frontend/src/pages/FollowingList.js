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
  DialogActions
} from '@mui/material';
import { 
  Search as SearchIcon,
  PersonRemove as PersonRemoveIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useTikTok } from '../context/TikTokContext';

const FollowingList = () => {
  const { 
    followingList, 
    loading, 
    error, 
    fetchFollowingList, 
    unfollowAccount 
  } = useTikTok();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filteredList, setFilteredList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false);
  const [unfollowing, setUnfollowing] = useState(false);

  useEffect(() => {
    fetchFollowingList();
  }, [fetchFollowingList]);

  useEffect(() => {
    if (followingList.length > 0) {
      let filtered = [...followingList];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(account => 
          account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        if (sortBy === 'username') {
          valueA = a.username.toLowerCase();
          valueB = b.username.toLowerCase();
        } else if (sortBy === 'lastEngagement') {
          valueA = a.lastEngagement ? new Date(a.lastEngagement).getTime() : 0;
          valueB = b.lastEngagement ? new Date(b.lastEngagement).getTime() : 0;
        } else if (sortBy === 'followedAt') {
          valueA = new Date(a.followedAt).getTime();
          valueB = new Date(b.followedAt).getTime();
        }
        
        if (sortDirection === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      
      setFilteredList(filtered);
    } else {
      setFilteredList([]);
    }
  }, [followingList, searchTerm, sortBy, sortDirection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleUnfollowClick = (account) => {
    setSelectedAccount(account);
    setUnfollowDialogOpen(true);
  };

  const handleUnfollow = async () => {
    if (selectedAccount) {
      setUnfollowing(true);
      await unfollowAccount(selectedAccount.tiktokUserId);
      setUnfollowing(false);
      setUnfollowDialogOpen(false);
      setSelectedAccount(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Following List
        </Typography>
        
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              startIcon={<SortIcon />}
              onClick={() => handleSortChange('username')}
              variant={sortBy === 'username' ? 'contained' : 'outlined'}
            >
              Username {sortBy === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="small" 
              startIcon={<SortIcon />}
              onClick={() => handleSortChange('lastEngagement')}
              variant={sortBy === 'lastEngagement' ? 'contained' : 'outlined'}
            >
              Last Engagement {sortBy === 'lastEngagement' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="small" 
              startIcon={<SortIcon />}
              onClick={() => handleSortChange('followedAt')}
              variant={sortBy === 'followedAt' ? 'contained' : 'outlined'}
            >
              Followed Date {sortBy === 'followedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Button>
          </Box>
        </Paper>
        
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredList.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1">
                {searchTerm ? 'No accounts match your search.' : 'You are not following anyone.'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredList.map((account, index) => (
                <React.Fragment key={account.tiktokUserId}>
                  <ListItem>
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
                            Followed since: {formatDate(account.followedAt)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="unfollow"
                        onClick={() => handleUnfollowClick(account)}
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
            disabled={unfollowing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUnfollow} 
            color="error" 
            disabled={unfollowing}
          >
            {unfollowing ? <CircularProgress size={24} /> : 'Unfollow'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FollowingList;
