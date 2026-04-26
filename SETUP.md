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

### 1. Subir tudo (com Nginx)

```bash
cd root/
docker-compose up -d
```

### 2. Aguardar inicialização (30-40s)

```bash
docker-compose ps
```

Todos os containers devem estar em "Up":
- tasks_db ✓
- tasks_api ✓
- tasks_frontend ✓
- tasks_nginx ✓

### 3. Acessar

- **Frontend**: http://localhost/
- **Backend API**: http://localhost/api/tasks
- **BD (psql)**: `psql -h localhost -U postgres`

## 🧪 Teste de Conexão

### Frontend → Backend

```bash
# Frontend faz requisição
curl http://localhost/api/tasks
```

### Backend CORS

```bash
# Backend aceita requets do frontend
curl -H "Origin: http://localhost" \
     http://localhost/api/tasks
```

## 🐛 Troubleshooting

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
```

## 📝 Estrutura de Pastas

```
root/
├── nginx.conf                 # Config reverse proxy
├── docker-compose.yml         # Orquestração
│
├── backend/
│   ├── Dockerfile             # Build produção
│   ├── .env                   # Env vars (DB, CORS)
│   └── .env.example
│
├── frontend/
│   ├── Dockerfile.dev         # Build desenvolvimento
│   ├── .env.local             # NEXT_PUBLIC_API_URL=/api
│   └── .env.example
```

## 🔄 Fluxo de Requisição

1. Browser faz `GET /api/tasks`
2. Nginx intercepta e mapeia para `GET /tasks` no backend
3. Backend processa e retorna JSON
4. Nginx reverte a resposta para o browser
5. Frontend atualiza UI

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

### Executar comando no container

```bash
# Migrations
docker-compose exec api npx prisma migrate status

# Rebuildar frontend
docker-compose exec frontend npm run build

# Shell no container
docker-compose exec api sh
```

## 📊 Performance

- **Nginx**: ~5ms latência
- **Frontend (dev)**: Hot reload automático
- **Backend (dev)**: Auto-restart com watch
- **BD**: Persistência em volume

## 🎯 Endpoints CRUD

### Criar Tarefa
```http
POST http://localhost/api/tasks
{
  "title": "Nova tarefa",
  "description": "Descrição"
}
```

### Listar Tarefas
```http
GET http://localhost/api/tasks
```

### Atualizar Status
```http
PATCH http://localhost/api/tasks/:id
{
  "status": "in_progress"
}
```

### Deletar
```http
DELETE http://localhost/api/tasks/:id
```

## ✨ Features

✅ Frontend em `/` com hot reload
✅ Backend em `/api/*` com auto-restart
✅ Nginx reverse proxy unificado
✅ CORS pré-configurado
✅ PostgreSQL persistente
✅ Migrations automáticas
✅ Docker network isolado

---

**Pronto!** 🎉 Seu monorepo está operacional com routing centralizado!
