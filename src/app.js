import express from "express";
import articulosRoutes from './routes/articulos.routes.js';
import estadosRoutes from './routes/estados.routes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan("default"));
app.use(articulosRoutes);
app.use(estadosRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found'
    })
})

export default app;