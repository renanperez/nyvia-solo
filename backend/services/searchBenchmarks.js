// Busca benchmark por mercado (substitui VLOOKUP do Excel)
// Baseado em Seção 3.1 do documento técnico

const benchmarks = require("../data/benchmarks");

/**
 * Busca dados de benchmark para um mercado específico
 * @param {string} market - Nome do mercado (ex: "SaaS B2B")
 * @returns {object|null} - Objeto com dados do benchmark ou null se não encontrado
 */
function searchBenchmarks(market) {
  const result = benchmarks.find((b) => b.mercado === market);

  if (!result) {
    return null;
  }

  return result;
}

module.exports = searchBenchmarks;
