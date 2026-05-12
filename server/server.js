const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');

const app = express();
const server = http.createServer(app);

// CORS configuration — allow the frontend origin in production
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in current phase
    }
  },
  credentials: true,
}));

app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'DevMatch API Running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Socket.io for real-time chat
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    socket.broadcast.emit('userOnline', userId);
  });

  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data;
    const targetSocket = connectedUsers[receiverId];
    if (targetSocket) {
      io.to(targetSocket).emit('receiveMessage', {
        senderId,
        message,
        createdAt: new Date().toISOString(),
      });
    }
  });

  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    const targetSocket = connectedUsers[receiverId];
    if (targetSocket) {
      io.to(targetSocket).emit('userTyping', { senderId });
    }
  });

  socket.on('stopTyping', (data) => {
    const { senderId, receiverId } = data;
    const targetSocket = connectedUsers[receiverId];
    if (targetSocket) {
      io.to(targetSocket).emit('userStopTyping', { senderId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        socket.broadcast.emit('userOffline', userId);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket ready for real-time chat`);
    });
  })
  .catch(err => console.log('❌ MongoDB connection error:', err));