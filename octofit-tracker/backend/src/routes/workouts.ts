import { Router } from 'express';
import { Workout } from '../models/workout.js';

const router = Router();

router.get('/', async (request, response) => {
  const difficulty = typeof request.query.difficulty === 'string' ? request.query.difficulty : undefined;
  const filter: Record<string, unknown> = difficulty ? { difficulty } : {};
  const workouts = await Workout.find(filter)
    .sort({ difficulty: 1, title: 1 });
  response.json(workouts);
});

router.get('/:id', async (request, response) => {
  const workout = await Workout.findById(request.params.id);
  if (!workout) {
    response.status(404).json({ message: 'Workout not found' });
    return;
  }
  response.json(workout);
});

router.post('/', async (request, response) => {
  const workout = await Workout.create(request.body);
  response.status(201).json(workout);
});

router.patch('/:id', async (request, response) => {
  const workout = await Workout.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (!workout) {
    response.status(404).json({ message: 'Workout not found' });
    return;
  }
  response.json(workout);
});

router.delete('/:id', async (request, response) => {
  const workout = await Workout.findByIdAndDelete(request.params.id);
  if (!workout) {
    response.status(404).json({ message: 'Workout not found' });
    return;
  }
  response.status(204).send();
});

export default router;
