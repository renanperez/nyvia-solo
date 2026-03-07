import { useMetrics } from "../../hooks/useMetrics";

//==============================================================
// Página de Métricas do dashboard, acessada pelo menu lateral
// *faz uso do hook de métricas para buscar e exibir as métricas do backend,
// e para enviar os dados do formulário de métrica para validação no backend
//==============================================================

export function MetricasPage() {
  const metrics = useMetrics();

  return (
    <div className="space-y-6">
      {/* Formulário para métricas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4"></h3>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            fetch("http://localhost:3001/api/validar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(metrics.novaMetrica),
            })
              .then((res) => res.json())
              .then((data) => {
                metrics.setValidacao(data); // Armazena resultadodo backend de validação no estado 'validacao'
              });
          }}
          className="flex flex-col gap-4"
        >
          {/* ========== SEÇÃO: CONFIGURAÇÃO DA CAMPANHA ========== */}
          <div className="border-b-2 border-gray-200 pb-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              CONFIGURAÇÃO DA CAMPANHA
            </h4>
            <p className="text-xs text-gray-500">
              Defina os parâmetros. Esses dados determinam toda a projeção.
            </p>
          </div>

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
            <span className="text-xs text-gray-500">
              A escolha o mercado que mais se encaixa com seu negócio. Os
              benchmarks e ranges serão carregados com base nessa escolha, mas
              poderá editar os dados se tiver informações próprias.
            </span>
          </div>

          {/* Campo Objetivo */}
          <div>
            <label className="block text-sm font-medium mb-1">Objetivo</label>
            <select
              value={metrics.novaMetrica.objetivo || "Gerar leads"}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  objetivo: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="Gerar leads">Gerar leads</option>
              <option value="Aumentar vendas">Aumentar vendas</option>
              <option value="Reconhecimento">Reconhecimento</option>
            </select>
            <span className="text-xs text-gray-500">
              Define o foco da campanha: geração de leads, aumento de vendas ou
              reconhecimento de marca. O objetivo pode influenciar as
              recomendações de canais e métricas.
            </span>
          </div>

          {/* Campo Orçamento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Orçamento (R$)
            </label>
            <input
              type="number"
              min="0"
              value={
                metrics.novaMetrica.orcamento === 0
                  ? ""
                  : metrics.novaMetrica.orcamento || ""
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  orcamento: Number(e.target.value),
                });
              }}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />

            <span className="text-xs text-gray-500">
              Orçamento total para o período definido. Ex: 1000 para R$1.000
            </span>
          </div>

          {/* Campo % Budget PPC */}
          <div>
            <label className="block text-sm font-medium mb-1">
              % Orçamento Mídia Paga (PPC)
            </label>
            <input
              type="number"
              value={metrics.novaMetrica.pct_budget_ppc || 1}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  pct_budget_ppc: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <span className="text-xs text-gray-500">
              % do total do orçamento destinado a mídia paga: entre 0 e 1 (ex: 1
              = 100%)
            </span>
          </div>

          {/* Divisão Display/Search */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Divisão de Orçamento (%)
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* Display */}
              <div>
                <label className="text-xs text-gray-600">Display</label>
                <input
                  type="number"
                  value={(metrics.novaMetrica.split_display * 100).toFixed(0)}
                  onChange={(e) => {
                    const displayPct = Number(e.target.value) / 100;
                    metrics.setNovaMetrica({
                      ...metrics.novaMetrica,
                      split_display: displayPct,
                      split_search: 1 - displayPct, // Auto-ajusta
                    });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Search */}
              <div>
                <label className="text-xs text-gray-600">Search</label>
                <input
                  type="number"
                  value={(metrics.novaMetrica.split_search * 100).toFixed(0)}
                  onChange={(e) => {
                    const searchPct = Number(e.target.value) / 100;
                    metrics.setNovaMetrica({
                      ...metrics.novaMetrica,
                      split_search: searchPct,
                      split_display: 1 - searchPct, // Auto-ajusta
                    });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Validação: soma deve ser 100% */}
            {Math.abs(
              metrics.novaMetrica.split_display +
                metrics.novaMetrica.split_search -
                1,
            ) > 0.01 && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Total deve somar 100%
              </p>
            )}
          </div>

          {/* Sugestão baseada em objetivo */}
          {(() => {
            let splitIdeal, justificativa;

            switch (metrics.novaMetrica.objetivo) {
              case "Reconhecimento":
                splitIdeal = "70% Display / 30% Search";
                justificativa =
                  "Prioriza alcance visual; Search captura interesse gerado";
                break;
              case "Gerar leads":
                splitIdeal = "40% Display / 60% Search";
                justificativa =
                  "Search captura alta intenção; Display mantém marca presente";
                break;
              case "Aumentar vendas":
                splitIdeal = "20% Display / 80% Search";
                justificativa = "Concentra onde conversão é direta";
                break;
              default:
                splitIdeal = "30% Display / 70% Search";
                justificativa = "";
            }

            return (
              <p className="text-xs text-gray-500">
                % Sugerido para "{metrics.novaMetrica.objetivo}": {splitIdeal} -{" "}
                {justificativa}
              </p>
            );
          })()}

          {/* Campo APF */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Frequência de compra/ano (APF)
            </label>

            <input
              type="number"
              value={
                metrics.novaMetrica.apf === undefined
                  ? ""
                  : metrics.novaMetrica.apf
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  apf: valor === "" ? undefined : Number(valor),
                });
              }}
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.apf !== undefined &&
                  (metrics.novaMetrica.apf < metrics.ranges.apf_min ||
                    metrics.novaMetrica.apf > metrics.ranges.apf_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Texto explicativo + range */}
            {metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Frequência de compra por ano: de {metrics.ranges.apf_min} -
                {metrics.ranges.apf_max}x/ano ({metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo Crescimento Mensal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Crescimento mensal (%)
            </label>
            <input
              type="number"
              value={metrics.novaMetrica.crescimento_mensal ?? ""}
              onChange={(e) =>
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  crescimento_mensal: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Ex: 0.05 para 5% de crescimento ao mês"
            />
            <span className="text-xs text-gray-500">
              % de crescimento mensal entre 0% e 20% (ex: 0.05 = cresce 5% ao
              mês)
            </span>
          </div>

          {/* ========== SEÇÃO: DADOS DA SUA EMPRESA ========== */}
          <div className="border-b-2 border-gray-200 pb-2 mb-4 mt-6">
            <h4 className="text-lg font-semibold text-gray-800">
              DADOS DA SUA EMPRESA
            </h4>
            <p className="text-xs text-gray-500">
              Ticket, Lifespan e COGS impactam CLTV e margem.
            </p>
          </div>

          {/* Campo Ticket médio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ticket médio (R$)
            </label>

            <input
              type="number"
              value={
                metrics.novaMetrica.ticket_medio === undefined
                  ? ""
                  : metrics.novaMetrica.ticket_medio
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  ticket_medio: valor === "" ? undefined : Number(valor),
                });
              }}
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.ticket_medio !== undefined &&
                  (metrics.novaMetrica.ticket_medio <
                    metrics.ranges.ticket_min ||
                    metrics.novaMetrica.ticket_medio >
                      metrics.ranges.ticket_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Texto descritivo */}
            {metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Valor médio de venda por cliente: R${metrics.ranges.ticket_min}{" "}
                - R${metrics.ranges.ticket_max}
              </p>
            )}
          </div>

          {/* Campo Customer Lifespan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Permanência do Cliente (anos)
            </label>

            <input
              type="number"
              value={
                metrics.novaMetrica.customer_lifespan_anos === undefined
                  ? ""
                  : metrics.novaMetrica.customer_lifespan_anos
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  customer_lifespan_anos:
                    valor === "" ? undefined : Number(valor),
                });
              }}
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.customer_lifespan_anos !== undefined &&
                  (metrics.novaMetrica.customer_lifespan_anos <
                    metrics.ranges.lifespan_min ||
                    metrics.novaMetrica.customer_lifespan_anos >
                      metrics.ranges.lifespan_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Texto explicativo + range */}
            {metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Tempo médio que um cliente permanece ativo:{" "}
                {metrics.ranges.lifespan_min}-{metrics.ranges.lifespan_max} anos
                ({metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo COGS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Custos Diretos (R$)
            </label>

            <input
              type="number"
              value={
                metrics.novaMetrica.cogs === undefined
                  ? ""
                  : metrics.novaMetrica.cogs
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  cogs: valor === "" ? undefined : Number(valor),
                });
              }}
              placeholder="Opcional - usa benchmark do mercado se vazio"
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.cogs !== undefined &&
                  metrics.novaMetrica.ticket_medio &&
                  (metrics.novaMetrica.cogs <
                    metrics.novaMetrica.ticket_medio *
                      metrics.ranges.cogs_min ||
                    metrics.novaMetrica.cogs >
                      metrics.novaMetrica.ticket_medio *
                        metrics.ranges.cogs_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Texto explicativo + sugestão */}
            {metrics.ranges && metrics.novaMetrica.ticket_medio && (
              <p className="text-xs text-gray-500 mt-1">
                Custo direto de entrega (produto/serviço): R$
                {(
                  metrics.novaMetrica.ticket_medio * metrics.ranges.cogs_min
                ).toFixed(2)}{" "}
                - R$
                {(
                  metrics.novaMetrica.ticket_medio * metrics.ranges.cogs_max
                ).toFixed(2)}{" "}
                ({metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* ========== SEÇÃO: MÉTRICAS DE MÍDIA ========== */}
          <div className="border-b-2 border-gray-200 pb-2 mb-4 mt-6">
            <h4 className="text-lg font-semibold text-gray-800">
              MÉTRICAS DE MÍDIA
            </h4>
            <p className="text-xs text-gray-500">
              Pré-preenchidos via Benchmarks. Edite se tiver dados próprios.
            </p>
          </div>

          {/* Campo CTR Display */}
          <div>
            <label className="block text-sm font-medium mb-1">
              CTR Display (%)
            </label>
            <input
              type="number"
              value={
                metrics.novaMetrica.ctr_display === undefined
                  ? ""
                  : metrics.novaMetrica.ctr_display * 100
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  ctr_display: valor === "" ? undefined : Number(valor) / 100, // Converte % para decimal
                });
              }}
              placeholder="Ex: 0.6 para 0.6%"
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.ctr_display !== undefined &&
                  (metrics.novaMetrica.ctr_display <
                    metrics.ranges.ctr_display_min ||
                    metrics.novaMetrica.ctr_display >
                      metrics.ranges.ctr_display_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Benchmark + range */}
            {metrics.benchmarks && metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Taxa de cliques Display:{" "}
                {(metrics.benchmarks.ctr_display * 100).toFixed(2)}%, faixa
                (entre): {(metrics.ranges.ctr_display_min * 100).toFixed(2)}%-
                {(metrics.ranges.ctr_display_max * 100).toFixed(2)}% - (
                {metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo CTR Search */}
          <div>
            <label className="block text-sm font-medium mb-1">
              CTR Search (%)
            </label>
            <input
              type="number"
              value={
                metrics.novaMetrica.ctr_search === undefined
                  ? ""
                  : metrics.novaMetrica.ctr_search * 100
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  ctr_search: valor === "" ? undefined : Number(valor) / 100, // Converte % para decimal
                });
              }}
              placeholder="Ex: 5.65 para 5.65%"
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.ctr_search !== undefined &&
                  (metrics.novaMetrica.ctr_search <
                    metrics.ranges.ctr_search_min ||
                    metrics.novaMetrica.ctr_search >
                      metrics.ranges.ctr_search_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Benchmark + range */}
            {metrics.benchmarks && metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Taxa de cliques Search:{" "}
                {(metrics.benchmarks.ctr_search * 100).toFixed(2)}%, faixa
                (entre): {(metrics.ranges.ctr_search_min * 100).toFixed(2)}%-
                {(metrics.ranges.ctr_search_max * 100).toFixed(2)}% - (
                {metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo CPM Display */}
          <div>
            <label className="block text-sm font-medium mb-1">
              CPM Display (R$)
            </label>
            <input
              type="number"
              value={
                metrics.novaMetrica.cpm_display === undefined
                  ? ""
                  : metrics.novaMetrica.cpm_display
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  cpm_display: valor === "" ? undefined : Number(valor),
                });
              }}
              placeholder="Usa benchmark se vazio"
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.cpm_display !== undefined &&
                  (metrics.novaMetrica.cpm_display < metrics.ranges.cpm_min ||
                    metrics.novaMetrica.cpm_display > metrics.ranges.cpm_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Benchmark sugerido + range */}
            {metrics.benchmarks && metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Custo por 1.000 impressões Display: R$
                {metrics.benchmarks.cpm_display.toFixed(2)}, faixa (entre): R$
                {metrics.ranges.cpm_min.toFixed(2)}-R$
                {metrics.ranges.cpm_max.toFixed(2)} - (
                {metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo CPC Search */}
          <div>
            <label className="block text-sm font-medium mb-1">
              CPC Search (R$)
            </label>
            <input
              type="number"
              value={
                metrics.novaMetrica.cpc_search === undefined
                  ? ""
                  : metrics.novaMetrica.cpc_search
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  cpc_search: valor === "" ? undefined : Number(valor),
                });
              }}
              placeholder="Usa benchmark se vazio"
              className={`
                w-full px-4 py-2 border-2 rounded
                ${
                  metrics.ranges &&
                  metrics.novaMetrica.cpc_search !== undefined &&
                  (metrics.novaMetrica.cpc_search < metrics.ranges.cpc_min ||
                    metrics.novaMetrica.cpc_search > metrics.ranges.cpc_max)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300"
                }
              `}
            />

            {/* Benchmark sugerido + range */}
            {metrics.benchmarks && metrics.ranges && (
              <p className="text-xs text-gray-500 mt-1">
                Custo por clique Search: R$
                {metrics.benchmarks.cpc_search.toFixed(2)}, faixa (entre): R$
                {metrics.ranges.cpc_min.toFixed(2)}-R$
                {metrics.ranges.cpc_max.toFixed(2)} - (
                {metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          {/* Campo Taxa de Conversão */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Taxa de Conversão (%)
            </label>
            <input
              type="number"
              value={
                metrics.novaMetrica.taxa_conversao === undefined
                  ? ""
                  : metrics.novaMetrica.taxa_conversao * 100
              }
              onChange={(e) => {
                const valor = e.target.value;
                metrics.setNovaMetrica({
                  ...metrics.novaMetrica,
                  taxa_conversao:
                    valor === "" ? undefined : Number(valor) / 100, // Converte % para decimal
                });
              }}
              placeholder="Ex: 3.8 para 3.8%"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded"
            />

            {/* Benchmark sugerido */}
            {metrics.benchmarks && (
              <p className="text-xs text-gray-500 mt-1">
                Percentual de visitantes que convertem:{" "}
                {(metrics.benchmarks.taxa_conversao * 100).toFixed(2)}% - (
                {metrics.novaMetrica.mercado})
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Validar
          </button>
        </form>
      </div>

      {/* Exibição das métricas calculadas */}
    </div>
  );
}
