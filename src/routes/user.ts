import { Router } from 'express';

const router = Router();

// Basic placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'User routes - coming soon' });
});

export default router; 