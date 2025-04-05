const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameTitle: String,
  wikidataProperty: String,
  guesses: Number
});

module.exports = mongoose.model("Game", gameSchema);