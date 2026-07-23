const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

function loadEnv(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) {
    return env;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=');
  }

  return env;
}

async function main() {
  const env = loadEnv(path.resolve(__dirname, '..', '.env'));

  const client = new Client({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT) || 5432,
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_NAME || 'reservaplay',
  });

  const email = 'admin@reservaplay.local';
  const password = 'Admin1234!';
  const name = 'Administrador ReservaPlay';
  const profile = 'Administrador principal';
  const role = 'admin';

  try {
    await client.connect();

    const existing = await client.query('SELECT id, role FROM users WHERE email = $1', [email]);
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.role === role) {
        await client.query(
          'UPDATE users SET password = $1, active = true, updated_at = NOW() WHERE email = $2',
          [hashedPassword, email],
        );
        console.log(`Usuario administrador existente actualizado: ${email}`);
      } else {
        await client.query(
          'UPDATE users SET password = $1, role = $2, active = true, updated_at = NOW() WHERE email = $3',
          [hashedPassword, role, email],
        );
        console.log(`Usuario existente convertido en administrador: ${email}`);
      }
    } else {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : require('crypto').randomUUID();
      await client.query(
        `INSERT INTO users (id, name, email, password, role, profile, active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [id, name, email, hashedPassword, role, profile, true],
      );
      console.log(`Administrador creado correctamente: ${email}`);
      console.log(`Contraseña: ${password}`);
    }
  } catch (error) {
    console.error('Error creando el usuario administrador:', error.message || error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
