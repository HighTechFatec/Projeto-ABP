import { Router } from 'express';
import { dadosControllers } from '../controllers/dadosControllers';


const router = Router();

router.get('/',dadosControllers.getAllDados);
router.get('/:id',dadosControllers.getAllDadosById);
router.post('/', dadosControllers.createDado); // ESP32 envia POST aqui

export default router