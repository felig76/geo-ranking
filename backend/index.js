import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.route.js";
import countryRoutes from "./routes/country.route.js";

import { connectDB } from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

console.log(process.env.MONGO_URI);
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/api/games", gameRoutes);
app.use("/api/countries", countryRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.clear();
    console.log(`Conectado a MongoDB: ${process.env.MONGO_URI || " en localhost"}`);
  });
}).catch((err) => {
  console.error("Error al conectar a la DB:", err);
});