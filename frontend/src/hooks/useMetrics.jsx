import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useAuth } from "./useAuth";

const MetricsContext = createContext();

//==================================================================================
// Custom hooks para buscar dados e função para calcular dados e métricas do backend
// =================================================================================

export function MetricsProvider({ children }) {
  const [loading, setLoading] = useState(false); // estado para indicar se os dados estão sendo carregados
  const [ranges, setRanges] = useState(null); // Armazena ranges do mercado selecionado
  const [validacao, setValidacao] = useState(null); // Armazena resultado do backend para validação de inputs
  const [projecao, setProjecao] = useState(null); // Armazena resultado do backend para projeção de métricas mês a mês
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
    incremento_orcamental: 0.05,
    aov: 100,
    customer_lifespan_anos: 1,
    cogs: undefined,
    // Métricas de Mídia (opcionais - usa benchmark se undefined)
    ctr_display: undefined,
    ctr_search: undefined,
    cpm_display: undefined,
    cpc_search: undefined,
    taxa_conversao: undefined,
  }); // estado para armazenar os dados da nova métrica a ser calculada, com valores iniciais para facilitar o teste e a validação do formulário

  // Função para calcular dados das métricas no backend
  const calcularMetricas = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaMetrica),
      });
      const data = await response.json();

      if (data.sucesso) {
        setProjecao(data.resultados);
        setValidacao({ valid: true, errors: [], warnings: data.avisos ?? [] });
        console.log("Projeção calculada:", data.resultados);
      } else {
        setValidacao({ valid: false, errors: data.erros, warnings: [] });
        console.error("Erros de validação:", data.erros);
      }
    } catch (error) {
      console.error("Erro ao calcular:", error);
    }
  };

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
        incremento_orcamental: 0.05,
        aov: 100,
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
        loading,
        setLoading,
        validacao,
        setValidacao,
        projecao,
        setProjecao,
        novaMetrica,
        setNovaMetrica,
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
