import { Router } from 'express'
import { getUsuarioLogin} from '../controllers/usuarios.controllers.js';

const router = Router();

router.get('/usuario', getUsuarioLogin);

export default router;