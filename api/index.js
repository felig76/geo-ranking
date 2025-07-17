import express from "express";
import axios from "axios";
import cors from "cors";

import Game from "./models/Game.js";

import { connectDB } from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

console.log(process.env.MONGO_URI);
app.get("/", (req, res) => {
  res.send("API funcionando");
});


app.post("/api/games", async (req, res) => {
    const game = req.body;
    
    const newGame = new Game(game);

    try{
      await newGame.save();
      res.status(201).json({ success: true, data: newGame });
    }
    catch (error) {
      console.error("Error al guardar el juego:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(201).json({ success: true, data: games });
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
})


const countriesQuery = `
SELECT ?country ?countryLabel WHERE {
  ?country wdt:P31 wd:Q6256.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`;

app.get("/api/countries", async (req, res) => {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(countriesQuery)}&format=json`;

  try {
    const response = await axios.get(url);

    const countries = response.data.results.bindings.map((entry) => entry.countryLabel.value);
    res.json(countries);
  } catch (error) {
    console.error("Error al obtener nombres de países de wikidata.org:", error);
    res.status(500).json({ error: "Error al obtener datos de países" });
  }
});


app.listen(3000, () => {
  console.clear();
  connectDB();
  console.log("API funcionando en http://localhost:3000/")
});