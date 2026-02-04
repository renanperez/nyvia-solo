import { useDashboard } from "../../hooks/useDashboard";

export function Header({ itensMenu }) {
  const dashboard = useDashboard();

  return (
    <header className="bg-white shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {itensMenu.find((i) => i.id === dashboard.paginaAtual)?.nome}
      </h2>
    </header>
  );
}
