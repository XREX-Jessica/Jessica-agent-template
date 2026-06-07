import React from 'react';
import { useFinancialData } from './hooks/useFinancialData';

// Section 1 – Current Position
import { MonthlyReviewCard } from './components/MonthlyReviewCard';
import { FreedomReserveCard } from './components/FreedomCashCard';
import { MonthlyDirectionCard } from './components/MonthlyDirectionCard';
import { RunwayCard } from './components/RunwayCard';

// Section 2 – Future Cash Events
import { FutureCashEventsCard } from './components/FutureCashEventsCard';

// Section 3 – Funding Status
import { FundingStatusCard } from './components/FundingStatusCard';

// Section 4 – Future Cash Inflows
import { CashInflowsCard } from './components/CashInflowsCard';

// Section 5 – Internal Balances
import { InternalBalancesCard } from './components/InternalBalancesCard';

// Section 6 – Cash Peak Calendar
import { CashPeakCalendar } from './components/CashPeakCalendar';

// Section 7 – October Forecast
import { OctoberForecastCard } from './components/OctoberForecastCard';
import { ForecastReviewCard } from './components/ForecastReviewCard';
import { ForecastScopeCard } from './components/ForecastScopeCard';

// Supporting tools
import { MonthlySpendingGuardrailCard } from './components/MonthlySpendingGuardrailCard';
import { CashWaterfallCard } from './components/CashWaterfallCard';
import { NetCashFlowCard } from './components/NetCashFlowCard';

// Data
import { UpdateForm } from './components/UpdateForm';
import { HistoryTable } from './components/HistoryTable';

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-medium tracking-widest text-slate-300 uppercase pt-2">
      {label}
    </p>
  );
}

export default function App() {
  const { records, addOrUpdateRecord, ready } = useFinancialData();

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">載入中…</p>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
  const currentRecord = sorted[sorted.length - 1];
  const prevRecord = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-800 tracking-tight">
              Jessica Financial OS
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Personal Treasury Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">{currentRecord.month}</p>
            <p className="text-xs text-slate-400">最新記錄</p>
          </div>
        </div>
      </header>

      {/* ── Dashboard ── */}
      <main className="max-w-3xl mx-auto px-5 py-6 space-y-4">

        {/* §1 Current Position */}
        <SectionLabel label="01 · Current Position" />
        <MonthlyReviewCard
          currentRecord={currentRecord}
          prevRecord={prevRecord}
          records={records}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FreedomReserveCard currentRecord={currentRecord} prevRecord={prevRecord} />
          <MonthlyDirectionCard currentRecord={currentRecord} prevRecord={prevRecord} />
        </div>
        <RunwayCard records={records} />

        {/* §2 Future Cash Events */}
        <SectionLabel label="02 · Future Cash Events" />
        <FutureCashEventsCard />

        {/* §3 Funding Status */}
        <SectionLabel label="03 · Funding Status" />
        <FundingStatusCard currentRecord={currentRecord} />

        {/* §4 Future Cash Inflows */}
        <SectionLabel label="04 · Future Cash Inflows" />
        <CashInflowsCard currentRecord={currentRecord} />

        {/* §5 Internal Balances */}
        <SectionLabel label="05 · Internal Balances" />
        <InternalBalancesCard />

        {/* §6 Cash Peak Calendar */}
        <SectionLabel label="06 · Cash Peak Calendar" />
        <CashPeakCalendar />

        {/* §7 October Forecast + Review */}
        <SectionLabel label="07 · October Forecast" />
        <OctoberForecastCard currentRecord={currentRecord} />
        <ForecastScopeCard />
        <ForecastReviewCard />

        {/* Supporting Tools */}
        <SectionLabel label="Tools" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MonthlySpendingGuardrailCard currentRecord={currentRecord} />
          <div className="space-y-4">
            <CashWaterfallCard record={currentRecord} />
            <NetCashFlowCard record={currentRecord} />
          </div>
        </div>

        {/* Data Entry */}
        <SectionLabel label="Data" />
        <UpdateForm latestMonth={currentRecord.month} onSave={addOrUpdateRecord} />
        <HistoryTable records={records} />

        <p className="text-center text-xs text-slate-300 pb-4">
          Personal Treasury Dashboard · data/records.json · 自由儲備金 = 備用金 + 旅遊金 + 娛樂費
        </p>
      </main>
    </div>
  );
}
