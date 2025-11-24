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
    const { email, senha, fcm_token } = req.body; // ⬅️ agora recebendo FCM token
    if (!email || !senha) throw new AppError("Email e senha são obrigatórios", 400);

    const user = await Modelusuario.findByEmail(email);
    if (!user) throw new AppError("E-mail ou senha incorretos", 401);

    // 🔐 Gerar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtConfig.secret as jwt.Secret,
      { expiresIn: jwtConfig.expiresIn as jwt.SignOptions["expiresIn"] }
    );

    // 🟡 Se vier um FCM token do app → atualizar no banco
    let finalFcmToken = user.expo_push_token;

    if (fcm_token) {
      await Modelusuario.updateExpoPushToken(user.id, fcm_token);
      finalFcmToken = fcm_token;
    }

    // 🔙 Retorno final do login
    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        id_laboratorio: user.id_laboratorio,
        expo_push_token: finalFcmToken,
      },
    });

  } catch (error) {
    next(error);
  }
},

 async savePushToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_usuario, fcm_token } = req.body;

  if (!id_usuario || !fcm_token) {
    res.status(400).json({ message: "id_usuario e fcm_token são obrigatórios" });
    return;
  }

  try {
    await database.query(
      "UPDATE usuario SET fcm_token = $1 WHERE id = $2",
      [fcm_token, id_usuario]
    );

    res.status(200).json({ message: "Token FCM salvo!" });

  } catch (e) {
    console.error("Erro ao salvar FCM:", e);
    next(e instanceof Error ? e : new AppError("Erro ao salvar token.", 500));
  }
}
};