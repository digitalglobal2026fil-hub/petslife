import { Hono } from 'hono';
import { db } from '../database';

const chat = new Hono();

// Get all chats for a user
chat.get('/', async (c) => {
  try {
    const userId = c.req.header('x-user-id') || c.req.query('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);

    const chats = await db.execute({
      sql: `SELECT c.*, 
              u1.name as user1Name, u2.name as user2Name,
              m.content as lastMessage, m.createdAt as lastMessageAt
            FROM chats c
            LEFT JOIN users u1 ON c.user1Id = u1.id
            LEFT JOIN users u2 ON c.user2Id = u2.id
            LEFT JOIN messages m ON m.id = (
              SELECT id FROM messages WHERE chatId = c.id ORDER BY createdAt DESC LIMIT 1
            )
            WHERE c.user1Id = ? OR c.user2Id = ?
            ORDER BY COALESCE(m.createdAt, c.createdAt) DESC`,
      args: [userId, userId],
    });

    return c.json({ chats: chats.rows });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Create or get existing chat between two users
chat.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { user1Id, user2Id } = body;
    if (!user1Id || !user2Id) return c.json({ error: 'user1Id and user2Id required' }, 400);

    // Check if chat already exists
    const existing = await db.execute({
      sql: `SELECT * FROM chats WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?) LIMIT 1`,
      args: [user1Id, user2Id, user2Id, user1Id],
    });

    if (existing.rows.length > 0) {
      return c.json({ chat: existing.rows[0] });
    }

    const id = `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await db.execute({
      sql: `INSERT INTO chats (id, user1Id, user2Id, createdAt) VALUES (?, ?, ?, datetime('now'))`,
      args: [id, user1Id, user2Id],
    });

    return c.json({ chat: { id, user1Id, user2Id } }, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Get messages for a chat
chat.get('/:chatId/messages', async (c) => {
  try {
    const { chatId } = c.req.param();
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const messages = await db.execute({
      sql: `SELECT m.*, u.name as senderName, u.image as senderImage
            FROM messages m
            LEFT JOIN users u ON m.senderId = u.id
            WHERE m.chatId = ?
            ORDER BY m.createdAt DESC
            LIMIT ? OFFSET ?`,
      args: [chatId, limit, offset],
    });

    return c.json({ messages: messages.rows.reverse() });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Send a message
chat.post('/:chatId/messages', async (c) => {
  try {
    const { chatId } = c.req.param();
    const body = await c.req.json();
    const { senderId, content, type = 'text' } = body;

    if (!senderId || !content) return c.json({ error: 'senderId and content required' }, 400);

    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await db.execute({
      sql: `INSERT INTO messages (id, chatId, senderId, content, type, createdAt) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      args: [id, chatId, senderId, content, type],
    });

    const message = await db.execute({
      sql: `SELECT m.*, u.name as senderName, u.image as senderImage FROM messages m LEFT JOIN users u ON m.senderId = u.id WHERE m.id = ?`,
      args: [id],
    });

    return c.json({ message: message.rows[0] }, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Delete a message
chat.delete('/:chatId/messages/:messageId', async (c) => {
  try {
    const { chatId, messageId } = c.req.param();
    const userId = c.req.header('x-user-id');

    await db.execute({
      sql: `DELETE FROM messages WHERE id = ? AND chatId = ? AND senderId = ?`,
      args: [messageId, chatId, userId || ''],
    });

    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default chat;
