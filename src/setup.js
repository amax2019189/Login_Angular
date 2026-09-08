import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function main() {
  const admin = new Client({ connectionString: process.env.DATABASE_URL.replace('/login_db', '/postgres') });
  await admin.connect();
  const database = await admin.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    ['login_db']
  );

  if (database.rowCount === 0) {
    await admin.query('CREATE DATABASE login_db');
    console.log('Base de datos login_db creada.');
  }

  await admin.end();

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
      stock INTEGER NOT NULL CHECK (stock >= 0),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await db.end();
  console.log('Tablas users y products listas.');
}

main().catch((error) => {
  console.error('Error en setup:', error.message);
  process.exit(1);
});
