# Guia de Execução - Monorepo Tasks

## 📋 Arquitetura

```
┌─────────────────────────────────────────────┐
│         NGINX (Reverse Proxy)               │
│              :80                            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────┐     ┌────────────────┐ │
│  │   Frontend     │     │   Backend      │ │
│  │  (Next.js)     │     │  (NestJS.js)   │ │
│  │  :3000 /       │     │  :3000 /api    │ │
│  └────────────────┘     └────────────────┘ │
│         ↓                      ↓            │
│         └──────────────────────┘            │
│              PostgreSQL                    │
│              :5432                         │
└─────────────────────────────────────────────┘

Acesso:
  Frontend: http://localhost/
  Backend:  http://localhost/api/*
  BD:       localhost:5432 (apenas interno)
```

## 🚀 Quick Start com Docker Compose

### 1. Preparar ambiente

```bash
cd root/

# Copiar arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Subir tudo (com Nginx)

```bash
docker-compose up -d
```

### 3. Aguardar inicialização (30-40s)

```bash
docker-compose ps
```

Todos os containers devem estar em "Up":
- tasks_db ✓
- tasks_api ✓
- tasks_frontend ✓
- tasks_nginx ✓

### 4. Executar migrations

```bash
docker-compose exec api npm run prisma:migrate
```

### 5. Acessar

- **Frontend**: http://localhost/
- **Backend API**: http://localhost/api (com JWT requerido)
- **BD (psql)**: `psql -h localhost -U postgres`

## 🔐 Autenticação JWT

### Endpoints Públicos (sem autenticação)

```bash
# Registrar novo usuário
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "username": "joao",
  "password": "senha123"
}

# Response:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "cl...",
    "username": "joao",
    "name": "João Silva"
  }
}
```

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "username": "joao",
  "password": "senha123"
}

# Response:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "cl...",
    "username": "joao"
  }
}
```

### Endpoints Protegidos (requerem JWT)

Todos os endpoints de tarefas e profile requerem autenticação:

```bash
# Adicionar token ao header
Authorization: Bearer <access_token>

# Exemplo:
GET /api/tasks
Authorization: Bearer eyJhbGc...
```

#### Tasks (requerem autenticação)

```bash
# Listar tarefas do usuário autenticado
GET /api/tasks
Authorization: Bearer <token>

# Criar tarefa
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implementar login",
  "description": "Adicionar autenticação JWT"
}

# Atualizar tarefa
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}

# Deletar tarefa
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Perfil do usuário

```bash
# Obter perfil do usuário autenticado
GET /api/users/profile
Authorization: Bearer <token>
```

### Configuração no Frontend

O frontend armazena automaticamente o token em `localStorage` após login/registro:

```javascript
// services/taskService.ts
const authService = {
  async login(username, password) { ... },
  async register(name, username, password) { ... },
  setToken(token) { ... },  // Salva em localStorage
  getToken() { ... },       // Recupera de localStorage
  logout() { ... }          // Remove token
};
```

Todos os requests de tarefas incluem automaticamente o token:

```javascript
// O interceptor adiciona automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Fluxo de autenticação

1. User acessa `/login`
2. Preenche form com nome/usuário/senha
3. Frontend chama `POST /api/auth/register` ou `POST /api/auth/login`
4. Backend valida credenciais e retorna JWT token
5. Frontend armazena token em localStorage
6. Frontend redireciona para `/` (home)
7. Home carrega com token no header `Authorization: Bearer <token>`
8. Backend valida JWT e retorna tarefas do usuário autenticado
9. User clica logout
10. Frontend remove token de localStorage e redireciona para `/login`

## 🧪 Teste de Conexão

### Frontend → Backend

```bash
# Frontend faz requisição (via browser)
curl http://localhost/api/tasks
# ❌ Erro 401: Unauthorized (esperado sem token)

# Com token:
curl -H "Authorization: Bearer eyJhbGc..." \
     http://localhost/api/tasks
# ✓ Retorna tarefas do usuário
```

### Backend CORS

```bash
# Backend aceita requests do frontend
curl -H "Origin: http://localhost" \
     http://localhost/api/tasks
```

## 🐛 Troubleshooting

### "Request failed with status code 401"

**Causa**: Token ausente ou inválido

```bash
# Verificar se token existe em localStorage
localStorage.getItem('token')

# Se vazio, fazer login novamente
```

### "Unauthorized" ao acessar tarefas

**Causa**: JWT expirado ou inválido

```bash
# Token expira em 24 horas (configurável em auth.module.ts)
# Solução: Fazer login novamente
```

### "Invalid credentials"

**Causa**: Usuário/senha incorretos

```bash
# Verificar nome de usuário e senha
# Criar novo usuário no registro se necessário
```

### Nginx não resolve

```bash
# Verificar logs
docker-compose logs nginx

# Reiniciar
docker-compose restart nginx
```

### Frontend não conecta ao backend

