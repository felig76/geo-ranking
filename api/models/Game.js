const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameTitle: String,
  countries: {
    name: String,
    value: Number
  },
  unitOfMeasure: String,
  guesses: Number
});

module.exports = mongoose.model("Game", gameSchema);