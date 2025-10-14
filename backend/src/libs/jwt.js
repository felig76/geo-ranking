import jwt from "jsonwebtoken";
import {SECRET_TOKEN} from "../config/config.js";

export function generateAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            SECRET_TOKEN,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    })
}