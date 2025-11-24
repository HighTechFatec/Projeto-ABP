import { Request, Response } from "express";
import ModelDados from "../model/Dados";
import database from "../config/database";
import { DataRow } from "../types";
import { sendPushNotification } from "../utils/pushNotification";

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

  // ------------------------------------------------------------------
  // 🔥 MÉTODO PRINCIPAL: RECEBE A TEMPERATURA DO ESP32
  // ------------------------------------------------------------------
  async createDado(req: Request, res: Response): Promise<void> {
    try {
      const { temperatura, id_laboratorio } = req.body;

      if (temperatura === undefined || id_laboratorio === undefined) {
        res.status(400).json({ error: "Temperatura e ID do laboratório são obrigatórios" });
        return;
      }

      // ✔ salva no banco
      const result = await database.query(
        "INSERT INTO dados_coletados (temperatura, id_laboratorio) VALUES ($1, $2) RETURNING *",
        [temperatura, id_laboratorio]
      );

      // ------------------------------------------------------------------
      // 🔍 BUSCAR AMOSTRA ATIVA PARA ESTE LABORATÓRIO
      // ------------------------------------------------------------------
      const amostraResult = await database.query(
        `
        SELECT a.temp_min, a.temp_max, a.id_usuario,
               u.fcm_token
        FROM amostras a
        JOIN users u ON u.id = a.id_usuario
        WHERE a.laboratorio = $1
          AND NOW() BETWEEN a.data_inicio AND a.data_fim
        LIMIT 1
        `,
        [id_laboratorio]
      );

      if (amostraResult.rows.length > 0) {
        const amostra = amostraResult.rows[0];

        const min = Number(amostra.temp_min);
        const max = Number(amostra.temp_max);

        // ------------------------------------------------------------------
        // ⚠ VERIFICAR SE TEMPERATURA ESTÁ FORA DO INTERVALO
        // ------------------------------------------------------------------
        if (temperatura < min || temperatura > max) {
          console.log("⚠ Temperatura fora do limite, notificando usuário...");

          if (amostra.fcm_token) {
            await sendPushNotification(
              amostra.fcm_token,
              "⚠ Alerta de Temperatura",
              `A temperatura atual (${temperatura}°C) ultrapassou o limite definido (${min}°C - ${max}°C).`,
              { laboratorio: String(id_laboratorio) }
            );
          } else {
            console.log("⚠ Usuário não possui token FCM salvo.");
          }
        }
      }

      res.status(201).json(result.rows[0]);

    } catch (error: any) {
      console.error("Erro ao criar dado:", error);
      res.status(500).json({ error: error.message });
    }
  }
};