
import { Request, Response } from 'express';
import  ModelDados from '../model/Dados';

export const dadosControllers = {
  async getAllDados(req: Request, res: Response): Promise<void> {
    try {
      const dados = await ModelDados.findAll();
      res.json(dados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  async getAllDadosById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const dados = await ModelDados.findById(id);
      if (!dados) {
        res.status(404).json({ error: 'Dado não encontrado' });
        return;
      }

      res.json(dados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};