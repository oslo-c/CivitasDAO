// app.js
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

import { initDB } from './models/resolutionModel.js';
import resolutionsRouter from './routes/resolutions.js';
import { registerSocketEvents } from './socket/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mount the REST routes for resolutions
app.use('/resolutions', resolutionsRouter);

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
const io = new SocketIO(server, { 
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

// Register Socket.io events (real-time logic)
registerSocketEvents(io);

// Before starting the server, ensure the DB is initialized
initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB:', err);
});
