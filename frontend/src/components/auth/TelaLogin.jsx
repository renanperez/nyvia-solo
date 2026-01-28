import { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Importa o hook de autenticação personalizado

export function TelaLogin() {
  // Componente TelaLogin
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {auth.erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {auth.erro}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <button
          onClick={() => auth.fazerLogin(email, senha)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
        <button
          onClick={() => auth.setMostraRegistro(true)}
          className="w-full text-blue-600 hover:underline mt-4"
        >
          Não tem conta? Registre-se
        </button>
      </div>
    </div>
  );
}
