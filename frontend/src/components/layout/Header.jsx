import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth"; // ← importa o hook

export function Header({ itensMenu }) {
  const dashboard = useDashboard();
  const { fazerLogout, usuario } = useAuth(); // ← pega logout e dados do usuário

  return (
    <header className="bg-white shadow p-6 flex justify-between items-center">
      {/* Título da página atual */}
      <h2 className="text-2xl font-bold text-gray-800">
        {itensMenu.find((i) => i.id === dashboard.paginaAtual)?.nome}
      </h2>

      {/* Lado direito: nome do usuário + botão sair */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">{usuario?.email}</span>
        <button
          onClick={fazerLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
