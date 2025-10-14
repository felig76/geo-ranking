import { Router } from "express";
import { 
    getUser,
    patchUser,
    submitDailyGame
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
router.get("/me", authRequired, getUser);
router.patch("/me", authRequired, patchUser);
router.post("/play", authRequired, submitDailyGame);

export default router;