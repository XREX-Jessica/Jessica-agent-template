import React from 'react';
import {
  MonthlyRecord,
  CASH_INFLOWS,
  CASH_RECEIVABLES,
  accruedSubsidy,
  monthsBetween,
  fmt,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
}

export function CashInflowsCard({ currentRecord }: Props) {
  const confirmed = CASH_INFLOWS.filter(i => i.category === 'confirmed');
  const expected  = CASH_INFLOWS.filter(i => i.category === 'expected');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Future Cash Inflows · 未來現金流入
      </p>

      {/* ── Confirmed ── */}
      <div className="mb-5">
        <p className="text-xs font-medium text-slate-500 mb-3">Confirmed · 確定收入</p>
        {confirmed.map(inflow => (
          <div key={inflow.id} className="flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm text-slate-700">{inflow.name}</p>
              {inflow.expectedMonth && (
                <p className="text-xs text-slate-400 mt-0.5">預計 {inflow.expectedMonth}</p>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-700 tabular-nums ml-4">
              {fmt(inflow.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Expected ── */}
      <div className="mb-5 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-3">Expected · 預期收入</p>
        {expected.map(inflow => {
          const isMonthly = inflow.frequency === 'monthly';
          const months = isMonthly && inflow.startMonth
            ? Math.max(0, monthsBetween(inflow.startMonth, currentRecord.month) + 1)
            : 0;
          const accrued = isMonthly && inflow.startMonth
            ? accruedSubsidy(inflow.startMonth, currentRecord.month, inflow.amount)
            : null;

          return (
            <div key={inflow.id} className="py-2.5 border-b border-slate-50 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-slate-700">{inflow.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isMonthly ? `${fmt(inflow.amount)}/月` : fmt(inflow.amount)}
                    {inflow.startMonth ? `・起自 ${inflow.startMonth}` : ''}
                  </p>
                </div>
                {inflow.note && (
                  <span className="text-xs text-slate-400 bg-slate-50 rounded px-2 py-0.5 ml-4 shrink-0">
                    {inflow.note}
                  </span>
                )}
              </div>
              {accrued !== null && (
                <div className="flex justify-between items-center py-1.5 bg-slate-50 rounded-lg px-3">
                  <span className="text-xs text-slate-500">
                    應計未收（{months} 個月）
                  </span>
                  <span className="text-sm font-medium text-slate-700 tabular-nums">
                    {fmt(accrued)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Recurring Receivables ── */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-3">Recurring Receivables · 定期應收款項</p>

        {CASH_RECEIVABLES.map(rec => {
          const confirmedTotal = rec.settlements
            .filter(s => s.amount !== null)
            .reduce((s, t) => s + (t.amount ?? 0), 0);
          const partyTotal = rec.parties.reduce((s, p) => s + p.amount, 0);

          return (
            <div key={rec.id} className="py-2.5">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-sm text-slate-700">{rec.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rec.frequency === 'quarterly' ? '每季結算' : rec.frequency} ·{' '}
                    每次 {fmt(partyTotal)}
                  </p>
                </div>
              </div>

              {/* Party breakdown */}
              <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
                {rec.parties.map(p => (
                  <div key={p.name} className="flex justify-between px-3 py-1.5 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500">{p.name}</span>
                    <span className="text-xs font-medium text-slate-600 tabular-nums">{fmt(p.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Settlement history */}
              <div className="space-y-1">
                {rec.settlements.map(s => (
                  <div key={s.period} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{s.period}</span>
                      <span className="text-xs text-slate-300">{s.date}</span>
                    </div>
                    <span className={`text-xs tabular-nums ${s.amount !== null ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                      {s.amount !== null ? fmt(s.amount) : 'TBD'}
                    </span>
                  </div>
                ))}
              </div>

              {rec.note && (
                <p className="text-xs text-slate-400 mt-2">{rec.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
