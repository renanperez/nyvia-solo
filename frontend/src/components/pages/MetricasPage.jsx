import { useMetrics } from "../../hooks/useMetrics";

export function MetricasPage() {
  const metrics = useMetrics();

  return (
    <div className="space-y-6">
      {/* Formulário para criar métrica */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Criar Nova Métrica</h3>
        <form onSubmit={metrics.calcularMetricas} className="flex gap-4">
          <input
            type="text"
            placeholder="Nome da métrica"
            value={metrics.novaMetrica.nome}
            onChange={(e) =>
              metrics.setNovaMetrica({
                ...metrics.novaMetrica,
                nome: e.target.value,
              })
            }
            className="flex-1 border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Benchmark"
            value={metrics.novaMetrica.benchmark}
            onChange={(e) =>
              metrics.setNovaMetrica({
                ...metrics.novaMetrica,
                benchmark: e.target.value,
              })
            }
            className="w-32 border border-gray-300 rounded px-4 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </form>
      </div>

      {/* tabela de métricas do backend */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Lista de Métricas (do Backend)
          </h3>
        </div>
        {metrics.loading ? (
          <div className="p-6 text-center text-gray-500">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {metrics.metricas.map((metrica) => (
                <tr key={metrica.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{metrica.id}</td>
                  <td className="px-6 py-4">{metrica.nome}</td>
                  <td className="px-6 py-4">{metrica.benchmark.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
