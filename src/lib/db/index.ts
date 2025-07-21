import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from './schema.js';

config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/agenda_contatos';

// Para produção, desabilite prepared statements para edge functions
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });