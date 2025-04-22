# TikTok Tracker - Developer Documentation

## System Architecture

TikTok Tracker is a full-stack application with the following components:

### Backend
- **Node.js Server**: Express-based RESTful API
- **MongoDB Database**: Stores user data, following relationships, engagements, and notifications
- **Python Service**: Handles TikTok API integration and data extraction
- **Scheduler Service**: Manages automated tasks like checking for inactive accounts
- **Auto-Unfollow Service**: Handles the automated unfollowing process

### Frontend
- **React Application**: Single-page application with responsive design
- **Material UI**: Component library for consistent UI/UX
- **Context API**: State management for authentication, notifications, and TikTok data
- **Recharts**: Data visualization for engagement analytics

## Project Structure

```
tiktok_tracker/
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── index.js          # Entry point
│   └── package.json          # Dependencies
├── frontend/                 # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── utils/            # Utility functions
│   │   └── App.js            # Main component
│   └── package.json          # Dependencies
├── python_service.py         # Python service for TikTok API
├── requirements.txt          # Python dependencies
├── documentation/            # Documentation files
└── run_tests.sh              # Test script
```

## Database Schema

### User
- `_id`: ObjectId
- `name`: String
- `email`: String
- `password`: String (hashed)
- `tiktokConnected`: Boolean
- `tiktokCredentials`: Object
  - `msToken`: String
  - `sessionId`: String
  - `username`: String
- `preferences`: Object
  - `notificationThreshold`: Number
  - `inactivityPeriod`: Number
  - `autoUnfollowEnabled`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

### Following
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `tiktokUserId`: String
- `username`: String
- `displayName`: String
- `profilePicture`: String
- `isActive`: Boolean
- `followedAt`: Date
- `unfollowedAt`: Date
- `lastEngagement`: Date
- `unfollowRecommended`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

### Engagement
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `tiktokUserId`: String
- `contentId`: String
- `type`: String (like, view, fyp_appearance)
- `timestamp`: Date
- `createdAt`: Date

### Notification
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `type`: String
- `title`: String
- `message`: String
- `read`: Boolean
- `data`: Object
- `createdAt`: Date
- `updatedAt`: Date

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/auth`: Get current user

### User Management
- `PUT /api/users/preferences`: Update user preferences
- `POST /api/users/connect-tiktok`: Connect TikTok account
- `POST /api/users/disconnect-tiktok`: Disconnect TikTok account

### Following Management
- `GET /api/users/following`: Get user's following list
- `GET /api/users/inactive-following`: Get inactive accounts
- `POST /api/following/unfollow/:tiktokUserId`: Unfollow a user
- `POST /api/following/batch-unfollow`: Unfollow multiple users
- `POST /api/following/ignore/:tiktokUserId`: Ignore unfollow recommendation

### Notifications
- `GET /api/notifications`: Get user's notifications
- `GET /api/notifications/unread-count`: Get unread notification count
- `PUT /api/notifications/read/:id`: Mark notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read
- `DELETE /api/notifications/:id`: Delete notification

### TikTok Data
- `GET /api/tiktok/engagement-stats`: Get engagement statistics
- `GET /api/tiktok/sync`: Sync TikTok data

### Scheduler
- `POST /api/scheduler/check-inactive`: Manually trigger inactive accounts check
- `POST /api/scheduler/sync-tiktok`: Manually trigger TikTok data sync

### Auto-Unfollow
- `POST /api/auto-unfollow/trigger`: Manually trigger auto-unfollow process

## Automated Processes

### Scheduler Service
- Daily check for inactive accounts (runs at 3 AM)
- Weekly TikTok data sync (runs every Sunday at 4 AM)

### Auto-Unfollow Service
- Daily check for auto-unfollow (runs at 2 AM)
- Processes accounts based on user preferences
- Creates notifications for batch unfollows

## TikTok API Integration

The application uses a Python service to interact with TikTok's API. Due to TikTok's API limitations, we use a combination of official and unofficial methods:

- **Official TikTok API**: Used for basic operations where available
- **TikTok-Api Library**: Python library for accessing TikTok data
- **Browser Automation**: For operations not supported by the API

## Deployment

### Backend Deployment
1. Install Node.js and MongoDB
2. Install Python and required packages: `pip install -r requirements.txt`
3. Set environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT authentication
   - `PORT`: Server port (default: 5000)
4. Start the server: `cd backend && npm start`

### Frontend Deployment
1. Build the React app: `cd frontend && npm run build`
2. Serve the static files from a web server

### Production Considerations
- Use a process manager like PM2 for the Node.js server
- Set up a reverse proxy with Nginx or Apache
- Configure SSL for secure connections
- Implement proper logging and monitoring
- Set up database backups

## Security Considerations

- User passwords are hashed using bcrypt
- JWT tokens are used for authentication
- TikTok credentials are encrypted in the database
- CORS is configured to restrict API access
- Input validation is implemented for all API endpoints
- Rate limiting is applied to prevent abuse

## Future Enhancements

- Email notification system
- Mobile application
- Additional social media platform integrations
- Advanced analytics and reporting
- Machine learning for engagement prediction
- Bulk import/export of following lists
