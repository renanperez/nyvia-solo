const express = require("express");
const cors = require("cors");
const app = express();
const { autenticar } = require("./login.js"); // Importa a função de autenticação
const db = require("./database.js"); // Importa o banco de dados (cria a conexão com o arquivo database.js)
const { registrarUsuario } = require("./registro.js"); // Importa a função de registro de usuário
const validateInputs = require("./validators/validateInputs"); // Importar validação de inputs e guardrails
const ranges = require("./data/ranges"); // Importa os ranges de referência para validação e guardrails

// Configurações do Express para lidar com JSON e CORS
app.use(cors());
app.use(express.json());

//=================================================================
// Rotas do backend para autenticação, registro, métricas e validação
//=================================================================

// Rota POST - registrar usuário
app.post("/api/registrar", (req, res) => {
  console.log("📥 POST /api/registrar recebeu:", req.body);
  registrarUsuario(req.body, (err, resultado) => {
    res.json(resultado);
  });
});

// Rota POST - login
app.post("/api/login", (req, res) => {
  autenticar(req.body, (err, resultado) => {
    res.json(resultado);
  });
});

// Rota GET - buscar métricas *Manter Rotas provisoriamente -futuramente substituída por API*
app.get("/api/metricas", (req, res) => {
  res.json({
    sucesso: true,
    metricas: [
      { id: 1, nome: "CPM", benchmark: 15.5 },
      { id: 2, nome: "CPC", benchmark: 2.3 },
      { id: 3, nome: "CTR", benchmark: 3.5 },
    ],
  });
});

// Rota POST - calcular métricas *Manter Rotas provisoriamente -futuramente substituída por API*
app.post("/api/metricas", (req, res) => {
  const dados = req.body;

  // Cálculos simples de exemplo
  const resultado1 = dados.valor_a * dados.valor_b;
  const resultado2 = resultado1 + dados.valor_c;
  const resultado3 = resultado2 / dados.valor_a;

  res.json({
    sucesso: true,
    mensagem: "Métricas calculadas com sucesso",
    resultados: {
      metrica1: resultado1,
      metrica2: resultado2,
      metrica3: resultado3,
    },
  });
});

// ========================================================
//  Rota POST - Endpoint usada para validar inputs e guardrails
// ========================================================
app.post("/api/validar", (req, res) => {
  const resultado = validateInputs(req.body);
  res.json(resultado);
});

//===========================================================
// Rota GET - Endpoint para buscar ranges de um mercado
//===========================================================
app.get("/api/ranges/:mercado", (req, res) => {
  const mercado = req.params.mercado;
  const range = ranges.find((r) => r.mercado === mercado);

  if (range) {
    res.json({ sucesso: true, range });
  } else {
    res.json({ sucesso: false, mensagem: "Mercado não encontrado" });
  }
});

//===========================================================
// Rota GET - Endpoint para buscar benchmarks de um mercado
//===========================================================
const searchBenchmarks = require("./services/searchBenchmarks");

app.get("/api/benchmarks/:mercado", (req, res) => {
  const mercado = req.params.mercado;
  const benchmark = searchBenchmarks(mercado);

  if (benchmark) {
    res.json({ sucesso: true, benchmark });
  } else {
    res.json({ sucesso: false, mensagem: "Mercado não encontrado" });
  }
});

// =========================================================
// Inicia o servidor na porta 3001
// =========================================================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
