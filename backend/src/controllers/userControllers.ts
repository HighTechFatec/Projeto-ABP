import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, UpdateRequest } from "../types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/auth";
import Modelusuario from "../model/Usuario";
import { AppError } from "../utils/AppError";

export const userController = {
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await Modelusuario.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const user = await Modelusuario.findById(id);
      if (!user) throw new AppError("Usuário não encontrado", 404);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { nome, email, senha, id_laboratorio, telefone }: CreateUserRequest =
        req.body;

      if (!nome || !email || !senha || !id_laboratorio)
        throw new AppError("Todos os campos são obrigatórios", 400);

      const existingUser = await Modelusuario.findByEmail(email);
      if (existingUser) throw new AppError("Email já está cadastrado", 409);

      const senhaHash = await bcrypt.hash(senha, 10);//criptografa a senha antes de salvar

      const newUser = await Modelusuario.create({
        nome,
        email,
        senha: senhaHash,
        id_laboratorio,
        telefone
      });
      res.status(201).json({
        mensage: "Usuário criado com sucesso",
        user: { id: newUser.id, nome: newUser.nome, email: newUser.email, id_laboratorio: newUser.id_laboratorio, telefone: newUser.telefone }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const userData: UpdateRequest = req.body;
      if (Object.keys(userData).length === 0)
        throw new AppError("Nenhum dado fornecido para atualização", 400);
      if (userData.senha) {
        userData.senha = await bcrypt.hash(userData.senha, 10);
      }

      const updatedUser = await Modelusuario.update(id, userData);
      if (!updatedUser) throw new AppError("Usuário não encontrado", 404);

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const deletedUser = await Modelusuario.delete(id);
      if (!deletedUser) throw new AppError("Usuário não encontrado", 404);

      res.json({
        message: "Usuário deletado com sucesso",
        user: deletedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, senha } = req.body;
      if (!email || !senha)
        throw new AppError("Email e senha são obrigatórios", 400);

      const user = await Modelusuario.findByEmail(email);
      if (!user) throw new AppError("E-mail ou senha incorretos", 401);
      
      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secret as jwt.Secret,
        { expiresIn: jwtConfig.expiresIn as jwt.SignOptions["expiresIn"] }
      );

      res.status(200).json({ message: "Login bem-sucedido", token, user: { id: user.id, nome: user.nome, email: user.email, id_laboratorio: user.id_laboratorio, telefone: user.telefone } 
      });
  }  catch (error) {
      next(error);
    }
  },
};