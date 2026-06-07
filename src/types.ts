export interface MonthlyRecord {
  id: string;
  month: string; // "2026/05"
  income: number;
  expense?: number;
  reserveFund: number;    // Emergency Fund
  travelFund: number;     // Travel Fund
  entertainFund: number;  // Entertainment Fund
  insuranceFund: number;  // Protection Fund (保教30健)
  creditAccount: number;  // kept for baseline compat
  houseAccountDiff?: number; // House Account Difference (Section 8)
  isBaseline: boolean;
  note?: string;
}

export type RecoveryStatus = 'baseline' | 'increasing' | 'decreasing' | 'flat';

// ── Fixed commitments ────────────────────────────────────────────────────────
export const FIXED_COMMITMENTS = 61879;

export const FIXED_BREAKDOWN = [
  { label: '房貸＋頭期款', amount: 35000 },
  { label: '房租',         amount: 21500 },
  { label: '信貸',         amount: 2566  },
  { label: '學貸',         amount: 2813  },
] as const;

// ── Fixed monthly allocations ────────────────────────────────────────────────
export const FIXED_ALLOCATIONS = 22062;

export const ALLOCATION_BREAKDOWN = [
  { label: '備用金',   amount: 9925 },
  { label: '學習',     amount: 711  },
  { label: '旅遊金',   amount: 2000 },
  { label: '保教30健', amount: 5926 },
  { label: '娛樂費',   amount: 3500 },
] as const;

// ── Milestones ───────────────────────────────────────────────────────────────
export const MILESTONES = [
  { level: 1, amount: 30000  },
  { level: 2, amount: 50000  },
  { level: 3, amount: 100000 },
] as const;

export type Milestone = (typeof MILESTONES)[number];

// ── Travel plans ─────────────────────────────────────────────────────────────
export interface TravelPlan {
  id: string;
  month: string;
  destination: string;
  budget: number;
  flightPaid: boolean;
  note?: string;
  breakdown?: { label: string; amount: number }[];
}

export const TRAVEL_PLANS: TravelPlan[] = [
  {
    id: 'yilan',
    month: '2026/07',
    destination: '宜蘭',
    budget: 6000,
    flightPaid: false,
  },
  {
    id: 'singapore',
    month: '2026/10',
    destination: '新加坡',
    budget: 49639,
    flightPaid: true,
    note: '機票已付',
    breakdown: [
      { label: '住宿',         amount: 24639 },
      { label: 'F1 門票',      amount: 20000 },
      { label: '食物＋交通',   amount: 5000  },
    ],
  },
  {
    id: 'chiayi',
    month: '2026/10',
    destination: '嘉義三天兩夜',
    budget: 7000,
    flightPaid: false,
  },
  {
    id: 'hualien',
    month: '2026/11',
    destination: '花蓮',
    budget: 6000,
    flightPaid: false,
  },
];

export const TRAVEL_MONTHLY_ALLOCATION = 2000;

// ── Direction config (no traffic-light colors) ───────────────────────────────
export interface DirectionConfig {
  label: string;
  sign: string;
  textColor: string;
}

export const DIRECTION_CONFIG: Record<RecoveryStatus, DirectionConfig> = {
  baseline:   { label: 'Baseline',   sign: '—', textColor: 'text-slate-500'   },
  increasing: { label: '上升',       sign: '+', textColor: 'text-emerald-600' },
  decreasing: { label: '下降',       sign: '↓', textColor: 'text-slate-600'   },
  flat:       { label: '持平',       sign: '→', textColor: 'text-slate-500'   },
};

// ── Pure helpers ─────────────────────────────────────────────────────────────
export function computeFreedomReserve(r: MonthlyRecord): number {
  return r.reserveFund + r.travelFund + r.entertainFund;
}

export function computeAvailableLivingRoom(income: number): number {
  return income - FIXED_COMMITMENTS - FIXED_ALLOCATIONS;
}

export function getNextMilestone(fc: number): Milestone | null {
  for (const m of MILESTONES) {
    if (fc < m.amount) return m;
  }
  return null;
}

export function getDirection(current: number, prev: number | null): RecoveryStatus {
  if (prev === null) return 'baseline';
  if (current > prev) return 'increasing';
  if (current < prev) return 'decreasing';
  return 'flat';
}

// projectedTravelFund: fund before a trip, given it's N months away.
// Formula: currentFund + (months - 1) × monthlyAllocation
// Rationale: current month allocation already in fund; each subsequent month adds one.
export function projectedTravelFund(
  currentFund: number,
  monthsUntil: number
): number {
  return currentFund + Math.max(0, monthsUntil - 1) * TRAVEL_MONTHLY_ALLOCATION;
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('zh-TW');
}

