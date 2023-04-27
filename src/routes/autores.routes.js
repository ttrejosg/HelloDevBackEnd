import { Router } from 'express'
import { getAutores, getAutorBy, createAutor} from '../controllers/autores.controllers.js';

const router = Router();

router.get('/autores', getAutores);

router.get('/autor', getAutorBy);

router.post('/autor', createAutor);

export default router;