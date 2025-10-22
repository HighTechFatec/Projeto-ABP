import database from '../config/database';

export async function initializeDatabase(): Promise<void> {
  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS laboratorio (
        id SERIAL PRIMARY KEY,
        sigla VARCHAR(10) NOT NULL UNIQUE,
        nome VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        senha VARCHAR(50),
        telefone VARCHAR(12),
        id_laboratorio INT,
        FOREIGN KEY(id_laboratorio) REFERENCES laboratorio(id)
      );

      CREATE TABLE IF NOT EXISTS dados_coletados (
        id SERIAL PRIMARY KEY,
        temperatura DECIMAL(4,2),
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        id_laboratorio INT,
        FOREIGN KEY(id_laboratorio) REFERENCES laboratorio(id)
      );

      CREATE TABLE IF NOT EXISTS avisos (
        id SERIAL PRIMARY KEY,
        temp_min DECIMAL(4,2),
        temp_max DECIMAL(4,2),
        id_usuario INT,
        FOREIGN KEY(id_usuario) REFERENCES usuario(id)
      )
    `);

    console.log('📁 Tabelas verificadas/criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabela(s):', error);
    throw error;
  }
}