export function fmtPct(ratio: number): string {
  return (ratio * 100).toFixed(1) + '%';
}

export function computeAverageMonthlyGrowth(records: MonthlyRecord[]): number | null {
  if (records.length < 3) return null;
  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
  const changes: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    changes.push(computeFreedomReserve(sorted[i]) - computeFreedomReserve(sorted[i - 1]));
  }
  return changes.reduce((s, c) => s + c, 0) / changes.length;
}

export function addMonth(month: string): string {
  const [y, m] = month.split('/').map(Number);
  return m === 12
    ? `${y + 1}/01`
    : `${y}/${String(m + 1).padStart(2, '0')}`;
}

export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split('/').map(Number);
  const [ty, tm] = to.split('/').map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

// ── Forecast Confidence ───────────────────────────────────────────────────────
export type ForecastConfidence = 'confirmed' | 'highly-likely' | 'expected';

export const CONFIDENCE_LABELS: Record<ForecastConfidence, string> = {
  'confirmed':     'Confirmed',
  'highly-likely': 'Highly Likely',
  'expected':      'Expected',
};

export interface ForecastAssumption {
  id: string;
  label: string;
  basis: string;      // one-line explanation of how the number is derived
  amount: number;
  confidence: ForecastConfidence;
  date?: string;
}

export interface ForecastActualEntry {
  id: string;
  label: string;
  forecast: number;
  actual: number | null;
}

export interface ForecastReview {
  month: string; // "2026/10"
  entries: ForecastActualEntry[];
  savedAt: string;
}

// ── Cash Events ───────────────────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  insurance:     '保費',
  travel:        '旅遊',
  fitness:       '健身訓練',
  'house-project': '房屋專案',
  other:         '其他',
};

export interface CashEvent {
  id: string;
  date: string;     // display: "2026/09/30" or "2026/10"
  monthKey: string; // for grouping: "2026/09"
  event: string;
  amount: number;
  type: 'required' | 'optional';
  category: 'insurance' | 'travel' | 'fitness' | 'house-project' | 'other';
}

// ── House Project Reconciliation ──────────────────────────────────────────────
export const HOUSE_PROJECT_DIFF              = 70217;
export const HOUSE_PROJECT_Q2_SETTLEMENT     = 22000;
export const HOUSE_PROJECT_DRAGONBOAT_ALLOC  = 48217;
export const HOUSE_PROJECT_RECONCILIATION    = HOUSE_PROJECT_DIFF - HOUSE_PROJECT_Q2_SETTLEMENT; // 48217
export const HOUSE_PROJECT_SETTLEMENT_DATE   = '2026/06/30';
export const DRAGONBOAT_TOTAL                = 52000;
export const DRAGONBOAT_REMAINING_FOR_OCTOBER = DRAGONBOAT_TOTAL - HOUSE_PROJECT_DRAGONBOAT_ALLOC; // 3783

export const CASH_EVENTS: CashEvent[] = [
  { id: 'house-reconciliation', date: '2026/06/30', monthKey: '2026/06', event: '房屋專案對帳（Q2）', amount: HOUSE_PROJECT_DIFF, type: 'required', category: 'house-project' },
  { id: 'yilan',        date: '2026/07',    monthKey: '2026/07', event: '宜蘭旅遊',          amount: 6000,  type: 'optional',  category: 'travel'    },
  { id: 'pt',           date: '2026/08',    monthKey: '2026/08', event: '個人訓練課程',       amount: 16000, type: 'required',  category: 'fitness'   },
  { id: 'ins-global',   date: '2026/09/30', monthKey: '2026/09', event: '全球人壽保費',       amount: 12284, type: 'required',  category: 'insurance' },
  { id: 'ins-taiwan',   date: '2026/10/01', monthKey: '2026/10', event: '台灣人壽保費',       amount: 19787, type: 'required',  category: 'insurance' },
  { id: 'singapore',    date: '2026/10',    monthKey: '2026/10', event: '新加坡旅遊',         amount: 49639, type: 'optional',  category: 'travel'    },
  { id: 'chiayi',       date: '2026/10',    monthKey: '2026/10', event: '嘉義三天兩夜',       amount: 7000,  type: 'optional',  category: 'travel'    },
  { id: 'ins-mother',   date: '2026/10/17', monthKey: '2026/10', event: '全球人壽保費（母親）', amount: 30111, type: 'required',  category: 'insurance' },
  { id: 'hualien',      date: '2026/11',    monthKey: '2026/11', event: '花蓮旅遊',           amount: 6000,  type: 'optional',  category: 'travel'    },
];

export const INSURANCE_EVENTS = CASH_EVENTS.filter(e => e.category === 'insurance');
export const INSURANCE_TOTAL = INSURANCE_EVENTS.reduce((s, e) => s + e.amount, 0); // 62182
export const INSURANCE_MONTHLY_ALLOC = 5926; // from fixed allocations
export const INSURANCE_FIRST_MONTH = '2026/09'; // earliest insurance month

