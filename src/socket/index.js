import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { client as redisClient } from '../config/redis.js';

const PRESENCE_TTL = 60;

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Missing token'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    await redisClient.setEx(`presence:${socket.userId}`, PRESENCE_TTL, 'online');
    
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { userId: socket.userId, roomId });
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', { userId: socket.userId, roomId });
    });

    socket.on('send_message', async (data) => {
      const { roomId, content } = data;
      try {
        const result = await db.query(
          'INSERT INTO messages (room_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
          [roomId, socket.userId, content]
        );
        io.to(roomId).emit('new_message', result.rows[0]);
      } catch (error) {
        console.error('Error processing message', error);
      }
    });

    socket.on('typing_start', (roomId) => {
      socket.to(roomId).emit('presence_update', { userId: socket.userId, status: 'typing' });
    });

    socket.on('typing_stop', (roomId) => {
      socket.to(roomId).emit('presence_update', { userId: socket.userId, status: 'online' });
    });

    socket.on('ping_presence', async () => {
      await redisClient.setEx(`presence:${socket.userId}`, PRESENCE_TTL, 'online');
    });

    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          socket.to(roomId).emit('user_left', { userId: socket.userId, roomId });
          socket.to(roomId).emit('presence_update', { userId: socket.userId, status: 'offline' });
        }
      }
    });

    socket.on('disconnect', async () => {
      await redisClient.del(`presence:${socket.userId}`);
    });
  });
};
