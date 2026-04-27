# Desafio Manole - API de Tarefas

**Monorepo** minimalista de gerenciamento de tarefas com Frontend (Next.js), Backend (NestJS), Autenticação JWT e Banco (PostgreSQL) em Docker.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│    NGINX Reverse Proxy (:80)            │
├─────────────────────────────────────────┤
│                                         │
│    /          →  Frontend (Next.js)    │
│    /api/*     →  Backend (NestJS)      │
│                                         │
└─────────────────────────────────────────┘
        ↓
    PostgreSQL 16
    (User + Task models)
```

## 🚀 Tecnologias

| Layer | Tech | Port |
|-------|------|------|
| **Frontend** | Next.js 16 + React 19 | 3000 (interno) |
| **Backend** | NestJS 11 + Prisma 7 + JWT | 3000 (interno) |
| **Database** | PostgreSQL 16 Alpine | 5432 (interno) |
| **Proxy** | Nginx Alpine | 80 (público) |

## 🐳 Quick Start

### Subir tudo com Docker Compose

```bash
docker-compose up -d
```

Aguarde ~30s para inicialização completa.

### Executar migrations do banco

```bash
docker-compose exec api npm run prisma:migrate
```

### Acessar

- **Frontend**: http://localhost/ (com login)
- **Backend API**: http://localhost/api/* (requer JWT)
- **Banco**: `psql -h localhost -U postgres`

### Parar

```bash
docker-compose down
```

## 🔐 Autenticação JWT

### Registro de novo usuário

Acesse http://localhost/, clique em "Register" e preencha:
- **Name**: Seu nome completo
- **Username**: Nome de usuário (único)
- **Password**: Senha

O frontend automaticamente:
1. Envia dados para `POST /api/auth/register`
2. Recebe JWT token
3. Armazena em localStorage
4. Redireciona para home

### Login

Clique em "Login" e preencha:
- **Username**: Nome de usuário
- **Password**: Senha

O frontend automáticamente:
1. Envia dados para `POST /api/auth/login`
2. Recebe JWT token
3. Armazena em localStorage
4. Redireciona para home com tarefas do usuário

### Logout

Clique no botão "Logout" que:
1. Remove token from localStorage
2. Redireciona para `/login`

## 🔧 Desenvolvimento Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate    # Gerar cliente Prisma
npm run prisma:migrate     # Criar/aplicar migrations
npm run start:dev          # Modo desenvolvimento
```

Backend roda em `http://localhost:3000` (local)

Com variáveis de ambiente:
```
DATABASE_URL=postgresql://...
JWT_SECRET=seu-secret-aqui
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost
```

### Frontend

```bash
cd frontend
npm install
# .env.local aponta para http://localhost:3000 em dev
npm run dev                # Modo desenvolvimento
```

Frontend roda em `http://localhost:3000` (local)

## 📚 Endpoints da API

### Tarefas CRUD

```http
# Listar
GET /api/tasks

# Criar
POST /api/tasks
{"title": "Título", "description": "Descrição"}

# Buscar por ID
GET /api/tasks/:id

# Atualizar (parcial)
PATCH /api/tasks/:id
{"status": "in_progress"}

# Deletar
DELETE /api/tasks/:id
```

## 📊 Task Schema

```typescript
interface Task {
  id: string                                    // CUID
  title: string                                 // min 3 chars
  description: string                           // min 3 chars
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: Date
  updatedAt: Date
}
```

## 📁 Estrutura

```
.
├── nginx.conf                # Configuração reverse proxy
├── docker-compose.yml        # Orquestração containers
├── SETUP.md                  # Guia detalhado
│
├── backend/
│   ├── src/
│   │   ├── tasks/           # Módulo CRUD
│   │   ├── prisma/          # Cliente Prisma gerado
│   │   ├── main.ts          # Entry point + CORS
│   │   └── app.module.ts    # Módulos
│   ├── prisma/
│   │   ├── schema.prisma    # Modelos DB
│   │   └── migrations/
│   ├── Dockerfile           # Build produção
│   ├── .env                 # Env vars
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   └── page.tsx         # Página principal
│   ├── components/          # React components
│   ├── hooks/
│   │   └── useTasks.ts      # Gerenciamento de estado
│   ├── services/
│   │   └── taskService.ts   # Cliente API (axios)
│   ├── types/
│   │   └── task.ts          # TypeScript types
│   ├── Dockerfile.dev       # Dev mode
│   ├── .env.local           # NEXT_PUBLIC_API_URL=/api
│   └── package.json
```

## 🧪 Testes

### Backend (E2E)

```bash
cd backend
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run build    # Testar build
npm run lint     # Lint check
```

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/tasks_db
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost,http://127.0.0.1
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=/api
```

## 🔍 Status da API

Verificar endpoints:

```bash
# Health check backend
curl http://localhost/api/health

# Ver tarefas
curl http://localhost/api/tasks

# Criar tarefa
curl -X POST http://localhost/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test"}'
```

## 🐛 Troubleshooting

### Nginx erro ao conectar

```bash
docker-compose logs nginx
docker-compose restart nginx
```

### Tarefas não carregam no frontend

```bash
# Verificar logs frontend
docker-compose logs frontend

# Verificar var de ambiente
docker-compose exec frontend env | grep API_URL
```

### Erro de conexão com BD

```bash
# Verificar se DB está ligado
docker-compose logs db

# Recriar volume
docker-compose down -v
docker-compose up -d
```

## 🚀 Deployment

### Docker Hub

```bash
docker build -t seu-usuario/tasks-backend ./backend
docker push seu-usuario/tasks-backend
```

### Vercel (Frontend)

```bash
vercel --prod
```

## 📖 Documentação Completa

Veja [SETUP.md](./SETUP.md) para guia detalhado de configuração.

## ✨ Features

✅ Frontend minimalista (5 componentes)
✅ Backend CRUD funcional
✅ Validação com class-validator
✅ CORS pré-configurado
✅ PostgreSQL persistente
✅ Hot reload em desenvolvimento
✅ Nginx reverse proxy
✅ Docker network isolado

## 📄 Licença

UNLICENSED

---

**Status**: 🟢 Operacional | Backend + Frontend + Nginx sincronizados

```

## 📝 Scripts Úteis

```bash
npm run build              # Compilar
npm run start:dev          # Dev (watch)
npm run prisma:migrate     # Migrations
npm run prisma:studio      # Visual BD
npm run lint               # Lint
npm run format             # Formatar
```

## 📄 Estrutura

```
backend/
├── src/
│   ├── tasks/              # Módulo CRUD
│   ├── prisma/             # Cliente Prisma
│   ├── prisma.service.ts   # Conexão
│   └── main.ts
├── prisma/
│   ├── schema.prisma       # Modelos
│   └── migrations/         # Migrations
└── Dockerfile
```

## ⚙️ Variáveis de Ambiente

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasks_db
PORT=3000
NODE_ENV=development
```

## 📖 Documentação

- [NestJS](https://docs.nestjs.com)
- [Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs)

---

**Status**: 🟢 API operacional | Frontend em progresso
