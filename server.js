import express from 'express';

const app = express();
app.use(express.json());

const contas = [], categorias = [], lancamentos = []; 

const erro = (res, status, erro) => res.status(status).json({ erro });
const novo = (lista, dados) => {
  const item = { id: Math.max(0, ...lista.map((x) => x.id)) + 1, ...dados };
  lista.push(item);
  return item;
};
const achar = (lista, id) => lista.find((x) => x.id === Number(id));

const saldo = (conta) =>
  lancamentos
    .filter((l) => l.conta_id === conta.id)
    .reduce((s, l) => s + (l.tipo === 'receita' ? l.valor : -l.valor), conta.saldo_inicial);

app.get('/contas', (req, res) => res.json(contas.map((c) => ({ ...c, saldo: saldo(c) }))));

app.post('/contas', (req, res) => {
  const { nome, saldo_inicial = 0 } = req.body ?? {};
  if (!nome) return erro(res, 400, 'Informe o nome');
  res.status(201).json(novo(contas, { nome, saldo_inicial }));
});

app.put('/contas/:id', (req, res) => {
  const conta = achar(contas, req.params.id);
  if (!conta) return erro(res, 404, 'Conta não encontrada');
  conta.nome = req.body?.nome ?? conta.nome;
  res.json(conta);
});

app.delete('/contas/:id', (req, res) => {
  const conta = achar(contas, req.params.id);
  if (!conta) return erro(res, 404, 'Conta não encontrada');
  if (lancamentos.some((l) => l.conta_id === conta.id)) return erro(res, 409, 'Conta tem lançamentos');
  contas.splice(contas.indexOf(conta), 1);
  res.status(204).end();
});

app.get('/categorias', (req, res) => res.json(categorias));
app.post('/categorias', (req, res) => {
  if (!req.body?.nome) return erro(res, 400, 'Informe o nome');
  res.status(201).json(novo(categorias, { nome: req.body.nome }));
});

app.get('/lancamentos', (req, res) => res.json(lancamentos));
app.post('/lancamentos', (req, res) => {
  const { conta_id, categoria_id, tipo, valor, descricao = '' } = req.body ?? {};
  const conta = achar(contas, conta_id);
  if (!conta || !achar(categorias, categoria_id)) return erro(res, 404, 'Conta ou categoria não encontrada');
  if (!['receita', 'gasto'].includes(tipo) || !(valor > 0)) return erro(res, 400, 'tipo ou valor inválido');

  if (tipo === 'gasto' && valor > saldo(conta)) return erro(res, 422, `Saldo insuficiente (saldo: ${saldo(conta)})`);

  res.status(201).json(novo(lancamentos, { conta_id, categoria_id, tipo, valor, descricao }));
});

app.put('/lancamentos/:id', (req, res) => {
  const l = achar(lancamentos, req.params.id);
  if (!l) return erro(res, 404, 'Lançamento não encontrado');
  l.descricao = req.body?.descricao ?? l.descricao; 
  res.json(l);
});

app.delete('/lancamentos/:id', (req, res) => {
  const l = achar(lancamentos, req.params.id);
  if (!l) return erro(res, 404, 'Lançamento não encontrado');
  if (l.tipo === 'receita' && saldo(achar(contas, l.conta_id)) - l.valor < 0) {
    return erro(res, 422, 'Não pode excluir, a conta ficaria negativa'); 
  }
  res.status(204).end();
});

app.listen(process.env.PORT || 3000, () => console.log('API rodando em http://localhost:3000'));
