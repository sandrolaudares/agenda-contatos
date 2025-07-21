import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { contatos } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const contatoId = parseInt(params.id);
    
    if (isNaN(contatoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const contato = await db.select().from(contatos).where(eq(contatos.id, contatoId)).execute();
    
    if (contato.length === 0) {
      return json({ error: 'Contato não encontrado' }, { status: 404 });
    }
    
    return json(contato[0]);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const contatoId = parseInt(params.id);
    
    if (isNaN(contatoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const dados = await request.json();
    
    // Validação básica
    if (!dados.nome || !dados.telefone) {
      return json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 });
    }
    
    const contatoAtualizado = await db.update(contatos)
      .set({
        nome: dados.nome,
        sobrenome: dados.sobrenome || null,
        telefone: dados.telefone,
        email: dados.email || null,
        endereco: dados.endereco || null,
        notas: dados.notas || null,
        favorito: dados.favorito || false
      })
      .where(eq(contatos.id, contatoId))
      .returning();
    
    if (contatoAtualizado.length === 0) {
      return json({ error: 'Contato não encontrado' }, { status: 404 });
    }
    
    return json(contatoAtualizado[0]);
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const contatoId = parseInt(params.id);
    
    if (isNaN(contatoId)) {
      return json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const contatoRemovido = await db.delete(contatos)
      .where(eq(contatos.id, contatoId))
      .returning();
    
    if (contatoRemovido.length === 0) {
      return json({ error: 'Contato não encontrado' }, { status: 404 });
    }
    
    return json({ message: 'Contato removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover contato:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};