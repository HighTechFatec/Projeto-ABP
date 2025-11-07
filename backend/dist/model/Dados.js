"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDados = void 0;
const database_1 = __importDefault(require("../config/database"));
class ModelDados {
    async findAll() {
        const result = await database_1.default.query("SELECT * FROM dados_coletados ORDER BY id DESC LIMIT 10");
        return result.rows;
    }
    async findById(id) {
        const result = await database_1.default.query("SELECT * FROM dados_coletados WHERE id = $1", [id]);
        return result.rows[0] || null;
    }
}
exports.ModelDados = ModelDados;
exports.default = new ModelDados();
