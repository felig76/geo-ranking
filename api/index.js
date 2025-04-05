const express = require("express");
const axios = require("axios");
const cors = require("cors");

const mongoose = require("mongoose");
const Game = require("./models/Game");

const app = express();
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/geo_ranking", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch(err => {
  console.error("Error de conexión a MongoDB:", err);
});

const countriesQuery = `
SELECT ?country ?countryLabel WHERE {
  ?country wdt:P31 wd:Q6256.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`;

app.get("/countries", async (req, res) => {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(countriesQuery)}&format=json`;

  try {
    const response = await axios.get(url);

    const countries = response.data.results.bindings.map((entry) => entry.countryLabel.value);
    res.json(countries);
  } catch (error) {
    console.error("Error al obtener datos de países:", error);
    res.status(500).json({ error: "Error al obtener datos de países" });
  }
});


app.get("/data", async (req, res) => {
  try {
    const randomGame = await Game.aggregate([{ $sample: { size: 1 } }]);
    if (!randomGame.length) return res.status(404).json({ error: "No hay juegos disponibles" });

    const game = randomGame[0]; 
    const query = `
      SELECT ?countryLabel ?value WHERE {
        ?country wdt:P31 wd:Q6256.
        ?country wdt:${game.wikidataProperty} ?value.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      ORDER BY DESC(?value)
      LIMIT ${game.guesses}
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
    const response = await axios.get(url);

    const results = response.data.results.bindings.map(item => ({
      country: item.countryLabel?.value || "Desconocido",
      value: parseFloat(item.value?.value) || 0
    }));

    res.json({
      gameTitle: game.gameTitle,
      unit: game.unit,
      data: results
    });

  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});


app.listen(3001, () => console.log("API funcionando en http://localhost:3001/"));