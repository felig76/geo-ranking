import express from "express";
import { getGames, postGames, runGame } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/", postGames);
router.get("/", getGames)
router.get("/:id/run", runGame)

export default router;