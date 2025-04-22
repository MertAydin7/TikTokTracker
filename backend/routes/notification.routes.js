const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// @route   GET api/notifications
// @desc    Get all notifications for a user
// @access  Private
router.get('/', notificationController.getNotifications);

// @route   GET api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', notificationController.getUnreadCount);

// @route   PUT api/notifications/read/:notificationId
// @desc    Mark notification as read
// @access  Private
router.put('/read/:notificationId', notificationController.markAsRead);

// @route   PUT api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', notificationController.markAllAsRead);

// @route   DELETE api/notifications/:notificationId
// @desc    Delete a notification
// @access  Private
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
