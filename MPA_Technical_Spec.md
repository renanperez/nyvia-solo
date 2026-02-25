# Marketing Predictive Analytics (MPA) — Especificação Técnica Completa

## Documento para implementação em SaaS (JavaScript/Node.js)

---

## 1. VISÃO GERAL

Sistema de projeção de marketing preditivo para mercado brasileiro. Recebe inputs do usuário (orçamento, ticket, COGS, mercado), aplica benchmarks por segmento, e calcula métricas de aquisição, receita, lucratividade e lifetime value para projeção mensal (1-12 meses).

### Arquitetura lógica

```
INPUTS (Dashboard) → BENCHMARKS (por mercado) → CÁLCULOS (por mês) → RESULTADOS (Dashboard display)
```

---

## 2. INPUTS DO USUÁRIO

Todos editáveis. Coluna B = input, Coluna C = guardrail (referência benchmark).

### 2.1 Configuração de Campanha

| Campo                | Tipo          | Default (SaaS B2B) | Validação                                          |
| -------------------- | ------------- | ------------------ | -------------------------------------------------- |
| `mercado`            | string (enum) | "SaaS B2B"         | Deve existir na tabela de benchmarks               |
| `objetivo`           | string (enum) | "Gerar leads"      | "Reconhecimento", "Gerar leads", "Aumentar vendas" |
| `orcamento`          | number (R$)   | 5000               | > 0                                                |
| `periodo_meses`      | integer       | 1                  | 1 a 12                                             |
| `pct_budget_ppc`     | decimal (0-1) | 1.0                | 0 a 1                                              |
| `split_display`      | decimal (0-1) | 0.3                | 0 a 1 (% do ad spend que vai pra Display)          |
| `apf`                | integer       | 1                  | >= 1 (frequência de compra por ano)                |
| `crescimento_mensal` | decimal       | 0.05               | 0 a 1                                              |

### 2.2 Dados da Empresa

| Campo                    | Tipo        | Default | Validação                                         |
| ------------------------ | ----------- | ------- | ------------------------------------------------- |
| `ticket_medio`           | number (R$) | 100     | > 0                                               |
| `customer_lifespan_anos` | number      | 1       | > 0                                               |
| `cogs`                   | number (R$) | 48      | >= 0, valor monetário por cliente, NÃO percentual |

### 2.3 Métricas de Mídia (pré-preenchidos por benchmark, editáveis)

| Campo            | Tipo        | Default (SaaS B2B) | Fonte                        |
| ---------------- | ----------- | ------------------ | ---------------------------- |
| `ctr_display`    | decimal     | 0.0046             | WordStream global proxy      |
| `ctr_search`     | decimal     | 0.0565             | WordStream global proxy      |
| `cpm_display`    | number (R$) | 80                 | ebrg.com.br / V4 Company BR  |
| `cpc_search`     | number (R$) | 7                  | Wayno/Google Ads Brasil 2024 |
| `taxa_conversao` | decimal     | 0.038              | NeoAtlas BR / Leadster 2025  |

---

## 3. TABELA DE BENCHMARKS (dados brasileiros)

### 3.1 Benchmarks por Mercado

| Mercado                | Split Display | Split Search | CTR Display | CTR Search | CPM Display (R$) | CPC Search (R$) | Taxa Conversão | COGS % |
| ---------------------- | ------------- | ------------ | ----------- | ---------- | ---------------- | --------------- | -------------- | ------ |
| E-commerce Moda        | 0.40          | 0.60         | 0.0046      | 0.0677     | 12.5             | 1.50            | 0.0175         | 0.48   |
| E-commerce Eletrônicos | 0.40          | 0.60         | 0.0046      | 0.0623     | 16.5             | 2.50            | 0.0180         | 0.75   |
| SaaS B2B               | 0.30          | 0.70         | 0.0046      | 0.0565     | 80.0             | 7.00            | 0.0380         | 0.20   |
| Infoprodutos           | 0.50          | 0.50         | 0.0046      | 0.0574     | 15.0             | 3.50            | 0.0450         | 0.15   |
| Serviços Locais        | 0.45          | 0.55         | 0.0046      | 0.0769     | 17.5             | 4.00            | 0.0350         | 0.35   |

### 3.2 Ranges de Referência (guardrails)

