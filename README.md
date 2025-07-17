# Real-Time Chat App MVP

## Overview
A full-stack real-time chat application with authentication, user-to-user messaging, and message persistence. Built with Node.js, Express, MongoDB, Socket.IO, and React.js.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs
- **Frontend:** React.js, Vite, Socket.IO-client, Axios, jwt-decode

## Features
- User registration and login (JWT authentication)
- Real-time messaging (Socket.IO)
- Message persistence (MongoDB)
- Contacts list
- Secure password hashing (bcrypt)
- Protected routes (JWT)
- CORS configuration

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with your MongoDB URI and JWT secret.
4. `node index.js`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment
- Backend: Render (or similar)
- Frontend: Vercel (or similar)

---
This MVP is ideal for portfolios, internships, or as a foundation for a more robust chat platform. 