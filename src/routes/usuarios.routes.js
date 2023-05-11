import { Router } from "express";
import {
	forgotPassword,
	restoreCode,
	restorePassword,
	usuariosLogin,
} from "../controllers/usuarios.controllers.js";

const router = Router();

router.post("/usuarios/forgotPassword", forgotPassword);

router.post("/usuarios/login", usuariosLogin);

router.post("/usuarios/restoreCode", restoreCode);

router.post("/usuarios/restorePassword", restorePassword);

export default router;
