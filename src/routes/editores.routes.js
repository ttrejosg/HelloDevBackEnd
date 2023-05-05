import { Router } from "express";
import { getEditores } from "../controllers/editores.controllers.js";

const router = Router();

router.get("/editores", getEditores);

export default router;
