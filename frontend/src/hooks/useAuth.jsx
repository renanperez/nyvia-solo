import { useState, useEffect } from "react";
import { createContext, useContext } from "react"; //  Importa createContext e useContext do React para criar e usar o contexto de autenticação

const AuthContext = createContext(); // Cria o contexto de autenticação

// =====================================================================================
// Custom hooks  para gerenciar autenticação de usuários (login, registro) na aplicação
// ====================================================================================

// AuthProvider (em useAuth.jsx) - componente que envolve a aplicação e fornece o contexto de autenticação
export function AuthProvider({ children }) {
  // Recebe os componentes filhos que serão envoltos pelo provedor
  const [autenticado, setAutenticado] = useState(false); // Estado para rastrear se o usuário está autenticado
  const [mostraRegistro, setMostraRegistro] = useState(false); // Estado para alternar entre tela de login e registro
  const [erro, setErro] = useState(""); // Estado para armazenar mensagens de erro
  const [usuario, setUsuario] = useState(null); // Estado para armazenar dados do usuário autenticado

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

  // useEffect para verificar se o usuário já está autenticado ao carregar o componente
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setAutenticado(true);
    }
  }, []);

  // useEffect para persistir o estado de autenticação no localStorage ao mudar autenticado ou usuario
  useEffect(() => {
    if (autenticado) {
      localStorage.setItem("usuario", JSON.stringify(usuario)); // Salva quando loga
      localStorage.setItem("autenticado", "true");
    } else {
      localStorage.removeItem("usuario"); // Remove quando deslogar
      localStorage.removeItem("autenticado");
    }
  }, [autenticado, usuario]);

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
// useAuth Hook (em useAuth.jsx) - hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext); // Retorna o valor do contexto de autenticação para uso em outros componentes
}
