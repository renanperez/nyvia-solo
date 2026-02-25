// Benchmarks por mercado (Seção 3.1 - Marketing Predictive Analytics)
// Fontes: WordStream 2025, Wayno/Google Ads BR, ebrg.com.br, NeoAtlas BR

const benchmarks = [
  {
    mercado: "E-commerce Moda",
    split_display: 0.4,
    split_search: 0.6,
    ctr_display: 0.0046,
    ctr_search: 0.0677,
    cpm_display: 12.5,
    cpc_search: 1.5,
    taxa_conversao: 0.0175,
    cogs_pct: 0.48,
  },
  {
    mercado: "E-commerce Eletrônicos",
    split_display: 0.4,
    split_search: 0.6,
    ctr_display: 0.0046,
    ctr_search: 0.0623,
    cpm_display: 16.5,
    cpc_search: 2.5,
    taxa_conversao: 0.018,
    cogs_pct: 0.75,
  },
  {
    mercado: "SaaS B2B",
    split_display: 0.3,
    split_search: 0.7,
    ctr_display: 0.0046,
    ctr_search: 0.0565,
    cpm_display: 80.0,
    cpc_search: 7.0,
    taxa_conversao: 0.038,
    cogs_pct: 0.2,
  },
  {
    mercado: "Infoprodutos",
    split_display: 0.5,
    split_search: 0.5,
    ctr_display: 0.0046,
    ctr_search: 0.0574,
    cpm_display: 15.0,
    cpc_search: 3.5,
    taxa_conversao: 0.045,
    cogs_pct: 0.15,
  },
  {
    mercado: "Serviços Locais",
    split_display: 0.45,
    split_search: 0.55,
    ctr_display: 0.0046,
    ctr_search: 0.0769,
    cpm_display: 17.5,
    cpc_search: 4.0,
    taxa_conversao: 0.035,
    cogs_pct: 0.35,
  },
];

module.exports = benchmarks;
