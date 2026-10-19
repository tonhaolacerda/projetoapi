Endpoints da API

Contas

`GET /contas` - Lista todas as contas cadastradas trazendo o cálculo do saldo atualizado em tempo real.
`GET /contas/:id` - Busca os detalhes de uma conta específica pelo ID.
`POST /contas` - Cria uma nova conta.
`PUT /contas/:id` - Atualiza o nome de uma conta existente.
`DELETE /contas/:id` - Remove uma conta (bloqueado caso a conta possua lançamentos vinculados).

`GET /categorias` - Lista todas as categorias cadastradas.
`GET /categorias/:id` - Busca os detalhes de uma categoria específica pelo ID.
`POST /categorias` - Cria uma nova categoria.


`GET /lancamentos` - Lista todos os lançamentos (receitas e gastos) efetuados.
`GET /lancamentos/:id` - Busca os detalhes de um lançamento específico pelo ID.
`POST /lancamentos` - Cria um novo lançamento de movimentação financeira.
    Regra: Impede lançamentos do tipo `gasto` caso o valor ultrapasse o saldo atual da conta.
    `PUT /lancamentos/:id` - Atualiza a descrição de um lançamento existente.
`DELETE /lancamentos/:id` - Remove um lançamento.
    Regra: Impede a exclusão de uma `receita` caso essa remoção deixe o saldo da conta negativo.
