import { Router } from 'express';
import { LeaderboardEntry } from '../models/leaderboard.js';

const router = Router();

router.get('/', async (request, response) => {
  const period = typeof request.query.period === 'string' ? request.query.period : 'all-time';
  const entries = await LeaderboardEntry.find({ period })
    .populate('user', 'username displayName points')
    .populate('team', 'name')
    .sort({ points: -1, rank: 1 });
  response.json(entries);
});

router.post('/', async (request, response) => {
  const entry = await LeaderboardEntry.create(request.body);
  await entry.populate([
    { path: 'user', select: 'username displayName points' },
    { path: 'team', select: 'name' },
  ]);
  response.status(201).json(entry);
});

export default router;
