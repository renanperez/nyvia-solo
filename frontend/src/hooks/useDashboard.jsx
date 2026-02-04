import { useState } from "react";
import { createContext, useContext } from "react"; //  Importa createContext e useContext do React para criar e usar o contexto de autenticação

const DashboardContext = createContext(); // Cria o contexto de dashboard

// ===========================================================================================================================
// Custom hook para gerenciar navegação do dashboard
// ===========================================================================================================================

export function DashboardProvider({ children }) {
  // Recebe os componentes filhos que serão envoltos pelo provedor
  const [paginaAtual, setPaginaAtual] = useState("dashboard"); // Estado para controlar a página atual do dashboard
  return (
    <DashboardContext.Provider
      value={{
        paginaAtual,
        setPaginaAtual,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
export function useDashboard() {
  return useContext(DashboardContext);
}
