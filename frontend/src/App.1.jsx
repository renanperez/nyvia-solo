import React, { useState, useEffect } from "react";
import { TelaLogin } from "./components/auth/TelaLogin";
import { TelaRegistro } from "./components/auth/TelaRegistro";
import { useAuth } from "./hooks/useAuth";
import { useDashboard } from "./hooks/useDashboard";

function App() {
  // Hook para autenticação usando o contexto de AuthProvider (em useAuth.jsx)
  const auth = useAuth();

  // Hook para gerenciar o dashboard e métricas do backend
  const dashboard = useDashboard();

  // Estados (useState) para gerenciar o menu lateral e a página atual ( dashboard, métricas, usuários, configurações)
  const [menuAberto, setMenuAberto] = useState(true); // Estado para controlar se o menu lateral está aberto ou fechado
  const [paginaAtual, setPaginaAtual] = useState("dashboard"); // Estado para controlar a página atual exibida no conteúdo principal

  // Hook para gerenciar o dashboard e métricas do backend (ex: buscar métricas, criar nova métrica)
  useEffect(() => {
    if (paginaAtual === "metricas") {
      dashboard.buscarMetricas(); // Buscar métricas do backend ao acessar a página de métricas
    }
  }, [paginaAtual]);

  // ================================================================================
  // Desestruturação dos estados e funções do hook useDashboard
  const itensMenu = [
    { id: "dashboard", nome: "Dashboard", icone: "📊" },
    { id: "metricas", nome: "Métricas", icone: "📈" },
    { id: "usuarios", nome: "Usuários", icone: "👥" },
    { id: "config", nome: "Configurações", icone: "⚙️" },
  ];
  // ================================================================================
  // declara a Importação dos componentes de autenticação de TelaLogin e TelaRegistro
  if (!auth.autenticado) {
    return auth.mostraRegistro ? <TelaRegistro /> : <TelaLogin />; // Mostra tela de login ou registro
  }

  // Dashboard Principal
  return (
    <div className="flex h-screen">
      {/* Menu Lateral */}
      <div
        className={`${menuAberto ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className={`font-bold text-xl ${!menuAberto && "hidden"}`}>
            {auth.usuario?.workspaceNome || "Meu App"}
          </h1>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            {menuAberto ? "◀" : "▶"}
          </button>
        </div>

        <nav className="mt-4">
          {itensMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setPaginaAtual(item.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition ${
                paginaAtual === item.id
                  ? "bg-gray-800 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="text-2xl">{item.icone}</span>
              <span className={`${!menuAberto && "hidden"}`}>{item.nome}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {itensMenu.find((i) => i.id === paginaAtual)?.nome}
          </h2>
        </header>

        <main className="p-6">
          {paginaAtual === "dashboard" && (
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-500">Total Vendas</div>
                <div className="text-3xl font-bold text-blue-600">
                  R$ 12.450
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-500">Produtos</div>
                <div className="text-3xl font-bold text-green-600">48</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-500">Usuários Ativos</div>
                <div className="text-3xl font-bold text-purple-600">1.234</div>
              </div>
            </div>
          )}

          {paginaAtual === "metricas" && (
            <div className="space-y-6">
              {/* Formulário para criar métrica */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Criar Nova Métrica
                </h3>
                <form
                  onSubmit={dashboard.calcularMetricas}
                  className="flex gap-4"
                >
                  <input
                    type="text"
                    placeholder="Nome da métrica"
                    value={dashboard.novaMetrica.nome}
                    onChange={(e) =>
                      dashboard.setNovaMetrica({
                        ...dashboard.novaMetrica,
                        nome: e.target.value,
                      })
                    }
                    className="flex-1 border border-gray-300 rounded px-4 py-2"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Benchmark"
                    value={dashboard.novaMetrica.benchmark}
                    onChange={(e) =>
                      dashboard.setNovaMetrica({
                        ...dashboard.novaMetrica,
                        benchmark: e.target.value,
                      })
                    }
                    className="w-32 border border-gray-300 rounded px-4 py-2"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Criar
                  </button>
                </form>
              </div>

              {/* Lista de métricas do backend */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">
                    Lista de Métricas (do Backend)
                  </h3>
                </div>
                {dashboard.loading ? (
                  <div className="p-6 text-center text-gray-500">
                    Carregando...
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Nome</th>
                        <th className="px-6 py-3 text-left">Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.metricas.map((metrica) => (
                        <tr
                          key={metrica.id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">{metrica.id}</td>
                          <td className="px-6 py-4">{metrica.nome}</td>
                          <td className="px-6 py-4">
                            {metrica.benchmark.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {paginaAtual === "usuarios" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Página de usuários em construção...
              </p>
            </div>
          )}

          {paginaAtual === "config" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Configurações do sistema...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
