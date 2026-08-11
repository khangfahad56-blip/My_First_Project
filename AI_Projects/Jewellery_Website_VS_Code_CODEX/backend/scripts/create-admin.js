import bcrypt from 'bcryptjs';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { query } from '../src/config/database.js';

const rl = readline.createInterface({ input, output });

const name = await rl.question('Admin name: ');
const email = await rl.question('Admin email: ');
const password = await rl.question('Admin password: ');

rl.close();

if (!name || !email || password.length < 8) {
    throw new Error('Name, email, and an 8+ character password are required.');
}

const passwordHash = await bcrypt.hash(password, 12);

await query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, updated_at = NOW()`,
    [name, email, passwordHash]
);

console.info('Admin account created.');
