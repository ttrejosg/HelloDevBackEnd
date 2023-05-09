import { Router } from "express";
import { forgotPassword, usuariosLogin } from "../controllers/usuarios.controllers.js";

const router = Router();

router.post("/usuarios/forgotPassword", forgotPassword);

router.post("/usuarios/login", usuariosLogin);

export default router;
