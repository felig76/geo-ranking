import mongoose from "mongoose";
import dotenv from "dotenv";
import { getValidCountries } from "./getCountries.js";
import Country from "../models/country.model.js";
import { connectDB } from "../config/db.js";

dotenv.config();
dotenv.config({ path: "../.env" });

await connectDB();

async function updateCountries() {
  try {
    const countries = await getValidCountries();
    console.log(`Se encontraron ${countries.length} países válidos.`);

    let updatedCount = 0;

    for (const c of countries) {
      const result = await Country.updateOne(
        { countryId: c.countryId },
        {
          $set: {
            countryName: c.countryName,
            iso2Code: c.iso2Code
          }
        },
        { upsert: true }
      );
      updatedCount++;
    }

    console.log(`Actualizados o insertados ${updatedCount} países.`);
  } catch (error) {
    console.error("Error al actualizar países:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateCountries();
