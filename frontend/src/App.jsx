//hooks do React e componentes de autenticação e dashboard (custom hooks)
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { TelaLogin } from "./components/auth/TelaLogin";
import { TelaRegistro } from "./components/auth/TelaRegistro";
import { useDashboard } from "./hooks/useDashboard";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardPage } from "./components/pages/DashboardPage";
import { MetricasPage } from "./components/pages/MetricasPage";
import { UsuariosPage } from "./components/pages/UsuariosPage";
import { ConfigPage } from "./components/pages/ConfigPage";
import { MetricsProvider } from "./hooks/useMetrics";

// =======================================================================================
// Componente principal da aplicação React e da estrutura do dashboard
// *faz uso dos hooks de autenticação e dashboard para gerenciar estados e funcionalidades
// *assim como definição dos itens do menu lateral
// =======================================================================================
function App() {
  const auth = useAuth(); // Hook para autenticação usando o contexto de AuthProvider (em useAuth.jsx)
  const dashboard = useDashboard(); // Custom Hook para gerenciar o dashboard e métricas do backend (em useDashboard.jsx)
  const [menuAberto, setMenuAberto] = useState(true); // Custom Hook que indica o Estado do menu lateral, aberto ou fechado (em App.jsx)

  const itensMenu = [
    { id: "dashboard", nome: "Dashboard", icone: "📊" },
    { id: "metricas", nome: "Métricas", icone: "📈" },
    { id: "usuarios", nome: "Usuários", icone: "👥" },
    { id: "config", nome: "Configurações", icone: "⚙️" },
  ];

  // ================================================================================
  // Renderização condicional dos componentes de autenticação (Tela Login/Registro)
  // *feita antes de mostrar o dashboard principal com base no estado de autenticação
  // ================================================================================

  if (!auth.autenticado) {
    return auth.mostraRegistro ? <TelaRegistro /> : <TelaLogin />; // Mostra tela de login ou registro
  }

  // ================================================================================
  // Dashboard Principal da aplicação após autenticação bem-sucedida
  // gerencia o menu lateral e o conteúdo principal com base na página atual
  // ================================================================================
  return (
    <MetricsProvider>
      <div className="flex h-screen">
        <Sidebar
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
          itensMenu={itensMenu}
        />

        <div className="flex-1 overflow-auto">
          <Header itensMenu={itensMenu} />
          <main className="p-6">
            {dashboard.paginaAtual === "dashboard" && <DashboardPage />}
            {dashboard.paginaAtual === "metricas" && <MetricasPage />}
            {dashboard.paginaAtual === "usuarios" && <UsuariosPage />}
            {dashboard.paginaAtual === "config" && <ConfigPage />}
          </main>
        </div>
      </div>
    </MetricsProvider>
  ); // Envolve o dashboard com MetricsProvider para fornecer contexto de métricas a toda a aplicação
}
export default App; // Exporta o componente App como padrão do módulo para uso em outros arquivos
