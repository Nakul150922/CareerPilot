// ═══════════════════════════════════════════════════════════════
// CURRENCY CONFIG — research-backed local currencies per region
// Sources: Glassdoor, levels.fyi, PayScale, GeeksforGeeks, Qubit Labs (2024-25)
// ═══════════════════════════════════════════════════════════════

const CURRENCY = {
  // location key → { symbol, code, name, rounding (to nearest N), usdEquiv (1 local = X USD) }
  sf:              { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  nyc:             { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  seattle:         { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  boston:          { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  la:              { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  austin:          { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  denver:          { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  chicago:         { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  miami:           { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  raleigh:         { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  remote_us:       { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  remote_outside_us:{ symbol: '$',  code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },
  midwest:         { symbol: '$',   code: 'USD', name: 'US Dollar',          round: 1000,   usd: 1.0 },

  london:          { symbol: '£',   code: 'GBP', name: 'British Pound',      round: 1000,   usd: 1.27 },
  zurich:          { symbol: 'CHF ', code:'CHF', name: 'Swiss Franc',        round: 1000,   usd: 1.12 },
  amsterdam:       { symbol: '€',   code: 'EUR', name: 'Euro',               round: 1000,   usd: 1.08 },
  berlin:          { symbol: '€',   code: 'EUR', name: 'Euro',               round: 1000,   usd: 1.08 },
  paris:           { symbol: '€',   code: 'EUR', name: 'Euro',               round: 1000,   usd: 1.08 },

  toronto:         { symbol: 'CA$', code: 'CAD', name: 'Canadian Dollar',    round: 1000,   usd: 0.74 },
  sydney:          { symbol: 'A$',  code: 'AUD', name: 'Australian Dollar',  round: 1000,   usd: 0.65 },
  singapore:       { symbol: 'S$',  code: 'SGD', name: 'Singapore Dollar',   round: 1000,   usd: 0.74 },
  tokyo:           { symbol: '¥',   code: 'JPY', name: 'Japanese Yen',       round: 100000, usd: 0.0067 },

  // Dubai/UAE — AED (Dirham). Entry SWE ~AED 8K–15K/mo = 96K–180K/yr
  dubai:           { symbol: 'AED ', code:'AED', name: 'UAE Dirham',         round: 1000,   usd: 0.272 },

  // India — INR. Entry frontend ~₹3.5–5 LPA; FAANG Bangalore entry SWE ~₹15–25 LPA
  bangalore:       { symbol: '₹',   code: 'INR', name: 'Indian Rupee',       round: 10000,  usd: 0.012 },

  latam:           { symbol: '$',   code: 'USD', name: 'US Dollar (equiv)',   round: 1000,   usd: 1.0 },
};

// ═══════════════════════════════════════════════════════════════
// MODEL — base salaries stored in LOCAL CURRENCY per region group
// 
// Architecture: rule-based salary estimator with calibrated base tables
// Uses location, industry, experience, and education multipliers
// reflecting real market data in local currency.
// "usd_base" group = US dollar markets (US cities + remote)
// Others = their own local-currency baseline
// ═══════════════════════════════════════════════════════════════

// USD baseline (US market) — used for all US cities, scaled by locationMult
const USD_BASE = {
  intern: 72000, junior_engineer: 88000, software_engineer: 120000,
  senior_software_engineer: 165000, staff_engineer: 205000,
  principal_engineer: 240000, distinguished_engineer: 290000,
  frontend_engineer: 115000, backend_engineer: 125000, fullstack_engineer: 122000,
  mobile_engineer: 128000, devops_engineer: 135000, security_engineer: 145000,
  embedded_engineer: 118000, data_analyst: 90000, data_engineer: 132000,
  data_scientist: 140000, ml_engineer: 160000, ai_researcher: 185000,
  analytics_engineer: 128000, product_manager: 148000, senior_pm: 190000,
  director_pm: 230000, ux_designer: 108000, ux_researcher: 118000,
  product_designer: 120000, tech_lead: 180000, engineering_manager: 195000,
  senior_em: 230000, director_eng: 275000, vp_engineering: 320000, cto: 420000,
  qa_engineer: 100000, technical_writer: 95000, solutions_architect: 158000,
  it_admin: 82000
};

// Regional base salaries in LOCAL CURRENCY — carefully calibrated from research
// India (INR): Entry frontend ₹3.5–5 LPA; FAANG SWE entry ₹15–25 LPA; Sr SWE ₹25–50 LPA
const INR_BASE = {
  intern: 350000, junior_engineer: 550000, software_engineer: 900000,
  senior_software_engineer: 1800000, staff_engineer: 3200000,
  principal_engineer: 5000000, distinguished_engineer: 7000000,
  frontend_engineer: 700000, backend_engineer: 850000, fullstack_engineer: 800000,
  mobile_engineer: 900000, devops_engineer: 1100000, security_engineer: 1400000,
  embedded_engineer: 750000, data_analyst: 600000, data_engineer: 1100000,
  data_scientist: 1200000, ml_engineer: 1600000, ai_researcher: 2500000,
  analytics_engineer: 950000, product_manager: 1500000, senior_pm: 2800000,
  director_pm: 5000000, ux_designer: 700000, ux_researcher: 850000,
  product_designer: 800000, tech_lead: 2200000, engineering_manager: 3000000,
  senior_em: 5000000, director_eng: 7000000, vp_engineering: 10000000, cto: 18000000,
  qa_engineer: 550000, technical_writer: 500000, solutions_architect: 1600000,
  it_admin: 450000
};

// UK (GBP): Entry SWE London ~£32K–47K; Sr SWE ~£70K–95K; Staff ~£100K+
const GBP_BASE = {
  intern: 28000, junior_engineer: 38000, software_engineer: 55000,
  senior_software_engineer: 80000, staff_engineer: 105000,
  principal_engineer: 130000, distinguished_engineer: 160000,
  frontend_engineer: 50000, backend_engineer: 57000, fullstack_engineer: 52000,
  mobile_engineer: 55000, devops_engineer: 60000, security_engineer: 75000,
  embedded_engineer: 52000, data_analyst: 42000, data_engineer: 62000,
  data_scientist: 68000, ml_engineer: 80000, ai_researcher: 95000,
  analytics_engineer: 58000, product_manager: 70000, senior_pm: 95000,
  director_pm: 120000, ux_designer: 50000, ux_researcher: 55000,
  product_designer: 55000, tech_lead: 90000, engineering_manager: 100000,
  senior_em: 125000, director_eng: 155000, vp_engineering: 190000, cto: 260000,
  qa_engineer: 45000, technical_writer: 42000, solutions_architect: 80000,
  it_admin: 38000
};

// EUR (Germany/Netherlands/France): Germany SWE avg €60–70K; entry ~€45–55K
const EUR_BASE = {
  intern: 32000, junior_engineer: 42000, software_engineer: 60000,
  senior_software_engineer: 78000, staff_engineer: 100000,
  principal_engineer: 125000, distinguished_engineer: 150000,
  frontend_engineer: 52000, backend_engineer: 60000, fullstack_engineer: 56000,
  mobile_engineer: 58000, devops_engineer: 65000, security_engineer: 78000,
  embedded_engineer: 56000, data_analyst: 46000, data_engineer: 65000,
  data_scientist: 72000, ml_engineer: 85000, ai_researcher: 100000,
  analytics_engineer: 62000, product_manager: 72000, senior_pm: 95000,
  director_pm: 120000, ux_designer: 54000, ux_researcher: 58000,
  product_designer: 58000, tech_lead: 88000, engineering_manager: 100000,
  senior_em: 125000, director_eng: 150000, vp_engineering: 185000, cto: 250000,
  qa_engineer: 46000, technical_writer: 44000, solutions_architect: 82000,
  it_admin: 38000
};

// CHF (Zurich): highest in Europe; entry SWE ~CHF 85–100K
const CHF_BASE = {
  intern: 65000, junior_engineer: 80000, software_engineer: 105000,
  senior_software_engineer: 135000, staff_engineer: 165000,
  principal_engineer: 195000, distinguished_engineer: 230000,
  frontend_engineer: 95000, backend_engineer: 108000, fullstack_engineer: 100000,
  mobile_engineer: 105000, devops_engineer: 115000, security_engineer: 130000,
  embedded_engineer: 100000, data_analyst: 80000, data_engineer: 112000,
  data_scientist: 120000, ml_engineer: 145000, ai_researcher: 165000,
  analytics_engineer: 108000, product_manager: 125000, senior_pm: 155000,
  director_pm: 190000, ux_designer: 92000, ux_researcher: 98000,
  product_designer: 98000, tech_lead: 148000, engineering_manager: 165000,
  senior_em: 200000, director_eng: 240000, vp_engineering: 290000, cto: 400000,
  qa_engineer: 78000, technical_writer: 72000, solutions_architect: 135000,
  it_admin: 65000
};

// CAD (Toronto/Vancouver): mid SWE ~CA$80–110K; entry ~CA$65–80K
const CAD_BASE = {
  intern: 58000, junior_engineer: 72000, software_engineer: 95000,
  senior_software_engineer: 125000, staff_engineer: 158000,
  principal_engineer: 190000, distinguished_engineer: 225000,
  frontend_engineer: 88000, backend_engineer: 96000, fullstack_engineer: 92000,
  mobile_engineer: 98000, devops_engineer: 105000, security_engineer: 118000,
  embedded_engineer: 90000, data_analyst: 72000, data_engineer: 102000,
  data_scientist: 110000, ml_engineer: 128000, ai_researcher: 148000,
  analytics_engineer: 98000, product_manager: 112000, senior_pm: 145000,
  director_pm: 180000, ux_designer: 82000, ux_researcher: 88000,
  product_designer: 88000, tech_lead: 138000, engineering_manager: 155000,
  senior_em: 190000, director_eng: 225000, vp_engineering: 270000, cto: 360000,
  qa_engineer: 72000, technical_writer: 68000, solutions_architect: 118000,
  it_admin: 62000
};

// AUD (Sydney/Melbourne): avg SWE ~A$85–120K; entry ~A$65–80K
const AUD_BASE = {
  intern: 60000, junior_engineer: 72000, software_engineer: 95000,
  senior_software_engineer: 125000, staff_engineer: 155000,
  principal_engineer: 185000, distinguished_engineer: 220000,
  frontend_engineer: 85000, backend_engineer: 96000, fullstack_engineer: 90000,
  mobile_engineer: 98000, devops_engineer: 105000, security_engineer: 118000,
  embedded_engineer: 88000, data_analyst: 72000, data_engineer: 100000,
  data_scientist: 108000, ml_engineer: 125000, ai_researcher: 145000,
  analytics_engineer: 96000, product_manager: 110000, senior_pm: 142000,
  director_pm: 175000, ux_designer: 80000, ux_researcher: 86000,
  product_designer: 86000, tech_lead: 135000, engineering_manager: 152000,
  senior_em: 185000, director_eng: 220000, vp_engineering: 265000, cto: 350000,
  qa_engineer: 70000, technical_writer: 65000, solutions_architect: 115000,
  it_admin: 60000
};

// SGD (Singapore): avg SWE ~S$85–120K; entry ~S$55–75K
const SGD_BASE = {
  intern: 42000, junior_engineer: 58000, software_engineer: 85000,
  senior_software_engineer: 115000, staff_engineer: 148000,
  principal_engineer: 180000, distinguished_engineer: 215000,
  frontend_engineer: 76000, backend_engineer: 86000, fullstack_engineer: 82000,
  mobile_engineer: 88000, devops_engineer: 96000, security_engineer: 108000,
  embedded_engineer: 80000, data_analyst: 65000, data_engineer: 92000,
  data_scientist: 100000, ml_engineer: 118000, ai_researcher: 138000,
  analytics_engineer: 88000, product_manager: 102000, senior_pm: 132000,
  director_pm: 165000, ux_designer: 72000, ux_researcher: 78000,
  product_designer: 78000, tech_lead: 128000, engineering_manager: 145000,
  senior_em: 175000, director_eng: 210000, vp_engineering: 255000, cto: 340000,
  qa_engineer: 62000, technical_writer: 58000, solutions_architect: 108000,
  it_admin: 55000
};

// AED (Dubai): entry SWE ~AED 96K–180K/yr; mid ~AED 180K–300K/yr  
const AED_BASE = {
  intern: 72000, junior_engineer: 96000, software_engineer: 144000,
  senior_software_engineer: 216000, staff_engineer: 300000,
  principal_engineer: 384000, distinguished_engineer: 480000,
  frontend_engineer: 120000, backend_engineer: 150000, fullstack_engineer: 138000,
  mobile_engineer: 156000, devops_engineer: 168000, security_engineer: 204000,
  embedded_engineer: 132000, data_analyst: 108000, data_engineer: 168000,
  data_scientist: 192000, ml_engineer: 240000, ai_researcher: 300000,
  analytics_engineer: 156000, product_manager: 180000, senior_pm: 252000,
  director_pm: 336000, ux_designer: 120000, ux_researcher: 138000,
  product_designer: 144000, tech_lead: 264000, engineering_manager: 300000,
  senior_em: 384000, director_eng: 480000, vp_engineering: 600000, cto: 900000,
  qa_engineer: 108000, technical_writer: 96000, solutions_architect: 240000,
  it_admin: 90000
};

// JPY (Tokyo): avg SWE ~¥6–8M; entry ~¥4–5M
const JPY_BASE = {
  intern: 3000000, junior_engineer: 4200000, software_engineer: 6000000,
  senior_software_engineer: 8500000, staff_engineer: 11000000,
  principal_engineer: 14000000, distinguished_engineer: 17000000,
  frontend_engineer: 5200000, backend_engineer: 6200000, fullstack_engineer: 5800000,
  mobile_engineer: 6500000, devops_engineer: 7000000, security_engineer: 8000000,
  embedded_engineer: 5800000, data_analyst: 4800000, data_engineer: 7000000,
  data_scientist: 7500000, ml_engineer: 9000000, ai_researcher: 11000000,
  analytics_engineer: 6500000, product_manager: 8000000, senior_pm: 10500000,
  director_pm: 14000000, ux_designer: 5500000, ux_researcher: 6000000,
  product_designer: 6000000, tech_lead: 10000000, engineering_manager: 11500000,
  senior_em: 14000000, director_eng: 17000000, vp_engineering: 22000000, cto: 32000000,
  qa_engineer: 4800000, technical_writer: 4500000, solutions_architect: 9500000,
  it_admin: 4200000
};

// LatAm — USD equivalent (mixed markets, use USD baseline at 0.55x)
const LATAM_BASE = Object.fromEntries(Object.entries(USD_BASE).map(([k,v]) => [k, Math.round(v * 0.55)]));

// Map location → base salary table
const LOCATION_BASES = {
  bangalore: INR_BASE, london: GBP_BASE,
  zurich: CHF_BASE, amsterdam: EUR_BASE, berlin: EUR_BASE, paris: EUR_BASE,
  toronto: CAD_BASE, sydney: AUD_BASE, singapore: SGD_BASE,
  dubai: AED_BASE, tokyo: JPY_BASE, latam: LATAM_BASE,
};
// All others use USD_BASE

// Location multiplier WITHIN the same currency zone (US cities)
const US_LOC_MULT = {
  sf: 1.55, nyc: 1.38, seattle: 1.33, boston: 1.24, la: 1.18,
  austin: 1.08, denver: 1.04, chicago: 1.06, miami: 1.02, raleigh: 1.01,
  remote_us: 1.14, remote_outside_us: 1.0, midwest: 0.90,
};

// Industry multiplier — same across all regions
const INDUSTRY_MULT = {
  big_tech: 1.55, quant_finance: 1.60, crypto: 1.38, ai_startup: 1.32,
  fintech: 1.28, growth_startup: 1.18, cloud_saas: 1.22, defense_aerospace: 1.10,
  startup: 0.92, ecommerce: 1.06, gaming: 1.04, media_ad: 0.98,
  healthcare: 0.96, edtech: 0.88,
  consulting: 0.93, insurance: 0.90, government: 0.70, education: 0.72
};

// Education bonus — universal
const EDU_BONUS = {
  highschool: 0.80, bootcamp: 0.90, associate: 0.87,
  bachelor: 1.0, master: 1.13, phd: 1.20, ivy_league: 1.22
};

const MODEL = {
  expCurve(yrs, role) {
    const isSenior = role && (role.includes('principal') || role.includes('distinguished') || role === 'cto' || role === 'vp_engineering');
    const cap = isSenior ? 0.16 : 0.26;
    return 1 + Math.log1p(yrs) * cap;
  },

  variancePct(industry, experience) {
    const baseVar = {
      big_tech: 0.06, quant_finance: 0.14, crypto: 0.24, ai_startup: 0.20,
      fintech: 0.09, growth_startup: 0.17, startup: 0.22, cloud_saas: 0.08,
      default: 0.11
    };
    const v = baseVar[industry] || baseVar.default;
    const expAdj = experience < 2 ? 0.07 : experience < 5 ? 0.03 : 0;
    return Math.min(v + expAdj, 0.30);
  },

  confidence(experience, industry, location, education) {
    let score = 50;
    score += Math.min(experience * 2.0, 22);
    if (['big_tech','fintech','cloud_saas','growth_startup'].includes(industry)) score += 10;
    if (['sf','nyc','seattle','remote_us','london','bangalore','toronto'].includes(location)) score += 8;
    if (['bachelor','master'].includes(education)) score += 4;
    if (experience < 1) score -= 14;
    if (['quant_finance','crypto','ai_startup'].includes(industry)) score -= 7;
    if (['latam','remote_outside_us'].includes(location)) score -= 5;
    return Math.min(Math.max(score, 38), 91);
  },

  predict(jobTitle, industry, location, education, experience) {
    const baseTable = LOCATION_BASES[location] || USD_BASE;
    const base = baseTable[jobTitle] || (baseTable === USD_BASE ? 110000 : Math.round((USD_BASE[jobTitle]||110000) * (CURRENCY[location]?.usd ? 1/CURRENCY[location].usd : 1)));
    const iM = INDUSTRY_MULT[industry] || 1;
    const lM = (baseTable === USD_BASE) ? (US_LOC_MULT[location] || 1.0) : 1.0;
    const eM = EDU_BONUS[education] || 1;
    const xM = this.expCurve(experience, jobTitle);
    const raw = base * iM * lM * eM * xM;
    const variance = this.variancePct(industry, experience);
    const curr = CURRENCY[location] || CURRENCY.sf;
    const salary = Math.round(raw / curr.round) * curr.round;
    // Small deterministic jitter
    const seed = (base % 9) - 4;
    const jitter = seed * (curr.round * 0.1);
    const finalSalary = salary + jitter;
    return {
      salary: finalSalary,
      low: Math.round((finalSalary * (1 - variance)) / curr.round) * curr.round,
      high: Math.round((finalSalary * (1 + variance)) / curr.round) * curr.round,
      variance: Math.round(variance * 100),
      confidence: this.confidence(experience, industry, location, education),
      weights: computeWeights(base, iM, lM, eM, xM),
      currency: curr
    };
  }
};

function computeWeights(base, iM, lM, eM, xM) {
  const effects = {
    'Job Title': base * 0.4,
    'Location': base * Math.max(Math.abs(lM - 1), 0.05) * 280,
    'Industry': base * Math.max(Math.abs(iM - 1), 0.05) * 280,
    'Experience': base * Math.abs(xM - 1) * 180,
    'Education': base * Math.abs(eM - 1) * 220
  };
  const total = Object.values(effects).reduce((a,b) => a+b, 0) || 1;
  const pcts = {};
  Object.entries(effects).forEach(([k,v]) => pcts[k] = Math.max(Math.round(v / total * 100), 2));
  const sum = Object.values(pcts).reduce((a,b) => a+b, 0);
  const keys = Object.keys(pcts);
  pcts[keys[0]] += (100 - sum);
  return pcts;
}

// Dynamic currency formatter — uses current location's currency
let currentCurrency = CURRENCY.sf;

function fmt(n, curr) {
  const c = curr || currentCurrency;
  const rounded = Math.round(n);
  if (c.code === 'JPY') return c.symbol + rounded.toLocaleString('en-US');
  if (c.code === 'INR') {
    const abs = Math.abs(rounded);
    if (abs >= 10000000) return c.symbol + (abs/10000000).toFixed(1) + ' Cr';
    if (abs >= 100000) return c.symbol + (abs/100000).toFixed(1) + ' L';
    return c.symbol + abs.toLocaleString('en-IN');
  }
  return c.symbol + rounded.toLocaleString('en-US');
}

function fmtK(n, curr) {
  const c = curr || currentCurrency;
  if (c.code === 'INR') {
    const abs = Math.abs(n);
    if (abs >= 100000) return c.symbol + (abs/100000).toFixed(0) + 'L';
    return c.symbol + Math.round(abs/1000) + 'K';
  }
  if (c.code === 'JPY') return c.symbol + (n/1000000).toFixed(1) + 'M';
  if (c.code === 'AED') return c.symbol + (n/1000).toFixed(0) + 'K';
  return c.symbol + (n/1000).toFixed(0) + 'K';
}

// ═══════════════════════════════════════════════════════════════
// TAB LOGIC
// ═══════════════════════════════════════════════════════════════

function switchTab(id, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
  if (id === 'compare') updateCompare();
  if (id === 'totalcomp') updateTotalComp();
}

// ═══════════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════════

Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = '#1a2540';
Chart.defaults.font.family = "'JetBrains Mono', monospace";
Chart.defaults.font.size = 10;

let distChart, expCurveChart, industryChart, locationChart, errorChart;
let compareChart, compPieChart, compProjectionChart;

function gauss(x, mu, sig) {
  return Math.exp(-0.5 * ((x - mu) / sig) ** 2) / (sig * Math.sqrt(2 * Math.PI));
}

function initCharts() {
  // Distribution
  const distCtx = document.getElementById('distributionChart').getContext('2d');
  const dLabels = Array.from({length:50}, (_,i) => 40000 + i * 10000);
  distChart = new Chart(distCtx, {
    type: 'line',
    data: {
      labels: dLabels,
      datasets: [
        { label:'Market', data: dLabels.map(x => gauss(x, 140000, 55000) * 3500000), borderColor:'#7c3aed', backgroundColor:'rgba(124,58,237,0.08)', fill:true, tension:0.4, pointRadius:0, borderWidth:2 },
        { label:'You', data: Array(50).fill(0), borderColor:'#00e5ff', backgroundColor:'rgba(0,229,255,0.18)', fill:true, tension:0.4, pointRadius:0, borderWidth:2 }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ title: c => fmtK(+c[0].label), label: c => fmt(c.raw) } } },
      scales: {
        x:{ ticks:{ callback:(v,i) => i % 10 === 0 ? fmtK(dLabels[i]) : '' }, grid:{display:false} },
        y:{ display:false }
      }
    }
  });

  // Experience curve
  const expCtx = document.getElementById('expChart').getContext('2d');
  const expYrs = Array.from({length:31}, (_,i) => i);
  expCurveChart = new Chart(expCtx, {
    type: 'line',
    data: {
      labels: expYrs,
      datasets: [
        { data: expYrs.map(y => USD_BASE['software_engineer'] * 1.35 * MODEL.expCurve(y,'software_engineer')), borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.07)', fill:true, tension:0.4, pointRadius:0, borderWidth:2 },
        { data: Array(31).fill(null), backgroundColor:'rgba(0,229,255,0.9)', borderColor:'#00e5ff', pointRadius:7, type:'scatter', showLine:false }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => fmt(c.raw) } } },
      scales: {
        x:{ ticks:{ callback: v => v+'yr' } },
        y:{ ticks:{ callback: v => fmtK(v) } }
      }
    }
  });

  // Industry
  const indCtx = document.getElementById('industryChart').getContext('2d');
  const inds = ['Big Tech','Quant','AI Co.','FinTech','SaaS','Startup','E-Comm','Gov\'t'];
  const indMs = [1.50,1.55,1.30,1.25,1.20,0.95,1.08,0.72];
  industryChart = new Chart(indCtx, {
    type: 'bar',
    data: {
      labels: inds,
      datasets:[{ data: indMs.map(m => Math.round(120000*m/1000)*1000), backgroundColor: indMs.map(m => m>1.3?'rgba(0,229,255,0.7)':m>1.1?'rgba(124,58,237,0.6)':'rgba(100,116,139,0.35)'), borderColor: indMs.map(m => m>1.3?'#00e5ff':m>1.1?'#7c3aed':'#475569'), borderWidth:1, borderRadius:4 }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => fmt(c.raw) } } },
      scales: { x:{ ticks:{ font:{size:9} } }, y:{ ticks:{ callback: v => fmtK(v) } } }
    }
  });

  // Location
  const locCtx = document.getElementById('locationChart').getContext('2d');
  const locs = ['SF','Zurich','NYC','Seattle','Boston','LA','Remote','Austin','Sydney','Bangalore'];
  const locMs = [1.60,1.30,1.42,1.38,1.28,1.22,1.18,1.12,0.92,0.42];
  locationChart = new Chart(locCtx, {
    type: 'bar',
    data: {
      labels: locs,
      datasets:[{ data: locMs, backgroundColor: locMs.map(m => `rgba(0,229,255,${Math.min(m*0.55,0.85)})`), borderColor:'#00e5ff', borderWidth:1, borderRadius:4 }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => c.raw.toFixed(2)+'x' } } },
      scales: { x:{ ticks:{ font:{size:9} } }, y:{ min:0, max:1.8, ticks:{ callback: v => v+'x' } } }
    }
  });

  // Error distribution
  const errCtx = document.getElementById('errorChart').getContext('2d');
  const errLbls = Array.from({length:22}, (_,i) => (i-11)*2000);
  errorChart = new Chart(errCtx, {
    type: 'bar',
    data: {
      labels: errLbls,
      datasets:[{ data: errLbls.map(x => gauss(x,0,4100)*32000), backgroundColor:'rgba(16,185,129,0.28)', borderColor:'#10b981', borderWidth:1, borderRadius:2 }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales: {
        x:{ ticks:{ callback:(v,i) => i%5===0 ? fmtK(errLbls[i]) : '', font:{size:9} }, grid:{display:false} },
        y:{ display:false }
      }
    }
  });

  // Compare chart
  const cmpCtx = document.getElementById('compareChart').getContext('2d');
  compareChart = new Chart(cmpCtx, {
    type: 'bar',
    data: {
      labels: ['Base Salary','Bonus','Equity/yr','Sign-on (1yr)','Total Comp'],
      datasets: [
        { label:'Offer A', data:[0,0,0,0,0], backgroundColor:'rgba(0,229,255,0.6)', borderColor:'#00e5ff', borderWidth:1, borderRadius:4 },
        { label:'Offer B', data:[0,0,0,0,0], backgroundColor:'rgba(124,58,237,0.6)', borderColor:'#a78bfa', borderWidth:1, borderRadius:4 }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:'#94a3b8', font:{size:11} } }, tooltip:{ callbacks:{ label: c => fmt(c.raw) } } },
      scales: { x:{ ticks:{font:{size:9}} }, y:{ ticks:{ callback: v => fmtK(v) } } }
    }
  });

  // Comp pie
  const pieCtx = document.getElementById('compPieChart').getContext('2d');
  compPieChart = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Base Salary','Bonus','RSU/Equity','Sign-on','Benefits','401k Match'],
      datasets:[{ data:[150000,22500,50000,25000,15000,6000], backgroundColor:['#00e5ff','#10b981','#7c3aed','#f59e0b','#0ea5e9','#34d399'], borderWidth:2, borderColor:'#0c1120', hoverBorderColor:'#fff' }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{ font:{size:10}, color:'#94a3b8', padding:10, boxWidth:12 } }, tooltip:{ callbacks:{ label: c => c.label+': '+fmt(c.raw) } } },
      cutout: '62%'
    }
  });

  // Comp projection
  const projCtx = document.getElementById('compProjectionChart').getContext('2d');
  compProjectionChart = new Chart(projCtx, {
    type: 'line',
    data: {
      labels: ['Year 1','Year 2','Year 3','Year 4','Year 5'],
      datasets: [
        { label:'Conservative', data:[0,0,0,0,0], borderColor:'#64748b', backgroundColor:'rgba(100,116,139,0.05)', fill:true, tension:0.4, pointRadius:3, borderWidth:1.5, borderDash:[4,3] },
        { label:'Expected', data:[0,0,0,0,0], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.07)', fill:true, tension:0.4, pointRadius:4, borderWidth:2 },
        { label:'Optimistic', data:[0,0,0,0,0], borderColor:'#00e5ff', backgroundColor:'rgba(0,229,255,0.06)', fill:true, tension:0.4, pointRadius:3, borderWidth:1.5, borderDash:[2,2] }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ font:{size:10}, color:'#94a3b8', padding:12, boxWidth:12 } }, tooltip:{ callbacks:{ label: c => c.dataset.label+': '+fmt(c.raw) } } },
      scales: { x:{ticks:{font:{size:10}}}, y:{ ticks:{ callback: v => fmtK(v) } } }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// PREDICT TAB UPDATE
// ═══════════════════════════════════════════════════════════════

let lastSalary = 0;
const INSIGHTS = [
  { t: s => s > 250000, m: "You're in the elite tier 🔥 — think carefully about total comp, not just base. At this level, equity and bonus multipliers can 2–3x your take-home." },
  { t: s => s > 180000, m: "Strong number 💪 You're comfortably above market average. If you haven't had a comp review in 12+ months, you're likely leaving money on the table." },
  { t: s => s > 130000, m: "Solid market rate. Location is your biggest lever here — going remote or relocating to a premium market could add $20–40K to this estimate." },
  { t: s => s > 90000, m: "You're right in the middle of the pack. A targeted skill upgrade (ML, infra, or a specific domain) + industry switch could unlock a 25–40% jump." },
  { t: () => true, m: "Early in the journey — and that compounds fast in tech. Even small role changes can mean 20–40% bumps. Focus on titles that unlock 2x salary doors." }
];

function updatePrediction() {
  // Validate
  const jobTitle = document.getElementById('jobTitle').value;
  const industry = document.getElementById('industry').value;
  const location = document.getElementById('location').value;
  const education = document.getElementById('education').value;
  const experience = parseInt(document.getElementById('experience').value);

  if (!jobTitle || !industry || !location) return;

  const result = MODEL.predict(jobTitle, industry, location, education, experience);
  currentCurrency = result.currency;

  // Show currency badge
  let currBadge = document.getElementById('currencyBadge');
  if (!currBadge) {
    currBadge = document.createElement('div');
    currBadge.id = 'currencyBadge';
    currBadge.style.cssText = 'font-family:JetBrains Mono,monospace;font-size:10px;color:var(--accent);background:var(--accent-dim);border:1px solid rgba(0,229,255,0.2);padding:3px 9px;border-radius:20px;display:inline-block;margin-bottom:6px;letter-spacing:0.5px';
    document.getElementById('predBox').insertBefore(currBadge, document.getElementById('predBox').firstChild);
  }
  currBadge.textContent = '🌍 ' + result.currency.code + ' · ' + result.currency.name;

  // Animate amount
  const el = document.getElementById('predAmount');
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  animateCounter(el, lastSalary, result.salary, result.currency);
  lastSalary = result.salary;

  document.getElementById('predLow').textContent = fmt(result.low);
  document.getElementById('predHigh').textContent = fmt(result.high);
  document.getElementById('varianceNote').textContent = '±' + result.variance + '%';
  document.getElementById('confPct').textContent = result.confidence + '%';

  const fill = document.getElementById('confFill');
  fill.style.width = result.confidence + '%';
  fill.style.background = result.confidence > 80
    ? 'linear-gradient(90deg,#10b981,#34d399)'
    : result.confidence > 65
    ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
    : 'linear-gradient(90deg,#ef4444,#f87171)';

  document.getElementById('insightMsg').textContent = INSIGHTS.find(i => i.t(result.salary)).m;

  const box = document.getElementById('predBox');
  box.classList.remove('updated');
  void box.offsetWidth;
  box.classList.add('updated');

  // Feature importance
  const colors = ['#00e5ff','#7c3aed','#10b981','#f59e0b','#ef4444'];
  const sorted = Object.entries(result.weights).sort((a,b) => b[1]-a[1]);
  document.getElementById('importanceList').innerHTML = sorted.map(([name,pct],i) => `
    <li class="importance-item">
      <span class="imp-rank">${i+1}</span>
      <span class="imp-name">${name}</span>
      <div class="imp-bar-wrap"><div class="imp-bar" style="width:${pct}%;background:${colors[i]}"></div></div>
      <span class="imp-pct">${pct}%</span>
    </li>`).join('');

  // Distribution chart — scale x-axis to local currency
  if (distChart) {
    const curr = result.currency;
    const sal = result.salary;
    const spread = result.high - result.low;
    // Build x-axis around the predicted salary
    const step = curr.round * 2;
    const dLabels = Array.from({length:50}, (_,i) => Math.max(0, sal - 25*step) + i*step);
    distChart.data.labels = dLabels;
    distChart.data.datasets[0].data = dLabels.map(x => {
      const mu = sal * 0.9, sig = sal * 0.4;
      return gauss(x, mu, sig) * sal * 25;
    });
    distChart.data.datasets[1].data = dLabels.map(x => {
      const d = Math.abs(x - sal);
      return d < spread ? gauss(x, sal, Math.max(spread*0.25, curr.round)) * sal * 3 : 0;
    });
    distChart.options.scales.x.ticks.callback = (v, i) => i % 10 === 0 ? fmtK(dLabels[i], curr) : '';
    distChart.update('none');
  }

  // Experience curve — use actual role base in local currency
  if (expCurveChart) {
    const baseTable = LOCATION_BASES[location] || USD_BASE;
    const lM = (baseTable === USD_BASE) ? (US_LOC_MULT[location] || 1.0) : 1.0;
    const roleBase = (baseTable[jobTitle] || USD_BASE[jobTitle] || 110000) * (INDUSTRY_MULT[industry]||1) * lM * (EDU_BONUS[education]||1);
    const curr = result.currency;
    const expYrs = Array.from({length:31}, (_,i) => i);
    expCurveChart.data.datasets[0].data = expYrs.map(y => roleBase * MODEL.expCurve(y, jobTitle));
    expCurveChart.data.datasets[1].data = [{ x: experience, y: roleBase * MODEL.expCurve(experience, jobTitle) }];
    expCurveChart.options.scales.y.ticks.callback = v => fmtK(v, curr);
    expCurveChart.update('none');
  }
}

function animateCounter(el, from, to, curr) {
  const dur = 650, start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(from + (to - from) * ease), curr);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ═══════════════════════════════════════════════════════════════
// COMPARE TAB
// ═══════════════════════════════════════════════════════════════

function initCompareListeners() {
  const ids = ['cA-base-range','cA-bonus-range','cA-equity-range','cA-signon-range',
               'cB-base-range','cB-bonus-range','cB-equity-range','cB-signon-range'];
  const displays = {
    'cA-base-range':'cA-base-display','cA-bonus-range':'cA-bonus-display',
    'cA-equity-range':'cA-equity-display','cA-signon-range':'cA-signon-display',
    'cB-base-range':'cB-base-display','cB-bonus-range':'cB-bonus-display',
    'cB-equity-range':'cB-equity-display','cB-signon-range':'cB-signon-display'
  };
  ids.forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
      document.getElementById(displays[id]).textContent = fmt(+this.value);
      updateCompare();
    });
  });
  ['cA-job','cA-industry','cA-location','cB-job','cB-industry','cB-location'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateCompare);
  });
}

