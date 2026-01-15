const sqlite3 = require("sqlite3").verbose();
const path = require("path");
//  Definindo o caminho do arquivo do banco de dados
const dbPath = path.join(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite");
  }
});

//  CRIAR tabela workspaces
db.run(
  `
  CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error("❌ Erro ao criar tabela workspaces:", err.message);
    } else {
      console.log("✅ Tabela workspaces pronta");
    }
  }
);

//  CRIAR tabela usuarios
db.run(
  `
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    workspace_id INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
  )
`,
  (err) => {
    if (err) {
      console.error("❌ Erro ao criar tabela usuarios:", err.message);
    } else {
      console.log("✅ Tabela usuarios pronta");
    }
  }
);
module.exports = db;
