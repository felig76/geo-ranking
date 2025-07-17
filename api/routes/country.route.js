import express from "express";
import { getCountries } from "../controllers/country.controller.js";

const router = express.Router();

router.get("/", getCountries);

export default router;