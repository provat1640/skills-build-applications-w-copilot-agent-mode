import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Activity } from '../models/activity.js';
import { LeaderboardEntry } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

async function seedDatabase() {
  try {
    await connectDatabase();
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      { username: 'alex', email: 'alex@octofit.test', displayName: 'Alex Rivera', passwordHash: 'seeded-demo-password', points: 145 },
      { username: 'jamie', email: 'jamie@octofit.test', displayName: 'Jamie Chen', passwordHash: 'seeded-demo-password', points: 120 },
      { username: 'taylor', email: 'taylor@octofit.test', displayName: 'Taylor Brooks', passwordHash: 'seeded-demo-password', points: 95 },
    ]);

    const teams = await Team.create([
      { name: 'Peak Performers', description: 'Consistent effort, shared progress.', members: [users[0]._id, users[1]._id], totalPoints: 265 },
      { name: 'Trail Blazers', description: 'Find a route and keep moving.', members: [users[2]._id], totalPoints: 95 },
    ]);

    await User.bulkWrite([
      { updateOne: { filter: { _id: users[0]._id }, update: { team: teams[0]._id } } },
      { updateOne: { filter: { _id: users[1]._id }, update: { team: teams[0]._id } } },
      { updateOne: { filter: { _id: users[2]._id }, update: { team: teams[1]._id } } },
    ]);

    await Activity.create([
      { user: users[0]._id, type: 'running', durationMinutes: 35, distanceKm: 5.2, points: 80, performedAt: new Date('2026-09-18') },
      { user: users[0]._id, type: 'strength', durationMinutes: 30, points: 65, performedAt: new Date('2026-09-20') },
      { user: users[1]._id, type: 'walking', durationMinutes: 45, distanceKm: 3.8, points: 120, performedAt: new Date('2026-09-19') },
      { user: users[2]._id, type: 'cycling', durationMinutes: 40, distanceKm: 12, points: 95, performedAt: new Date('2026-09-21') },
    ]);

    await Workout.create([
      { title: 'Starter Run', description: 'An easy-paced run to build a steady habit.', difficulty: 'beginner', targetActivity: 'running', durationMinutes: 25, points: 40 },
      { title: 'Full Body Circuit', description: 'A balanced strength circuit for the whole body.', difficulty: 'intermediate', targetActivity: 'strength', durationMinutes: 35, points: 55 },
      { title: 'Endurance Ride', description: 'A challenging ride with sustained effort.', difficulty: 'advanced', targetActivity: 'cycling', durationMinutes: 50, points: 75 },
    ]);

    await LeaderboardEntry.create([
      { user: users[0]._id, team: teams[0]._id, points: 145, rank: 1, period: 'all-time' },
      { user: users[1]._id, team: teams[0]._id, points: 120, rank: 2, period: 'all-time' },
      { user: users[2]._id, team: teams[1]._id, points: 95, rank: 3, period: 'all-time' },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
