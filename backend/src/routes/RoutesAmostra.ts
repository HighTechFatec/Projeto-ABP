import { Router } from "express";
import { amostraController } from "../controllers/amostraController";

const router = Router();

router.get('/', amostraController.getAll);
router.get('/:id', amostraController.getById);
router.post('/', amostraController.create);
router.put('/:id', amostraController.update);
router.delete('/:id', amostraController.delete);

export default router;