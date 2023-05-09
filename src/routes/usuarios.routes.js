import { Router } from "express";
import {
	forgotPassword,
	restoreCode,
	usuariosLogin,
} from "../controllers/usuarios.controllers.js";

const router = Router();

router.post("/usuarios/forgotPassword", forgotPassword);

router.post("/usuarios/login", usuariosLogin);

router.post("/usuarios/restoreCode", restoreCode);

export default router;
