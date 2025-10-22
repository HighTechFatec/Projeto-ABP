import { Request, Response, NextFunction } from 'express';
import ModelDados from '../model/Dados';
import { AppError } from '../utils/AppError';

export const temperaturaController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = await ModelDados.findAll();
      res.json(dados);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('ID inválido', 400);

      const dado = await ModelDados.findById(id);
      if (!dado) throw new AppError('Dado de temperatura não encontrado', 404);

      res.json(dado);
    } catch (error) {
      next(error);
    }
  },
};
