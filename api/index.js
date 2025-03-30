const express = require("express");
const axios = require("axios");
const cors = require("cors");
const gameConfig = require("./gameConfig.json");

const app = express();
app.use(cors());


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



app.get("/game", (req, res) => {
  res.json(gameConfig);
});


const query = `
SELECT ?countryLabel ?value WHERE {
  ?country wdt:P31 wd:Q6256.
  ?country wdt:${gameConfig.property} ?value.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?value)
LIMIT ${gameConfig.guesses}
`;

app.get("/data", async (req, res) => {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await axios.get(url);
    const results = response.data.results.bindings.map(item => ({
      country: item.countryLabel?.value || "Desconocido",
      value: parseFloat(item.value?.value) || 0
    }));

    res.json(results);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

app.listen(3001, () => console.log("API funcionando en http://localhost:3001/"));