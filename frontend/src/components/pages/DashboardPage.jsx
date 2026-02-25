//==============================================================
// Página de Dashboard: Exibe as principais métricas do sistema
//==============================================================

export function DashboardPage() {
  return (
    // Renderiza as métricas do dashboard quando a página atual é "dashboard"
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm text-gray-500">Total Vendas</div>
        <div className="text-3xl font-bold text-blue-600">R$ 12.450</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm text-gray-500">Produtos</div>
        <div className="text-3xl font-bold text-green-600">48</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm text-gray-500">Usuários Ativos</div>
        <div className="text-3xl font-bold text-purple-600">1.234</div>
      </div>
    </div>
  );
}
