import Game from "../models/game.model.js";
import { getIndicatorSeries } from "../clients/wbClient.js";

// GameService (v1, sin caché)
// - Ejecuta un indicador del World Bank en runtime
// - Orquesta ordenamiento y recorte por top N

function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function buildRanking(rows, { top = 10 } = {}) {
  const items = rows
    .filter((r) => r && r.iso2 && r.country && r.value !== null && r.value !== undefined)
    .map((r) => ({
      iso2: r.iso2,
      country: r.country,
      value: toNumber(r.value),
      date: r.date,
    }))
    .filter((r) => r.value !== null)
    .sort((a, b) => b.value - a.value)
    .slice(0, top)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));

  return items;
}

export async function runIndicator(indicator, { year, top = 10 } = {}) {
  if (!indicator) throw new Error("indicator is required");
  const rows = await getIndicatorSeries(indicator, { year });
  return buildRanking(rows, { top });
}

export async function runGameById(gameId, { year, top = 10 } = {}) {
  if (!gameId) throw new Error("gameId is required");
  const game = await Game.findById(gameId).lean();
  if (!game) throw new Error("Game not found");

  const effectiveYear = year ?? game.defaultYear;
  const rows = await getIndicatorSeries(game.indicator, { year: effectiveYear });
  const ranking = buildRanking(rows, { top });

  return {
    game: {
      id: String(game._id),
      title: game.title,
      indicator: game.indicator,
      unit: game.unit,
      hint: game.hint,
      defaultYear: game.defaultYear,
      options: game.options,
    },
    params: { year: effectiveYear, top },
    ranking,
  };
}

export default {
  runIndicator,
  runGameById,
};
