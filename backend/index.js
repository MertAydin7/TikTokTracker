const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const schedulerService = require('./services/scheduler.service');
const autoUnfollowService = require('./services/auto-unfollow.service');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiktok-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/following', require('./routes/following.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/tiktok', require('./routes/tiktok.routes'));
app.use('/api/scheduler', require('./routes/scheduler.routes'));
app.use('/api/auto-unfollow', require('./routes/auto-unfollow.routes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Initialize services
schedulerService.initScheduler();
autoUnfollowService.initialize();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
