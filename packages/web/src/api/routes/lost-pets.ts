import { Hono } from 'hono';
import { db } from '../database';

const lostPets = new Hono();

const ensureTable = async () => {
  await db.execute({
    sql: `CREATE TABLE IF NOT EXISTS lost_pets (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'lost',
      petName TEXT,
      species TEXT DEFAULT 'dog',
      breed TEXT,
      color TEXT,
      location TEXT,
      lat REAL,
      lng REAL,
      description TEXT,
      contact TEXT,
      userId TEXT,
      resolved INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    )`,
    args: [],
  });
};

lostPets.get('/', async (c) => {
  try {
    await ensureTable();
    const type = c.req.query('type') || 'lost';
    const posts = await db.execute({
      sql: `SELECT * FROM lost_pets WHERE type = ? AND resolved = 0 ORDER BY createdAt DESC LIMIT 50`,
      args: [type],
    });
    return c.json({ posts: posts.rows });
  } catch (e: any) {
    return c.json({ posts: [], error: e.message });
  }
});

lostPets.post('/', async (c) => {
  try {
    await ensureTable();
    const body = await c.req.json();
    const { type, petName, species, breed, color, location, lat, lng, description, contact } = body;
    const id = `lp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await db.execute({
      sql: `INSERT INTO lost_pets (id, type, petName, species, breed, color, location, lat, lng, description, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, type || 'lost', petName || '', species || 'dog', breed || '', color || '', location || '', lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null, description || '', contact || ''],
    });
    return c.json({ success: true, id }, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

lostPets.patch('/:id/resolve', async (c) => {
  try {
    const { id } = c.req.param();
    await db.execute({ sql: `UPDATE lost_pets SET resolved = 1 WHERE id = ?`, args: [id] });
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export { lostPets };
