import database from '../config/database';
import { Usuario, CreateUserRequest, UpdateRequest } from '../types';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';

export class Modelusuario {
  async findAll(): Promise<Usuario[]> {
    const result = await database.query('SELECT * FROM usuario');
    return result.rows;
  }

  async findById(id: number): Promise<Usuario | null> {
    const result = await database.query(
      'SELECT * FROM usuario WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await database.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async create(userData: CreateUserRequest): Promise<Usuario> {
    const { nome, email, senha, telefone, sigla_laboratorio, fcm_token } = userData;

    // Buscar ID do laboratório
    const labResult = await database.query(
      'SELECT id FROM laboratorio WHERE sigla = $1',
      [sigla_laboratorio]
    );

    if (labResult.rowCount === 0) {
      throw new AppError('Laboratório não encontrado', 404);
    }

    const id_laboratorio = labResult.rows[0].id;

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await database.query(
      `
      INSERT INTO usuario 
      (nome, email, senha, telefone, id_laboratorio, fcm_token) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
      `,
      [nome, email, hashedPassword, telefone, id_laboratorio, fcm_token ?? null]
    );

    return result.rows[0];
  }

  async update(id: number, userData: UpdateRequest): Promise<Usuario | null> {
    const { nome, email, senha, id_laboratorio, telefone, fcm_token } = userData;

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${paramCount}`);
      values.push(nome);
      paramCount++;
    }

    if (email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (senha !== undefined) {
      fields.push(`senha = $${paramCount}`);
      values.push(senha);
      paramCount++;
    }

    if (id_laboratorio !== undefined) {
      fields.push(`id_laboratorio = $${paramCount}`);
      values.push(id_laboratorio);
      paramCount++;
    }

    if (telefone !== undefined) {
      fields.push(`telefone = $${paramCount}`);
      values.push(telefone);
      paramCount++;
    }

    if (fcm_token !== undefined) {
      fields.push(`fcm_token = $${paramCount}`);
      values.push(fcm_token);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo fornecido para atualização');
    }

    values.push(id);

    const query = `
      UPDATE usuario
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<Usuario | null> {
    const result = await database.query(
      'DELETE FROM usuario WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  async updateExpoPushToken(id: number, token: string) {
  const result = await database.query(
    `UPDATE usuario SET fcm_token = $1 WHERE id = $2 RETURNING fcm_token`,
    [token, id]
  );
  return result.rows[0];
}
}

export default new Modelusuario();