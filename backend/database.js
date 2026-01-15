const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do arquivo do banco
const dbPath = path.join(__dirname, 'database.db');

// Criar/conectar ao banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  } else {
    console.log('✅ Conectado ao banco SQLite');
  }
});

// Criar tabela usuarios se não existir
db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)
`, (err) => {
if (err) {
    console.error('❌ Erro ao criar tabela:', err.message);
} else {
    console.log('✅ Tabela usuarios pronta');
}
});

module.exports = db;