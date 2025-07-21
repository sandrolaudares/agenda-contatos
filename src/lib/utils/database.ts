import { db } from '$lib/db/index.js';
import { contatos, compromissos } from '$lib/db/schema.js';

export async function initializeDatabase() {
  try {
    // Verificar se as tabelas existem tentando fazer uma consulta simples
    await db.select().from(contatos).limit(1);
    await db.select().from(compromissos).limit(1);
    console.log('✅ Database tables are ready');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

export async function seedDatabase() {
  try {
    // Verificar se já existem dados
    const existingContatos = await db.select().from(contatos).limit(1);
    if (existingContatos.length > 0) {
      console.log('📊 Database already has data, skipping seed');
      return;
    }

    // Dados de exemplo para contatos
    const contatosExemplo = [
      {
        nome: 'João',
        sobrenome: 'Silva',
        telefone: '(11) 99999-9999',
        email: 'joao.silva@email.com',
        endereco: 'Rua das Flores, 123, São Paulo, SP',
        notas: 'Contato da empresa XYZ',
        favorito: true
      },
      {
        nome: 'Maria',
        sobrenome: 'Santos',
        telefone: '(11) 88888-8888',
        email: 'maria.santos@email.com',
        endereco: 'Av. Principal, 456, São Paulo, SP',
        notas: 'Dentista recomendada',
        favorito: false
      },
      {
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        telefone: '(11) 77777-7777',
        email: 'pedro.oliveira@email.com',
        endereco: 'Rua do Comércio, 789, São Paulo, SP',
        notas: 'Fornecedor de equipamentos',
        favorito: true
      }
    ];

    // Inserir contatos de exemplo
    const contatosInseridos = await db.insert(contatos).values(contatosExemplo).returning();
    console.log(`✅ Inserted ${contatosInseridos.length} example contacts`);

    // Dados de exemplo para compromissos
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const proximaSemana = new Date(hoje);
    proximaSemana.setDate(hoje.getDate() + 7);

    const compromissosExemplo = [
      {
        contatoId: contatosInseridos[0].id,
        titulo: 'Reunião de Trabalho',
        descricao: 'Discussão sobre o projeto Q3',
        data: hoje.toISOString().split('T')[0],
        hora: '14:00',
        local: 'Escritório Central',
        tipo: 'trabalho',
        concluido: false
      },
      {
        contatoId: contatosInseridos[1].id,
        titulo: 'Consulta Dentária',
        descricao: 'Limpeza e check-up regular',
        data: amanha.toISOString().split('T')[0],
        hora: '10:30',
        local: 'Clínica Odontológica',
        tipo: 'saude',
        concluido: false
      },
      {
        contatoId: contatosInseridos[2].id,
        titulo: 'Entrega de Equipamentos',
        descricao: 'Recebimento dos novos computadores',
        data: proximaSemana.toISOString().split('T')[0],
        hora: '09:00',
        local: 'Empresa',
        tipo: 'trabalho',
        concluido: false
      }
    ];

    // Inserir compromissos de exemplo
    const compromissosInseridos = await db.insert(compromissos).values(compromissosExemplo).returning();
    console.log(`✅ Inserted ${compromissosInseridos.length} example appointments`);

    console.log('🌱 Database seeded successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}