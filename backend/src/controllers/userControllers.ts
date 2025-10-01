import { Request, Response } from 'express';
import { CreateUserRequest, UpdateRequest } from '../types';
import Modelusuario from '../model/Usuario';


export const userController = {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await Modelusuario.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const user = await Modelusuario.findById(id);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, id_laboratorio }: CreateUserRequest = req.body;

      if (!nome || !email ||!senha ||!id_laboratorio) {
        res.status(400).json({ error: 'Nome e email são obrigatórios' });
        return;
      }

      const existingUser = await Modelusuario.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      const newUser = await Modelusuario.create({ nome, email, senha,id_laboratorio });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const userData: UpdateRequest = req.body;
      
      if (Object.keys(userData).length === 0) {
        res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
        return;
      }

      const updatedUser = await Modelusuario.update(id, userData);
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const deletedUser = await Modelusuario.delete(id);
      if (!deletedUser) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({ 
        message: 'Usuário deletado com sucesso', 
        user: deletedUser 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};