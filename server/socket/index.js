// socket/index.js
import { updateTotalSupply, getTotalSupply } from '../utils/chainUtils.js';
import { currentTime } from '../utils/timeUtils.js';
import { createResolution, getAllResolutions } from '../models/resolutionModel.js';
// import { executeResolution } from '../controllers/contractController.js';

const buttonCounts = refreshButtonCounts();

export function registerSocketEvents(io) {
  io.on('connection', async (socket) => {
    console.log('Client connected');

    // Emit initial data
    const initialTime = currentTime();
    const initialSupply = getTotalSupply().toString();
    socket.emit('time', initialTime);
    socket.emit('supply', initialSupply);

    // Emit historic resolutions from DB
    const allResolutions = await getAllResolutions();
    socket.emit('historicResolutions', allResolutions);

    // Listen for button click events
    socket.on('buttonClick', (buttonId) => {
      buttonCounts[buttonId]++;
      console.log(`Button clicked: ${buttonId}. Total: ${buttonCounts[buttonId]}`);
    });
  });

  // Start the broadcast loop
  synchronizeBroadcast(io, buttonCounts);
}

async function synchronizeBroadcast(io, buttonCounts) {
  const time = currentTime();
  
  if (time === null) {
    io.emit('time', '[RESOLVING]');
    io.emit('supply', '[RESOLVING]');

    // Insert a new resolution record in the DB
    await createResolution(getResolutionId(), getAction(), getBurnedAmount(), getMintedAmount(), getTimestamp());

    // Determine the button with the most votes
    const mostVotedButton = Object.keys(buttonCounts).reduce((a, b) => buttonCounts[a] > buttonCounts[b] ? a : b, null);
    io.emit('mostVotedButton', mostVotedButton);

    // Re-query to get updated resolutions
    const updatedResolutions = await getAllResolutions();
    io.emit('historicResolutions', updatedResolutions);

    setTimeout(() => synchronizeBroadcast(io, buttonCounts), 4000);

  } else {
    updateTotalSupply((supply) => {
      io.emit('supply', `[Current supply: ${supply}]`);
    });
    io.emit('time', time);
    setTimeout(() => synchronizeBroadcast(io, buttonCounts), 1000);
  }
}

// export function resolve() {
//   executeResolution(buttonCounts);
// }

function refreshButtonCounts() {
  let buttonCounts = {
    'increaseMint': 0,
    'decreaseMint': 0,
    'increaseBurn': 0,
    'decreaseBurn': 0,
    'pauseSystem': 0,
  };
  return buttonCounts;
}

function getResolutionId() {
  return Date.now();
}

function getAction() {
  const mostVotedButton = Object.keys(buttonCounts).reduce((a, b) => buttonCounts[a] > buttonCounts[b] ? a : b, null);
  return mostVotedButton;
}

function getBurnedAmount() {
  let burnedAmount = 0;
  for (const bucket in buttonCounts) {
    burnedAmount += buttonCounts[bucket];
  }
  return burnedAmount;
}

function getMintedAmount() {
  // TODO: Implement minted amount
  return 0;
}

function getTimestamp() {
  return new Date().toISOString();
}
