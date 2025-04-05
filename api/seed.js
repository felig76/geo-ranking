const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/geo_ranking", { useNewUrlParser: true, useUnifiedTopology: true });

const gameSchema = new mongoose.Schema({
  gameTitle: String,
  wikidataProperty: String,
  guesses: Number,
  unit: String
});

const Game = mongoose.model("Game", gameSchema);

const games = [
  { gameTitle: "Países con mayor población", wikidataProperty: "P1082", guesses: 10, unit: "" },
  { gameTitle: "Países más grandes por superficie", wikidataProperty: "P2046", guesses: 10, unit: "km²" },
  { gameTitle: "Países con mayor PIB nominal", wikidataProperty: "P2131", guesses: 10, unit: "USD" },
  { gameTitle: "Países con mayor coeficiente de Gini", wikidataProperty: "P1125", guesses: 7, unit: "" }
];

Game.deleteMany({})
  .then(() => {
    return Game.insertMany(games);
  })
  .then(() => {
    console.log("Juegos insertados correctamente");
    mongoose.connection.close();
  })
  .catch(error => {
    console.error("Error:", error);
    mongoose.connection.close();
  });