```bash
# Verificar configuração NEXT_PUBLIC_API_URL
docker-compose exec frontend env | grep API

# Deve mostrar: NEXT_PUBLIC_API_URL=/api
```

### Backend retorna erro CORS

```bash
# Verificar CORS_ORIGIN
docker-compose exec api env | grep CORS

# Deve incluir localhost
```

### Limpar tudo e começar

```bash
docker-compose down -v
docker-compose up -d --build

# Após inicializar
docker-compose exec api npm run prisma:migrate
```

## 📝 Estrutura de Pastas

```
root/
├── nginx.conf                 # Config reverse proxy
├── docker-compose.yml         # Orquestração
│
├── backend/
│   ├── Dockerfile             # Build produção
│   ├── .env                   # Env vars (DB, CORS, JWT_SECRET)
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma      # User + Task models
│   └── src/
│       ├── auth/              # JWT, Login, Register
│       ├── users/             # User profile
│       ├── tasks/             # CRUD tarefas
│       └── common/            # Constants, JWT decorator
│
├── frontend/
│   ├── Dockerfile.dev         # Build desenvolvimento
│   ├── .env.local             # NEXT_PUBLIC_API_URL=/api
│   ├── .env.example
│   ├── app/
│   │   ├── page.tsx           # Home (tarefas)
│   │   └── login/page.tsx     # Login/Register
│   ├── components/            # TaskForm, TaskList, etc
│   ├── hooks/                 # useTasks
│   ├── services/              # taskService, authService
│   └── types/                 # Task interface
```

## 🔄 Fluxo de Requisição

1. Browser acessa `http://localhost/`
2. Nginx redireciona para frontend ✓
3. Frontend verifica token em localStorage
4. Se não existe → redireciona para `/login`
5. User faz login/registro
6. Backend valida credenciais, gera JWT token
7. Frontend armazena token e redireciona para home
8. Home carrega e envia `GET /api/tasks` com token
9. Nginx intercepta e mapeia para `GET /tasks` no backend
10. JwtGuard valida token extraindo userId
11. TasksController filtra tarefas do usuário autenticado
12. Backend retorna JSON com tarefas
13. Frontend atualiza UI com tarefas

## 🛠️ Manutenção

### Ver logs em tempo real

```bash
# Frontend
docker-compose logs -f frontend

# Backend
docker-compose logs -f api

# Nginx
docker-compose logs -f nginx

# Banco
docker-compose logs -f db
```

### Executar prisma commands

```bash
# Criar/aplicar migrations
docker-compose exec api npm run prisma:migrate

# Abrir Prisma Studio (web UI)
docker-compose exec api npm run prisma:studio

# Gerar Prisma Client
docker-compose exec api npm run prisma:generate
```

### Resetar banco de dados

```bash
# ⚠️ CUIDADO: Remove todos os dados!
docker-compose exec api npm run prisma:reset

# Depois execute migrations automaticamente
docker-compose exec api npm run prisma:migrate
```

### Rebuild containers

```bash
# Rebuild após mudar Dockerfile ou dependências
docker-compose up -d --build

# Re-aplicar migrations
docker-compose exec api npm run prisma:migrate
```

## 🔒 Segurança

### JWT Secret

Configurado em `backend/.env`:

```
JWT_SECRET=seu-secret-muito-seguro-aqui
JWT_EXPIRATION=24h
```

### Passwords

Senhas são hasheadas com bcrypt (10 salt rounds) no banco:

```
user.password: $2b$10$... (bcrypt hash)
```

### CORS

Configurado para localhost em `backend/src/app.module.ts`:

```typescript
CorsModule.register({
  origin: 'http://localhost',
})
```

## 📊 Base de Dados

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  username  String   @unique
  password  String   (bcrypt hash)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]   (relations)
}
```

### Task Model

```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String
  status      TaskStatus @default(pending)  # pending | in_progress | completed
  userId      String     (foreign key)
  user        User       (relation)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

## 📱 Endpoints

### Public (sem autenticação)

```
POST   /auth/register          # Criar novo usuário
POST   /auth/login             # Fazer login
```

### Protected (requer JWT)

```
GET    /users/profile          # Perfil do usuário
GET    /tasks                  # Listar tarefas
POST   /tasks                  # Criar tarefa
GET    /tasks/:id              # Obter tarefa
PATCH  /tasks/:id              # Atualizar tarefa
DELETE /tasks/:id              # Deletar tarefa
```

## ✅ Checklist de Deploy

- [ ] Copiar arquivos `.env.example` para `.env`
- [ ] Configurar `JWT_SECRET` seguro em `backend/.env`
- [ ] Executar `docker-compose up -d`
- [ ] Aguardar 30-40s para inicialização
- [ ] Executar `docker-compose exec api npm run prisma:migrate`
- [ ] Acessar `http://localhost` no browser
- [ ] Registrar novo usuário
- [ ] Criar tarefa de teste
- [ ] Fazer logout e novo login
- [ ] Verificar tarefas persistem

---

**Última atualização**: Adicionado suporte completo a JWT com registro/login e tarefas por usuário.
