# TikTok Tracker - README

## Overview

TikTok Tracker is a full-stack application designed to help users manage their TikTok following list based on their For You Page (FYP) activity. The application tracks engagement with accounts that appear on the FYP and automatically identifies accounts with no interaction for a specified period, allowing users to unfollow these inactive accounts individually or in batches.

## Key Features

- **TikTok Account Integration**: Connect your TikTok account to track FYP activity
- **Engagement Tracking**: Monitor likes and FYP appearances for followed accounts
- **Automated Following Management**: Automatically identify inactive accounts for unfollowing
- **Batch Unfollow**: Unfollow multiple inactive accounts at once
- **Notification System**: Get alerts about pending unfollows, especially for large batches
- **Analytics Dashboard**: Visualize engagement patterns
- **Customizable Settings**: Adjust inactivity periods and notification thresholds

## Technology Stack

### Backend
- Node.js with Express
- MongoDB for data storage
- Python for TikTok API integration
- JWT for authentication

### Frontend
- React with hooks and context API
- Material UI for responsive design
- Recharts for data visualization

## Project Structure

```
tiktok_tracker/
├── backend/                  # Node.js backend
├── frontend/                 # React frontend
├── python_service.py         # Python service for TikTok API
├── requirements.txt          # Python dependencies
├── documentation/            # Documentation files
├── run_tests.sh              # Test script
└── README.md                 # This file
```

## Documentation

For detailed information, please refer to the following documentation:

- [User Guide](./documentation/user_guide.md) - How to use the application
- [Developer Guide](./documentation/developer_guide.md) - Technical details and architecture
- [Installation Guide](./documentation/installation_guide.md) - How to install and deploy

## Getting Started

See the [Installation Guide](./documentation/installation_guide.md) for detailed setup instructions.

Quick start:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
cd ../backend
npm start

# In a separate terminal, start the frontend development server
cd ../frontend
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TikTok-Api library for Python
- Material UI for React components
- The open source community for various tools and libraries used in this project
