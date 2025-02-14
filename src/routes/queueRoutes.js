import express from 'express';
import auth from '../middleware/auth.js';
import { queueService } from '../services/queueService.js';

const router = express.Router();

// Set io instance when routes are initialized
router.use((req, res, next) => {
  queueService.setIO(req.app.get('io'));
  next();
});

router.post('/join', auth, (req, res) => {
  try {
    const position = queueService.join(req.user._id);
    res.json({ position });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/leave', auth, (req, res) => {
  try {
    queueService.leave(req.user._id);
    res.json({ message: 'Removed from queue' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving queue' });
  }
});

router.post('/cancel', auth, (req, res) => {
  try {
    const position = queueService.cancel(req.user._id);
    res.json({ position });
  } catch (error) {
    res.status(500).json({ message: 'Error updating queue position' });
  }
});

export default router;