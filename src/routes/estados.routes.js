import { Router } from 'express'
import { getEstados} from '../controllers/estados.controllers.js';

const router = Router();

router.get('/estados', getEstados );

export default router;