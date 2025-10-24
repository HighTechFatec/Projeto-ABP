import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, UpdateRequest } from "../types";
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
    const { nome, email, senha, sigla_laboratorio, telefone }: CreateUserRequest = req.body;

    // Verifica campos obrigatórios
    if (!nome || !email || !senha || !sigla_laboratorio) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    // Verifica se o email já existe
    const existingUser = await Modelusuario.findByEmail(email);
    if (existingUser) throw new AppError("Email já está cadastrado", 409);

    // Cria o usuário (o Modelusuario.create já vai resolver o id do laboratório)
    const newUser = await Modelusuario.create({
      nome,
      email,
      senha,
      telefone,
      sigla_laboratorio, // envia a sigla para o model
    });

    res.status(201).json(newUser);
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
      if (!user || user.senha !== senha)
        throw new AppError("E-mail ou senha incorretos", 401);

      res.status(200).json({ message: "Login bem-sucedido", user });
    } catch (error) {
      next(error);
    }
  },
};