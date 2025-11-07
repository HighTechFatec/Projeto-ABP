"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dadosControllers = void 0;
const Dados_1 = __importDefault(require("../model/Dados"));
exports.dadosControllers = {
    async getAllDados(req, res) {
        try {
            const dados = await Dados_1.default.findAll();
            res.json(dados);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAllDadosById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido" });
                return;
            }
            const dados = await Dados_1.default.findById(id);
            if (!dados) {
                res.status(404).json({ error: "Dado não encontrado" });
                return;
            }
            res.json(dados);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