function updateCompare() {
  const getVal = id => +document.getElementById(id).value;
  const aBase = getVal('cA-base-range'), aBonus = getVal('cA-bonus-range');
  const aEquity = getVal('cA-equity-range'), aSignon = getVal('cA-signon-range');
  const bBase = getVal('cB-base-range'), bBonus = getVal('cB-bonus-range');
  const bEquity = getVal('cB-equity-range'), bSignon = getVal('cB-signon-range');

  const aTotal = aBase + aBonus + aEquity + aSignon;
  const bTotal = bBase + bBonus + bEquity + bSignon;

  document.getElementById('cA-total').textContent = fmt(aTotal);
  document.getElementById('cB-total').textContent = fmt(bTotal);

  // Update compare chart
  if (compareChart) {
    compareChart.data.datasets[0].data = [aBase, aBonus, aEquity, aSignon/3, aTotal];
    compareChart.data.datasets[1].data = [bBase, bBonus, bEquity, bSignon/3, bTotal];
    compareChart.update('none');
  }

  // Verdict
  const verdict = document.getElementById('compareVerdict');
  verdict.classList.add('visible');
  const diff = Math.abs(aTotal - bTotal);
  const winner = aTotal >= bTotal ? 'A' : 'B';
  const loser = winner === 'A' ? 'B' : 'A';

  document.getElementById('verdictTitle').textContent =
    diff < 10000 ? '🤝 These offers are very close — it\'s a lifestyle call'
    : `🏆 Offer ${winner} is financially stronger`;

  const pct = ((diff / Math.min(aTotal,bTotal)) * 100).toFixed(1);
  let body = '';
  if (diff < 10000) {
    body = `The gap is only ${fmt(diff)}/yr — consider non-financial factors like team culture, growth trajectory, work-life balance, and role prestige before deciding.`;
  } else {
    body = `Offer ${winner} pays ${fmt(diff)} more per year (${pct}% higher). Over 4 years, that's ${fmt(diff*4)} before raises. However, don't overlook growth potential — a lower-paying role at a fast-growing company can eclipse a higher starting offer through promotions and equity appreciation.`;
  }

  // Base vs equity split insight
  const aEquityPct = Math.round(aEquity / aTotal * 100);
  const bEquityPct = Math.round(bEquity / bTotal * 100);
  if (Math.abs(aEquityPct - bEquityPct) > 10) {
    const moreEquity = aEquityPct > bEquityPct ? 'A' : 'B';
    body += ` Note: Offer ${moreEquity} has more equity (${moreEquity==='A'?aEquityPct:bEquityPct}% of total comp) — this carries more risk but higher upside if the company does well.`;
  }

  document.getElementById('verdictBody').textContent = body;
}

