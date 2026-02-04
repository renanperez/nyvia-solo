import { useState, useEffect } from "react";
import { createContext, useContext } from "react";

const MetricsContext = createContext();

export function MetricsProvider({ children }) {
  const [metricas, setMetricas] = useState([]); // estado que mostra e armazena as métricas buscadas do backend e exibidas na página de métricas
  const [loading, setLoading] = useState(false); // estado para indicar se os dados estão sendo carregados
  const [novaMetrica, setNovaMetrica] = useState({
    // Estado para criar uma nova métrica
    nome: "",
    benchmark: "",
  });

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
    // useEffect para buscar as métricas ao carregar o hook MetricsProvider, a página de métricas chama esse hook
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
