import db from '../config/database';
import type { dados_coletados } from '../types';

const ModelDados = {
  async findAll(): Promise<dados_coletados[]> {
    const result = await db.query('SELECT * FROM dados_coletados ORDER BY data_hora DESC');
    return result.rows;
  },

  async findById(id: number): Promise<dados_coletados | null> {
    const result = await db.query('SELECT * FROM dados_coletados WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create(dado: Omit<dados_coletados, 'id'>): Promise<dados_coletados> {
    const result = await db.query(
      'INSERT INTO dados_coletados (temperatura, umidade, data_hora) VALUES ($1, $2, $3) RETURNING *',
      [dado.temperatura, dado.umidade, dado.data_hora]
    );
    return result.rows[0];
  },
};

export default ModelDados;