// ═══════════════════════════════════════════════════════════════
// TOTAL COMP TAB
// ═══════════════════════════════════════════════════════════════

function initTotalCompListeners() {
  const sliders = [
    { id:'tc-base', display:'tc-base-val', prefix:'$', k:true },
    { id:'tc-bonus-pct', display:'tc-bonus-pct-val', prefix:'', k:false },
    { id:'tc-rsu-total', display:'tc-rsu-val', prefix:'$', k:true },
    { id:'tc-signon', display:'tc-signon-val', prefix:'$', k:true },
    { id:'tc-benefits', display:'tc-benefits-val', prefix:'$', k:true },
    { id:'tc-401k', display:'tc-401k-val', prefix:'$', k:true },
  ];
  sliders.forEach(({id, display, prefix, k}) => {
    document.getElementById(id).addEventListener('input', function() {
      const v = +this.value;
      document.getElementById(display).textContent = prefix + (k ? v.toLocaleString() : v);
      if (id === 'tc-bonus-pct' || id === 'tc-base') {
        const base = +document.getElementById('tc-base').value;
        const bPct = +document.getElementById('tc-bonus-pct').value;
        document.getElementById('tc-bonus-val').textContent = fmt(base * bPct / 100);
      }
      if (id === 'tc-rsu-total') {
        const vest = document.getElementById('tc-vest').value;
        const yrs = vest === '4cliff' ? 4 : parseInt(vest);
        document.getElementById('tc-rsu-yr-val').textContent = yrs + ' yrs';
      }
      updateTotalComp();
    });
  });
  document.getElementById('tc-vest').addEventListener('change', updateTotalComp);
}

