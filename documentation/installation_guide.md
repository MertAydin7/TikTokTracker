# TikTok Tracker - Installation Guide

## Prerequisites

Before installing TikTok Tracker, ensure you have the following prerequisites:

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Python (v3.8 or higher)
- npm or pnpm package manager
- Git (optional, for cloning the repository)

## Installation Steps

### 1. Clone or Download the Repository

```bash
git clone https://github.com/yourusername/tiktok-tracker.git
cd tiktok-tracker
```

Or download and extract the ZIP file from the provided source.

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install Node.js dependencies
npm install

# Create a .env file with your configuration
echo "MONGODB_URI=mongodb://localhost:27017/tiktok-tracker
JWT_SECRET=your_jwt_secret_key
PORT=5000" > .env
```

### 3. Python Service Setup

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### 4. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 5. Database Setup

Ensure MongoDB is running on your system. The application will automatically create the necessary collections when it first connects to the database.

## Running the Application

### Development Mode

#### Backend Server

```bash
# From the backend directory
npm run dev
```

#### Frontend Development Server

```bash
# From the frontend directory
npm run dev
```

### Production Mode

#### Build Frontend

```bash
# From the frontend directory
npm run build
```

#### Start Backend Server

```bash
# From the backend directory
npm start
```

## Accessing the Application

- Backend API: http://localhost:5000/api
- Frontend (Development): http://localhost:3000
- Frontend (Production): Served through the backend at http://localhost:5000

## Environment Variables

### Backend (.env file)

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port for the backend server (default: 5000)
- `NODE_ENV`: Environment (development or production)

### Frontend (.env file)

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Deployment Options

### Option 1: Traditional Server Deployment

1. Set up a server with Node.js, MongoDB, and Python
2. Clone the repository and follow the installation steps
3. Use a process manager like PM2 to keep the application running
4. Set up a reverse proxy with Nginx or Apache
5. Configure SSL for secure connections

### Option 2: Docker Deployment

A Dockerfile and docker-compose.yml are provided for containerized deployment:

```bash
# Build and start the containers
docker-compose up -d
```

### Option 3: Cloud Deployment

The application can be deployed to cloud platforms:

- **Backend**: Deploy to services like Heroku, AWS Elastic Beanstalk, or Google App Engine
- **Frontend**: Deploy to services like Netlify, Vercel, or GitHub Pages
- **Database**: Use MongoDB Atlas or similar managed database service

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the connection string in the .env file

2. **Python Service Not Working**:
   - Verify Python dependencies are installed
   - Check Python version compatibility

3. **Frontend API Connection Issues**:
   - Ensure the REACT_APP_API_URL is correctly set
   - Check for CORS configuration in the backend

### Logs

- Backend logs are available in the console or in `logs/` directory if configured
- Frontend development logs are available in the browser console

## Updating

To update the application to a newer version:

1. Backup your database and configuration files
2. Pull the latest changes or download the new version
3. Install any new dependencies
4. Apply any database migrations if provided
5. Rebuild the frontend if necessary
6. Restart the application

## Support

For additional support, refer to:
- The developer documentation in `/documentation/developer_guide.md`
- The user guide in `/documentation/user_guide.md`
- The GitHub repository issues section
