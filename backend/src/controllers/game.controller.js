import Game from "../models/game.model.js";
import { runGameById } from "../services/game.service.js";

export const postGames = async (req, res) => {
    const game = req.body;
    
    const newGame = new Game(game);

    try{
      await newGame.save();
      res.status(200).json({ success: true, data: newGame });
    }
    catch (error) {
      console.error("Error al guardar el juego:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(201).json({ success: true, data: games });
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const runGame = async (req, res) => {
  try {
    const { id } = req.params;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const top = req.query.top ? Number(req.query.top) : 10;

    const result = await runGameById(id, { year, top });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error al ejecutar el juego:", error);
    res.status(500).json({ success: false, message: error?.message || "Server Error" });
  }
}