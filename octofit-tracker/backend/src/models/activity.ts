import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['running', 'walking', 'cycling', 'strength', 'swimming', 'other'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0 },
    performedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export const Activity = mongoose.model('Activity', activitySchema);
