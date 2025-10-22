import { Request, Response } from 'express';
import ModelDados from '../model/Dados';
import { dados_coletados } from '../types';

export const dadosControllers = {
  // Lista todos os dados
  async getAllDados(req: Request, res: Response): Promise<void> {
    try {
      const dados = await ModelDados.findAll();
      res.json(dados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lista um dado específico por ID
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
  },

  // ✅ Novo método: recebe dados enviados pelo ESP32
  async createDado(req: Request, res: Response): Promise<void> {
    try {
      const { temperatura, umidade } = req.body;

      if (temperatura == null || umidade == null) {
        res.status(400).json({ error: 'Dados incompletos' });
        return;
      }

      const novoDado: dados_coletados = {
        temperatura,
        umidade,
        data_hora: new Date(), // gera timestamp automaticamente
        create: '',
      };

      res.status(201).json({
        message: 'Dado inserido com sucesso!',
        dado: novoDado,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
