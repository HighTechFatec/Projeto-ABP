import { Request, Response } from 'express';
import ModelAvisos from '../model/Avisos';
import { CreateAvisoRequest, UpdateAvisoRequest } from '../types';
import { sendPushNotification } from "../utils/pushNotification";
import database from '../config/database';

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
    const { temp_min, temp_max, id_usuario }: CreateAvisoRequest = req.body;

    if (!temp_min || !temp_max || !id_usuario) {
      res.status(400).json({ error: "Temperatura máxima, mínima e ID do usuário são necessários." });
      return;
    }

    // ✔ Cria o aviso normalmente
    const newAviso = await ModelAvisos.create({ temp_min, temp_max, id_usuario });

    // ------------------------------------------------------------------------------
    // 🔍 BUSCAR ÚLTIMA AMOSTRA ATIVA DESSE USUÁRIO
    // ------------------------------------------------------------------------------
    const amostraQuery = await database.query(
      `
      SELECT temp_min, temp_max
      FROM amostras
      WHERE id_usuario = $1
        AND NOW() BETWEEN data_inicio AND data_fim
      ORDER BY data_fim DESC
      LIMIT 1
      `,
      [id_usuario]
    );

    const amostra = amostraQuery.rows[0];

    // ------------------------------------------------------------------------------
    // 🔍 BUSCAR TOKEN FCM DO USUÁRIO
    // ------------------------------------------------------------------------------
    const result = await database.query(
      "SELECT fcm_token FROM usuario WHERE id = $1",
      [id_usuario]
    );

    const user = result.rows[0];

    // ------------------------------------------------------------------------------
    // 📲 ENVIAR PUSH NOTIFICATION
    // ------------------------------------------------------------------------------
    if (user?.fcm_token) {
      await sendPushNotification(
        user.fcm_token,
        "Aviso de Temperatura",
        amostra
          ? `Limite configurado: ${amostra.temp_min}°C a ${amostra.temp_max}°C`
          : `Aviso configurado para limites ${temp_min}°C a ${temp_max}°C`,
        { screen: "Notificações" }
      );
    }

    res.status(201).json({
      message: "Aviso criado com sucesso!",
      aviso: newAviso,
    });
  } catch (error: any) {
    console.error("❌ Erro ao criar aviso:", error);
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