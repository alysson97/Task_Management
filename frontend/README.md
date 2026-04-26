# Frontend - Gerenciador de Tarefas

Cliente Next.js 16 minimalista para gerenciar tarefas via API REST.

## 🚀 Tecnologias

- **Next.js 16** (React 19)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (cliente HTTP)

## 🏃 Quick Start

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## 📁 Estrutura

```
├── app/              # Page routes (Next.js App Router)
├── components/       # Componentes React
├── hooks/           # React hooks customizados
├── services/        # Clientes HTTP
└── types/           # Tipos TypeScript
```

## 🔗 Configuração

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## ✨ Funcionalidades

✅ Listar tarefas
✅ Criar tarefa (com validação)
✅ Atualizar status (pending → in_progress → completed)
✅ Deletar tarefa
✅ Estatísticas (total, pendentes, concluídas)
✅ Loading states e tratamento de erros

## 🧩 Componentes Principais

- **TaskForm**: Formulário criar tarefa
- **TaskList**: Lista de tarefas
- **TaskItem**: Tarefa individual com dropdown status
- **TaskStatusBadge**: Badge visual de status

## 🪝 Hook Principal

```typescript
const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
```

## 📝 Scripts

```bash
npm run dev       # Desenvolvimento
npm run build     # Build produção
npm run start     # Iniciar produção
npm run lint      # Linter
```

## ⚙️ Build

```bash
npm run build
```

Build criado com sucesso! ✅

---

**Status**: 🟢 Operacional | Integrado com backend


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
