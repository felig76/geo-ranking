import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.route.js";
import countryRoutes from "./routes/country.route.js";

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

app.use("/api/games", gameRoutes);
app.use("/api/countries", countryRoutes);

app.listen(3000, () => {
  console.clear();
  connectDB();
  console.log("API funcionando en http://localhost:3000/")
});



/* 
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
*/