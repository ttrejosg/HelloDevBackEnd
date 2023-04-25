import { Router } from 'express'
import { getArticulos, getArticulo,createArticulos, updateArticulos, deleteArticulos } from '../controllers/artculos.controllers';

const router = Router();

router.get('/articulos', getArticulos );

router.get('/articulos/:id', getArticulo);

router.post('/articulos', createArticulos);

router.delete('/articulos/:id', deleteArticulos);

router.patch('/articulos/:id', updateArticulos);

export default router;