function updateTotalComp() {
  const base = +document.getElementById('tc-base').value;
  const bonusPct = +document.getElementById('tc-bonus-pct').value;
  const rsuTotal = +document.getElementById('tc-rsu-total').value;
  const vestStr = document.getElementById('tc-vest').value;
  const signon = +document.getElementById('tc-signon').value;
  const benefits = +document.getElementById('tc-benefits').value;
  const match401k = +document.getElementById('tc-401k').value;

  const vestYrs = vestStr === '4cliff' ? 4 : parseInt(vestStr);
  const bonus = base * bonusPct / 100;
  const rsuPerYear = rsuTotal / vestYrs;
  const signonY1 = signon; // typically amortized over 1 year
  const totalY1 = base + bonus + rsuPerYear + signonY1 + benefits + match401k;

  // Breakdown
  const rows = [
    { label: '💵 Base Salary', val: base, color: '#00e5ff' },
    { label: '🎯 Annual Bonus', val: bonus, color: '#10b981' },
    { label: '📈 RSU/Equity (per yr)', val: rsuPerYear, color: '#7c3aed' },
    { label: '🎁 Sign-on Bonus', val: signonY1, color: '#f59e0b' },
    { label: '🏥 Benefits & Perks', val: benefits, color: '#0ea5e9' },
    { label: '🏦 401k Match', val: match401k, color: '#34d399' },
  ];

  document.getElementById('compBreakdown').innerHTML = rows.map(r => `
    <div class="comp-row">
      <span class="comp-row-label">${r.label}</span>
      <span class="comp-row-val" style="color:${r.color}">${fmt(r.val)}</span>
    </div>`).join('') + ` 
    <div class="comp-total">
      <span class="comp-total-label">Total Year 1 Compensation</span>
      <span class="comp-total-val">${fmt(totalY1)}</span>
    </div>`;

  document.getElementById('compNote').textContent =
    `Equity vests over ${vestYrs} year${vestYrs>1?'s':''} — Year 1 includes sign-on of ${fmt(signon)}. After cliff/vesting, annual recurring comp is ${fmt(totalY1 - signonY1)}/yr.`;

  // Pie chart
  if (compPieChart) {
    compPieChart.data.datasets[0].data = rows.map(r => r.val);
    compPieChart.update('none');
  }

  // Projection
  if (compProjectionChart) {
    const recurring = base + bonus + rsuPerYear + benefits + match401k;
    const conservative = [totalY1, recurring*1.03, recurring*1.06, recurring*1.09, recurring*1.12];
    const expected = [totalY1, recurring*1.06, recurring*1.13, recurring*1.22, recurring*1.32];
    const optimistic = [totalY1, recurring*1.10, recurring*1.25, recurring*1.45, recurring*1.70];
    compProjectionChart.data.datasets[0].data = conservative;
    compProjectionChart.data.datasets[1].data = expected;
    compProjectionChart.data.datasets[2].data = optimistic;
    compProjectionChart.update('none');
  }
}

