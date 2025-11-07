"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'teste',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
};
class Database {
    constructor() {
        this.pool = new pg_1.Pool(dbConfig);
        this.testConnection();
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log('✅ Conectado ao PostgreSQL com sucesso!');
            client.release();
        }
        catch (error) {
            console.error('❌ Erro ao conectar com PostgreSQL:', error);
            process.exit(1);
        }
    }
    getPool() {
        return this.pool;
    }
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
}
exports.default = new Database();
