import { Router } from "express";
import {
	createAutor,
	getAutorByFilter,
	getAutorById,
	getAutores,
} from "../controllers/autores.controllers.js";

const router = Router();

router.get("/autores", getAutores);

router.get("/autores/:id", getAutorById);

router.get("/autores/by", getAutorByFilter);

router.post("/autores", createAutor);

export default router;
