"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelAvisos = void 0;
const database_1 = __importDefault(require("../config/database"));
class ModelAvisos {
    async findAll() {
        const result = await database_1.default.query('SELECT * FROM avisos');
        return result.rows;
    }
    async findById(id) {
        const result = await database_1.default.query('SELECT * FROM avisos WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async create(avisorData) {
        const { temp_min, temp_max, id_usuario } = avisorData;
        const result = await database_1.default.query('INSERT INTO avisos (temp_min, temp_max, id_usuario) VALUES ($1, $2, $3) RETURNING *', [temp_min, temp_max, id_usuario]);
        return result.rows[0];
    }
    async update(id, avisorData) {
        const { temp_min, temp_max } = avisorData;
        const fields = [];
        const values = [];
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
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await database_1.default.query('DELETE FROM avisos WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
}
exports.ModelAvisos = ModelAvisos;
exports.default = new ModelAvisos();
