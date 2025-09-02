import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.route.js";
import countryRoutes from "./routes/country.route.js";

import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirnameEnv = path.dirname(__filename);
dotenv.config( { path: path.resolve(__dirnameEnv, "../.env") } );

const __dirnameIndex = path.resolve();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/games", gameRoutes);
app.use("/api/countries", countryRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirnameIndex, "/frontend/dist")));
  app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirnameIndex, "frontend", "dist", "index.html"));
});
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});