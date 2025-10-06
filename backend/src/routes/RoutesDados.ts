import { Router } from 'express';
import { dadosControllers } from '../controllers/dadosControllers';


const router = Router();

router.get('/',dadosControllers.getAllDados);
router.get('/:id',dadosControllers.getAllDadosById);

export default router