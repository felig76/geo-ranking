import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.route.js";
import countryRoutes from "./routes/country.route.js";

import { connectDB } from "./config/db.js";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/games", gameRoutes);
app.use("/api/countries", countryRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});