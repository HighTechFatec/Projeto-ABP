import database from '../config/database';
import { dados_coletados } from '../types';

export class ModelDados{
    async findAll(): Promise<dados_coletados[]> {
    const result = await database.query('SELECT * FROM dados_coletados');
    return result.rows;
  }
  async findById(id: number): Promise<dados_coletados | null> {
    const result = await database.query('SELECT * FROM dados_coletados WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}

export default new ModelDados