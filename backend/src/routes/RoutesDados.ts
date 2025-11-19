import { Router } from 'express';
import { dadosControllers } from '../controllers/dadosControllers';

const router = Router();

router.get('/',dadosControllers.getAllDados);
router.get('/datas/disponiveis', dadosControllers.getDatasDisponiveis);
router.get('/:id',dadosControllers.getAllDadosById);
router.post('/', dadosControllers.createDado);

export default router