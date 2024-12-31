// routes/resolutions.js
import { Router } from 'express';
import { createResolution, getAllResolutions } from '../models/resolutionModel.js';

const router = Router();

// GET /resolutions -> Fetch all from DB
router.get('/', async (req, res) => {
  try {
    const resolutions = await getAllResolutions();
    res.json(resolutions);
  } catch (err) {
    console.error('Error fetching resolutions:', err);
    res.status(500).json({ error: 'Failed to fetch resolutions' });
  }
});

// POST /resolutions -> Insert a new resolution
router.post('/', async (req, res) => {
  try {
    const { timestamp, message } = req.body;
    if (!timestamp || !message) {
      return res.status(400).json({ error: 'timestamp and message are required' });
    }
    const id = await createResolution(timestamp, message);
    res.status(201).json({ message: 'Resolution created', id });
  } catch (err) {
    console.error('Error creating resolution:', err);
    res.status(500).json({ error: 'Failed to create resolution' });
  }
});

export default router;

/* 
class Resolution {
    constructor(timestamp, message, link) {
        this.timestamp = timestamp;
        this.message = message;
        // this.link = link;
    }
}

Resolution.prototype.toString = function() {
    return `Resolution @ ${this.timestamp}: ${this.message}`;
}


export default Resolution;
*/