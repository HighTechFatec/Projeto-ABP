import { Router } from 'express';
import { avisoControllers } from '../controllers/avisoControllers';

const router = Router();

router.get('/',avisoControllers.getAllAvisos);
router.get('/:id',avisoControllers.getAvisosById);
router.post("/",avisoControllers.createAviso);
router.put("/",avisoControllers.updateAviso);
router.delete("/:id",avisoControllers.deleteAviso);

export default router