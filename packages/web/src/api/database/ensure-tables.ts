import { sqlClient } from "./index";

/**
 * Cria as tabelas novas se não existirem. Corre no arranque do servidor.
 * Necessário porque o projecto não tem migrações automáticas — sem isto,
 * qualquer tabela nova falha em produção.
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    main_code TEXT NOT NULL UNIQUE,
    partner_benefit TEXT NOT NULL DEFAULT 'lifetime',
    active INTEGER DEFAULT 1,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS partner_codes (
    id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL DEFAULT 'referral',
    benefit TEXT NOT NULL DEFAULT 'discount',
    max_uses INTEGER,
    uses INTEGER NOT NULL DEFAULT 0,
    label TEXT,
    active INTEGER DEFAULT 1,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS code_redemptions (
    id TEXT PRIMARY KEY,
    code_id TEXT NOT NULL,
    code TEXT NOT NULL,
    partner_id TEXT,
    user_id TEXT NOT NULL,
    user_email TEXT,
    benefit TEXT,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pet_id TEXT,
    title TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'medication',
    dosage TEXT,
    notes TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    times TEXT NOT NULL DEFAULT '[]',
    frequency TEXT NOT NULL DEFAULT 'daily',
    interval_days INTEGER,
    active INTEGER DEFAULT 1,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS reminder_logs (
    id TEXT PRIMARY KEY,
    reminder_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    due_at TEXT NOT NULL,
    done_at INTEGER,
    skipped INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS pet_scans (
    id TEXT PRIMARY KEY,
    pet_id TEXT NOT NULL,
    lat REAL,
    lng REAL,
    accuracy REAL,
    address TEXT,
    finder_name TEXT,
    finder_phone TEXT,
    message TEXT,
    user_agent TEXT,
    created_at INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS idx_partner_codes_partner ON partner_codes(partner_id)`,
  `CREATE INDEX IF NOT EXISTS idx_redemptions_partner ON code_redemptions(partner_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_scans_pet ON pet_scans(pet_id)`,
];

let done = false;

export async function ensureTables() {
  if (done) return;
  done = true;
  for (const sql of STATEMENTS) {
    try {
      await sqlClient.execute(sql);
    } catch (e: any) {
      console.error("[ensureTables] falhou:", e?.message, sql.slice(0, 60));
    }
  }
  console.log("[ensureTables] tabelas verificadas");
}
