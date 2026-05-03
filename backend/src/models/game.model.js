import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  indicator: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
  defaultYear: {
    type: Number,
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
  }
});

const Game = mongoose.model("Game", gameSchema);
export default Game;