import express from 'express';
import auth from '../middleware/auth.js';
import { queueService } from '../services/queueService.js';

const router = express.Router();

router.use((req, res, next) => {
  queueService.setIO(req.app.get('io'));
  next();
});

router.post('/join', auth, (req, res) => {
  try {
    const position = queueService.join(req.user);
    res.json({ position });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/leave', auth, (req, res) => {
  try {
    queueService.leave(req.user);
    res.json({ message: 'Removed from queue' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving queue' });
  }
});

router.post('/cancel', auth, (req, res) => {
  try {
    const position = queueService.cancel(req.user);
    res.json({ position });
  } catch (error) {
    res.status(500).json({ message: 'Error updating queue position' });
  }
});

// Add a new route to get current queue
router.get('/status', auth, (req, res) => {
  try {
    const queue = queueService.getCurrentQueue();
    const position = queueService.getPosition(req.user.email);
    res.json({ 
      position,
      queueLength: queue.length,
      isInQueue: queue.includes(req.user.email)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting queue status' });
  }
});

export default router;