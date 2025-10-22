import { Request, Response } from 'express';
import ModelAvisos from '../model/Avisos';
import { CreateAvisoRequest, UpdateAvisoRequest } from '../types';

export const avisoControllers = {
    async getAllAvisos(req: Request, res: Response): Promise<void> {
    try {
      const avisos = await ModelAvisos.findAll();
      res.json(avisos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAvisosById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const avisos = await ModelAvisos.findById(id);
      if (!avisos) {
        res.status(404).json({ error: 'Aviso não encontrado' });
        return;
      }

      res.json(avisos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createAviso(req: Request, res: Response): Promise<void> {
    try {
      const { temp_min,temp_max,id_usuario }: CreateAvisoRequest = req.body;

      if (!temp_min || !temp_max ||!id_usuario) {
        res.status(400).json({ error: 'Temperatura maxima e minina é necessaria' });
        return;
      }
      const newAviso = await ModelAvisos.create({ temp_min,temp_max,id_usuario });
      res.status(201).json(newAviso);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateAviso(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const avisoData: UpdateAvisoRequest = req.body;
      
      if (Object.keys(avisoData).length === 0) {
        res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
        return;
      }

      const updatedAviso = await ModelAvisos.update(id, avisoData);
      if (!updatedAviso) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(updatedAviso);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteAviso(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const deletedAviso = await ModelAvisos.delete(id);
      if (!deletedAviso) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({ 
        message: 'Usuário deletado com sucesso', 
        aviso: deletedAviso
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}