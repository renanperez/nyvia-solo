import { useState } from "react";
import { createContext, useContext } from "react";
//    Importa createContext e useContext do React para criar e usar o contexto de autenticação

const AuthContext = createContext(); // CreateContext cria o contexto de autenticação associado à constante AuthContext

export function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [mostraRegistro, setMostraRegistro] = useState(false);
  const [erro, setErro] = useState("");
  const [usuario, setUsuario] = useState(null);

  // Função de registro
  const fazerRegistro = async (email, senha, nomeWorkspace) => {
    try {
      const response = await fetch("http://localhost:3001/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, nomeWorkspace }),
      });
      const data = await response.json();

      if (data.sucesso) {
        setAutenticado(true); // Marcar como autenticado e logado
        setUsuario(data.usuario); // Armazenar dados do usuário
        setErro("");
      } else {
        setErro(data.mensagem);
      }
    } catch (error) {
      setErro("Erro ao conectar com servidor");
    }
  };

  // Função de login
  const fazerLogin = async (email, senha) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      // Verificar sucesso do login
      if (data.sucesso) {
        setAutenticado(true);
        setUsuario(data.usuario); // Armazenar dados do usuário
        setErro("");
      } else {
        setErro(data.mensagem);
      }
    } catch (error) {
      setErro("Erro ao conectar com servidor");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        setAutenticado,
        mostraRegistro,
        setMostraRegistro,
        erro,
        setErro,
        usuario,
        setUsuario,
        fazerRegistro,
        fazerLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
