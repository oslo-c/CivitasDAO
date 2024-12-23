import express from 'express';
import http from 'http'; // http for testing, https for production
import { Server as socketIo } from 'socket.io';
import cors from 'cors';
import { updateTotalSupply, getTotalSupply } from './chain-logic.js';
import Resolution from './resolutions.js';

const app = express();
const PORT = process.env.PORT || 4000;


// Server Setup
const server = http.createServer(app);
const io = new socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const historicResolutions = []; // Array to store historic resolutions

io.on('connection', (socket) => {
    console.log('Client connected');

    // Emit initial data
    const initialTime = currentTime();
    const initialSupply = getTotalSupply().toString();
    socket.emit('time', initialTime);
    socket.emit('supply', initialSupply);

    // Emit historic resolutions
    socket.emit('historicResolutions', historicResolutions);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to synchronize broadcasts
function synchronizeBroadcast() {
    const time = currentTime();
    if (time === '[RESOLVING]') {
        io.emit('time', time);
        io.emit('supply', '[RESOLVING]');
        setTimeout(synchronizeBroadcast, 4000);
        addResolution(new Date().toISOString(), "Test successful");
        io.emit('historicResolutions', historicResolutions);
        
    } else {
        updateTotalSupply((supply) => {
            io.emit('supply', `[Current supply: ${supply}]`);
        });
        io.emit('time', time);
        setTimeout(synchronizeBroadcast, 1000);
    }
}

// Start the broadcast loop
synchronizeBroadcast();

function currentTime() {
    const time = timeToResolve(new Date());
    return time;
}

function timeToResolve(date) {
    const nextHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, 0, 0);
    const timeDifference = nextHour.getTime() - date.getTime();
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (seconds === 0) {
        return '[RESOLVING]';
    }
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `[Time to resolve: ${paddedMinutes}m ${paddedSeconds}s]`;
}

// Function to add a resolution to the history
function addResolution(date, message) {
    const resolution = {
        timestamp: new Date().toISOString(),
        message: message
    };
    historicResolutions.push(resolution);
}



