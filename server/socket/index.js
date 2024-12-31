// socket/index.js
import { updateTotalSupply, getTotalSupply } from '../utils/chainUtils.js';
import { currentTime } from '../utils/timeUtils.js';
import { createResolution, getAllResolutions } from '../models/resolutionModel.js';

export function registerSocketEvents(io) {
  io.on('connection', async (socket) => {
    console.log('Client connected');

    // Emit initial data
    const initialTime = currentTime();
    const initialSupply = getTotalSupply().toString();
    socket.emit('time', initialTime);
    socket.emit('supply', initialSupply);

    // Emit historic resolutions from DB instead of in-memory array
    const allResolutions = await getAllResolutions();
    socket.emit('historicResolutions', allResolutions);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Start the broadcast loop
  synchronizeBroadcast(io);
}

async function synchronizeBroadcast(io) {
  const time = currentTime();

  if (time === '[RESOLVING]') {
    io.emit('time', time);
    io.emit('supply', '[RESOLVING]');

    // Insert a new resolution record in the DB
    await createResolution(new Date().toISOString(), 'Test successful');

    // Re-query to get updated resolutions
    const updatedResolutions = await getAllResolutions();
    io.emit('historicResolutions', updatedResolutions);

    setTimeout(() => synchronizeBroadcast(io), 4000);

  } else {
    updateTotalSupply((supply) => {
      io.emit('supply', `[Current supply: ${supply}]`);
    });
    io.emit('time', time);
    setTimeout(() => synchronizeBroadcast(io), 1000);
  }
}
