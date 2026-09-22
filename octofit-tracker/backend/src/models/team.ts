import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '', trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const Team = mongoose.model('Team', teamSchema);
