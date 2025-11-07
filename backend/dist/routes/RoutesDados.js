"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dadosControllers_1 = require("../controllers/dadosControllers");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
router.get('/', dadosControllers_1.dadosControllers.getAllDados);
router.get('/:id', dadosControllers_1.dadosControllers.getAllDadosById);
// 🔹 Nova rota para inserção automática dos dados
router.post('/', async (req, res) => {
    try {
        const { temperatura, id_laboratorio } = req.body;
        // Validação básica
        if (temperatura === undefined || id_laboratorio === undefined) {
            res.status(400).json({ error: 'Temperatura e ID do laboratório são obrigatórios' });
            return;
        }
        const result = await database_1.default.query('INSERT INTO dados_coletados (temperatura, id_laboratorio) VALUES ($1, $2) RETURNING *', [temperatura, id_laboratorio]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
