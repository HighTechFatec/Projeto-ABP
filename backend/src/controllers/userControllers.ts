import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, UpdateRequest } from "../types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/auth";
import Modelusuario from "../model/Usuario";
import { AppError } from "../utils/AppError";
import database from "../config/database";

export const userController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await Modelusuario.findAll();
      res.json(users); // users agora inclui expo_push_token no model
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const user = await Modelusuario.findById(id);
      if (!user) throw new AppError("Usuário não encontrado", 404);

      res.json(user); // também retorna expo_push_token
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, email, senha, sigla_laboratorio, telefone, expo_push_token }: CreateUserRequest = req.body;

      if (!nome || !email || !senha || !sigla_laboratorio) {
        throw new AppError("Todos os campos são obrigatórios", 400);
      }

      const existingUser = await Modelusuario.findByEmail(email);
      if (existingUser) throw new AppError("Email já está cadastrado", 409);

      const newUser = await Modelusuario.create({
        nome,
        email,
        senha,
        telefone,
        sigla_laboratorio,
        expo_push_token // opcional
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const userData: UpdateRequest = req.body;

      if (Object.keys(userData).length === 0) {
        throw new AppError("Nenhum dado fornecido para atualização", 400);
      }

      if (userData.senha) {
        userData.senha = await bcrypt.hash(userData.senha, 10);
      }

      const updatedUser = await Modelusuario.update(id, userData);
      if (!updatedUser) throw new AppError("Usuário não encontrado", 404);

      res.json(updatedUser); // inclui expo_push_token se alterado
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError("ID inválido", 400);

      const deletedUser = await Modelusuario.delete(id);
      if (!deletedUser) throw new AppError("Usuário não encontrado", 404);

      res.json({
        message: "Usuário deletado com sucesso",
        user: deletedUser, // inclui expo_push_token
      });
    } catch (error) {
      next(error);
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) throw new AppError("Email e senha são obrigatórios", 400);

      const user = await Modelusuario.findByEmail(email);
      if (!user) throw new AppError("E-mail ou senha incorretos", 401);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secret as jwt.Secret,
        { expiresIn: jwtConfig.expiresIn as jwt.SignOptions["expiresIn"] }
      );

      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          id_laboratorio: user.id_laboratorio,
          expo_push_token: user.expo_push_token ?? null,
        },
      });

    } catch (error) {
      next(error);
    }
  },

  async savePushToken(req: Request, res: Response) {
    const { id_usuario, expo_push_token } = req.body;

    if (!id_usuario || !expo_push_token) {
      return res
        .status(400)
        .json({ message: "id_usuario e expo_push_token são obrigatórios." });
    }

    try {
      await database.query(
        "UPDATE usuario SET expo_push_token = $1 WHERE id = $2",
        [expo_push_token, id_usuario]
      );

      return res.status(200).json({ message: "Token salvo com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar token:", error);
      return res.status(500).json({ message: "Erro ao salvar token." });
    }
  },
};