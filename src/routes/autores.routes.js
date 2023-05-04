import {
	createAutor,
	getAutorByFilter,
	getAutorById,
	getAutores,
	loginAutor,
} from "../controllers/autores.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/autores", getAutores);

router.get("/autores/:id", getAutorById);

router.get("/autores/by", getAutorByFilter);

router.post("/autores/login", loginAutor);

router.post("/autores", createAutor);

export default router;
