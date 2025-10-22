import { Pool, PoolConfig } from 'pg';
import type types = require('../types');


const dbConfig: types.DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',  
  port: parseInt(process.env.DB_PORT || '5432'),  
  database: process.env.DB_NAME || 'teste',  
  user: process.env.DB_USER || 'postgres',  
  password: process.env.DB_PASSWORD || '123',  
};

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(dbConfig as PoolConfig);
    this.testConnection();
  }

  async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Conectado ao PostgreSQL com sucesso!');
      client.release();
    } catch (error) {
      console.error('❌ Erro ao conectar com PostgreSQL:', error);
      process.exit(1);
    }
  }

  getPool(): Pool {
    return this.pool;
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}

export default new Database();