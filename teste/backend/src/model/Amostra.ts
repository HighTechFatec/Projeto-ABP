import database from '../config/database';
import { Amostra, CreateAmostraRequest, UpdateAmostraRequest } from '../types';

export class ModelAmostra {
  async findAll(): Promise<Amostra[]> {
    const result = await database.query('SELECT * FROM amostras');
    return result.rows;
  }

  async findById(id: number): Promise<Amostra | null> {
    const result = await database.query('SELECT * FROM amostras WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(amostraData: CreateAmostraRequest): Promise<Amostra> {
    const { nome, data_inicio, data_fim, temp_min, temp_max, id_usuario } = amostraData;
    const result = await database.query(
      `INSERT INTO amostras (nome, data_inicio, data_fim, temp_min, temp_max, id_usuario)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nome, data_inicio, data_fim, temp_min, temp_max, id_usuario]
    );
    return result.rows[0];
  }

  async update(id: number, amostraData: UpdateAmostraRequest): Promise<Amostra | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(amostraData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo fornecido para atualização');
    }

    values.push(id);
    const query = `
      UPDATE amostras
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<Amostra | null> {
    const result = await database.query(
      'DELETE FROM amostras WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }
}

export default new ModelAmostra();