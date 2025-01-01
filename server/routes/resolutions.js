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
    const { resolution_id, action, burned_amount, minted_amount, timestamp } = req.body;
    if (!resolution_id || !action || !burned_amount || !minted_amount || !timestamp) {
      return res.status(400).json({ error: 'resolution_id, action, burned_amount, minted_amount, and timestamp are required' });
    }
    const id = await createResolution(resolution_id, action, burned_amount, minted_amount, timestamp);
    res.status(201).json({ message: 'Resolution created', resolution_id });
  } catch (err) {
    console.error('Error creating resolution:', err);
    res.status(500).json({ error: 'Failed to create resolution' });
  }
});

export default router;