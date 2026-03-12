import { useMetrics } from "../../hooks/useMetrics";
import { useDashboard } from "../../hooks/useDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

//==============================================================
// Página de Dashboard: Exibe KPIs, gráficos e insights da projeção
//==============================================================

// ── Helpers de formatação ────────────────────────────────────
const formatBRL = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatPct = (valor) => `${(valor * 100).toFixed(1)}%`;

// ── Gerador de insights textuais baseado nos dados reais ─────
function gerarInsights(projecao) {
  const primeiro = projecao[0];
  const ultimo = projecao[projecao.length - 1];
  const totalVendas = projecao.reduce((acc, m) => acc + m.total_sales, 0);
  const totalLucro = projecao.reduce((acc, m) => acc + m.profit, 0);
  const totalConversoes = projecao.reduce((acc, m) => acc + m.new_orders, 0);
  const insights = [];

  // ROI
  if (ultimo.roi > 0.5) {
    insights.push(
      `🚀 ROI de ${formatPct(ultimo.roi)} no mês ${ultimo.month} — retorno sólido. Considere aumentar o orçamento.`,
    );
  } else if (ultimo.roi > 0) {
    insights.push(
      `📈 ROI positivo de ${formatPct(ultimo.roi)} no mês ${ultimo.month} — campanha lucrativa com espaço para otimização.`,
    );
  } else {
    insights.push(
      `⚠️ ROI negativo no mês ${ultimo.month}. Revise CPC ou taxa de conversão.`,
    );
  }

  // LTV/CAC
  if (primeiro.ltv_cac >= 4) {
    insights.push(
      `✅ LTV/CAC de ${primeiro.ltv_cac.toFixed(2)} — excelente. Cada R$1 investido em aquisição gera R$${primeiro.ltv_cac.toFixed(2)} em valor de cliente.`,
    );
  } else if (primeiro.ltv_cac >= 3) {
    insights.push(
      `👍 LTV/CAC de ${primeiro.ltv_cac.toFixed(2)} — saudável. Margem positiva com espaço para crescer.`,
    );
  } else if (primeiro.ltv_cac >= 2) {
    insights.push(
      `⚡ LTV/CAC de ${primeiro.ltv_cac.toFixed(2)} — modesto. Otimize CAC ou aumente frequência de compra.`,
    );
  } else {
    insights.push(
      `🔴 LTV/CAC de ${primeiro.ltv_cac.toFixed(2)} — atenção. CAC está consumindo o valor do cliente.`,
    );
  }

  // Safety Margin
  if (primeiro.safety_margin > 0.3) {
    insights.push(
      `🛡️ Margem de segurança de ${formatPct(primeiro.safety_margin)} — campanha ${formatPct(primeiro.safety_margin)} acima do break even.`,
    );
  } else if (primeiro.safety_margin > 0) {
    insights.push(
      `⚠️ Margem de segurança baixa (${formatPct(primeiro.safety_margin)}). Pequenas variações podem zerar o lucro.`,
    );
  } else {
    insights.push(
      `🔴 Campanha abaixo do break even. Revise orçamento ou ticket médio.`,
    );
  }

  // Crescimento
  const crescimentoVendas =
    ((ultimo.total_sales - primeiro.total_sales) / primeiro.total_sales) * 100;
  insights.push(
    `📊 Receita cresce ${crescimentoVendas.toFixed(1)}% do mês 1 ao mês ${ultimo.month} — de ${formatBRL(primeiro.total_sales)} para ${formatBRL(ultimo.total_sales)}.`,
  );

  return insights;
}

export function DashboardPage() {
  const metrics = useMetrics();
  const dashboard = useDashboard();
  const projecao = metrics.projecao;

  // ── Estado vazio ─────────────────────────────────────────
  if (!projecao) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="text-6xl">📊</div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma projeção calculada ainda
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Preencha seus dados em Métricas e clique em Calcular para ver sua
            projeção.
          </p>
          <button
            onClick={() => dashboard.setPaginaAtual("metricas")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Ir para Métricas
          </button>
        </div>
      </div>
    );
  }

  // ── Dados calculados ─────────────────────────────────────
  const primeiro = projecao[0];
  const ultimo = projecao[projecao.length - 1];
  const totalVendas = projecao.reduce((acc, m) => acc + m.total_sales, 0);
  const totalLucro = projecao.reduce((acc, m) => acc + m.profit, 0);
  const totalConversoes = projecao.reduce((acc, m) => acc + m.new_orders, 0);
  const insights = gerarInsights(projecao);

  // ── Dados para gráficos ──────────────────────────────────
  const dadosGrafico = projecao.map((m) => ({
    mes: `M${m.month}`,
    Receita: parseFloat(m.total_sales.toFixed(2)),
    Lucro: parseFloat(m.profit.toFixed(2)),
    "Ad Spend": parseFloat(m.ad_spend.toFixed(2)),
  }));

  const dadosEficiencia = projecao.map((m) => ({
    mes: `M${m.month}`,
    ROAS: parseFloat(m.roas.toFixed(2)),
    "ROI (%)": parseFloat((m.roi * 100).toFixed(1)),
  }));

  const dadosCPA = projecao.map((m) => ({
    mes: `M${m.month}`,
    "CPA (R$)": parseFloat(m.cpa.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      {/* ── KPIs Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">Receita Total (12m)</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatBRL(totalVendas)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">Lucro Total (12m)</div>
          <div
            className={`text-2xl font-bold ${totalLucro >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatBRL(totalLucro)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">
            ROI mês {ultimo.month}
          </div>
          <div
            className={`text-2xl font-bold ${ultimo.roi >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatPct(ultimo.roi)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">Conversões Totais</div>
          <div className="text-2xl font-bold text-purple-600">
            {totalConversoes.toFixed(0)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">CPA médio</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatBRL(primeiro.cpa)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">LTV/CAC</div>
          <div
            className={`text-2xl font-bold ${primeiro.ltv_cac >= 3 ? "text-green-600" : "text-red-600"}`}
          >
            {primeiro.ltv_cac.toFixed(2)}x
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">ROAS mês 1</div>
          <div className="text-2xl font-bold text-blue-600">
            {primeiro.roas.toFixed(2)}x
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-xs text-gray-500 mb-1">Break Even (mês 1)</div>
          <div className="text-2xl font-bold text-gray-700">
            {primeiro.break_even_units.toFixed(0)} vendas
          </div>
        </div>
      </div>

      {/* ── Gráfico 1: Receita vs Lucro vs Ad Spend ────── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Receita · Lucro · Ad Spend — evolução mensal
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(value) => formatBRL(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Receita"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Lucro"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Ad Spend"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Gráfico 2: ROAS · ROI ─────────────────────────── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          ROAS · ROI (%) — eficiência mensal
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dadosEficiencia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="ROAS"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ROI (%)"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Gráfico 3: CPA ───────────────────────────────── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          CPA — custo por aquisição mensal
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dadosCPA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
            <Tooltip formatter={(value) => formatBRL(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="CPA (R$)"
              stroke="#ea580c"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Insights textuais ────────────────────────────── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          💡 Insights da Projeção
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="text-sm text-gray-700 bg-gray-50 rounded p-3"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
