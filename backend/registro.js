const db = require('./database.js');
const bcrypt = require('bcrypt');
// Função para registrar um novo usuário e workspace
function registrarUsuario(dados, callback) {
  // Validar campos obrigatórios
  if (!dados.email || !dados.senha || !dados.nomeWorkspace) {
    return callback(null, {
      sucesso: false,
      mensagem: 'Email, senha e nome do workspace são obrigatórios'
    });
  }

  // validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(dados.email)) {  
    return callback(null, {
      sucesso: false,
      mensagem: 'Formato de email inválido'
    });
  }

  //  validar força da senha
  if (dados.senha.length < 6) {
    return callback(null, { 
      sucesso: false, 
      mensagem: 'A senha deve ter pelo menos 6 caracteres' 
    });
  }

  //  Verificar se o email já está registrado
  db.get(
    'SELECT id FROM usuarios WHERE email = ?',
    [dados.email], (err, usuario) => {   // Callback da consulta
      //  Em caso de erro na consulta
      if (err) {
        return callback(null, {
          sucesso: false,
          mensagem: 'Erro ao verificar email'
        });
      }
      //  Se o usuário já existir
      if (usuario) {
        return callback(null, {
          sucesso: false,
          mensagem: 'Email já registrado'
        });
      }
          
      // Hash da senha
      const saltRounds = 10;
      bcrypt.hash(dados.senha, saltRounds, (err, senhaHash) => {
        if (err) {
          return callback(null, {
            sucesso: false,
            mensagem: 'Erro ao processar senha'
          });
        }

      // Criar workspace
      db.run(
        'INSERT INTO workspaces (nome) VALUES (?)',
        [dados.nomeWorkspace],
        function(err) {
          if (err) {
            return callback(null, {
              sucesso: false,
              mensagem: 'Erro ao criar workspace'
            });
          }

          const workspaceId = this.lastID;
          
          // Criar usuário vinculado ao workspace
          db.run(
            'INSERT INTO usuarios (email, senha, workspace_id) VALUES (?, ?, ?)',
            [dados.email, senhaHash, workspaceId],
            function(err) {
              if (err) {
                return callback(null, {
                  sucesso: false,
                  mensagem: 'Erro ao criar usuário'
                });
              }

              // Retornar sucesso
              callback(null, {
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso',
                usuario: {
                  id: this.lastID,
                  email: dados.email,
                  workspaceId: workspaceId
                }
              });
            }
          );
        }
      );
    });
  });
}

module.exports = { registrarUsuario };