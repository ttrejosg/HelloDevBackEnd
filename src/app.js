import express from "express";
import articulosRoutes from './routes/articulos.routes.js';

const app = express();

app.use(articulosRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found'
    })
})

export default app;