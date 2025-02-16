import express from 'express';
import auth from '../middleware/auth.js';
import { queueService } from '../services/queueService.js';

const router = express.Router();

router.use((req, res, next) => {
  queueService.setIO(req.app.get('io'));
  next();
});

// Add a new route to get current queue
router.get('/status', auth, (req, res) => {
  try {
    const queueStatus = queueService.getCurrentQueue();
    const position = queueService.getPosition(req.user.email);
    res.json({ 
      position,
      queueLength: queueStatus.length,
      isInQueue: queueStatus.queue.some(u => u.email === req.user.email), // Check if user is in queue
      // Only send queue details to drivers
      ...(req.user.role === 'driver' && { queueDetails: queueStatus.queueDetails })
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting queue status' });
  }
});

// New route for drivers to view queue
router.get('/list', auth, (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Drivers only.' });
    }

    const queueStatus = queueService.getCurrentQueue();
    res.json(queueStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error getting queue list' });
  }
});

export default router;