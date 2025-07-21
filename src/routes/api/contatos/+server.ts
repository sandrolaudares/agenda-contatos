import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { contatos } from '$lib/db/schema.js';
import { eq, like, or } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const busca = url.searchParams.get('busca');
    const favoritos = url.searchParams.get('favoritos');
    
    let query = db.select().from(contatos);
    
    if (busca) {
      query = query.where(
        or(
          like(contatos.nome, `%${busca}%`),
          like(contatos.sobrenome, `%${busca}%`),
          like(contatos.telefone, `%${busca}%`),
          like(contatos.email, `%${busca}%`)
        )
      );
    }
    
    if (favoritos === 'true') {
      query = query.where(eq(contatos.favorito, true));
    }
    
    const resultado = await query.execute();
    
    return json(resultado);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const dados = await request.json();
    
    // Validação básica
    if (!dados.nome || !dados.telefone) {
      return json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 });
    }
    
    const novoContato = await db.insert(contatos).values({
      nome: dados.nome,
      sobrenome: dados.sobrenome || null,
      telefone: dados.telefone,
      email: dados.email || null,
      endereco: dados.endereco || null,
      notas: dados.notas || null,
      favorito: dados.favorito || false
    }).returning();
    
    return json(novoContato[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};