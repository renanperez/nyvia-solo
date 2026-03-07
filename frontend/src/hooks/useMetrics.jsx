import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useAuth } from "./useAuth";

const MetricsContext = createContext();

//==================================================================================
// Custom hooks para buscar dados e função para calcular dados e métricas do backend
// =================================================================================

export function MetricsProvider({ children }) {
  const [metricas, setMetricas] = useState([]); // estado que mostra e armazena as métricas buscadas do backend e exibidas na página de métricas
  const [loading, setLoading] = useState(false); // estado para indicar se os dados estão sendo carregados
  const [ranges, setRanges] = useState(null); // Armazena ranges do mercado selecionado
  const [validacao, setValidacao] = useState(null); // Armazena resultado do backend para validação de inputs
  const [benchmarks, setBenchmarks] = useState(null); // Armazena benchmarks do mercado selecionado
  const { autenticado } = useAuth(); // ← pega estado de autenticação do hook de autenticação para usar como dependência e evitar buscar métricas se não estiver autenticado
  const [novaMetrica, setNovaMetrica] = useState({
    mercado: "SaaS B2B",
    objetivo: "Gerar leads",
    orcamento: 5000,
    periodo_meses: 12,
    pct_budget_ppc: 1.0,
    split_display: 0.3,
    split_search: 0.7,
    apf: 12,
    crescimento_mensal: 0.05,
    ticket_medio: 100,
    customer_lifespan_anos: 1,
    cogs: undefined,
    // Métricas de Mídia (opcionais - usa benchmark se undefined)
    ctr_display: undefined,
    ctr_search: undefined,
    cpm_display: undefined,
    cpc_search: undefined,
    taxa_conversao: undefined,
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
    if (autenticado) {
      buscarMetricas(); // Buscar métricas ao carregar o hook se o usuário estiver autenticado
    }
  }, [autenticado]); // Dependência de autenticado para evitar buscar métricas se não estiver logado

  // useEffect para buscar ranges quando mercado muda
  useEffect(() => {
    async function buscarRanges() {
      if (novaMetrica.mercado) {
        console.log("📡 Buscando ranges para:", novaMetrica.mercado);
        try {
          const response = await fetch(
            `http://localhost:3001/api/ranges/${novaMetrica.mercado}`,
          );
          const data = await response.json();
          if (data.sucesso) {
            setRanges(data.range);
          }
        } catch (error) {
          console.error("Erro ao buscar ranges:", error);
        }
      }
    }

    buscarRanges();
  }, [novaMetrica.mercado]);

  // useEffect para Buscar benchmarks quando mercado muda ← ADICIONAR
  useEffect(() => {
    async function buscarBenchmarks() {
      if (novaMetrica.mercado) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/benchmarks/${novaMetrica.mercado}`,
          );
          const data = await response.json();
          if (data.sucesso) {
            setBenchmarks(data.benchmark);
          }
        } catch (error) {
          console.error("Erro ao buscar benchmarks:", error);
        }
      }
    }
    buscarBenchmarks();
  }, [novaMetrica.mercado]);

  // useEffect para resetar formulário quando usuário deslogar
  useEffect(() => {
    if (!autenticado) {
      setNovaMetrica({
        mercado: "SaaS B2B",
        objetivo: "Gerar leads",
        orcamento: 5000,
        periodo_meses: 12,
        pct_budget_ppc: 1.0,
        split_display: 0.3,
        split_search: 0.7,
        apf: 12,
        crescimento_mensal: 0.05,
        ticket_medio: 100,
        customer_lifespan_anos: 1,
        cogs: undefined,
        ctr_display: undefined,
        ctr_search: undefined,
        cpm_display: undefined,
        cpc_search: undefined,
        taxa_conversao: undefined,
      });
      setMetricas([]);
    }
  }, [autenticado]);

  // useEffect para sugerir split Display/Search com base no objetivo selecionado, usando benchmarks como referência.
  useEffect(() => {
    if (novaMetrica.objetivo) {
      let splitSugerido;

      switch (novaMetrica.objetivo) {
        case "Reconhecimento":
          splitSugerido = 0.7; // 70% Display
          break;
        case "Gerar leads":
          splitSugerido = 0.4; // 40% Display
          break;
        case "Aumentar vendas":
          splitSugerido = 0.2; // 20% Display
          break;
        default:
          splitSugerido = 0.3;
      }

      // Mostrar sugestão (não forçar)
      // Frontend vai exibir esse valor como sugestão
    }
  }, [novaMetrica.objetivo]);

  return (
    <MetricsContext.Provider
      value={{
        metricas,
        setMetricas,
        loading,
        setLoading,
        validacao,
        setValidacao,
        novaMetrica,
        setNovaMetrica,
        buscarMetricas,
        calcularMetricas,
        ranges,
        benchmarks,
      }} // Fornece os estados e funções relacionados às métricas para os componentes filhos que consumirem esse contexto
    >
      {children}
    </MetricsContext.Provider>
  );
}
// Fim do componente MetricsProvider
export function useMetrics() {
  return useContext(MetricsContext); // Hook personalizado para acessar o MetricsContext (contexto de métricas) em outros componentes
}
