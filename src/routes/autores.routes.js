import { Router } from "express";
import {
  createAutor,
  getAutorByFilter,
  getAutorById,
  getAutores,
  loginAutor,
  patchAutor,
} from "../controllers/autores.controllers.js";

const router = Router();

router.get("/autores", getAutores);

router.get("/autores/:id", getAutorById);

router.get("/autores/by", getAutorByFilter);

router.post("/autores/login", loginAutor);

router.post("/autores", createAutor);

router.patch("/autores/:id", patchAutor);

export default router;
