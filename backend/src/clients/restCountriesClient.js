import axios from "axios";

// REST Countries v3.1 client (subset)
// Docs: https://restcountries.com/#api-endpoints-v3-all
// We fetch cca2, cca3, name.common

const RC_BASE_URL = process.env.RC_BASE_URL || "https://restcountries.com/v3.1";
const RC_TIMEOUT_MS = Number(process.env.RC_TIMEOUT_MS || 10000);

const http = axios.create({
  baseURL: RC_BASE_URL,
  timeout: RC_TIMEOUT_MS,
});

export async function getAllCountriesBasics() {
  // Fields: cca2, cca3, name
  const params = { fields: "cca2,cca3,name" };
  const res = await http.get("/all", { params });
  const data = Array.isArray(res.data) ? res.data : [];
  return data
    .filter((c) => c && c.cca2)
    .map((c) => ({
      iso2: c.cca2,
      iso3: c.cca3,
      commonName: c?.name?.common || null,
      officialName: c?.name?.official || null,
    }));
}

export default {
  getAllCountriesBasics,
};
