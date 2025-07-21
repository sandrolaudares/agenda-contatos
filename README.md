# 📞 Agenda de Contatos

Aplicativo de agenda de contatos com compromissos usando **SvelteKit**, **PostgreSQL** e **Drizzle ORM**.

Um aplicativo web completo para gerenciamento de contatos e agendamento de compromissos, construído com tecnologias modernas de desenvolvimento web.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Funcionalidades

- ✅ **Gerenciamento completo de contatos** (criar, visualizar, editar, excluir)
- 📅 **Agendamento de compromissos** vinculados a contatos
- 🔍 **Busca e filtros** por nome, telefone, email
- 📊 **Dashboard** com estatísticas e visão geral
- ⭐ **Sistema de favoritos** para contatos importantes
- 🏷️ **Categorização** de compromissos por tipo
- 📱 **Interface responsiva** para desktop e dispositivos móveis
- 🎨 **Design moderno** com Tailwind CSS

## 🚀 Início Rápido com Docker

A maneira mais fácil de executar o aplicativo é usando Docker Compose:

```bash
git clone <repository-url>
cd agenda-contatos
docker-compose up -d
```

O aplicativo estará disponível em http://localhost:3000.

## ⚙️ Instalação Manual

### Pré-requisitos

- 📦 **Node.js** (v18+)
- 🐘 **PostgreSQL** (v13+)
- 📋 **npm** ou **yarn**

### Configuração Rápida

Para uma configuração automática, execute:

```bash
git clone <repository-url>
cd agenda-contatos
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

### Configuração Manual

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd agenda-contatos
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o banco de dados:**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/agenda_contatos
   ```

4. **Configure o banco de dados:**
   ```bash
   # Criar tabelas do banco de dados
   npm run db:setup
   
   # Inserir dados de exemplo (opcional)
   npm run db:seed
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

O aplicativo estará disponível em http://localhost:5173 no modo de desenvolvimento.

## 🛠️ Tecnologias

- **Frontend:** SvelteKit, TailwindCSS
- **Backend:** SvelteKit (SSR), API endpoints
- **Banco de Dados:** PostgreSQL
- **ORM:** Drizzle
- **Containerização:** Docker, Docker Compose
- **Testes:** Vitest, Playwright
- **Tipagem:** TypeScript

## 🔌 API Endpoints

### Contatos
- `GET /api/contatos` - Lista todos os contatos
  - Query params: `busca`, `favoritos`
- `POST /api/contatos` - Cria um novo contato
- `GET /api/contatos/[id]` - Busca contato por ID
- `PUT /api/contatos/[id]` - Atualiza contato
- `DELETE /api/contatos/[id]` - Remove contato

### Compromissos
- `GET /api/compromissos` - Lista todos os compromissos
  - Query params: `dataInicio`, `dataFim`, `tipo`, `concluido`, `contatoId`
- `POST /api/compromissos` - Cria um novo compromisso
- `GET /api/compromissos/[id]` - Busca compromisso por ID
- `PUT /api/compromissos/[id]` - Atualiza compromisso
- `DELETE /api/compromissos/[id]` - Remove compromisso

## 📊 Estrutura do Banco de Dados
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
