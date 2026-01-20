// frontend/src/App.jsx
import  React, { useState, useEffect } from "react";
   
      function App() {
        const [autenticado, setAutenticado] = useState(false);
        const [mostraRegistro, setMostraRegistro] = useState(false); // estado para alternar entre login e registro
        const [erro, setErro] = useState("");
        const [usuario, setUsuario] = useState(null); // estado para armazenar dados do usuário
        const [menuAberto, setMenuAberto] = useState(true);
        const [paginaAtual, setPaginaAtual] = useState("dashboard");
        const [metricas, setMetricas] = useState([]); // estado para armazenar métricas
        const [loading, setLoading] = useState(false);
        const [novaMetrica, setNovaMetrica] = useState({ // estado para nova métrica
          nome: "",
          benchmark: "",
        });

        //  Função de registro
        const fazerRegistro = async (email, senha, nomeWorkspace) => {
          try {
            const response = await fetch(
              "http://localhost:3001/api/registrar",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha, nomeWorkspace }),
              }
            );
            const data = await response.json();

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

        //  Função de login
        const fazerLogin = async (email, senha) => {
          try {
            const response = await fetch("http://localhost:3001/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();
            //  Verificar sucesso do login
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

        //  Função para buscar métricas do backend
        const buscarMetricas = async () => {
          setLoading(true);
          try {
            const response = await fetch("http://localhost:3001/api/metricas");
            const data = await response.json();
            setMetricas(data.metricas);
          } catch (error) {
            console.error("Erro ao buscar métricas:", error);
            alert(
              "Erro: Certifique-se de que o backend está rodando na porta 3001"
            );
          }
          setLoading(false);
        };

        // Função para calcular métricas
        const calcularMetricas = async (e) => {
          e.preventDefault();
          try {
            const response = await fetch("http://localhost:3001/api/metricas", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novaMetrica),
            });
            const data = await response.json();
            alert(data.mensagem);
            console.log("Resultados:", data.resultados);
            setNovaMetrica({ nome: "", benchmark: "" });
            buscarMetricas();
          } catch (error) {
            console.error("Erro ao calcular métricas:", error);
          }
        };

        useEffect(() => {
          if (paginaAtual === "metricas") {
            buscarMetricas();
          }
        }, [paginaAtual]);

        const itensMenu = [
          { id: "dashboard", nome: "Dashboard", icone: "📊" },
          { id: "metricas", nome: "Métricas", icone: "📈" },
          { id: "usuarios", nome: "Usuários", icone: "👥" },
          { id: "config", nome: "Configurações", icone: "⚙️" },
        ];
        // Renderização condicional entre tela de login e dashboard
        const TelaLogin = () => {
          const [email, setEmail] = useState("");
          const [senha, setSenha] = useState("");

          // Tela de Login
          return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                {erro && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {erro}
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
                  onClick={() => fazerLogin(email, senha)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setMostraRegistro(true)}
                  className="w-full text-blue-600 hover:underline mt-4"
                >
                  Não tem conta? Registre-se
                </button>
              </div>
            </div>
          );
        };

        //  Tela de Registro
        const TelaRegistro = () => {
          const [email, setEmail] = useState("");
          const [senha, setSenha] = useState("");
          const [nomeWorkspace, setNomeWorkspace] = useState("");

          return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6">Criar Conta</h2>
                {erro && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {erro}
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
                  onClick={() => fazerRegistro(email, senha, nomeWorkspace)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
                >
                  Registrar
                </button>

                <button
                  onClick={() => setMostraRegistro(false)}
                  className="w-full text-blue-600 hover:underline"
                >
                  Já tem conta? Faça login
                </button>
              </div>
            </div>
          );
        };

        if (!autenticado) {
          return mostraRegistro ? <TelaRegistro /> : <TelaLogin />; // Mostra tela de login ou registro
        }

        // Dashboard Principal
        return (
          <div className="flex h-screen">
            {/* Menu Lateral */}
            <div
              className={`${
                menuAberto ? "w-64" : "w-20"
              } bg-gray-900 text-white transition-all duration-300`}
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-700">
                <h1 className={`font-bold text-xl ${!menuAberto && "hidden"}`}>
                  {usuario?.workspaceNome || "Meu App"}
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
                    <span className={`${!menuAberto && "hidden"}`}>
                      {item.nome}
                    </span>
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
                      <div className="text-3xl font-bold text-green-600">
                        48
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="text-sm text-gray-500">
                        Usuários Ativos
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        1.234
                      </div>
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
                      <form onSubmit={calcularMetricas} className="flex gap-4">
                        <input
                          type="text"
                          placeholder="Nome da métrica"
                          value={novaMetrica.nome}
                          onChange={(e) =>
                            setNovaMetrica({
                              ...novaMetrica,
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
                          value={novaMetrica.benchmark}
                          onChange={(e) =>
                            setNovaMetrica({
                              ...novaMetrica,
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
                      {loading ? (
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
                            {metricas.map((metrica) => (
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
      export default App  ;
//  

