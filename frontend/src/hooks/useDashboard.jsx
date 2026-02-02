import { useState, useEffect } from "react";

// ===========================================================================================================================
// Custom hook para gerenciar o dashboard e métricas da aplicação (por ex: buscar métricas, criar nova métrica) na plataforma
// ===========================================================================================================================

export function useDashboard() {
  const [paginaAtual, setPaginaAtual] = useState("dashboard"); // Estado para controlar a página atual exibida no conteúdo principal( dashboard, métricas, usuários, configurações)
  const [metricas, setMetricas] = useState([]); // Estado para armazenar as métricas
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [novaMetrica, setNovaMetrica] = useState({
    // Estado para nova métrica a ser criada
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
    // useEffect para buscar métricas ao acessar a página de métricas na plataforma atualizando página atual
    if (paginaAtual === "metricas") {
      buscarMetricas(); // Buscar métricas ao carregar o hook
    }
  }, [paginaAtual]);

  return {
    paginaAtual,
    setPaginaAtual,
    metricas,
    setMetricas,
    loading,
    setLoading,
    novaMetrica,
    setNovaMetrica,
    buscarMetricas,
    calcularMetricas,
  };
}