// ═══════════════════════════════════════════════════════════════
// AI TIPS (CLAUDE API)
// ═══════════════════════════════════════════════════════════════

let selectedTip = 'counter';
let lastAIText = '';

document.querySelectorAll('.tip-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.tip-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    selectedTip = this.dataset.tip;
  });
});

const TIP_PROMPTS = {
  counter: "Give me 5 specific, tactical tips for countering a salary offer. Include exact language/scripts I can use in the negotiation conversation.",
  underpaid: "Give me 5 actionable steps I can take if I believe I'm currently underpaid at my job. Include how to build the case and how to have the conversation.",
  competing: "Give me 5 tactical strategies for using a competing offer to negotiate a better salary, including how to leverage it without burning bridges.",
  equity: "Give me 5 expert tips specifically about negotiating equity/RSUs/options, including how to evaluate vesting schedules and compare grants.",
  raise: "Give me 5 specific strategies for asking for a raise mid-year or during performance reviews, including timing, framing, and exact phrases to use.",
  remote: "Give me 5 tips for navigating pay differences when going remote — including how to handle geographic salary adjustments and negotiate to keep your pay.",
  firstjob: "Give me 5 critical things to negotiate in my very first job offer that most people miss — beyond just the base salary number.",
  gap: "Give me 5 strategies for negotiating confidently when I have a career gap or non-traditional background, including how to frame my experience."
};

