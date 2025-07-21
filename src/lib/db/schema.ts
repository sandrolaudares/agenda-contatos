import { pgTable, serial, text, boolean, timestamp, integer, date, time } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const contatos = pgTable('contatos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  sobrenome: text('sobrenome'),
  telefone: text('telefone').notNull(),
  email: text('email'),
  endereco: text('endereco'),
  notas: text('notas'),
  favorito: boolean('favorito').default(false),
  criadoEm: timestamp('criado_em').defaultNow()
});

export const compromissos = pgTable('compromissos', {
  id: serial('id').primaryKey(),
  contatoId: integer('contato_id').references(() => contatos.id, { onDelete: 'cascade' }),
  titulo: text('titulo').notNull(),
  descricao: text('descricao'),
  data: date('data').notNull(),
  hora: time('hora').notNull(),
  local: text('local'),
  tipo: text('tipo').default('outro'),
  concluido: boolean('concluido').default(false),
  criadoEm: timestamp('criado_em').defaultNow()
});

// Definindo as relações
export const contatosRelations = relations(contatos, ({ many }) => ({
  compromissos: many(compromissos)
}));

export const compromissosRelations = relations(compromissos, ({ one }) => ({
  contato: one(contatos, {
    fields: [compromissos.contatoId],
    references: [contatos.id]
  })
}));

export type Contato = typeof contatos.$inferSelect;
export type NovoContato = typeof contatos.$inferInsert;
export type Compromisso = typeof compromissos.$inferSelect;
export type NovoCompromisso = typeof compromissos.$inferInsert;