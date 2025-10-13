import { Router } from "express";
import { 
    getUser,
    patchUser
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
router.get("/me", authRequired, getUser);
router.patch("/me", authRequired, patchUser);

export default router;