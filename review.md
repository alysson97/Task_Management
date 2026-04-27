* Apresentação

Este projeto é um desafio técnico para Manole.
Ele contém 3 partes do desafio:
- backend: contém a api
- frontend: contém o frontend
- docs: contém as questões teóricas

O software foi orquestrado em Docker, então o frontend, backend e o banco de dados (postgreSQL) estão subindo juntos.
A ideia foi criar em formato de monorepo (frontend em '/' e backend em '/api'), então o docker também está instanciando um nginx para facilitar.

* Como rodar o projeto
## 🚀 Como rodar o projeto

Este projeto está totalmente "dockerizado", o que significa que você não precisa instalar o Node.js, PostgreSQL ou Prisma localmente. O Docker cuidará de todo o ambiente.

### Pré-requisitos
- [Docker](https://docker.com)
- [Docker Compose](https://docker.com)

### Passo a passo

1. **Clone o repositório:**
2. **Suba os containers:**
   No diretório raiz (onde está o arquivo `docker-compose.yml`), execute:
   ```bash
   docker compose up --build
   ```
   *Este comando irá baixar as imagens, instalar as dependências, gerar o Prisma Client, criar as tabelas no banco de dados e iniciar todos os serviços.*

3. **Acessar a aplicação:**
   - **Frontend:** [http://localhost](http://localhost)
   - **API (Backend):** [http://localhost/api](http://localhost/api)

---

**Nota:** O processo inicial pode levar alguns minutos devido à instalação das dependências dentro dos containers. Assim que o log indicar que o servidor está rodando, a aplicação estará disponível.


* O que eu faria se tivesse mais tempo
- segurança:
- filtro de senhas fracas
- frontend:
- Adicionaria tratamento de erros corretos no frontend
- Adicionaria loading e skeleton onde fosse possível
- backend:
- adicionaria logs com Winston
- adicionaria uma camada repository para facilitar os Mocks de testes
- criaria testes automatizados


* Pontos fortes e limitações
- Pontos fortes:
- Aplicação robusta com frameworks estáveis
- Ampla documentação dos frameworks e muitas soluções na comunidade
- Arquitetura inicial simples, mas saudável e que permite o crescimento
- Pontos fracos:
- Complexidade alta para poucas funcionalidades
- Curva de aprendizado mais lenta para desenvolvedores que não estão habituados às tecnologias
- Estrutura de DB e nginx não reutilizável para um projeto real

