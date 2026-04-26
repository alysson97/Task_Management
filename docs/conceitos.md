# Diferença entre REST e GraphQL:
 Os dois são padrões de APi, a diferença é que enquanto REST utiliza vários endpoints para receber algum dado, GraphQL utiliza o mesmo, porém enviado os campos que deseja receber os dados referentes à consulta (queries). 

# O que é transação em banco de dados:
Recurso utilizado para garantir atomicidade nas transações (ACID). Utilizando Commit e Rollback, é possível evitar que uma sequência de alterações (como atualizar duas tabelas) não seja feita pela metade (uma atualiza e a outra não).

# Diferença entre autenticação e autorização:
Autenticação serve para verificar se um usuário existe e está autorizado a fazer o acesso (login e senha), enquanto autorização serve para identificar se o usuário autenticado pode acessar tal conteúdo ou mesmo o nível de modificação que ele pode fazer (como deletar um item, por exemplo).

# Quando usar cache e quando evitar:
Cache é uma ferramenta poderosa para acessar dados com um custo computacional baixo, porém existem situações onde os dados são modificados regularmente e podem ocorrer problemas críticos quando um dado antigo é utilizado (Saldo bancário é um exemplo).