import { Request, Response } from "express";
import ModelDados from "../model/Dados";
import database from "../config/database";
import { DataRow } from "../types";

export const dadosControllers = {
  async getAllDados(req: Request, res: Response): Promise<void> {
    try {
      const { data, periodo } = req.query;

      if(data) {
        const dados = await ModelDados.findByData(data as string);
        res.json(dados);
        return;
      }
      if(periodo) {
        const dados = await ModelDados.findByPeriodo(periodo as string);
        res.json(dados);
        return;
      }

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
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const dados = await ModelDados.findById(id);
      if (!dados) {
        res.status(404).json({ error: "Dado não encontrado" });
        return;
      }

      res.json(dados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDatasDisponiveis(req: Request, res: Response): Promise<void> {
    try {
      const result = await database.query(`
        SELECT DISTINCT DATE(data_hora) as data 
        FROM dados_coletados 
        ORDER BY data DESC
      `);
      
      const datas = result.rows.map((row: DataRow) => row.data);
      res.json(datas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createDado(req: Request, res: Response): Promise<void> {
    try {
      const { temperatura, id_laboratorio } = req.body;

      if (temperatura === undefined || id_laboratorio === undefined) {
        res.status(400).json({ error: 'Temperatura e ID do laboratório são obrigatórios' });
        return;
      }

      const result = await database.query(
        'INSERT INTO dados_coletados (temperatura, id_laboratorio) VALUES ($1, $2) RETURNING *',
        [temperatura, id_laboratorio]
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

};