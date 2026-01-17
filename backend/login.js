const db = require("./database.js"); // Conexão com o banco SQLite
const bcrypt = require("bcrypt"); // Para comparar senha com hash

function autenticar(dados, callback) {
  //  Função de autenticação de usuário
  if (!dados.email || !dados.senha) {
    // Validar campos obrigatórios
    return callback(null, {
      sucesso: false,
      mensagem: "Email e senha são obrigatórios",
    });
  }

  // Buscar usuário no banco de dados
  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    [dados.email],
    (err, row) => {
      //  Validar em caso de erro na consulta
      if (err) {
        return callback(null, {
          sucesso: false,
          mensagem: "Erro ao buscar usuário",
        });
      }
      //  Se o usuário não for encontrado
      if (!row) {
        // validar se o usuário existe
        return callback(null, {
          sucesso: false,
          mensagem: "Email ou senha incorretos",
        });
      }

      // Comparar senha fornecida com o hash armazenado
      bcrypt.compare(dados.senha, row.senha, (err, senhaCorreta) => {
        //  validar em caso de erro na comparação - bcrypt
        if (err) {
          return callback(null, {
            sucesso: false,
            mensagem: "Erro ao processar senha",
          });
        }
        //  Verificar se a senha está correta
        if (senhaCorreta) {
          // validar autenticação bem-sucedida
          return callback(null, {
            sucesso: true,
            mensagem: "Login realizado com sucesso",
            usuario: {
              id: row.id,
              nome: row.nome,
              email: row.email,
            },
          });
        } else {
          // Senha incorreta
          return callback(null, {
            sucesso: false,
            mensagem: "Email ou senha incorretos",
          });
        }
      });
    }
  );
}

module.exports = { autenticar };
