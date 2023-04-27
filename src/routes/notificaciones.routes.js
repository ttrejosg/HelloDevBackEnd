import { Router } from "express";
import {
	createNotificacion,
	getNotificacionesAutor,
	getNotificacionesEditor,
	getNotificacionesEditorHistorial,
	patchEstadoNotificacion,
} from "../controllers/notificaciones.controllers.js";

const router = Router();
//TODO: Seleccionar solo lo necesario de cada consulta.
router.get("/notificaciones/editor/historial/:id", getNotificacionesEditorHistorial);

router.get("/notificaciones/editor/:id", getNotificacionesEditor);

router.get("/notificaciones/autor/:id", getNotificacionesAutor);

router.post("/notificaciones", createNotificacion);

router.patch("/notificaiones", patchEstadoNotificacion);

export default router;
