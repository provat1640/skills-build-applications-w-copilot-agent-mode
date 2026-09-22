import { Router } from 'express';
import { User } from '../models/user.js';

const router = Router();

router.get('/', async (_request, response) => {
  const users = await User.find().populate('team', 'name').sort({ displayName: 1 });
  response.json(users);
});

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('team', 'name');
  if (!user) {
    response.status(404).json({ message: 'User not found' });
    return;
  }
  response.json(user);
});

router.post('/', async (request, response) => {
  const user = await User.create(request.body);
  response.status(201).json(user);
});

router.patch('/:id', async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  }).populate('team', 'name');
  if (!user) {
    response.status(404).json({ message: 'User not found' });
    return;
  }
  response.json(user);
});

router.delete('/:id', async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);
  if (!user) {
    response.status(404).json({ message: 'User not found' });
    return;
  }
  response.status(204).send();
});

export default router;
