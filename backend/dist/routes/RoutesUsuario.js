"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', userControllers_1.userController.createUser);
router.post('/login', userControllers_1.userController.loginUser);
//Rotas protegidas
router.get('/', authMiddleware_1.authMiddleware, userControllers_1.userController.getAllUsers);
router.get('/:id', authMiddleware_1.authMiddleware, userControllers_1.userController.getUserById);
router.put('/:id', authMiddleware_1.authMiddleware, userControllers_1.userController.updateUser);
router.delete('/:id', authMiddleware_1.authMiddleware, userControllers_1.userController.deleteUser);
exports.default = router;
