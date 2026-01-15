// Usuário mockado para testes
const usuarioMock = {
  email: 'admin@test.com',
  senha: '123456'
};

function autenticar(dados) {
  // Validação: campos obrigatórios
  if (!dados.email || !dados.senha) {
    return {
      sucesso: false,
      mensagem: 'Email e senha são obrigatórios'
    };
  }

  // Validação: credenciais corretas
  if (dados.email === usuarioMock.email && dados.senha === usuarioMock.senha) {
    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      usuario: { email: usuarioMock.email }
    };
  }

  // Credenciais inválidas
  return {
    sucesso: false,
    mensagem: 'Email ou senha incorretos'
  };
}

module.exports = { autenticar };