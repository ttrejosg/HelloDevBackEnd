import { Router } from "express";
import {
	createArticulo,
	deleteArticulo,
	getArticuloBy,
	getArticuloById,
	getArticulos,
	getArticulosAutor,
	multerMiddleware,
	searchArticulos,
	updateArticulo,
	getArticulosAutorPublicados
} from "../controllers/articulos.controllers.js";

const router = Router();

router.get("/articulos", getArticulos);

router.get("/articulos/autor/:id", getArticulosAutor);

router.get("/articulos/by", getArticuloBy);

router.get("/articulos/:id", getArticuloById);

router.get("/articulos/autor/publicados/:id", getArticulosAutorPublicados);

router.post(
	"/articulos",
	multerMiddleware.fields([
		{ name: "archivo", maxCount: 1 },
		{ name: "portada", maxCount: 1 },
	]),
	createArticulo,
);

router.post("/articulos/buscar", searchArticulos);

router.patch(
	"/articulos",
	multerMiddleware.fields([
		{ name: "archivo", maxCount: 1 },
		{ name: "portada", maxCount: 1 },
	]),
	updateArticulo,
);

router.delete("/articulos/:id", deleteArticulo);

export default router;
