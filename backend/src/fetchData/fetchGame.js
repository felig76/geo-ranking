import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { getValidCountries } from './getCountries.js';
import { connectDB } from '../config/db.js';
import Game from '../models/game.model.js';

dotenv.config();
dotenv.config({ path: '../.env' });
await connectDB();

const juegos = [
  {
    indicator: "FP.CPI.TOTL.ZG",
    title: "Countries with the highest consumer price inflation (annual %)",
    unit: "percent",
    hint: "Look for countries undergoing sharp price spikes — often crisis-hit or currency-stressed economies.",
    apiYear: "2024" // used only for the API URL, not saved in the collection
  }
];

async function fetchIndicatorData(indicator, year) {
  const url = `http://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=500&date=${year}`;
  console.log(`Consulting ${url}`);
  const res = await axios.get(url);
  return res.data[1] || [];
}

async function createAllGames() {
  const countries = await getValidCountries();
  const validIso2Codes = countries.map(({ iso2Code }) => iso2Code);

  for (const juego of juegos) {
    const { indicator, title, unit, hint, apiYear } = juego;
    console.log(`\n📌 Creating game: ${title}`);
    const data = await fetchIndicatorData(indicator, apiYear);

    const filteredData = data.filter(
      ({ country, value }) =>
        country && validIso2Codes.includes(country.id) && value !== null
    );

    const countryValues = filteredData
      .map(({ country, value }) => {
        const countryData = countries.find(c => c.iso2Code === country.id);
        return {
          countryName: countryData?.countryName || country.value,
          value,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    if (countryValues.length === 0) {
      console.log(`❌ No valid data found for: ${title}`);
      continue;
    }

    const game = new Game({ title, countries: countryValues, unit, hint });
    await game.save();
    console.log(`✅ Game saved: ${title}`);
  }

  mongoose.connection.close();
}

console.clear();
createAllGames();
