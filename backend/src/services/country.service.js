import { getCountries as wbGetCountries } from "../clients/wbClient.js";

// CountryService (v1, sin caché)
// - Obtiene países desde World Bank
// - Filtra y normaliza a estructura mínima para la app

export async function listCountries({ excludeRegionNA = true } = {}) {
  const countries = await wbGetCountries({ perPage: 500, format: "json" });

  const filtered = countries.filter((c) => {
    if (!c?.iso2 || !c?.iso3) return false;
    if (excludeRegionNA && (c?.region === "Aggregates" || c?.region === "")) return false;
    // El endpoint de WB marca "Not classified" o region NA para agregados; filtramos intentado quedarnos con países soberanos.
    return true;
  });

  return filtered.map((c) => ({
    iso2: c.iso2,
    iso3: c.iso3,
    name: c.name,
    region: c.region,
    adminRegion: c.adminRegion,
    incomeLevel: c.incomeLevel,
    capitalCity: c.capitalCity,
    lat: c.latitude,
    lng: c.longitude,
  }));
}

export default {
  listCountries,
};
