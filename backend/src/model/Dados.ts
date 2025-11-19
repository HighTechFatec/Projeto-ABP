import database from "../config/database";
import { dados_coletados } from "../types";

export class ModelDados {
  async findAll(): Promise<dados_coletados[]> {
    const result = await database.query(
      "SELECT * FROM dados_coletados ORDER BY id DESC LIMIT 50"
    );
    return result.rows;
  }

  async findById(id: number): Promise<dados_coletados | null> {
    const result = await database.query(
      "SELECT * FROM dados_coletados WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async findByData(data: string): Promise<dados_coletados[]> {
    const result = await database.query(
      `SELECT * FROM dados_coletados 
       WHERE DATE(data_hora) = $1 
       ORDER BY data_hora ASC`,
      [data]
    );
    return result.rows;
  }

  async findByPeriodo(periodo: string): Promise<dados_coletados[]> {
    let query = '';
    
    switch (periodo) {
      case 'semana':
        query = `
          SELECT * FROM dados_coletados 
          WHERE data_hora >= CURRENT_DATE - INTERVAL '7 days'
          ORDER BY data_hora ASC
        `;
        break;
      case 'mes':
        query = `
          SELECT * FROM dados_coletados 
          WHERE data_hora >= CURRENT_DATE - INTERVAL '30 days'
          ORDER BY data_hora ASC
        `;
        break;
      default:
        query = `
          SELECT * FROM dados_coletados 
          WHERE DATE(data_hora) = CURRENT_DATE
          ORDER BY data_hora ASC
        `;
    }

    const result = await database.query(query);
    return result.rows;
  }
}

export default new ModelDados();
