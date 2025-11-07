"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelAmostra = void 0;
const database_1 = __importDefault(require("../config/database"));
class ModelAmostra {
    async findAll() {
        const result = await database_1.default.query('SELECT * FROM amostras');
        return result.rows;
    }
    async findById(id) {
        const result = await database_1.default.query('SELECT * FROM amostras WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async create(amostraData) {
        const { nome, laboratorio, data_inicio, data_fim, temp_min, temp_max, unidade, id_usuario } = amostraData;
        const result = await database_1.default.query(`INSERT INTO amostras (nome, laboratorio, data_inicio, data_fim, temp_min, temp_max, unidade, id_usuario)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`, [nome, laboratorio, data_inicio, data_fim, temp_min, temp_max, unidade, id_usuario]);
        return result.rows[0];
    }
    async update(id, amostraData) {
        const fields = [];
        const values = [];
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
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await database_1.default.query('DELETE FROM amostras WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
}
exports.ModelAmostra = ModelAmostra;
exports.default = new ModelAmostra();
