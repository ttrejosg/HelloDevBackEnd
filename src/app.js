import cors from "cors";
import express from "express";
import morgan from "morgan";
import articulosRoutes from "./routes/articulos.routes.js";
import autoresRoutes from "./routes/autores.routes.js";
import estadosRoutes from "./routes/estados.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
const app = express();

app.use(morgan("short"));
app.use(express.json());
app.use(
	cors({
		methods: ["GET", "POST", "PATCH", "DELETE"],
		origin: "http://localhost:5173",
	}),
);
app.use(express.static("uploads"));
app.use(estadosRoutes);
app.use(articulosRoutes);
app.use(usuariosRoutes);
app.use(autoresRoutes);
app.use(notificacionesRoutes);

app.use((req, res, next) => {
	res.status(404).json({
		message: "Not found",
	});
});

export default app;
