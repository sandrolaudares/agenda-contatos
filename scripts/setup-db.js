import { config } from 'dotenv';
import postgres from 'postgres';

config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/agenda_contatos';

async function setupDatabase() {
  console.log('🚀 Setting up database...');
  
  try {
    // Parse connection string to get database name
    const url = new URL(connectionString);
    const dbName = url.pathname.slice(1); // Remove leading slash
    
    // Connect to postgres (default database) to create our database
    const adminUrl = connectionString.replace(`/${dbName}`, '/postgres');
    const adminClient = postgres(adminUrl, { prepare: false });
    
    try {
      // Check if database exists
      const result = await adminClient`
        SELECT 1 FROM pg_database WHERE datname = ${dbName}
      `;
      
      if (result.length === 0) {
        console.log(`📦 Creating database: ${dbName}`);
        await adminClient`CREATE DATABASE ${dbName}`;
        console.log('✅ Database created successfully');
      } else {
        console.log('📦 Database already exists');
      }
    } finally {
      await adminClient.end();
    }
    
    // Now connect to our database to create tables
    const client = postgres(connectionString, { prepare: false });
    
    try {
      console.log('📋 Creating tables...');
      
      // Create contatos table
      await client`
        CREATE TABLE IF NOT EXISTS contatos (
          id SERIAL PRIMARY KEY,
          nome TEXT NOT NULL,
          sobrenome TEXT,
          telefone TEXT NOT NULL,
          email TEXT,
          endereco TEXT,
          notas TEXT,
          favorito BOOLEAN DEFAULT false,
          criado_em TIMESTAMP DEFAULT NOW()
        )
      `;
      
      // Create compromissos table
      await client`
        CREATE TABLE IF NOT EXISTS compromissos (
          id SERIAL PRIMARY KEY,
          contato_id INTEGER REFERENCES contatos(id) ON DELETE CASCADE,
          titulo TEXT NOT NULL,
          descricao TEXT,
          data DATE NOT NULL,
          hora TIME NOT NULL,
          local TEXT,
          tipo TEXT DEFAULT 'outro',
          concluido BOOLEAN DEFAULT false,
          criado_em TIMESTAMP DEFAULT NOW()
        )
      `;
      
      console.log('✅ Tables created successfully');
      
      // Create indexes for better performance
      await client`CREATE INDEX IF NOT EXISTS idx_contatos_nome ON contatos(nome)`;
      await client`CREATE INDEX IF NOT EXISTS idx_contatos_telefone ON contatos(telefone)`;
      await client`CREATE INDEX IF NOT EXISTS idx_compromissos_data ON compromissos(data)`;
      await client`CREATE INDEX IF NOT EXISTS idx_compromissos_contato_id ON compromissos(contato_id)`;
      
      console.log('✅ Indexes created successfully');
      
    } finally {
      await client.end();
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();