import { useState, useEffect } from "react";
import { createContext, useContext } from "react";

const MetricsContext = createContext();

//==================================================================================
// Custom hooks para buscar dados e função para calcular dados e métricas do backend
// =================================================================================

export function MetricsProvider({ children }) {
  const [metricas, setMetricas] = useState([]); // estado que mostra e armazena as métricas buscadas do backend e exibidas na página de métricas
  const [loading, setLoading] = useState(false); // estado para indicar se os dados estão sendo carregados
  const [novaMetrica, setNovaMetrica] = useState({
    nome: "",
    benchmark: "",
    mercado: "SaaS B2B",
    orcamento: 5000,
    periodo_meses: 12,
    pct_budget_ppc: 1.0,
    split_display: 0.3,
    apf: 12,
    crescimento_mensal: 0.05,
    ticket_medio: 100,
    customer_lifespan_anos: 1,
    cogs: undefined,
  }); // estado para armazenar os dados da nova métrica a ser calculada, com valores iniciais para facilitar o teste e a validação do formulário

  // Função para buscar dados das métricas do backend
  const buscarMetricas = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/metricas");
      const data = await response.json();
      setMetricas(data.metricas);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      alert("Erro: Certifique-se de que o backend está rodando na porta 3001");
    }
    setLoading(false);
  };
  // Função para calcular dados das métricas no backend
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
    // useEffect para buscar as métricas ao carregar o hook MetricsProvider, 
    // a página de métricas chama esse hook para buscar métricas do backend e exibir na tela, 
    // e também para atualizar a lista de métricas após calcular uma nova métrica
    buscarMetricas(); // Buscar métricas ao carregar o hook
  }, []);

  return (
    <MetricsContext.Provider
      value={{
        metricas,
        setMetricas,
        loading,
        setLoading,
        novaMetrica,
        setNovaMetrica,
        buscarMetricas,
        calcularMetricas,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
}
// Fim do componente MetricsProvider
export function useMetrics() {
  return useContext(MetricsContext); // Hook personalizado para acessar o MetricsContext (contexto de métricas) em outros componentes
}
