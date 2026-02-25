// Validação de inputs do usuário (Seção 2 - Documento Técnico)

const searchBenchmarks = require("../services/searchBenchmarks");
const ranges = require("../data/ranges");

/**
 * Valida todos os inputs recebidos do frontend
 * @param {object} inputs - Dados enviados pelo usuário
 * @returns {object} - { valid: boolean, errors: [], warnings: [] }
 */
function validateInputs(inputs) {
  const errors = [];
  const warnings = [];

  // ========================================
  // 2.1 CONFIGURAÇÃO DE CAMPANHA
  // ========================================

  // Mercado
  if (!inputs.mercado) {
    errors.push({ field: "mercado", message: "Mercado é obrigatório" });
  } else {
    const benchmark = searchBenchmarks(inputs.mercado);
    if (!benchmark) {
      errors.push({ field: "mercado", message: "Mercado inválido" });
    }
  }

  // Objetivo + Split sugerido
  if (inputs.objetivo) {
    let split_sugerido;
    let justificativa;

    switch (inputs.objetivo) {
      case "Reconhecimento":
        split_sugerido = 0.7;
        justificativa =
          "Prioriza alcance visual e massa crítica; Search captura interesse gerado";
        break;
      case "Gerar leads":
        split_sugerido = 0.4;
        justificativa =
          "Search captura alta intenção; Display (remarketing) mantém marca presente";
        break;
      case "Aumentar vendas":
        split_sugerido = 0.2;
        justificativa =
          "Concentra onde conversão é direta; Display restrito a retargeting agressivo";
        break;
      default:
        split_sugerido = 0.3;
        justificativa = "";
    }

    // Se usuário não especificou split, usar sugerido
    if (inputs.split_display === undefined || inputs.split_display === null) {
      inputs.split_display = split_sugerido;
    }

    // Se usuário especificou mas está diferente do ideal, avisar
    if (Math.abs(inputs.split_display - split_sugerido) > 0.15) {
      warnings.push({
        field: "split_display",
        message: `Para objetivo "${inputs.objetivo}", recomendamos ${split_sugerido * 100}% Display. ${justificativa}`,
      });
    }
  }

  // Orçamento
  if (!inputs.orcamento || inputs.orcamento <= 0) {
    errors.push({
      field: "orcamento",
      message: "Orçamento deve ser maior que zero",
    });
  }

  // Período
  if (
    !inputs.periodo_meses ||
    inputs.periodo_meses < 1 ||
    inputs.periodo_meses > 12
  ) {
    errors.push({
      field: "periodo_meses",
      message: "Período deve estar entre 1 e 12 meses",
    });
  }

  // % Budget PPC
  if (
    inputs.pct_budget_ppc === undefined ||
    inputs.pct_budget_ppc < 0 ||
    inputs.pct_budget_ppc > 1
  ) {
    errors.push({
      field: "pct_budget_ppc",
      message: "% Budget PPC deve estar entre 0 e 1",
    });
  }

  // Split Display/Search
  if (inputs.split_display < 0 || inputs.split_display > 1) {
    errors.push({
      field: "split_display",
      message: "Split Display deve estar entre 0 e 1",
    });
  }

  // APF (Freq. compra/ano)
  if (!inputs.apf || inputs.apf < 1) {
    errors.push({ field: "apf", message: "APF deve ser no mínimo 1" });
  } else if (inputs.mercado) {
    const range = ranges.find((r) => r.mercado === inputs.mercado);
    if (range && (inputs.apf < range.apf_min || inputs.apf > range.apf_max)) {
      warnings.push({
        field: "apf",
        message: `APF fora da faixa típica (${range.apf_min}-${range.apf_max}x/ano) para ${inputs.mercado}`,
      });
    }
  }

  // Crescimento mensal
  if (
    inputs.crescimento_mensal === undefined ||
    inputs.crescimento_mensal < 0 ||
    inputs.crescimento_mensal > 0.2
  ) {
    errors.push({
      field: "crescimento_mensal",
      message: "Crescimento mensal deve estar entre 0% e 20%",
    });
  }
  if (inputs.crescimento_mensal > 0.1) {
    warnings.push({
      field: "crescimento_mensal",
      message:
        "Crescimento acima de 10%/mês pode exigir múltiplos ajustes para não disparar learning phase",
    });
  }

  // ========================================
  // 2.2 DADOS DA EMPRESA
  // ========================================

  // Ticket médio
  if (!inputs.ticket_medio || inputs.ticket_medio <= 0) {
    errors.push({
      field: "ticket_medio",
      message: "Ticket médio deve ser maior que zero",
    });
  } else if (inputs.mercado) {
    const range = ranges.find((r) => r.mercado === inputs.mercado);
    if (
      range &&
      (inputs.ticket_medio < range.ticket_min ||
        inputs.ticket_medio > range.ticket_max)
    ) {
      warnings.push({
        field: "ticket_medio",
        message: `Ticket fora da faixa típica (R$${range.ticket_min} - R$${range.ticket_max}) para ${inputs.mercado}`,
      });
    }
  }

  // Customer Lifespan
  if (!inputs.customer_lifespan_anos || inputs.customer_lifespan_anos <= 0) {
    errors.push({
      field: "customer_lifespan_anos",
      message: "Customer Lifespan deve ser maior que zero",
    });
  } else if (inputs.mercado) {
    const range = ranges.find((r) => r.mercado === inputs.mercado);
    if (
      range &&
      (inputs.customer_lifespan_anos < range.lifespan_min ||
        inputs.customer_lifespan_anos > range.lifespan_max)
    ) {
      warnings.push({
        field: "customer_lifespan_anos",
        message: `Lifespan fora da faixa típica (${range.lifespan_min}-${range.lifespan_max} anos) para ${inputs.mercado}`,
      });
    }
  }

  // COGS (opcional - usa benchmark se não informado)
  if (inputs.cogs !== undefined && inputs.cogs < 0) {
    errors.push({ field: "cogs", message: "COGS não pode ser negativo" });
  }

  // ========================================
  // 2.3 MÉTRICAS DE MÍDIA (editáveis)
  // ========================================

  // CTR Display (qualquer valor > 0)
  if (inputs.ctr_display !== undefined && inputs.ctr_display <= 0) {
    errors.push({
      field: "ctr_display",
      message: "CTR Display deve ser maior que zero",
    });
  }

  // CTR Search (qualquer valor > 0)
  if (inputs.ctr_search !== undefined && inputs.ctr_search <= 0) {
    errors.push({
      field: "ctr_search",
      message: "CTR Search deve ser maior que zero",
    });
  }

  // CPM Display (qualquer valor > 0)
  if (inputs.cpm_display !== undefined && inputs.cpm_display <= 0) {
    errors.push({
      field: "cpm_display",
      message: "CPM Display deve ser maior que zero",
    });
  }

  // CPC Search (qualquer valor > 0)
  if (inputs.cpc_search !== undefined && inputs.cpc_search <= 0) {
    errors.push({
      field: "cpc_search",
      message: "CPC Search deve ser maior que zero",
    });
  }

  // Taxa de Conversão (qualquer valor > 0)
  if (inputs.taxa_conversao !== undefined && inputs.taxa_conversao <= 0) {
    errors.push({
      field: "taxa_conversao",
      message: "Taxa de conversão deve ser maior que zero",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = validateInputs;
