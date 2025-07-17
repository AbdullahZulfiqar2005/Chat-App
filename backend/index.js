require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');
const User = require('./models/User');

// Track online users: { userId: socketId }
const onlineUsers = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {/* MongoDB connected */})
  .catch(err => {/* MongoDB connection error */});

// Socket.IO events
io.on('connection', (socket) => {
  // Listen for user identification
  socket.on('userOnline', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });

  // Listen for sending messages
  socket.on('sendMessage', async ({ sender, recipient, content }) => {
    try {
      // Persist message
      const message = new Message({ sender, recipient, content });
      await message.save();
      // Emit to recipient if online
      const recipientSocket = onlineUsers[recipient];
      if (recipientSocket) {
        io.to(recipientSocket).emit('receiveMessage', message);
      }
      // Optionally emit to sender for confirmation
      socket.emit('messageSent', message);
    } catch (err) {
      socket.emit('error', 'Message send failed');
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove user from onlineUsers
    for (const [userId, sockId] of Object.entries(onlineUsers)) {
      if (sockId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {/* Server running on port */}); 