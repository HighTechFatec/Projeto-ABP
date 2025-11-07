"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseIfNotExists = createDatabaseIfNotExists;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createDatabaseIfNotExists() {
    const client = new pg_1.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: 'postgres' // conecta ao banco padrão só para criar outro
    });
    const dbName = process.env.DB_NAME;
    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`📦 Banco "${dbName}" criado com sucesso.`);
        }
        else {
            console.log(`✅ Banco "${dbName}" já existe.`);
        }
    }
    catch (err) {
        console.error('❌ Erro ao verificar/criar banco:', err);
        throw err;
    }
    finally {
        await client.end();
    }
}
