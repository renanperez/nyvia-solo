import { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Importa o hook de autenticação personalizado

//  Tela de Registro
export function TelaRegistro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeWorkspace, setNomeWorkspace] = useState("");
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Criar Conta</h2>
        {auth.erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {auth.erro}
          </div>
        )}

        <input
          type="text"
          placeholder="Nome da Empresa"
          value={nomeWorkspace}
          onChange={(e) => setNomeWorkspace(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
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
          onClick={() => auth.fazerRegistro(email, senha, nomeWorkspace)}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
        >
          Registrar
        </button>

        <button
          onClick={() => auth.setMostraRegistro(false)}
          className="w-full text-blue-600 hover:underline"
        >
          Já tem conta? Faça login
        </button>
      </div>
    </div>
  );
}
