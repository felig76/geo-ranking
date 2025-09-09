import axios from "axios";

export async function getValidCountries() {
  const url = "http://api.worldbank.org/v2/country?format=json&per_page=500";

  try {
    const res = await axios.get(url);
    const countriesRaw = res.data[1];

    const validCountries = countriesRaw
      .filter(country =>
        country.region?.id !== "NA" &&
        country.id.length === 3 &&
        country.iso2Code.length === 2
      )
      .map(country => ({
        countryName: country.name,
        countryId: country.id,
        iso2Code: country.iso2Code,
      }));

    return validCountries;
  } catch (error) {
    console.error("Error obteniendo países:", error.message);
    return [];
  }
}