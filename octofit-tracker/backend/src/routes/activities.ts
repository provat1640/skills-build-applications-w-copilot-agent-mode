import { Router } from 'express';
import { Activity } from '../models/activity.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';

const router = Router();

router.get('/', async (request, response) => {
  const userId = typeof request.query.user === 'string' ? request.query.user : undefined;
  const activities = await (userId ? Activity.find({ user: userId }) : Activity.find())
    .populate('user', 'username displayName')
    .sort({ performedAt: -1 });
  response.json(activities);
});

router.get('/:id', async (request, response) => {
  const activity = await Activity.findById(request.params.id).populate('user', 'username displayName');
  if (!activity) {
    response.status(404).json({ message: 'Activity not found' });
    return;
  }
  response.json(activity);
});

router.post('/', async (request, response) => {
  const activity = await Activity.create(request.body);
  const user = await User.findByIdAndUpdate(activity.user, { $inc: { points: activity.points } }, { new: true });
  if (user?.team) {
    await Team.findByIdAndUpdate(user.team, { $inc: { totalPoints: activity.points } });
  }
  await activity.populate('user', 'username displayName');
  response.status(201).json(activity);
});

router.delete('/:id', async (request, response) => {
  const activity = await Activity.findByIdAndDelete(request.params.id);
  if (!activity) {
    response.status(404).json({ message: 'Activity not found' });
    return;
  }
  const user = await User.findByIdAndUpdate(
    activity.user,
    { $inc: { points: -activity.points } },
    { new: true },
  );
  if (user?.team) {
    await Team.findByIdAndUpdate(user.team, { $inc: { totalPoints: -activity.points } });
  }
  response.status(204).send();
});

export default router;
