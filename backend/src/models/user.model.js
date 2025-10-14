import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    lastLogin: { type: Date, default: Date.now },

    stats: {
      gamesPlayed: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },

      dailyPlays: {
        type: [
          {
            date: { type: Date, required: true },
            score: { type: Number, required: true },
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);

// Esto hace que nunca se devuelva la contraseña en res.json
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("User", userSchema);