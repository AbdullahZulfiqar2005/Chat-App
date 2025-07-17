# Real-Time Chat App

A full-stack real-time chat application with Firebase Authentication, user-to-user messaging, and message persistence. Built with Node.js, Express, MongoDB, Socket.IO, React.js, and Firebase Auth.

## Features
- User registration and login with Firebase Authentication (email verification required)
- Random display names for users (no email shown in chat)
- Real-time messaging (Socket.IO)
- Message persistence (MongoDB)
- Contacts list (shows all registered users except yourself)
- Secure backend (no passwords stored)
- Protected routes (Firebase Auth)
- CORS configuration

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Frontend:** React.js, Vite, Socket.IO-client, Axios, Firebase JS SDK
- **Authentication:** Firebase Auth (email/password, email verification)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AbdullahZulfiqar2005/Chat-App.git
cd Chat-App
```

### 2. Setup Backend
- Go to the `backend` folder:
  ```bash
  cd backend
  npm install
  ```
- Create a `.env` file in `backend/` with your MongoDB URI:
  ```env
  MONGO_URI=your_mongodb_uri
  PORT=5000
  ```
- Start the backend:
  ```bash
  node index.js
  ```

### 3. Setup Frontend
- Go to the `frontend` folder:
  ```bash
  cd ../frontend
  npm install
  ```
- Create a `src/firebase.js` file with your Firebase config (already present if you followed setup):
- Start the frontend:
  ```bash
  npm run dev
  ```

### 4. Firebase Setup
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable **Email/Password** authentication
- Enable **Email Verification** in the Authentication templates
- Copy your Firebase config to `frontend/src/firebase.js`

## Deployment
- Backend: Render, Railway, Heroku, or similar (free tiers available)
- Frontend: Vercel, Netlify, or similar (free tiers available)
- MongoDB: [MongoDB Atlas](https://www.mongodb.com/atlas/database) (free tier)
- Firebase Auth: [Firebase Console](https://console.firebase.google.com/)

## Environment Variables
- **Backend:**
  - `MONGO_URI` - Your MongoDB connection string
  - `PORT` - Port for backend (default: 5000)
- **Frontend:**
  - Firebase config is stored in `src/firebase.js`

## Notes
- Each user is assigned a random display name on first login (e.g., "Brave Tiger").
- Only verified users can log in and chat.
- No passwords are stored in your backend; all authentication is handled by Firebase.
