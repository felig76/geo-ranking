import country from "../models/country.model.js";

export const getCountries = async (req, res) => {
    try {
        const countries = await country.find({});
        res.status(200).json({ success: true, data: countries });
    } catch (error) {
        console.error("Error al obtener los países:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
