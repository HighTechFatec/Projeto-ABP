"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
const Usuario_1 = __importDefault(require("../model/Usuario"));
const AppError_1 = require("../utils/AppError");
exports.userController = {
    async getAllUsers(req, res, next) {
        try {
            const users = await Usuario_1.default.findAll();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    },
    async getUserById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError("ID inválido", 400);
            const user = await Usuario_1.default.findById(id);
            if (!user)
                throw new AppError_1.AppError("Usuário não encontrado", 404);
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    },
    async createUser(req, res, next) {
        try {
            const { nome, email, senha, sigla_laboratorio, telefone } = req.body;
            // Verifica campos obrigatórios
            if (!nome || !email || !senha || !sigla_laboratorio) {
                throw new AppError_1.AppError("Todos os campos são obrigatórios", 400);
            }
            // Verifica se o email já existe
            const existingUser = await Usuario_1.default.findByEmail(email);
            if (existingUser)
                throw new AppError_1.AppError("Email já está cadastrado", 409);
            // Cria o usuário (o Modelusuario.create já vai resolver o id do laboratório)
            const newUser = await Usuario_1.default.create({
                nome,
                email,
                senha,
                telefone,
                sigla_laboratorio, // envia a sigla para o model
            });
            res.status(201).json(newUser);
        }
        catch (error) {
            next(error);
        }
    },
    async updateUser(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError("ID inválido", 400);
            const userData = req.body;
            if (Object.keys(userData).length === 0)
                throw new AppError_1.AppError("Nenhum dado fornecido para atualização", 400);
            if (userData.senha) {
                userData.senha = await bcryptjs_1.default.hash(userData.senha, 10);
            }
            const updatedUser = await Usuario_1.default.update(id, userData);
            if (!updatedUser)
                throw new AppError_1.AppError("Usuário não encontrado", 404);
            res.json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteUser(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError("ID inválido", 400);
            const deletedUser = await Usuario_1.default.delete(id);
            if (!deletedUser)
                throw new AppError_1.AppError("Usuário não encontrado", 404);
            res.json({
                message: "Usuário deletado com sucesso",
                user: deletedUser,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async loginUser(req, res, next) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha)
                throw new AppError_1.AppError("Email e senha são obrigatórios", 400);
            const user = await Usuario_1.default.findByEmail(email);
            if (!user)
                throw new AppError_1.AppError("E-mail ou senha incorretos", 401);
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, auth_1.jwtConfig.secret, { expiresIn: auth_1.jwtConfig.expiresIn });
            res.status(200).json({ message: "Login bem-sucedido", token, user: { id: user.id, nome: user.nome, email: user.email, id_laboratorio: user.id_laboratorio, telefone: user.telefone }
            });
        }
        catch (error) {
            next(error);
        }
    },
};
