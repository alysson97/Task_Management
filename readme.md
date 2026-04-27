# Desafio Técnico - Sistema de Gerenciamento de Tarefas

Este projeto é uma solução completa para o desafio da Manole, incluindo API REST, Interface Web e infraestrutura automatizada.

## 📂 Estrutura do Projeto
- **/backend**: NestJS, Prisma ORM, PostgreSQL e Autenticação JWT.
- **/frontend**: Next.js 16, React Hooks e Tailwind CSS.
- **/docs**: Respostas para as questões teóricas.

---

## 🚀 Como rodar o projeto

O projeto está totalmente "dockerizado". Você só precisa do Docker instalado.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/alysson97/Task_Management.git
   cd Task_Management
   ```

2. **Suba os containers:**
   ```bash
   docker compose up --build
   ```

3. **Acesse:**
   - **Frontend:** [http://localhost](http://localhost)
   - **API:** [http://localhost/api](http://localhost/api)

---

## 🧠 Decisões Técnicas

1. **NestJS + Prisma**: Escolhidos pela robustez e produtividade. O NestJS impõe uma arquitetura modular que facilita a manutenção, enquanto o Prisma garante segurança de tipos no acesso ao banco.
2. **Autenticação JWT**: Implementada como diferencial para garantir que cada usuário gerencie apenas suas próprias tarefas, elevando o nível de segurança da aplicação.
3. **Nginx como Proxy Reverso**: Utilizado para unificar o acesso. O frontend e o backend rodam em containers separados, mas o usuário acessa tudo via porta 80, simulando um ambiente de produção real.
4. **Global Exception Filter**: Implementado no backend para capturar erros do Prisma e transformá-los em status HTTP semânticos (404, 409), mantendo o código dos services limpo.
5. **Docker Healthchecks**: A API só inicia após o banco de dados estar pronto para conexões, evitando erros de inicialização.

---

## 🛠️ O que eu faria com mais tempo

- **Testes Automatizados**: Implementaria testes de integração no backend e testes de componentes (Cypress ou Jest) no frontend.
- **Cache com Redis**: Para otimizar a listagem de tarefas em cenários de alta carga.
- **UX Avançada**: Adicionaria Skeletons para loading e Toasts para feedbacks de erro/sucesso mais fluidos.

---

## 📈 Pontos Fortes e Limitações

### Pontos Fortes
- **Escalabilidade**: Arquitetura modular preparada para o crescimento.
- **Segurança**: Senhas criptografadas com Bcrypt e rotas protegidas por JWT.
- **Pronto para Produção**: Orquestração Docker e Nginx facilitam o deploy em qualquer cloud.

### Limitações
- **Complexidade Inicial**: A estrutura de monorepo e containers pode ser intimidante para projetos extremamente simples, mas foi escolhida para demonstrar padrões profissionais.
- **Validação de Senha**: Atualmente aceita senhas simples; em produção, implementaria regras de complexidade.
