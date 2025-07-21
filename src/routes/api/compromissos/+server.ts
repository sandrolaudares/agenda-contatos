import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { compromissos, contatos } from '$lib/db/schema.js';
import { eq, gte, lte, and, like } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const dataInicio = url.searchParams.get('dataInicio');
    const dataFim = url.searchParams.get('dataFim');
    const tipo = url.searchParams.get('tipo');
    const concluido = url.searchParams.get('concluido');
    const contatoId = url.searchParams.get('contatoId');
    
    let query = db.select({
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
    }).from(compromissos).leftJoin(contatos, eq(compromissos.contatoId, contatos.id));
    
    const conditions = [];
    
    if (dataInicio) {
      conditions.push(gte(compromissos.data, dataInicio));
    }
    
    if (dataFim) {
      conditions.push(lte(compromissos.data, dataFim));
    }
    
    if (tipo) {
      conditions.push(eq(compromissos.tipo, tipo));
    }
    
    if (concluido !== null && concluido !== undefined) {
      conditions.push(eq(compromissos.concluido, concluido === 'true'));
    }
    
    if (contatoId) {
      const contatoIdInt = parseInt(contatoId);
      if (!isNaN(contatoIdInt)) {
        conditions.push(eq(compromissos.contatoId, contatoIdInt));
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const resultado = await query.execute();
    
    return json(resultado);
  } catch (error) {
    console.error('Erro ao buscar compromissos:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const dados = await request.json();
    
    // Validação básica
    if (!dados.titulo || !dados.data || !dados.hora) {
      return json({ error: 'Título, data e hora são obrigatórios' }, { status: 400 });
    }
    
    const novoCompromisso = await db.insert(compromissos).values({
      titulo: dados.titulo,
      descricao: dados.descricao || null,
      data: dados.data,
      hora: dados.hora,
      local: dados.local || null,
      tipo: dados.tipo || 'outro',
      concluido: dados.concluido || false,
      contatoId: dados.contatoId || null
    }).returning();
    
    return json(novoCompromisso[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar compromisso:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};