async function generateAITips() {
  const btn = document.getElementById('aiGenerateBtn');
  const box = document.getElementById('aiResponseBox');
  const placeholder = document.getElementById('aiPlaceholder');
  const output = document.getElementById('aiTextOutput');

  const job = document.getElementById('ai-context-job').options[document.getElementById('ai-context-job').selectedIndex].text;
  const industry = document.getElementById('ai-context-industry').options[document.getElementById('ai-context-industry').selectedIndex].text;

  btn.disabled = true;
  btn.textContent = '⏳ Thinking...';
  box.classList.add('loading');
  placeholder.style.display = 'none';
  output.style.display = 'block';
  output.innerHTML = '<span class="ai-typing-cursor"></span>';

  const context = `The person is a ${job} working in ${industry}.`;
  const prompt = TIP_PROMPTS[selectedTip] || TIP_PROMPTS.counter;

  const systemPrompt = `You are an expert salary negotiation coach with deep knowledge of tech compensation. 
Be direct, tactical, and specific. Use bullet points with bold headers. 
Keep each tip to 2-3 sentences max. Format nicely with emojis. 
Always tailor advice to person's specific role and industry context.
At the end, add one "Power Move" tip that's bold and surprising.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'REPLACE_WITH_BACKEND_PROXY_ENDPOINT', // Demo key - replace with real key
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `${context}\n\n${prompt}` }]
      })
    });

    if (!resp.ok) throw new Error('API error: ' + resp.status);
    const data = await resp.json();
    const text = data.content?.[0]?.text || 'No response received.';
    lastAIText = text;

    // Typewriter effect
    output.innerHTML = '';
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        const char = text[i];
        output.innerHTML = formatAIText(text.slice(0, i+1)) + '<span class="ai-typing-cursor"></span>';
        i++;
        setTimeout(typeWriter, char === '\n' ? 20 : 8);
      } else {
        output.innerHTML = formatAIText(text);
        lastApiResponse = text; // Store for chatbot context
        document.getElementById('copyTipsBtn').style.display = 'inline-flex';
      }
    };
    typeWriter();

  } catch (err) {
    // Fallback to demo tips if API fails
    const demoTips = {
      counter: `**� Counter Like a Pro**\n\n• **Market Intelligence**: Research 3-5 comparable offers on Levels.fyi before negotiating\n• **The 15-20% Rule**: Always ask for 15-20% above their initial offer as your starting point\n• **Total Package Focus**: Emphasize base + bonus + equity + benefits, not just salary number\n• **Timing Advantage**: Use their hiring timeline - "I need to decide by Friday" creates urgency\n• **Confident Walk-Away**: Have a genuine alternative and be ready to decline respectfully\n\n**� Power Move**: "I appreciate your offer of $X. Based on my market research and competing offers, I was expecting $Y. Is there flexibility to get closer?"`,
      
      underpaid: `**📈 Get What You Deserve**\n\n• **Impact Portfolio**: Create a document showing specific projects, metrics, and business value you've delivered\n• **Salary Benchmarking**: Gather 5+ data points from Glassdoor, Levels.fyi, and recruiter conversations\n• **Strategic Timing**: Schedule compensation talks after successful project completion or during annual review cycle\n• **Business Case Framing**: Present your request as investment in company growth, not personal need\n• **Allied Support**: Get endorsements from colleagues and managers who can vouch for your contributions\n\n**🎯 Power Move**: "Over the past year, I've delivered [specific achievement] resulting in [business outcome]. Market research shows my role commands $X-$Y. I'd like to discuss aligning my compensation accordingly."`,
      
      competing: `⚖️ **Leverage Multiple Offers**\n\n• **Written Confirmation**: Never negotiate without official offer letters in hand\n• **Transparent Approach**: Be honest about having multiple opportunities without being aggressive\n• **Value Proposition**: Explain specifically why you prefer their company despite other offers\n• **Strategic Disclosure**: Share offer amounts selectively - sometimes just "significant" is enough\n• **Relationship Building**: Maintain professionalism even if you decline - industry is small\n\n**� Power Move**: "I'm genuinely excited about your mission and team. Company A offered $X, but I believe your culture and [specific project] align better with my goals. Can we work toward a competitive package?"`,
      
      equity: `**📊 Master Equity Negotiation**\n\n• **Vesting Knowledge**: 4-year with 1-year cliff is standard - negotiate for accelerated vesting or shorter cliff\n• **Grant Size Leverage**: Most companies have 10-25% flexibility on initial equity grants\n• **Early Exercise Rights**: Request ability to exercise options before vesting for tax advantages\n• **Annual Refreshers**: Discuss performance-based equity refreshers during initial negotiation\n• **409A Valuation**: Understand company's valuation and how it affects your equity value\n\n**🚀 Power Move**: "I'm excited about the company's growth trajectory. Could we increase the equity grant to $X and add a provision for annual refreshers based on performance?"`,
      
      raise: `**💰 Secure Your Raise**\n\n• **Achievement Log**: Maintain running document of quantified accomplishments and business impact\n• **Market Timing**: Initiate raise discussions after major wins or during performance review season\n• **Data-Driven Case**: Bring salary research for your specific role, experience, and geographic market\n• **Future Value**: Frame request around future contributions, not past performance\n• **Prepared Alternatives**: Know your walk-away point and have backup options if declined\n\n**⚡ Power Move**: "Based on my contributions to [specific metrics] and market data showing similar roles pay $X-$Y, I'm requesting a $Z increase to bring my compensation in line with market rates."`,
      
      remote: `**🏠 Remote Work Compensation**\n\n• **Productivity Metrics**: Document your output and efficiency compared to in-office colleagues\n• **Cost Savings**: Calculate savings company gets from remote setup (office space, utilities, etc.)\n• **Home Office Stipend**: If they reduce pay, negotiate $2,000-5,000 annual home office allowance\n• **Flexibility Premium**: Position remote work as benefit that justifies maintaining current salary\n• **Remote-First Research**: Gather data from remote-first companies' compensation bands\n\n**🌟 Power Move**: "I understand geographic adjustments, but given my proven remote productivity and the $X monthly savings the company realizes, I believe maintaining my current salary is fair and competitive."`,
      
      firstjob: `🎓 **First Job Negotiation Mastery**\n\n• **Comprehensive Research**: Know entry-level salaries for your role, location, and company size\n• **Beyond Base Salary**: Negotiate sign-on bonus, 401k match, professional development budget, and vacation days\n• **Practice Sessions**: Role-play with career services, mentors, or trusted friends\n• **Confident Positioning**: Show enthusiasm without sounding desperate or overly eager\n• **Multiple Benefits**: Even small wins on various benefits add significant value\n\n**🌈 Power Move**: "I'm thrilled about this opportunity. Based on my research of entry-level offers in this market, would you consider a starting salary of $X with a $Y sign-on bonus?"`,
      
      gap: `🔄 **Turn Gaps Into Strengths**\n\n• **Growth Narrative**: Frame gap as intentional skill-building period with specific achievements\n• **Skill Documentation**: List courses, certifications, freelance projects, or volunteer work completed\n• **Market Awareness**: Post-2020 career breaks are common and increasingly accepted\n• **Value Connection**: Directly link gap experiences to requirements of target role\n• **Confident Delivery**: Practice concise, positive explanations without defensiveness\n\n**� Power Move**: "During my career transition, I intentionally focused on [specific skill development], completing [certification/project]. This makes me uniquely qualified to handle [specific challenge] in this role."`
    };
    
    const fallbackText = demoTips[selectedTip] || demoTips.counter;
    lastAIText = fallbackText;
    
    // Typewriter effect for fallback
    output.innerHTML = '';
    let i = 0;
    const typeWriter = () => {
      if (i < fallbackText.length) {
        const char = fallbackText[i];
        output.innerHTML = formatAIText(fallbackText.slice(0, i+1)) + '<span class="ai-typing-cursor"></span>';
        i++;
        setTimeout(typeWriter, char === '\n' ? 20 : 8);
      } else {
        output.innerHTML = formatAIText(fallbackText);
        lastApiResponse = fallbackText; // Store for chatbot context
        document.getElementById('copyTipsBtn').style.display = 'inline-flex';
      }
    };
    typeWriter();
    
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ Get Tips';
    box.classList.remove('loading');
  }
}

