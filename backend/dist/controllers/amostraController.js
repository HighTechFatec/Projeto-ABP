"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amostraController = void 0;
const Amostra_1 = __importDefault(require("../model/Amostra"));
const AppError_1 = require("../utils/AppError");
exports.amostraController = {
    async getAll(req, res, next) {
        try {
            const amostras = await Amostra_1.default.findAll();
            res.json(amostras);
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError('ID inválido', 400);
            const amostra = await Amostra_1.default.findById(id);
            if (!amostra)
                throw new AppError_1.AppError('Amostra não encontrada', 404);
            res.json(amostra);
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const { nome, laboratorio, data_inicio, data_fim, temp_min, temp_max, unidade, id_usuario } = req.body;
            // Verificação de campos obrigatórios
            if (!nome || !laboratorio || !data_inicio || !data_fim || unidade == null || !id_usuario) {
                throw new AppError_1.AppError('Todos os campos são obrigatórios', 400);
            }
            // Verificação das temperaturas
            if (temp_min == null || temp_max == null)
                throw new AppError_1.AppError('Informe temp_min e temp_max', 400);
            if (isNaN(temp_min) || isNaN(temp_max))
                throw new AppError_1.AppError('Temperaturas devem ser números', 400);
            if (temp_min >= temp_max)
                throw new AppError_1.AppError('Temperatura mínima deve ser menor que a máxima', 400);
            // Datas
            if (new Date(data_inicio) > new Date(data_fim))
                throw new AppError_1.AppError('Data de início deve ser anterior à data de fim', 400);
            // Criar no banco
            const newAmostra = await Amostra_1.default.create({
                nome,
                laboratorio,
                data_inicio,
                data_fim,
                temp_min,
                temp_max,
                unidade,
                id_usuario
            });
            res.status(201).json({
                message: 'Amostra criada com sucesso!',
                amostra: newAmostra,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError('ID inválido', 400);
            const amostraData = req.body;
            if (Object.keys(amostraData).length === 0)
                throw new AppError_1.AppError('Nenhum campo fornecido para atualização', 400);
            const updated = await Amostra_1.default.update(id, amostraData);
            if (!updated)
                throw new AppError_1.AppError('Amostra não encontrada', 404);
            res.json({
                message: 'Amostra atualizada com sucesso!',
                amostra: updated,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new AppError_1.AppError('ID inválido', 400);
            const deleted = await Amostra_1.default.delete(id);
            if (!deleted)
                throw new AppError_1.AppError('Amostra não encontrada', 404);
            res.json({
                message: 'Amostra deletada com sucesso!',
                amostra: deleted,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
