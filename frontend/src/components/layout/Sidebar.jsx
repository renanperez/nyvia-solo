import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";

export function Sidebar({ menuAberto, setMenuAberto, itensMenu }) {
  const auth = useAuth();
  const dashboard = useDashboard();
  console.log("Sidebar dashboard.paginaAtual:", dashboard.paginaAtual);

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
            {auth.usuario?.workspaceNome || "Meu App"}
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
              onClick={() => dashboard.setPaginaAtual(item.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition ${
                dashboard.paginaAtual === item.id
                  ? "bg-gray-800 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="text-2xl">{item.icone}</span>
              <span className={`${!menuAberto && "hidden"}`}>{item.nome}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
