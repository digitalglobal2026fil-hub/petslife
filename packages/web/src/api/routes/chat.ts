import { Hono } from 'hono';
import { db } from '../database';
import { chats, messages } from '../database/schema';
import { user } from '../database/auth-schema';
import { and, desc, eq, or, sql } from 'drizzle-orm';

const chat = new Hono();

// Get all chats for a user
chat.get('/', async (c) => {
  try {
    const userId = c.req.header('x-user-id') || c.req.query('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);

    const rows = await db
      .select({
        id: chats.id,
        user1Id: chats.user1Id,
        user2Id: chats.user2Id,
        lastMessage: chats.lastMessage,
        lastMessageAt: chats.lastMessageAt,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(or(eq(chats.user1Id, userId), eq(chats.user2Id, userId)))
      .orderBy(desc(sql`COALESCE(${chats.lastMessageAt}, ${chats.createdAt})`))
      .limit(100);

    // Attach the other participant's name/image
    const result = [];
    for (const row of rows) {
      const otherId = row.user1Id === userId ? row.user2Id : row.user1Id;
      const other = await db
        .select({ id: user.id, name: user.name, image: user.image })
        .from(user)
        .where(eq(user.id, otherId))
        .limit(1);
      result.push({
        ...row,
        otherUserId: otherId,
        otherUserName: other[0]?.name ?? 'Utilizador',
        otherUserImage: other[0]?.image ?? null,
      });
    }

    return c.json({ chats: result });
  } catch (e: any) {
    return c.json({ chats: [], error: e.message }, 200);
  }
});

// Create or get existing chat between two users
chat.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { user1Id, user2Id } = body;
    if (!user1Id || !user2Id) return c.json({ error: 'user1Id and user2Id required' }, 400);

    const existing = await db
      .select()
      .from(chats)
      .where(
        or(
          and(eq(chats.user1Id, user1Id), eq(chats.user2Id, user2Id)),
          and(eq(chats.user1Id, user2Id), eq(chats.user2Id, user1Id)),
        ),
      )
      .limit(1);

    if (existing.length > 0) return c.json({ chat: existing[0] });

    const inserted = await db.insert(chats).values({ user1Id, user2Id }).returning();
    return c.json({ chat: inserted[0] }, 201);
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

    const rows = await db
      .select({
        id: messages.id,
        chatId: messages.chatId,
        senderId: messages.senderId,
        content: messages.content,
        imageUrl: messages.imageUrl,
        read: messages.read,
        createdAt: messages.createdAt,
        senderName: user.name,
        senderImage: user.image,
      })
      .from(messages)
      .leftJoin(user, eq(messages.senderId, user.id))
      .where(eq(messages.chatId, chatId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json({ messages: rows.reverse() });
  } catch (e: any) {
    return c.json({ messages: [], error: e.message }, 200);
  }
});

// Send a message
chat.post('/:chatId/messages', async (c) => {
  try {
    const { chatId } = c.req.param();
    const body = await c.req.json();
    const { senderId, content, imageUrl } = body;

    if (!senderId || (!content && !imageUrl)) {
      return c.json({ error: 'senderId and content required' }, 400);
    }

    const inserted = await db
      .insert(messages)
      .values({ chatId, senderId, content: content ?? null, imageUrl: imageUrl ?? null })
      .returning();

    await db
      .update(chats)
      .set({ lastMessage: content ?? '📷 Foto', lastMessageAt: new Date() })
      .where(eq(chats.id, chatId));

    return c.json({ message: inserted[0] }, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Mark messages as read
chat.patch('/:chatId/read', async (c) => {
  try {
    const { chatId } = c.req.param();
    const userId = c.req.header('x-user-id') || '';
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.chatId, chatId), sql`${messages.senderId} != ${userId}`));
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Delete a message
chat.delete('/:chatId/messages/:messageId', async (c) => {
  try {
    const { chatId, messageId } = c.req.param();
    const userId = c.req.header('x-user-id') || '';

    await db
      .delete(messages)
      .where(
        and(eq(messages.id, messageId), eq(messages.chatId, chatId), eq(messages.senderId, userId)),
      );

    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default chat;
