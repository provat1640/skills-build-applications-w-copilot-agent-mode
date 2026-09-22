import { Router } from 'express';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';

const router = Router();

router.get('/', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username displayName points').sort({ totalPoints: -1 });
  response.json(teams);
});

router.get('/:id', async (request, response) => {
  const team = await Team.findById(request.params.id).populate('members', 'username displayName points');
  if (!team) {
    response.status(404).json({ message: 'Team not found' });
    return;
  }
  response.json(team);
});

router.post('/', async (request, response) => {
  const team = await Team.create(request.body);
  response.status(201).json(team);
});

router.post('/:id/members/:userId', async (request, response) => {
  const [team, user] = await Promise.all([
    Team.findById(request.params.id),
    User.findById(request.params.userId),
  ]);
  if (!team || !user) {
    response.status(404).json({ message: team ? 'User not found' : 'Team not found' });
    return;
  }
  if (!team.members.some((member) => member.equals(user._id))) {
    team.members.push(user._id);
    await team.save();
  }
  user.team = team._id;
  await user.save();
  await team.populate('members', 'username displayName points');
  response.json(team);
});

router.patch('/:id', async (request, response) => {
  const team = await Team.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  }).populate('members', 'username displayName points');
  if (!team) {
    response.status(404).json({ message: 'Team not found' });
    return;
  }
  response.json(team);
});

router.delete('/:id', async (request, response) => {
  const team = await Team.findByIdAndDelete(request.params.id);
  if (!team) {
    response.status(404).json({ message: 'Team not found' });
    return;
  }
  await User.updateMany({ team: team._id }, { $unset: { team: 1 } });
  response.status(204).send();
});

export default router;
