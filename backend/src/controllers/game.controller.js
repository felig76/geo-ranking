import Game from "../models/game.model.js";

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