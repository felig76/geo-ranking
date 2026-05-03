import { getCountries as wbGetCountries } from "../clients/wbClient.js";
import { getAllCountriesBasics as rcGetAll } from "../clients/restCountriesClient.js";

// CountryService (v1, sin caché)
// - Obtiene países desde World Bank
// - Filtra y normaliza a estructura mínima para la app
// - Enriquece con commonName (REST Countries) y flagUrl (FlagCDN)

export async function listCountries({ excludeRegionNA = true } = {}) {
  const countries = await wbGetCountries({ perPage: 500, format: "json" });

  let rcByIso2 = new Map();
  try {
    const rc = await rcGetAll();
    rcByIso2 = new Map(rc.map((c) => [String(c.iso2).toUpperCase(), c]));
  } catch (e) {
    // Si REST Countries cae, seguimos sin commonName
    rcByIso2 = new Map();
  }

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
    commonName: rcByIso2.get(String(c.iso2).toUpperCase())?.commonName || null,
    region: c.region,
    adminRegion: c.adminRegion,
    incomeLevel: c.incomeLevel,
    capitalCity: c.capitalCity,
    lat: c.latitude,
    lng: c.longitude,
    flagUrl: c.iso2 ? `https://flagcdn.com/${String(c.iso2).toLowerCase()}.svg` : null,
  }));
}

export default {
  listCountries,
};
