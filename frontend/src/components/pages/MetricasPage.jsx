import { useMetrics } from "../../hooks/useMetrics";

//==============================================================
// Página de Métricas do dashboard, acessada pelo menu lateral
// *faz uso do hook de métricas para buscar e exibir as métricas do backend, 

//==============================================================

export function MetricasPage() {
  const metrics = useMetrics();

  return (
    <div className="space-y-6">
      {/* Formulário para criar métrica */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Criar Nova Métrica</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetch("http://localhost:3001/api/validar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(metrics.novaMetrica),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Validação:", data);
                alert(
                  data.valid
                    ? "✅ Dados válidos!"
                    : "❌ Erros:\n" +
                        data.errors
                          .map((e) => `- ${e.field}: ${e.message}`)
                          .join("\n"),
                );
              });
          }}
          className="flex flex-col gap-4"
        >
          {/* Campo Mercado */}
          <div>
            <label className="block text-sm font-medium mb-1">Mercado</label>
            <select
              value={metrics.novaMetrica.mercado || "SaaS B2B"}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  mercado: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="SaaS B2B">SaaS B2B</option>
              <option value="E-commerce Moda">E-commerce Moda</option>
              <option value="E-commerce Eletrônicos">
                E-commerce Eletrônicos
              </option>
              <option value="Infoprodutos">Infoprodutos</option>
              <option value="Serviços Locais">Serviços Locais</option>
            </select>
          </div>

          {/* Campo Orçamento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Orçamento (R$)
            </label>
            <input
              type="number"
              value={metrics.novaMetrica.orcamento || 5000}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  orcamento: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          {/* Campo Período */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Período (meses)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={metrics.novaMetrica.periodo_meses || 12}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  periodo_meses: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          {/* Campo % Budget PPC */}
          <div>
            <label className="block text-sm font-medium mb-1">
              % Budget PPC
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={metrics.novaMetrica.pct_budget_ppc || 1}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  pct_budget_ppc: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <span className="text-xs text-gray-500">
              Valor entre 0 e 1 (ex: 1 = 100%)
            </span>
          </div>

          {/* Campo Split Display/Search */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Split Display/Search (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={metrics.novaMetrica.split_display || 0.3}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  split_display: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              <p>% para Display (ex: 0.30 = 30% Display / 70% Search)</p>
              <p className="text-blue-600 mt-1">
                ℹ️ <strong>Display inclui:</strong> Google Display Network, Meta
                (Facebook/Instagram), YouTube, LinkedIn, TikTok e outras
                plataformas visuais.
                <strong> Search</strong> refere-se apenas ao Google Search
                (intenção de busca).
              </p>
            </div>
          </div>

          {/* Campo APF */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Freq. compra/ano (APF)
            </label>
            <input
              type="number"
              min="1"
              value={metrics.novaMetrica.apf || 12}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  apf: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <span className="text-xs text-gray-500">
              Frequência de compra por ano (ex: 12 = mensal)
            </span>
          </div>

          {/* Campo Crescimento Mensal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Crescimento mensal (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="0.20"
              value={metrics.novaMetrica.crescimento_mensal || 0.05}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  crescimento_mensal: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <span className="text-xs text-gray-500">
              Entre 0% e 20% (ex: 0.05 = 5% ao mês)
            </span>
          </div>

          {/* Campo Ticket Médio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ticket médio (R$)
            </label>
            <input
              type="number"
              min="0"
              value={metrics.novaMetrica.ticket_medio || 100}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  ticket_medio: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <span className="text-xs text-gray-500">
              Valor médio de venda por cliente
            </span>
          </div>

          {/* Campo Customer Lifespan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Lifespan (anos)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={metrics.novaMetrica.customer_lifespan_anos || 1}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  customer_lifespan_anos: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <span className="text-xs text-gray-500">
              Tempo médio que um cliente permanece ativo
            </span>
          </div>

          {/* Campo COGS */}
          <div>
            <label className="block text-sm font-medium mb-1">COGS (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.novaMetrica.cogs || ""}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  cogs: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Opcional - usa benchmark se vazio"
            />
            <span className="text-xs text-gray-500">
              Custo do produto em R$ (opcional - usa benchmark do mercado se não
              informado)
            </span>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Validar
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
