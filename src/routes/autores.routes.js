import { Router } from "express";
import {
	getAutorByFilter,
	getAutorById,
	getAutores,
} from "../controllers/autores.controllers.js";

const router = Router();

router.get("/autores", getAutores);

router.get("/autores/:id", getAutorById);

router.get("/autores/by", getAutorByFilter);

export default router;
