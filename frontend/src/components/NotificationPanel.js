import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Divider, 
  Button, 
  Box 
} from '@mui/material';
import { 
  Close as CloseIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

const NotificationPanel = ({ open, onClose }) => {
  const { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 320, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {notifications.length > 0 && (
          <Button 
            variant="text" 
            onClick={handleMarkAllAsRead}
            sx={{ mb: 2 }}
          >
            Mark all as read
          </Button>
        )}
        
        {loading ? (
          <Typography>Loading notifications...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : notifications.length === 0 ? (
          <Typography>No notifications</Typography>
        ) : (
          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    borderRadius: 1
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </>
                    }
                    onClick={() => handleMarkAsRead(notification._id)}
                  />
                  <ListItemSecondaryAction>
                    {!notification.read && (
                      <IconButton 
                        edge="end" 
                        aria-label="mark as read"
                        onClick={() => handleMarkAsRead(notification._id)}
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDelete(notification._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationPanel;
