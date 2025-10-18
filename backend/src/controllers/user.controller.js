import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
}

export const patchUser = async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: updatedUser });
}

export const submitDailyGame = async (req, res) => {
  const { score, gameId, outcome, timeTaken, hintUsed, guesses, missed } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalizamos a medianoche

  // Verificar si ya jugó hoy
  const playedToday = user.stats.dailyPlays.some(play => {
    const playDate = new Date(play.date);
    playDate.setHours(0,0,0,0);
    const sameDay = playDate.getTime() === today.getTime();
    if (!sameDay) return false;
    if (gameId && play.gameId) return String(play.gameId) === String(gameId);
    return sameDay;
  });

  if (playedToday) return res.status(400).json({ success: false, message: "Already played today" });

  // Agregar la partida del día
  user.stats.dailyPlays.push({
    date: today,
    score,
    gameId: gameId || undefined,
    outcome: outcome || undefined,
    timeTaken: typeof timeTaken === 'number' ? timeTaken : undefined,
    hintUsed: typeof hintUsed === 'boolean' ? hintUsed : undefined,
    guesses: Array.isArray(guesses) ? guesses : undefined,
    missed: Array.isArray(missed) ? missed : undefined,
  });
  user.stats.gamesPlayed += 1;
  user.stats.highestScore = Math.max(user.stats.highestScore, score);

  // Calcular promedio
  const totalScore = user.stats.dailyPlays.reduce((sum, play) => sum + play.score, 0);
  user.stats.averageScore = totalScore / user.stats.dailyPlays.length;

  // Calcular streaks
  // Ordenamos las partidas de más reciente a más antigua
  const sortedPlays = user.stats.dailyPlays
    .map(p => ({ date: new Date(p.date) }))
    .sort((a, b) => b.date - a.date);

  let currentStreak = 1;
  for (let i = 0; i < sortedPlays.length - 1; i++) {
    const diff = (sortedPlays[i].date - sortedPlays[i + 1].date) / (1000 * 60 * 60 * 24);
    if (diff === 1) currentStreak++;
    else break;
  }
  user.stats.currentStreak = currentStreak;
  user.stats.longestStreak = Math.max(user.stats.longestStreak, currentStreak);

  await user.save();
  res.status(201).json({ success: true, data: user.stats });
};