const express = require('express');
const cors = require('cors');
const app = express();
const { autenticar } = require('./login.js');

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const resultado = autenticar(req.body);
  res.json(resultado);
});

app.get('/api/metricas', (req, res) => {
  res.json({
    sucesso: true,
    metricas: [
      { id: 1, nome: 'CPM', benchmark: 15.50 },
      { id: 2, nome: 'CPC', benchmark: 2.30 },
      { id: 3, nome: 'CTR', benchmark: 3.5 }
    ]
  });
});

// Rota POST - calcular métricas
app.post('/api/metricas', (req, res) => {
  const dados = req.body;
  
  // Cálculos simples de exemplo
  const resultado1 = dados.valor_a * dados.valor_b;
  const resultado2 = resultado1 + dados.valor_c;
  const resultado3 = resultado2 / dados.valor_a;
  
  res.json({
    sucesso: true,
    mensagem: 'Métricas calculadas com sucesso',
    resultados: {
      metrica1: resultado1,
      metrica2: resultado2,
      metrica3: resultado3
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});