| Mercado                | COGS Min | COGS Max | Ticket Min | Ticket Max | APF Min | APF Max | Lifespan Min | Lifespan Max |
| ---------------------- | -------- | -------- | ---------- | ---------- | ------- | ------- | ------------ | ------------ |
| E-commerce Moda        | 0.30     | 0.65     | 30         | 500        | 1       | 6       | 1            | 3            |
| E-commerce Eletrônicos | 0.60     | 0.85     | 100        | 3000       | 1       | 3       | 1            | 4            |
| SaaS B2B               | 0.10     | 0.35     | 50         | 2000       | 12      | 12      | 1            | 5            |
| Infoprodutos           | 0.05     | 0.25     | 20         | 500        | 1       | 4       | 1            | 3            |
| Serviços Locais        | 0.20     | 0.50     | 50         | 1000       | 1       | 6       | 1            | 5            |

### 3.3 Fatores Temporais (evolução mensal)

Aplicados ao CPC e à taxa de conversão conforme o mês avança (learning period do Google Ads).

| Mês  | Fator CPC | Fator Conversão | Descrição                                |
| ---- | --------- | --------------- | ---------------------------------------- |
| 1    | 1.00      | 1.00            | Cold start / Learning period             |
| 2    | 0.97      | 1.00            | Ainda em learning (~2-3 semanas)         |
| 3    | 0.92      | 1.03            | Saída do learning, primeiras otimizações |
| 4    | 0.88      | 1.05            | Quality Score melhorando                 |
| 5    | 0.85      | 1.07            | Otimização contínua, negative keywords   |
| 6    | 0.83      | 1.08            | Campanha madura                          |
| 7    | 0.81      | 1.09            | Estabilização                            |
| 8    | 0.80      | 1.10            | Platô de eficiência                      |
| 9-12 | 0.80      | 1.10            | Mantém platô                             |

### 3.4 Fontes dos Benchmarks

- **CTR Search**: WordStream 2025 Google Ads Benchmarks (16.446 campanhas, abr/2024-mar/2025) — proxy global
- **CTR Display**: WordStream/Store Growers (~0.46% média GDN global) — proxy global
- **CPC Search (R$)**: Wayno/Google Ads Benchmarks Brasil 2024 + Redbit (faixas por segmento brasileiro)
- **CPM Display (R$)**: ebrg.com.br 2025 + V4 Company 2025 (dados nacionais BR)
- **Taxa Conversão**: NeoAtlas BR, Leadster 2025, mLabs/Unbounce (benchmarks brasileiros por segmento)
- **COGS%**: TrueProfit, OpenSend, NYU Stern (margens brutas por setor)

---

## 4. MOTOR DE CÁLCULO

Calcula para cada mês (1 a `periodo_meses`). Cada mês é uma "row".

### 4.1 Coluna A-F: Budget

```
calendar           = mes (1, 2, 3... até periodo_meses)
period             = periodo_meses (constante)
marketing_budget   = orcamento
pct_budget_ppc     = pct_budget_ppc (constante)
ad_spend           = marketing_budget * pct_budget_ppc
```

### 4.2 Coluna G-K: Display

```
display_budget       = ad_spend * split_display
impressions_display  = IF(cpm_display == 0, 0, (display_budget / cpm_display) * 1000)
clicks_display       = impressions_display * ctr_display
cpm_display_calc     = IF(impressions_display == 0, 0, (display_budget / impressions_display) * 1000)
ctr_display_calc     = IF(impressions_display == 0, 0, clicks_display / impressions_display)
```

**NOTA**: Display usa lógica CPM (Budget → CPM → Impressões → CTR → Clicks).

### 4.3 Coluna L-P: Search

```
search_budget        = ad_spend * (1 - split_display)
cpc_ajustado         = cpc_search * fator_cpc[mes]         // Benchmarks temporal
cvr_ajustado         = taxa_conversao * fator_conversao[mes] // Benchmarks temporal
clicks_search        = IF(cpc_ajustado == 0, 0, search_budget / cpc_ajustado)
impressions_search   = IF(ctr_search == 0, 0, clicks_search / ctr_search)
cpc_search_calc      = IF(clicks_search == 0, 0, search_budget / clicks_search)
ctr_search_calc      = IF(impressions_search == 0, 0, clicks_search / impressions_search)
```

