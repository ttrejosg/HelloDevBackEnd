import express from "express";
import morgan from "morgan";
import articulosRoutes from "./routes/articulos.routes.js";
import autoresRoutes from "./routes/autores.routes.js";
import estadosRoutes from "./routes/estados.routes.js";
import notificaionesRoutes from "./routes/notificaciones.routes.js";
const app = express();

app.use(morgan("short"));
app.use(express.json());
app.use(estadosRoutes);
app.use(articulosRoutes);
app.use(notificaionesRoutes);
app.use(autoresRoutes);

app.use((req, res, next) => {
	res.status(404).json({
		message: "Not found",
	});
});

export default app;
