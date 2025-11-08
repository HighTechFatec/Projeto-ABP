import { Router } from 'express';
import { userController } from '../controllers/userControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/',userController.createUser);
router.post('/login',userController.loginUser);

//Rotas protegidas
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router