// Project the insurance protection fund to the month of first payment
export function projectedInsuranceFund(currentFund: number, currentMonth: string): number {
  const months = Math.max(0, monthsBetween(currentMonth, INSURANCE_FIRST_MONTH));
  return currentFund + months * INSURANCE_MONTHLY_ALLOC;
}

// Project the Singapore travel fund to October
export function projectedSingaporeFund(currentFund: number, currentMonth: string): number {
  const months = Math.max(0, monthsBetween(currentMonth, '2026/10') - 1);
  return currentFund + months * TRAVEL_MONTHLY_ALLOCATION;
}

// Aggregate cash events by calendar month
export interface MonthPeak {
  month: string;
  total: number;
  events: CashEvent[];
}

export function cashPeaksByMonth(): MonthPeak[] {
  const map: Record<string, MonthPeak> = {};
  for (const e of CASH_EVENTS) {
    if (!map[e.monthKey]) map[e.monthKey] = { month: e.monthKey, total: 0, events: [] };
    map[e.monthKey].total += e.amount;
    map[e.monthKey].events.push(e);
  }
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

// ── Cash Inflows ──────────────────────────────────────────────────────────────
export interface CashInflow {
  id: string;
  name: string;
  category: 'confirmed' | 'expected';
  amount: number;
  frequency: 'one-time' | 'monthly';
  expectedMonth?: string;
  startMonth?: string;
  status: 'pending' | 'approved-pending';
  note?: string;
}

export const CASH_INFLOWS: CashInflow[] = [
  {
    id: 'dragon-boat',
    name: '端午節獎金',
    category: 'confirmed',
    amount: 52000,
    frequency: 'one-time',
    expectedMonth: '2026/06',
    status: 'pending',
  },
  {
    id: 'mid-autumn',
    name: '中秋節獎金',
    category: 'confirmed',
    amount: 52000,
    frequency: 'one-time',
    expectedMonth: '2026/09',
    status: 'pending',
    note: '預計 2026/09/25 發放',
  },
  {
    id: 'housing-subsidy',
    name: '住房補貼',
    category: 'expected',
    amount: 4800,
    frequency: 'monthly',
    startMonth: '2026/05',
    status: 'approved-pending',
    note: '已核准，尚未收到',
  },
];

// Compute months of accrued but unreceived subsidy
export function accruedSubsidy(startMonth: string, currentMonth: string, monthly: number): number {
  const months = Math.max(0, monthsBetween(startMonth, currentMonth) + 1);
  return months * monthly;
}

// ── Receivables ───────────────────────────────────────────────────────────────
export interface CashReceivable {
  id: string;
  name: string;
  frequency: 'quarterly' | 'annual' | 'one-time';
  parties: { name: string; amount: number }[];
  // date format: "2026/06/30" — used for cutoff filtering
  settlements: { period: string; date: string; amount: number | null }[];
  note?: string;
}

export const CASH_RECEIVABLES: CashReceivable[] = [
  {
    id: 'house-settlement',
    name: '房屋專案結算',
    frequency: 'quarterly',
    parties: [
      { name: '姐姐', amount: 13600 },
      { name: '妹妹', amount: 8400  },
    ],
    settlements: [
      { period: 'Q2 2026', date: '2026/06/30', amount: 22000 },
      { period: 'Q3 2026', date: '2026/09/30', amount: 22000 },
      { period: 'Q4 2026', date: '2026/12/31', amount: 22000 },
    ],
    note: '先前支出之分攤，每季收回',
  },
];

// Sum settlements whose date falls strictly before cutoffMonth (e.g. "2026/10")
export function receivablesBefore(cutoffMonth: string): number {
  return CASH_RECEIVABLES.reduce((total, rec) =>
    total + rec.settlements
      .filter(s => s.amount !== null && s.date.slice(0, 7) < cutoffMonth)
      .reduce((sum, s) => sum + (s.amount ?? 0), 0),
    0
  );
}

export function confirmedReceivableTotal(): number {
  return receivablesBefore('9999/99'); // all confirmed settlements
}

// ── Internal Balances ─────────────────────────────────────────────────────────
export interface InternalBalance {
  id: string;
  name: string;
  currentBalance: number;
  expectedBalance: number;
  targetDate: string; // "2026/12"
  note?: string;
}

export const INTERNAL_BALANCES: InternalBalance[] = [
  {
    id: 'house-project',
    name: '房屋專案帳戶',
    currentBalance: 200469,
    expectedBalance: 270686,
    targetDate: '2026/12',
    note: '逐步補足，目標 2026 年底達標',
  },
];
