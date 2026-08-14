import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

// Pets
export const pets = sqliteTable("pets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  species: text("species").notNull(), // dog, cat, bird, etc.
  breed: text("breed"),
  gender: text("gender"), // male, female
  birthDate: text("birth_date"),
  weight: real("weight"),
  color: text("color"),
  microchip: text("microchip"),
  photoUrl: text("photo_url"),
  allergies: text("allergies"), // JSON array
  diet: text("diet"),
  notes: text("notes"),
  qrCode: text("qr_code"),
  isLost: integer("is_lost", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Vaccines
export const vaccines = sqliteTable("vaccines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  nextDate: text("next_date"),
  veterinarian: text("veterinarian"),
  clinic: text("clinic"),
  batch: text("batch"),
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Appointments
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // consulta, vacina, exame, outro
  date: text("date").notNull(),
  time: text("time"),
  veterinarian: text("veterinarian"),
  clinic: text("clinic"),
  address: text("address"),
  notes: text("notes"),
  status: text("status").default("pending"), // pending, done, cancelled
  reminderSent: integer("reminder_sent", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Health Logs
export const healthLogs = sqliteTable("health_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // sintoma, comportamento, peso, alimentacao, medicacao, outro
  title: text("title").notNull(),
  description: text("description"),
  value: text("value"), // e.g. peso em kg
  documentUrl: text("document_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Photos / Album
export const photos = sqliteTable("photos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  isMemory: integer("is_memory", { mode: "boolean" }).default(false),
  date: text("date"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Documents (receitas, cadernetas, etc.)
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // receita, caderneta, exame, outro
  title: text("title").notNull(),
  url: text("url").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Social Posts
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  petId: text("pet_id"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Post Likes
export const postLikes = sqliteTable("post_likes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Post Comments
export const postComments = sqliteTable("post_comments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Chats
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user1Id: text("user1_id").notNull(),
  user2Id: text("user2_id").notNull(),
  lastMessage: text("last_message"),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Messages
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text("chat_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Marketplace Listings
export const listings = sqliteTable("listings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category").notNull(), // alimentacao, brinquedos, acessorios, servicos, outro
  condition: text("condition"), // novo, usado
  imageUrl: text("image_url"),
  location: text("location"),
  contact: text("contact"),
  status: text("status").default("active"), // active, sold, inactive
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Business Profiles (clínicas, petshops, serviços)
export const businesses = sqliteTable("businesses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // clinica, petshop, tosquiador, hotel, treino, outro
  description: text("description"),
  logoUrl: text("logo_url"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  schedule: text("schedule"), // JSON: { seg: "9-18", ter: "9-18", ... }
  services: text("services"), // JSON array: [{ name, price, duration }]
  bookingUrl: text("booking_url"),
  bookingPhone: text("booking_phone"),
  averageRating: real("average_rating").default(0),
  reviewsCount: integer("reviews_count").default(0),
  status: text("status").default("active"), // active, inactive
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Business Reviews
export const businessReviews = sqliteTable("business_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text("business_id").notNull(),
  userId: text("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Subscriptions
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique(),
  plan: text("plan").notNull(), // trial, monthly, annual
  status: text("status").notNull(), // active, expired, cancelled
  trialEndsAt: integer("trial_ends_at", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  googlePurchaseToken: text("google_purchase_token"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Vet Consultations (video calls)
export const consultations = sqliteTable("consultations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  petId: text("pet_id"),
  vetName: text("vet_name"),
  vetEmail: text("vet_email"),
  specialty: text("specialty"), // geral, dermatologia, ortopedia, oncologia, comportamento, outro
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  duration: integer("duration").default(30), // minutes
  status: text("status").default("pending"), // pending, confirmed, ongoing, done, cancelled
  roomUrl: text("room_url"), // Whereby/Daily.co room URL
  roomName: text("room_name"),
  notes: text("notes"),
  price: real("price"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Deworming
export const dewormings = sqliteTable("dewormings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  product: text("product").notNull(),
  date: text("date").notNull(),
  nextDate: text("next_date"),
  type: text("type").default("internal"), // internal, external, both
  veterinarian: text("veterinarian"),
  notes: text("notes"),
  documentUrl: text("document_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Weight Logs
export const weightLogs = sqliteTable("weight_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  userId: text("user_id").notNull(),
  weight: real("weight").notNull(), // kg
  date: text("date").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Promo Codes (acesso vitalício gratuito)
export const promoCodes = sqliteTable("promo_codes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  description: text("description"), // ex: "Influencer João", "Familiar Maria"
  usedByUserId: text("used_by_user_id"),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Blog/Tips Articles
export const articles = sqliteTable("articles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // saude, nutricao, comportamento, curiosidades
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============ PARCEIROS / AFILIADOS ============
// Um parceiro (ex: influencer) recebe UM código principal, e pode distribuir
// códigos-filhos aos seguidores. Assim sabemos quanto cada parceiro trouxe.
export const partners = sqliteTable("partners", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),               // "Influencer João"
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  mainCode: text("main_code").notNull().unique(), // código do próprio parceiro
  // benefício que o PRÓPRIO parceiro recebe ao resgatar o mainCode
  partnerBenefit: text("partner_benefit").notNull().default("lifetime"), // lifetime | year1 | months3 | none
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Códigos que o parceiro distribui (ou o código principal dele)
export const partnerCodes = sqliteTable("partner_codes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  partnerId: text("partner_id").notNull(),
  code: text("code").notNull().unique(),
  kind: text("kind").notNull().default("referral"), // main | referral
  // benefício de quem resgata: lifetime | year1 | months3 | discount | none
  benefit: text("benefit").notNull().default("discount"),
  maxUses: integer("max_uses"),        // null = ilimitado
  uses: integer("uses").notNull().default(0),
  label: text("label"),                // nome/nota para identificar (ex: "story out/26")
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Cada resgate individual — base do relatório de desempenho
export const codeRedemptions = sqliteTable("code_redemptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  codeId: text("code_id").notNull(),
  code: text("code").notNull(),
  partnerId: text("partner_id"),
  userId: text("user_id").notNull(),
  userEmail: text("user_email"),
  benefit: text("benefit"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============ LEMBRETES (medicação, tratamentos, geral) ============
export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  petId: text("pet_id"),
  title: text("title").notNull(),
  kind: text("kind").notNull().default("medication"), // medication | treatment | vaccine | appointment | other
  dosage: text("dosage"),              // "1 comprimido", "5ml"
  notes: text("notes"),
  startDate: text("start_date").notNull(),   // YYYY-MM-DD
  endDate: text("end_date"),                 // null = sem fim
  times: text("times").notNull().default("[]"), // JSON: ["08:00","20:00"]
  frequency: text("frequency").notNull().default("daily"), // daily | weekly | monthly | once | interval
  intervalDays: integer("interval_days"),     // usado quando frequency=interval
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Registo de doses dadas / marcadas como feitas
export const reminderLogs = sqliteTable("reminder_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  reminderId: text("reminder_id").notNull(),
  userId: text("user_id").notNull(),
  dueAt: text("due_at").notNull(),    // "2026-08-14 08:00"
  doneAt: integer("done_at", { mode: "timestamp" }),
  skipped: integer("skipped", { mode: "boolean" }).default(false),
});

// ============ QR CODE: localização de quem encontrou ============
export const petScans = sqliteTable("pet_scans", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  petId: text("pet_id").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  accuracy: real("accuracy"),
  address: text("address"),
  finderName: text("finder_name"),
  finderPhone: text("finder_phone"),
  message: text("message"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
