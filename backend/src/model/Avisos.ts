import database from '../config/database';
import { Avisos, CreateAvisoRequest, UpdateAvisoRequest } from '../types';

export class ModelAvisos{
    static findAll: any;
    async findAll(): Promise<Avisos[]> {
    const result = await database.query('SELECT * FROM avisos');
    return result.rows;
  }
  async findById(id: number): Promise<Avisos | null> {
    const result = await database.query('SELECT * FROM avisos WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
  async create(avisorData: CreateAvisoRequest): Promise<Avisos> {
    const { temp_min, temp_max, id_usuario } = avisorData;
    const result = await database.query(
      'INSERT INTO usuario (temp_min, temp_max, id_usuario) VALUES ($1, $2, $3) RETURNING *',
      [temp_min, temp_max, id_usuario]
    );
    return result.rows[0];
  }
  async update(id: number, avisorData: UpdateAvisoRequest): Promise<Avisos | null> {
    const { temp_min, temp_max } = avisorData;
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (temp_min !== undefined) {
      fields.push(`temp_min = $${paramCount}`);
      values.push(temp_min);
      paramCount++;
    }

    if (temp_max !== undefined) {
      fields.push(`temp_max = $${paramCount}`);
      values.push(temp_max);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo fornecido para atualização');
    }
    
    // Adicionando o id no final dos valores
    values.push(id);

    const query = `
      UPDATE avisos 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

 async delete(id: number): Promise<Avisos | null> {
    const result = await database.query(
      'DELETE FROM avisos WHERE id = $1 RETURNING *', 
      [id]
    );
    return result.rows[0] || null;
  }
}

export default new ModelAvisos();