**NOTA**: Search usa lógica CPC (Budget → CPC → Clicks → CTR → Impressões). Fórmula de clicks_search na planilha: `L / (Dashboard!B26 * VLOOKUP(mes, Benchmarks!M:N, 2, FALSE))`.

### 4.4 Coluna Q-V: Performance

```
visitors             = clicks_display + clicks_search
sessions             = visitors * 1        // Sessions = Visitors (ratio 1:1)
sessions_per_user    = 1                   // Documentação
new_orders           = visitors * cvr_ajustado
conversion_rate      = cvr_ajustado
roas                 = IF(ad_spend == 0, 0, total_sales / ad_spend)
```

### 4.5 Coluna W-AD: Revenue & Diferença (v3 original preservado)

```
break_even_roas      = IF(ad_spend == 0, 0, total_sales / ad_spend)
revenue_minus_adspend = total_sales - ad_spend
roi_pct_adspend      = IF(ad_spend == 0, 0, revenue_minus_adspend / ad_spend)
customer_acquisition = new_orders
ticket               = ticket_medio (input)
total_sales          = ticket * customer_acquisition
difference           = total_sales - ad_spend
pct_variation        = IF(marketing_budget == 0, 0, difference / marketing_budget)
```

### 4.6 Coluna AE-AQ: Profitability v3 (legado, mantido)

```
cac_adspend_only     = IF(customers == 0, 0, ad_spend / customers)
rpc                  = IF(customers == 0, 0, total_sales / customers)
cogs_rs              = cogs (input em R$, valor monetário direto)
gp_per_customer      = rpc - cogs_rs
gp_margin            = IF(rpc == 0, 0, gp_per_customer / rpc)
aov                  = IF(new_orders == 0, 0, total_sales / new_orders)
apf                  = apf (input)
acl                  = customer_lifespan_anos (input)
cltv                 = aov * apf * acl
revenue_profit_lt    = cltv - cogs_rs
break_even_cac_v3    = cltv * gp_margin
ltv_cac_v3           = IF(cac_adspend_only == 0, 0, cltv / cac_adspend_only)
status_v3            = classificacao_ltv_cac(ltv_cac_v3)
```

### 4.7 Coluna AR-AY: Profitability v4 (Revenue Growth — CORRIGIDO)

**Estas são as fórmulas corrigidas que incluem COGS no custo total.**

```
total_cogs           = customers * cogs_rs
cogs_plus_adspend    = total_cogs + ad_spend
cac_full             = IF(customers == 0, 0, cogs_plus_adspend / customers)
lucro                = total_sales - cogs_plus_adspend
roi                  = IF(cogs_plus_adspend == 0, 0, lucro / cogs_plus_adspend)
break_even_cac       = IF(gp_per_customer == 0, 0, cac_full / gp_per_customer)
ltv_cac_full         = IF(cac_full == 0, 0, cltv / cac_full)
status_full          = classificacao_ltv_cac(ltv_cac_full)
```

### 4.8 Marketing Efficiency Ratio (MER)

```
mer = IF(marketing_budget == 0, 0, total_sales / marketing_budget)
```

---

## 5. FÓRMULAS ROW 15 (TOTAIS)

Row 15 agrega todos os meses. Algumas métricas são SUM, outras são recalculadas.

