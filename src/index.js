import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import morgan from 'morgan';
import cors from 'cors';
import auth from './middleware/auth.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const io = new Server(httpServer, {
  cors: {
    origin: ['*','http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

// Socket.IO connection handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    const user = await User.findOne({ _id: decoded.userId });
    console.log('User:', user);

    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.log('Socket error:', error.message);
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected', socket.user.email);

  socket.on('test', async (data) => {
    console.log('Test event', data);
  });

  socket.on('queue_join', async (data) => {
    try {
      const position = queueService.join(socket.user);
      io.emit('queueUpdate', queueService.getCurrentQueue());
    } catch (error) {
      socket.emit('queue_error', { message: error.message });
    }
  });

  socket.on('queue_leave', async (data) => {
    queueService.leave(socket.user);
    io.emit('queueUpdate', queueService.getCurrentQueue());
  });

  socket.on('queue_cancel', async (data) => {
    const position = queueService.cancel(socket.user);
    io.emit('queueUpdate', queueService.getCurrentQueue());
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.user.email);
  });
});

// Make io accessible to our routes
app.set('io', io);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});