import { Router } from "express";
import { 
    getUser
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
router.get("/me", authRequired, getUser);
router.patch("/me", authRequired, getUser);

export default router;