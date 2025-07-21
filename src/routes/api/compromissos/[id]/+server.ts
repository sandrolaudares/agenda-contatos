import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { compromissos, contatos } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const compromissoId = parseInt(params.id);
    
    if (isNaN(compromissoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const compromisso = await db.select({
      id: compromissos.id,
      titulo: compromissos.titulo,
      descricao: compromissos.descricao,
      data: compromissos.data,
      hora: compromissos.hora,
      local: compromissos.local,
      tipo: compromissos.tipo,
      concluido: compromissos.concluido,
      criadoEm: compromissos.criadoEm,
      contatoId: compromissos.contatoId,
      contato: {
        nome: contatos.nome,
        sobrenome: contatos.sobrenome,
        telefone: contatos.telefone,
        email: contatos.email
      }
    }).from(compromissos)
      .leftJoin(contatos, eq(compromissos.contatoId, contatos.id))
      .where(eq(compromissos.id, compromissoId))
      .execute();
    
    if (compromisso.length === 0) {
      return json({ error: 'Compromisso não encontrado' }, { status: 404 });
    }
    
    return json(compromisso[0]);
  } catch (error) {
    console.error('Erro ao buscar compromisso:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const compromissoId = parseInt(params.id);
    
    if (isNaN(compromissoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const dados = await request.json();
    
    // Validação básica
    if (!dados.titulo || !dados.data || !dados.hora) {
      return json({ error: 'Título, data e hora são obrigatórios' }, { status: 400 });
    }
    
    const compromissoAtualizado = await db.update(compromissos)
      .set({
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        data: dados.data,
        hora: dados.hora,
        local: dados.local || null,
        tipo: dados.tipo || 'outro',
        concluido: dados.concluido || false,
        contatoId: dados.contatoId || null
      })
      .where(eq(compromissos.id, compromissoId))
      .returning();
    
    if (compromissoAtualizado.length === 0) {
      return json({ error: 'Compromisso não encontrado' }, { status: 404 });
    }
    
    return json(compromissoAtualizado[0]);
  } catch (error) {
    console.error('Erro ao atualizar compromisso:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const compromissoId = parseInt(params.id);
    
    if (isNaN(compromissoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const compromissoRemovido = await db.delete(compromissos)
      .where(eq(compromissos.id, compromissoId))
      .returning();
    
    if (compromissoRemovido.length === 0) {
      return json({ error: 'Compromisso não encontrado' }, { status: 404 });
    }
    
    return json({ message: 'Compromisso removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover compromisso:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};