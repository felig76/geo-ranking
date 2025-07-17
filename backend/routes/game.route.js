import express from "express";
import { getGames, postGames } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/", postGames);
router.get("/", getGames)

export default router;