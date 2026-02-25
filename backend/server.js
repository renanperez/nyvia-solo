const express = require("express");
const cors = require("cors");
const app = express();
const { autenticar } = require("./login.js");
// Importa o banco de dados (cria a conexão com o arquivo database.js)
const db = require("./database.js");
// Importa a função de registro de usuário
const { registrarUsuario } = require("./registro.js");

app.use(cors());
app.use(express.json());
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

// Rota POST - calcular métricas
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
//  Rota POST - validar inputs (usada para validação e guardrails)
// ========================================================
const validateInputs = require('./validators/validateInputs');

app.post("/api/validar", (req, res) => {
  const resultado = validateInputs(req.body);
  res.json(resultado);
});

// =========================================================
// Inicia o servidor na porta 3001  
// =========================================================

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
