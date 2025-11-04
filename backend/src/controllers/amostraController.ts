import { Request, Response, NextFunction } from 'express';
import ModelAmostra from '../model/Amostra';
import { CreateAmostraRequest, UpdateAmostraRequest } from '../types';
import { AppError } from '../utils/AppError';

export const amostraController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const amostras = await ModelAmostra.findAll();
      res.json(amostras);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('ID inválido', 400);

      const amostra = await ModelAmostra.findById(id);
      if (!amostra) throw new AppError('Amostra não encontrada', 404);

      res.json(amostra);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, laboratorio, data_inicio, data_fim, temp_min, temp_max, unidade, id_usuario }: CreateAmostraRequest = req.body;

      if (!nome || !data_inicio || !data_fim || temp_min == null || temp_max == null)
        throw new AppError('Todos os campos são obrigatórios', 400);

      if (temp_min >= temp_max)
        throw new AppError('Temperatura mínima deve ser menor que a máxima', 400);

      if (new Date(data_inicio) > new Date(data_fim))
        throw new AppError('Data de início deve ser anterior à data de fim', 400);

      const newAmostra = await ModelAmostra.create({
        nome,
        laboratorio,
        data_inicio,
        data_fim,
        temp_min,
        temp_max,
        unidade,
        id_usuario
      });

      res.status(201).json({
        message: 'Amostra criada com sucesso!',
        amostra: newAmostra,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('ID inválido', 400);

      const amostraData: UpdateAmostraRequest = req.body;
      if (Object.keys(amostraData).length === 0)
        throw new AppError('Nenhum campo fornecido para atualização', 400);

      const updated = await ModelAmostra.update(id, amostraData);
      if (!updated) throw new AppError('Amostra não encontrada', 404);

      res.json({
        message: 'Amostra atualizada com sucesso!',
        amostra: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('ID inválido', 400);

      const deleted = await ModelAmostra.delete(id);
      if (!deleted) throw new AppError('Amostra não encontrada', 404);

      res.json({
        message: 'Amostra deletada com sucesso!',
        amostra: deleted,
      });
    } catch (error) {
      next(error);
    }
  },
};