function formatAIText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*)/gm, '<h3 style="color:var(--accent);font-size:14px;margin:14px 0 6px">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 style="color:var(--accent);font-size:15px;margin:14px 0 6px">$1</h2>')
    .replace(/^• (.*)/gm, '<li style="margin:4px 0;padding-left:4px">$1</li>')
    .replace(/^\d+\. (.*)/gm, '<li style="margin:6px 0;padding-left:4px">$1</li>')
    .split('\n').map(line => line.trim() ? (line.startsWith('<') ? line : `<p style="margin:4px 0">${line}</p>`) : '<br>').join('');
}

function copyTips() {
  navigator.clipboard.writeText(lastAIText).then(() => showToast('Tips copied to clipboard!', 'success'));
}

// ═══════════════════════════════════════════════════════════════
// CHATBOT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

let chatbotContext = '';
let chatbotHistory = [];
let lastUserContext = '';
let lastApiResponse = '';

// Initialize chatbot context when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateChatbotContext();
  initializeDraggableChatbot();
});

// ═══════════════════════════════════════════════════════════════
// DRAG FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let chatbotStartX = 0;
let chatbotStartY = 0;

function initializeDraggableChatbot() {
  const chatbot = document.getElementById('chatbotContainer');
  const header = document.getElementById('chatbotHeader');
  const indicator = document.getElementById('positionIndicator');
  
  // Load saved position
  const savedPosition = localStorage.getItem('chatbotPosition');
  if (savedPosition) {
    const pos = JSON.parse(savedPosition);
    chatbot.style.left = pos.x + 'px';
    chatbot.style.top = pos.y + 'px';
    chatbot.style.right = 'auto';
    chatbot.style.bottom = 'auto';
  }
  
  // Mouse events
  header.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Touch events for mobile
  header.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);
  
  // Show position indicator on hover
  chatbot.addEventListener('mouseenter', () => {
    if (!isDragging) {
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 2000);
    }
  });
}

function startDrag(e) {
  const chatbot = document.getElementById('chatbotContainer');
  
  // Prevent dragging when clicking toggle button
  if (e.target.classList.contains('chatbot-toggle')) {
    return;
  }
  
  isDragging = true;
  chatbot.classList.add('dragging');
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  
  dragStartX = clientX;
  dragStartY = clientY;
  
  const rect = chatbot.getBoundingClientRect();
  chatbotStartX = rect.left;
  chatbotStartY = rect.top;
  
  // Remove right/bottom positioning when dragging starts
  chatbot.style.right = 'auto';
  chatbot.style.bottom = 'auto';
  
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  
  const deltaX = clientX - dragStartX;
  const deltaY = clientY - dragStartY;
  
  const chatbot = document.getElementById('chatbotContainer');
  const newX = chatbotStartX + deltaX;
  const newY = chatbotStartY + deltaY;
  
  // Boundary checking
  const maxX = window.innerWidth - chatbot.offsetWidth;
  const maxY = window.innerHeight - chatbot.offsetHeight;
  
  const boundedX = Math.max(0, Math.min(newX, maxX));
  const boundedY = Math.max(0, Math.min(newY, maxY));
  
  chatbot.style.left = boundedX + 'px';
  chatbot.style.top = boundedY + 'px';
  
  e.preventDefault();
}

function endDrag(e) {
  if (!isDragging) return;
  
  isDragging = false;
  const chatbot = document.getElementById('chatbotContainer');
  chatbot.classList.remove('dragging');
  
  // Save position to localStorage
  const rect = chatbot.getBoundingClientRect();
  localStorage.setItem('chatbotPosition', JSON.stringify({
    x: rect.left,
    y: rect.top
  }));
  
  // Hide position indicator
  document.getElementById('positionIndicator').classList.remove('visible');
}

function updateChatbotContext() {
  const job = document.getElementById('ai-context-job')?.options[document.getElementById('ai-context-job')?.selectedIndex]?.text || 'Software Engineer';
  const industry = document.getElementById('ai-context-industry')?.options[document.getElementById('ai-context-industry')?.selectedIndex]?.text || 'Big Tech';
  const scenario = selectedTip || 'general';
  
  lastUserContext = `User: ${job} in ${industry} industry, interested in ${scenario} negotiation`;
  chatbotContext = `The user is a ${job} working in ${industry} industry, interested in ${scenario} negotiation scenario. Current salary prediction data: ${getCurrentPredictionData()}`;
}

function getCurrentPredictionData() {
  try {
    const predAmount = document.getElementById('predAmount')?.textContent || '$150,000';
    const confidence = document.getElementById('confPct')?.textContent || '94%';
    return `Predicted salary: ${predAmount}, Confidence: ${confidence}`;
  } catch {
    return 'No prediction data available';
  }
}

function toggleChatbot() {
  const chatbot = document.getElementById('chatbotContainer');
  chatbot.classList.toggle('expanded');
}

function handleChatbotKeypress(event) {
  if (event.key === 'Enter') {
    sendChatbotMessage();
  }
}

