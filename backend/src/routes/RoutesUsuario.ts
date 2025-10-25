import { Router } from 'express';
import { userController } from '../controllers/userControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/',userController.createUser);
router.post('/login',userController.loginUser);

//Rotas protegidas
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router