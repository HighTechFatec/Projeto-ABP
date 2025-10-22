import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export async function createDatabaseIfNotExists() {
  const client = new Client({
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
    } else {
      console.log(`✅ Banco "${dbName}" já existe.`);
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/criar banco:', err);
    throw err;
  } finally {
    await client.end();
  }
}
