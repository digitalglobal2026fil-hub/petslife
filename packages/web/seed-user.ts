import { createClient } from '@libsql/client';
import { randomBytes } from 'crypto';
import { hashPassword } from 'better-auth/crypto';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const hash = await hashPassword('C@rdoso.99');
const id = randomBytes(16).toString('hex').slice(0, 32);
const accId = randomBytes(16).toString('hex').slice(0, 32);
const now = new Date().toISOString();

await client.execute({
  sql: 'INSERT INTO user (id, email, name, emailVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
  args: [id, 'digitalglobal2026fil@gmail.com', 'Digital Global', 1, now, now]
});

await client.execute({
  sql: 'INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
  args: [accId, id, 'credential', id, hash, now, now]
});

console.log('OK', id);
