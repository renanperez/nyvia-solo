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

//===================================================================
// Rotas do backend para autenticação, registro, métricas e validação
//===================================================================

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

// ========================================================
//  Rota POST - Endpoint usada para validar inputs e guardrails
// ========================================================
app.post("/api/validar", (req, res) => {
  const resultado = validateInputs(req.body);
  res.json(resultado);
});

// =========================================================
// Rota POST - Calcular métricas (algoritmo principal)
// =========================================================
const calculateMetrics = require("./services/calculateMetrics");

app.post("/api/calcular", (req, res) => {
  const inputs = req.body;

  // 1. Validar inputs antes de calcular
  const validacao = validateInputs(inputs);
  if (!validacao.valid) {
    return res.json({
      sucesso: false,
      erros: validacao.errors,
      avisos: validacao.warnings,
    });
  }

  // 2. Calcular métricas
  const resultados = calculateMetrics(inputs);

  // 3. Retornar resultados
  res.json({
    sucesso: true,
    avisos: validacao.warnings,
    resultados,
  });
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
