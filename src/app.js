import express from "express";
import articulosRoutes from './routes/articulos.routes.js';
//import estadosRoutes from './routes/estados.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import autoresRoutes from './routes/autores.routes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan("default"));

app.use(express.json());
app.use(articulosRoutes);
//app.use(estadosRoutes);
app.use(usuariosRoutes);
app.use(autoresRoutes)

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found'
    })
})

export default app;