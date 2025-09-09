import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  countries: [
    {
      countryName: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }
  ],
  unit: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  }
});

const Game = mongoose.model("Game", gameSchema);
export default Game;