```
// SOMAS diretas
marketing_budget_total   = SUM(marketing_budget[1..12])
ad_spend_total           = SUM(ad_spend[1..12])
display_budget_total     = SUM(display_budget[1..12])
search_budget_total      = SUM(search_budget[1..12])
impressions_display_total = SUM(impressions_display[1..12])
clicks_display_total     = SUM(clicks_display[1..12])
impressions_search_total = SUM(impressions_search[1..12])
clicks_search_total      = SUM(clicks_search[1..12])
visitors_total           = SUM(visitors[1..12])
sessions_total           = SUM(sessions[1..12])
new_orders_total         = SUM(new_orders[1..12])
customers_total          = SUM(customers[1..12])
total_sales_total        = SUM(total_sales[1..12])
revenue_minus_adspend_total = SUM(revenue_minus_adspend[1..12])
total_cogs_total         = SUM(total_cogs[1..12])

// RECALCULADAS (médias ponderadas ou derivadas)
mer_total                = IF(budget_total == 0, 0, sales_total / budget_total)
cpm_display_total        = IF(imp_display == 0, 0, (display_budget / imp_display) * 1000)
ctr_display_total        = IF(imp_display == 0, 0, clicks_display / imp_display)
cpc_search_total         = IF(clicks_search == 0, 0, search_budget / clicks_search)
ctr_search_total         = IF(imp_search == 0, 0, clicks_search / imp_search)
roas_total               = IF(adspend == 0, 0, sales / adspend)
conversion_rate_total    = IF(visitors == 0, 0, orders / visitors)
break_even_roas_total    = IF(adspend == 0, 0, sales / adspend)
roi_pct_total            = IF(adspend == 0, 0, (sales-adspend) / adspend)
ticket_total             = ticket_medio (input, constante)
cac_adspend_total        = IF(customers == 0, 0, adspend / customers)
rpc_total                = IF(customers == 0, 0, sales / customers)
cogs_total               = cogs (input constante)
gp_per_customer_total    = rpc_total - cogs_total
gp_margin_total          = IF(rpc == 0, 0, gp_per_cust / rpc)
aov_total                = IF(orders == 0, 0, sales / orders)
apf_total                = apf (input)
acl_total                = acl (input)
cltv_total               = aov * apf * acl
revenue_profit_lt_total  = cltv - cogs
break_even_cac_v3_total  = cltv * gp_margin
ltv_cac_v3_total         = IF(cac_adspend == 0, 0, cltv / cac_adspend)

// V4 TOTAIS
cogs_plus_adspend_total  = total_cogs_total + adspend_total
cac_full_total           = IF(customers == 0, 0, cogs_plus_adspend_total / customers_total)
lucro_total              = sales_total - cogs_plus_adspend_total
roi_total                = IF(cogs_plus_adspend == 0, 0, lucro / cogs_plus_adspend)
break_even_cac_total     = IF(gp_per_cust == 0, 0, cac_full / gp_per_cust)
ltv_cac_full_total       = IF(cac_full == 0, 0, cltv / cac_full)
status_full_total        = classificacao_ltv_cac(ltv_cac_full_total)
```

---

## 6. CLASSIFICAÇÃO STATUS (LTV/CAC)

```javascript
function classificacao_ltv_cac(ltv_cac) {
  if (ltv_cac >= 4) return "Excellent margin for reinvestment";
  if (ltv_cac >= 3) return "Healthy profitability";
  if (ltv_cac >= 2) return "Modest profitability";
  return "Loss (CAC above gross margin)";
}
```

---

## 7. DASHBOARD DISPLAY — Seções e Métricas

### 7.1 📊 REVENUE GROWTH

- MER (Marketing Efficiency Ratio) — `mer_total`
- Total Sales (R$) — `total_sales_total`
- Lucro (R$) — `lucro_total` (v4, inclui COGS)

Guardrail: MER < 1 = prejuízo. Acima de 3 = excelente.

### 7.2 📣 RUNNING ADS

- Ad Spend Total (R$)
- Budget Display (R$)
- Budget Search (R$)
- Impressões Display
- Clicks Display
- Impressões Search
- Clicks Search
- CPM Display (R$)
- CTR Display (%)
- CPC Search (R$)
- CTR Search (%)

### 7.3 🎯 PERFORMANCE MEASUREMENT

- ROAS
- Visitors/Users
- Sessions
- New Orders
- Conversion Rate (%)
- Break Even ROAS
- Lucro (R$) — `lucro_total`
- ROI (%) — `roi_total` (v4)

Guardrail: ROAS > 4 = Excelente. Break Even = mínimo.

### 7.4 👥 CRM BASE GROWTH

- Clientes Adquiridos
- Ticket Médio (R$)

### 7.5 💰 PROFITABILITY

- CAC (R$) — `cac_full_total` (v4, inclui COGS)
- Revenue Per Customer (R$)
- COGS (R$) — valor monetário
- Gross Profit/Customer (R$)
- Gross Profit Margin (%)

Guardrail: CAC > margem bruta = prejuízo. CAC < 30% ticket = ótimo.

### 7.6 🔄 CUSTOMER LIFETIME VALUE

- AOV (R$)
- APF
- ACL (anos)
- CLTV (R$)
- Revenue Profit Lifetime (R$)
- Break Even CAC
- LTV/CAC — `ltv_cac_full_total` (v4)

Guardrail: LTV/CAC > 3 = saudável. < 1 = insustentável.

### 7.7 🔮 PREDICTIVE ANALYSIS

