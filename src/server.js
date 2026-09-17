import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectRedis } from './config/redis.js';
import { setupSocket } from './socket/index.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const init = async () => {
  await connectRedis();
  setupSocket(io);
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

init();