function addChatbotMessage(sender, message) {
  const messagesContainer = document.getElementById('chatbotMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${sender}`;
  messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatbotTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = '<div class="chatbot-typing"></div>';
  document.getElementById('chatbotMessages').appendChild(typingDiv);
  document.getElementById('chatbotMessages').scrollTop = document.getElementById('chatbotMessages').scrollHeight;
}

function hideChatbotTyping() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

async function sendChatbotMessage() {
  const input = document.getElementById('chatbotInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Update context before processing
  updateChatbotContext();
  
  // Add user message
  addChatbotMessage('user', message);
  input.value = '';
  
  // Show typing indicator
  showChatbotTyping();
  
  try {
    const response = await callChatbotAPI(message);
    hideChatbotTyping();
    addChatbotMessage('bot', response);
  } catch (error) {
    hideChatbotTyping();
    addChatbotMessage('bot', getChatbotFallback(message));
  }
}

async function callChatbotAPI(userMessage) {
  // Check if we have a recent similar response to avoid repetition
  const recentSimilar = chatbotHistory.slice(-4).find(h => 
    h.sender === 'bot' && 
    h.message.toLowerCase().includes(userMessage.toLowerCase().split(' ')[0])
  );
  
  if (recentSimilar && userMessage.length < 20) {
    return `I noticed you're asking about similar topics. ${recentSimilar.message}`;
  }

  const systemPrompt = `You are an expert salary negotiation coach with 15+ years of experience in tech compensation. You've helped thousands of professionals negotiate better offers.

CORE PRINCIPLES:
1. Give SPECIFIC, NUMERICAL advice whenever possible
2. Reference real market data and industry standards  
3. Provide actionable steps the user can take TODAY
4. Be direct and confident - avoid vague suggestions
5. Include concrete examples and scripts
6. Ask clarifying questions to provide targeted advice

RESPONSE STYLE:
- Use specific numbers and ranges ($180-220K, not "good salary")
- Provide concrete examples: "Say this: 'Based on my 8 years' experience...'"
- Include market data: "Levels.fyi shows similar roles pay..."
- Give immediate action items: "1) Research 2) Document 3) Practice"

AVOID:
- Generic advice like "research the market"
- Vague statements without numbers
- Repeating the same tips
- Overly casual language

Current Context: ${chatbotContext}
Recent Tips Generated: ${lastApiResponse || 'No tips generated yet'}

Conversation History (last 3 exchanges):
${chatbotHistory.slice(-6).map(h => `${h.sender}: ${h.message}`).join('\n')}

Remember: You're talking to someone who needs practical, immediate help for their specific situation.`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': 'REPLACE_WITH_BACKEND_PROXY_ENDPOINT',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!resp.ok) throw new Error('API error: ' + resp.status);
  const data = await resp.json();
  const response = data.content?.[0]?.text || 'I apologize, but I couldn\'t generate a response. Could you try rephrasing your question?';
  
  // Update history and track responses
  chatbotHistory.push({ sender: 'user', message: userMessage });
  chatbotHistory.push({ sender: 'bot', message: response });
  
  // Keep history manageable
  if (chatbotHistory.length > 20) {
    chatbotHistory = chatbotHistory.slice(-10);
  }
  
  return response;
}

function getChatbotFallback(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for recent similar fallback responses
  const recentFallback = chatbotHistory.slice(-4).find(h => 
    h.sender === 'bot' && h.message.includes('💰') && 
    (lowerMessage.includes('salary') || lowerMessage.includes('pay'))
  );
  
  if (recentFallback) {
    return `Let's approach this differently. Instead of just salary amounts, what's your negotiation timeline? Are you in active discussions or just preparing? This context will help me give you more targeted advice.`;
  }
  
  const fallbacks = {
    'salary': `💰 **Salary Strategy**: For your role, research shows the 75th percentile earns $180-220K. Key tactic: anchor high but have data to back it up. What's your current offer amount so I can give you specific numbers?`,
    
    'negotiate': `🤝 **Negotiation Framework**: Use the "Value + Market + Leverage" formula. Document 3 quantifiable wins, research 5 comparable offers, identify your unique leverage point. Which part feels most challenging for you?`,
    
    'offer': `📋 **Offer Evaluation**: Calculate 4-year total value: (Base + Bonus) × 4 + Equity + Sign-on. Don't forget annual equity refreshers. What's the equity portion of your current offer?`,
    
    'raise': `📈 **Raise Strategy**: Best timing = Q1 after strong performance or when company is hiring similar roles. Bring market data + your documented impact. What's your most recent performance rating?`,
    
    'equity': `📊 **Equity Deep Dive**: Ask these 4 questions: 1) Current 409A valuation? 2) 4-year vesting schedule? 3) Early exercise options? 4) Annual refreshers? What's your equity grant size?`,
    
    'remote': `🏠 **Remote Premium**: Data shows remote workers earn 5-15% less, but negotiate: home office stipend ($3-5K), flexible hours, or annual "remote productivity" bonus. What's their current remote policy?`,
    
    'confidence': `💪 **Confidence Tactics**: Role-play with a friend using your actual talking points. Record yourself and review. Remember: 73% of candidates who negotiate get more. What's your biggest fear?`,
    
    'counter': `⚔️ **Counter Formula**: Research + 15-20% + specific justification. Example: "Based on my 8 years' experience and market data showing $200K average, I'm seeking $210K." What's their initial offer?`,
    
    'how much': `💡 **Worth Calculation**: Use Levels.fyi + Glassdoor + recruiter insights. Factor in: years experience, company size, location, role complexity. What's your experience level and company size?`,
    
    'prepare': `📋 **Prep Checklist**: 1) Market research 2) Achievement list 3) Salary history 4) Benefits comparison 5) Walk-away number. Which step do you need help with?`,
    
    'default': `🎯 **Targeted Advice**: I can help with specific scenarios: counter offers, raise requests, equity negotiation, or competing offers. What's your immediate negotiation situation?`
  };
  
  // Check for specific keywords
  for (const [key, response] of Object.entries(fallbacks)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Check for question patterns
  if (lowerMessage.includes('?') || lowerMessage.includes('how')) {
    return `🤔 **Specific Question**: I can give better advice with more context. What's your role, years of experience, and current situation (new offer/raise/competing offers)?`;
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `😊 **You're welcome!** Remember: the key is preparation and confidence. Feel free to ask follow-up questions as they come up during your negotiation!`;
  }
  
  return fallbacks.default;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT PDF
// ═══════════════════════════════════════════════════════════════

function exportPDF() {
  const jobEl = document.getElementById('jobTitle');
  const jobTitle = jobEl.options[jobEl.selectedIndex].text;
  const salary = document.getElementById('predAmount').textContent;
  const low = document.getElementById('predLow').textContent;
  const high = document.getElementById('predHigh').textContent;
  const confidence = document.getElementById('confPct').textContent;
  const insight = document.getElementById('insightMsg').textContent;
  const currLabel = document.getElementById('currencyBadge') ? document.getElementById('currencyBadge').textContent : '';
  const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;max-width:680px;margin:48px auto;padding:48px;color:#1e293b;background:#fff;line-height:1.5}
    h1{font-size:26px;font-weight:800;margin:0 0 2px;color:#0f172a;letter-spacing:-0.5px}
    .sub{color:#64748b;font-size:13px;margin-bottom:8px}
    .currency{display:inline-block;font-size:11px;background:#f1f5f9;border:1px solid #e2e8f0;padding:2px 8px;border-radius:12px;color:#475569;margin-bottom:28px}
    .section{margin-bottom:28px}
    .label{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:#94a3b8;font-weight:700;margin-bottom:6px}
    .big{font-size:52px;font-weight:800;color:#7c3aed;line-height:1;margin-bottom:6px}
    .range{font-size:14px;color:#64748b}
    .conf-wrap{margin:20px 0}
    .conf-row{display:flex;align-items:center;gap:12px}
    .conf-bar{flex:1;height:7px;background:#e2e8f0;border-radius:4px;overflow:hidden}
    .conf-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#06b6d4);border-radius:4px}
    .insight{padding:14px 18px;background:#f0fdf4;border-left:4px solid #10b981;border-radius:6px;font-size:13px;color:#065f46;margin-top:20px}
    .divider{height:1px;background:#e2e8f0;margin:28px 0}
    .footer{font-size:11px;color:#94a3b8}
  </style></head><body>
  <h1>SalaryML Salary Report</h1>
  <div class="sub">Generated ${date} &nbsp;·&nbsp; ${jobTitle}</div>
  <div class="currency">${currLabel}</div>
  <div class="section">
    <div class="label">Estimated Base Salary</div>
    <div class="big">${salary}</div>
    <div class="range">Market range: <strong>${low}</strong> — <strong>${high}</strong></div>
    <div class="conf-wrap">
      <div class="label">Model Confidence — ${confidence}</div>
      <div class="conf-row">
        <div class="conf-bar"><div class="conf-fill" style="width:${confidence}"></div></div>
      </div>
    </div>
    <div class="insight">${insight}</div>
  </div>
  <div class="divider"></div>
  <div class="footer">SalaryML &nbsp;·&nbsp; Estimates only, not financial advice &nbsp;·&nbsp; salaryml.com</div>
  </body></html>`;

  try {
    // Blob download — works in sandboxed iframes where window.open is blocked
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salaryml-report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report downloaded! Open the file and use Ctrl+P to save as PDF.', 'success');
  } catch (e) {
    showToast('Could not download — try right-clicking to save the page.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════

function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════

const exp = document.getElementById('experience');
exp.addEventListener('input', function() {
  document.getElementById('expVal').textContent = this.value;
  updatePrediction();
});

['jobTitle','industry','location','education'].forEach(id => {
  document.getElementById(id).addEventListener('change', updatePrediction);
});

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════

window.addEventListener('load', () => {
  initCharts();
  initCompareListeners();
  initTotalCompListeners();
  setTimeout(() => {
    updatePrediction();
    updateCompare();
    updateTotalComp();
  }, 120);
});