- Status — `status_full_total` (v4)

---

## 8. VALIDAÇÃO DE REFERÊNCIA

### Cenário: SaaS B2B, R$5.000, Ticket R$100, COGS R$48

```
Ad Spend:           R$ 5.000,00
Display Budget:     R$ 1.500,00  (5000 × 0.3)
Search Budget:      R$ 3.500,00  (5000 × 0.7)
Impressions Disp:   18.750       ((1500/80) × 1000)
Clicks Display:     86,25        (18750 × 0.0046)
Clicks Search:      500          (3500 / 7)
Visitors:           586,25       (86.25 + 500)
Sessions:           586          (= visitors × 1)
Orders:             22,28        (586.25 × 0.038)
Customers:          22,28
Ticket:             R$ 100,00
Total Sales:        R$ 2.227,75  (100 × 22.28)
RPC:                R$ 100,00    (2227.75 / 22.28)
COGS:               R$ 48,00     (input direto)
GP/Customer:        R$ 52,00     (100 - 48)
GP Margin:          52%          (52 / 100)
Total COGS:         R$ 1.069,32  (22.28 × 48)
COGS+AdSpend:       R$ 6.069,32  (1069.32 + 5000)
CAC (full):         R$ 272,44    (6069.32 / 22.28)
Lucro:              -R$ 3.841,57 (2227.75 - 6069.32)
ROI:                -63,31%      (-3841.57 / 6069.32)
CLTV:               R$ 100,00    (100 × 1 × 1)
LTV/CAC:            0,37         (100 / 272.44)
Status:             Loss (CAC above gross margin)
```

### Cenário: E-commerce Moda, R$5.000, Ticket R$150, COGS R$72

Com CPC Search R$1,50, CVR 1.75%, CPM Display R$12,50:

- Clicks Search: 2.333 (3000/1.50)
- Clicks Display: 184 ((2000/12.5)_1000 _ 0.0046)
- Visitors: 2.517
- Orders: 44 (2517 × 0.0175)
- Total Sales: R$6.607
- CAC full: (44×72 + 5000) / 44 = R$185,64
- Lucro: 6607 - 8168 = -R$1.561

---

## 9. REGRAS DE NEGÓCIO IMPORTANTES

1. **COGS é valor monetário (R$), nunca percentual.** Input direto do usuário.
2. **CAC inclui COGS**: CAC = (Total COGS + Ad Spend) / Clientes
3. **Lucro = Total Sales - (Total COGS + Ad Spend)**
4. **ROI = Lucro / (Total COGS + Ad Spend)**
5. **Display usa CPM** (Budget → CPM → Impressões → CTR → Clicks)
6. **Search usa CPC** (Budget → CPC → Clicks → CTR → Impressões)
7. **Sessions = Visitors × 1** (ratio 1:1)
8. **Fatores temporais** se aplicam ao CPC Search e à Taxa de Conversão
9. **Todos os inputs do Dashboard devem ser editáveis** — benchmarks servem apenas como guardrail/referência visual na coluna ao lado
10. **Benchmarks são brasileiros** (CPC, CPM, CVR) exceto CTR que usa proxy global WordStream

---

## 10. MAPEAMENTO PARA CÓDIGO

### Models sugeridos

```
Benchmark { mercado, split_display, split_search, ctr_display, ctr_search,
            cpm_display, cpc_search, taxa_conversao, cogs_pct,
            cogs_min, cogs_max, ticket_min, ticket_max,
            apf_min, apf_max, lifespan_min, lifespan_max }

TemporalFactor { mes, fator_cpc, fator_conversao, descricao }

CampaignInput { mercado, objetivo, orcamento, periodo_meses, pct_budget_ppc,
                split_display, apf, crescimento_mensal, ticket_medio,
                customer_lifespan_anos, cogs,
                ctr_display, ctr_search, cpm_display, cpc_search, taxa_conversao }

MonthlyResult { mes, ad_spend, display_budget, search_budget,
                impressions_display, clicks_display, impressions_search, clicks_search,
                visitors, sessions, new_orders, customers, total_sales,
                rpc, cogs_rs, gp_per_customer, gp_margin,
                total_cogs, cogs_plus_adspend, cac_full, lucro, roi,
                cltv, ltv_cac, status, ... }

TotalResult { ... mesmos campos agregados ... }
```
