"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avisoControllers = void 0;
const Avisos_1 = __importDefault(require("../model/Avisos"));
exports.avisoControllers = {
    async getAllAvisos(req, res) {
        try {
            const avisos = await Avisos_1.default.findAll();
            res.json(avisos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAvisosById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const avisos = await Avisos_1.default.findById(id);
            if (!avisos) {
                res.status(404).json({ error: 'Aviso não encontrado' });
                return;
            }
            res.json(avisos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async createAviso(req, res) {
        try {
            const { temp_min, temp_max, id_usuario } = req.body;
            if (!temp_min || !temp_max || !id_usuario) {
                res.status(400).json({ error: 'Temperatura maxima e minina é necessaria' });
                return;
            }
            const newAviso = await Avisos_1.default.create({ temp_min, temp_max, id_usuario });
            res.status(201).json(newAviso);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateAviso(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const avisoData = req.body;
            if (Object.keys(avisoData).length === 0) {
                res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
                return;
            }
            const updatedAviso = await Avisos_1.default.update(id, avisoData);
            if (!updatedAviso) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            res.json(updatedAviso);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteAviso(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const deletedAviso = await Avisos_1.default.delete(id);
            if (!deletedAviso) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            res.json({
                message: 'Usuário deletado com sucesso',
                aviso: deletedAviso
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
