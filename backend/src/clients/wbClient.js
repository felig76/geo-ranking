import axios from "axios";

// World Bank API v2 client (versión inicial sin caché/fallbacks)
// Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation

const WB_BASE_URL = process.env.WB_BASE_URL || "https://api.worldbank.org/v2";
const WB_TIMEOUT_MS = Number(process.env.WB_TIMEOUT_MS || 10000);
const WB_MAX_RETRIES = Number(process.env.WB_MAX_RETRIES || 2); // reintentos simples

const http = axios.create({
  baseURL: WB_BASE_URL,
  timeout: WB_TIMEOUT_MS,
});

async function requestWithRetry(config) {
  let attempt = 0;
  let lastError;

  while (attempt <= WB_MAX_RETRIES) {
    try {
      const res = await http.request(config);
      return res;
    } catch (err) {
      lastError = err;
      attempt += 1;
      if (attempt > WB_MAX_RETRIES) break;
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw lastError;
}

// WB responses often return [metadata, dataArray]
function parseWBArrayResponse(res) {
  const data = res?.data;
  if (Array.isArray(data) && data.length === 2) {
    return { meta: data[0], rows: data[1] };
  }
  return { meta: null, rows: [] };
}

// GET /country => listado de países
export async function getCountries({ perPage = 500, format = "json" } = {}) {
  const res = await requestWithRetry({
    method: "GET",
    url: "/country",
    params: { per_page: perPage, format },
  });
  const { rows } = parseWBArrayResponse(res);
  // Normalizamos lo que usaremos: iso2, iso3, name
  return rows
    .filter(Boolean)
    .map((c) => ({
      iso2: c?.iso2Code,
      iso3: c?.id,
      name: c?.name,
      region: c?.region?.value,
      adminRegion: c?.adminregion?.value,
      incomeLevel: c?.incomeLevel?.value,
      lendingType: c?.lendingType?.value,
      capitalCity: c?.capitalCity,
      latitude: c?.latitude,
      longitude: c?.longitude,
    }));
}

// GET /country/all/indicator/{indicator}
// Ejemplo params: { year: 2024, perPage: 20000, format: 'json' }
export async function getIndicatorSeries(indicator, { year, perPage = 20000, format = "json" } = {}) {
  if (!indicator) throw new Error("indicator is required");
  const params = { per_page: perPage, format };
  if (year) params.date = String(year);

  const res = await requestWithRetry({
    method: "GET",
    url: `/country/all/indicator/${encodeURIComponent(indicator)}`,
    params,
  });
  const { rows } = parseWBArrayResponse(res);
  // Normalizamos a: { iso2, country, value, date, unit?, decimal? }
  return rows
    .filter((r) => r && r.countryiso3code && r.country && (r.value !== null && r.value !== undefined))
    .map((r) => ({
      iso2: r?.country?.id, // WB usa ISO2 en country.id
      country: r?.country?.value,
      value: r?.value,
      date: r?.date,
      unit: r?.unit, // puede venir en null
      decimal: r?.decimal,
    }));
}

export default {
  getCountries,
  getIndicatorSeries,
};
