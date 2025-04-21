# agenda-contatos
Aplicativo de agenda de contatos com compromissos usando SvelteKit e Drizzle
Agenda de Contatos com Compromissos
Um aplicativo web completo para gerenciamento de contatos e agendamento de compromissos, construído com tecnologias modernas de desenvolvimento web.

SvelteKitPostgreSQLDockerTailwind CSS
📋 Funcionalidades
Gerenciamento completo de contatos (criar, visualizar, editar, excluir)
Agendamento de compromissos vinculados a contatos
Visualização em calendário ou lista de compromissos
Filtros por data, tipo e status de compromissos
Sistema de notificações para compromissos próximos
Interface responsiva para desktop e dispositivos móveis
🚀 Início Rápido com Docker
A maneira mais fácil de executar o aplicativo é usando Docker Compose:

git clone https://github.com/sandrolaudares/agenda-contatos-app.git
cd agenda-contatos-app
docker-compose up -d
O aplicativo estará disponível em http://localhost:3000.

⚙️ Instalação Manual
Pré-requisitos
Node.js (v16+)
PostgreSQL (v13+)
npm ou yarn
Passos
Clone o repositório:
git clone https://github.com/sandrolaudares/agenda-contatos-app.git
cd agenda-contatos-app
Instale as dependências:
npm install
# ou
yarn install
Configure o banco de dados:
Crie um arquivo .env na raiz do projeto:

DATABASE_URL=postgresql://usuario:senha@localhost:5432/agenda_contatos
# ou use a conexão fornecida
DATABASE_URL=postgresql://es2_owner:npg_Pn0TDGrESy9L@ep-flat-snowflake-acq6x5in-pooler.sa-east-1.aws.neon.tech/es2?sslmode=require
Execute as migrações do banco de dados:
npm run db:migrate
# ou
yarn db:migrate
Inicie o servidor de desenvolvimento:
npm run dev
# ou
yarn dev
O aplicativo estará disponível em http://localhost:5173 no modo de desenvolvimento.

🛠️ Tecnologias
Frontend: SvelteKit, TailwindCSS
Backend: SvelteKit (SSR), API endpoints
Banco de Dados: PostgreSQL
ORM: Drizzle
Containerização: Docker, Docker Compose
CI/CD: GitHub Actions
Testes: Vitest, Playwright
📊 Estrutura do Banco de Dados
O aplicativo utiliza duas tabelas principais:

Tabela de Contatos
CREATE TABLE contatos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT,
  telefone TEXT NOT NULL,
  email TEXT,
  endereco TEXT,
  notas TEXT,
  favorito BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT NOW()
);
Tabela de Compromissos
CREATE TABLE compromissos (
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
);
🧪 Testes
Execute os testes unitários e de integração:

npm run test
# ou
yarn test
Execute os testes end-to-end com Playwright:

npm run test:e2e
# ou
yarn test:e2e
🚢 Implantação
O aplicativo está configurado para implantação fácil em várias plataformas:

Vercel
npm install -g vercel
vercel login
vercel
Netlify
Conecte o repositório ao Netlify e configure as variáveis de ambiente.

📝 Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

👥 Contribuição
Contribuições são bem-vindas! Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.
