# Dynexia Client Portal - MERN Stack Application

A full-stack client portal application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication and authorization
- Project management
- Document uploads and management
- Messaging system
- Invoice tracking
- Client onboarding
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for file storage

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- shadcn/ui components

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Google OAuth credentials (optional)

## Environment Variables

### Backend
Create a `.env` file in the backend directory with the following variables:

\`\`\`
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
MAX_FILE_UPLOAD=10000000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

### Frontend
Create a `.env` file in the frontend directory with the following variables:

\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
\`\`\`

## Installation

### Development Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/dynexia-client-portal.git
cd dynexia-client-portal
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd ../frontend
npm install
\`\`\`

4. Run the development servers:

Backend:
\`\`\`bash
cd ../backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd ../frontend
npm start
\`\`\`

The backend will run on http://localhost:5000 and the frontend on http://localhost:3000.

### Production Deployment

#### Using Docker Compose

1. Make sure Docker and Docker Compose are installed on your server.

2. Create a `.env` file in the root directory with all the required environment variables.

3. Build and start the containers:
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

#### Manual Deployment

1. Build the frontend:
\`\`\`bash
cd frontend
npm run build
\`\`\`

2. Set up a production server (e.g., Nginx) to serve the frontend build files.

3. Set up a process manager (e.g., PM2) to run the backend:
\`\`\`bash
cd backend
npm install -g pm2
pm2 start server.js
\`\`\`

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

This completes the production-ready MERN stack implementation of the Dynexia Client Portal. The application is now ready for deployment, with all the necessary files and configurations in place. Just add the environment variables as specified, and you'll be good to go!
