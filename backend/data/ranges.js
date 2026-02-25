// Ranges de Referência por mercado (Seção 3.2 - Marketing Predictive Analytics)
// Usado para validações e guardrails

const ranges = [
  {
    mercado: "E-commerce Moda",
    cogs_min: 0.3,
    cogs_max: 0.65,
    ticket_min: 30,
    ticket_max: 500,
    apf_min: 1,
    apf_max: 6,
    lifespan_min: 1,
    lifespan_max: 3,
  },
  {
    mercado: "E-commerce Eletrônicos",
    cogs_min: 0.6,
    cogs_max: 0.85,
    ticket_min: 100,
    ticket_max: 3000,
    apf_min: 1,
    apf_max: 3,
    lifespan_min: 1,
    lifespan_max: 4,
  },
  {
    mercado: "SaaS B2B",
    cogs_min: 0.1,
    cogs_max: 0.35,
    ticket_min: 50,
    ticket_max: 2000,
    apf_min: 12,
    apf_max: 12,
    lifespan_min: 1,
    lifespan_max: 5,
  },
  {
    mercado: "Infoprodutos",
    cogs_min: 0.05,
    cogs_max: 0.25,
    ticket_min: 20,
    ticket_max: 500,
    apf_min: 1,
    apf_max: 4,
    lifespan_min: 1,
    lifespan_max: 3,
  },
  {
    mercado: "Serviços Locais",
    cogs_min: 0.2,
    cogs_max: 0.5,
    ticket_min: 50,
    ticket_max: 1000,
    apf_min: 1,
    apf_max: 6,
    lifespan_min: 1,
    lifespan_max: 5,
  },
];

module.exports = ranges;
