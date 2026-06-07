import React, { useState } from 'react';
import {
  MonthlyRecord,
  INSURANCE_TOTAL,
  CASH_EVENTS,
  CASH_INFLOWS,
  CASH_RECEIVABLES,
  HOUSE_PROJECT_DIFF,
  HOUSE_PROJECT_Q2_SETTLEMENT,
  HOUSE_PROJECT_DRAGONBOAT_ALLOC,
  HOUSE_PROJECT_RECONCILIATION,
  HOUSE_PROJECT_SETTLEMENT_DATE,
  DRAGONBOAT_TOTAL,
  DRAGONBOAT_REMAINING_FOR_OCTOBER,
  projectedInsuranceFund,
  projectedSingaporeFund,
  accruedSubsidy,
  monthsBetween,
  fmt,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
}

export function OctoberForecastCard({ currentRecord }: Props) {
  const [showAssumptions, setShowAssumptions] = useState(false);

  const sgpEvent       = CASH_EVENTS.find(e => e.id === 'singapore')!;
  const chiyaEvent     = CASH_EVENTS.find(e => e.id === 'chiayi')!;
  const dragonBoat     = CASH_INFLOWS.find(i => i.id === 'dragon-boat')!;
  const midAutumn      = CASH_INFLOWS.find(i => i.id === 'mid-autumn')!;
  const housingSubsidy = CASH_INFLOWS.find(i => i.id === 'housing-subsidy')!;
  const houseRec       = CASH_RECEIVABLES[0];

  // Required
  const totalRequired = INSURANCE_TOTAL + sgpEvent.amount + chiyaEvent.amount;

  // Confirmed sources — Dragon Boat remaining + Mid-Autumn + Q3 settlement
  const insProjected    = projectedInsuranceFund(currentRecord.insuranceFund, currentRecord.month);
  const sgpProjected    = projectedSingaporeFund(currentRecord.travelFund, currentRecord.month);
  const q3Amount        = houseRec.settlements[1].amount ?? 0;
  const confirmedTotal  = insProjected + sgpProjected + DRAGONBOAT_REMAINING_FOR_OCTOBER + midAutumn.amount + q3Amount;

  // Expected
  const housingProjected = housingSubsidy.startMonth
    ? accruedSubsidy(housingSubsidy.startMonth, '2026/09', housingSubsidy.amount)
    : 0;

  // Positions
  const positionConservative = confirmedTotal - totalRequired;              // -43,933
  const positionWithExpected = confirmedTotal + housingProjected - totalRequired; // -19,933

  const insMonths     = Math.max(0, monthsBetween(currentRecord.month, '2026/09'));
  const sgpMonths     = Math.max(0, monthsBetween(currentRecord.month, '2026/10') - 1);
  const housingMonths = housingSubsidy.startMonth
    ? Math.max(0, monthsBetween(housingSubsidy.startMonth, '2026/09') + 1)
    : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">
        October Forecast · 十月資金預測
      </p>
      <p className="text-xs text-slate-400 mb-5">
        10 月為目前最大現金集中月份，含保費、新加坡與嘉義行程。
      </p>

      {/* Required Cash */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Required Cash</p>
        <div className="space-y-1.5">
          {[
            { label: '保費（9–10 月）', amount: INSURANCE_TOTAL   },
            { label: '新加坡旅遊',      amount: sgpEvent.amount   },
            { label: '嘉義行程',        amount: chiyaEvent.amount },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className="text-sm tabular-nums text-slate-700">{fmt(r.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-600">合計</span>
            <span className="text-sm font-semibold text-slate-800 tabular-nums">{fmt(totalRequired)}</span>
          </div>
        </div>
      </div>

      {/* Confirmed Funding */}
      <div className="mb-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Confirmed Funding</p>
        <div className="space-y-1.5">
          {[
            { label: '保險基金預計（至9月）',                                    amount: insProjected                   },
            { label: '旅遊基金預計（至10月）',                                   amount: sgpProjected                   },
            { label: 'Dragon Boat Bonus（已扣 House Project 分配後）',          amount: DRAGONBOAT_REMAINING_FOR_OCTOBER },
            { label: `${midAutumn.name}（${midAutumn.expectedMonth}）`,         amount: midAutumn.amount               },
            { label: 'Q3 House Settlement（9/30）',                             amount: q3Amount                       },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className="text-sm tabular-nums text-slate-600">{fmt(Math.round(r.amount))}</span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-600">Confirmed 合計</span>
            <span className="text-sm font-semibold text-slate-800 tabular-nums">{fmt(Math.round(confirmedTotal))}</span>
          </div>
        </div>
      </div>

      {/* Expected Funding */}
      <div className="mb-5 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Expected Funding</p>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-slate-500">住房補貼應計（5月至9月，5個月）</p>
            <p className="text-xs text-slate-400 mt-0.5">已核准，尚未收到 · 4,800 × 5</p>
          </div>
          <span className="text-sm tabular-nums text-slate-700 shrink-0 ml-4">{fmt(housingProjected)}</span>
        </div>
      </div>

      {/* October Position */}
      <div className="pt-4 border-t-2 border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
          October Position (Conservative)
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-400 mb-1">Confirmed Only</p>
            <p className={`text-2xl font-bold tabular-nums ${positionConservative >= 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
              {positionConservative >= 0 ? '+' : ''}{fmt(Math.round(positionConservative))}
            </p>
            <p className="text-xs text-slate-400 mt-1 tabular-nums">
              {fmt(Math.round(confirmedTotal))} − {fmt(totalRequired)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-400 mb-1">Including Expected</p>
            <p className={`text-2xl font-bold tabular-nums ${positionWithExpected >= 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
              {positionWithExpected >= 0 ? '+' : ''}{fmt(Math.round(positionWithExpected))}
            </p>
            <p className="text-xs text-slate-400 mt-1 tabular-nums">
              + {fmt(housingProjected)} Expected
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible Assumptions */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setShowAssumptions(v => !v)}
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            Forecast Assumptions
          </p>
          <span className="text-xs text-slate-400">{showAssumptions ? '▲ 收起' : '▼ 展開'}</span>
        </button>

        {showAssumptions && (
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Protection Fund</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Balance</span>
                  <span className="tabular-nums">{fmt(currentRecord.insuranceFund)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Monthly Contribution × {insMonths} 個月</span>
                  <span className="tabular-nums">+ {fmt(5926 * insMonths)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Projected</span>
                  <span className="tabular-nums">{fmt(Math.round(insProjected))}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Travel Fund</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Balance</span>
                  <span className="tabular-nums">{fmt(currentRecord.travelFund)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Monthly Contribution × {sgpMonths} 個月</span>
                  <span className="tabular-nums">+ {fmt(2000 * sgpMonths)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Projected</span>
                  <span className="tabular-nums">{fmt(Math.round(sgpProjected))}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Dragon Boat Festival Bonus</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Total Amount（{dragonBoat.expectedMonth}）</span>
                  <span className="tabular-nums">{fmt(DRAGONBOAT_TOTAL)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Allocated to House Project</span>
                  <span className="tabular-nums">− {fmt(HOUSE_PROJECT_DRAGONBOAT_ALLOC)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Remaining Available for October</span>
                  <span className="tabular-nums">{fmt(DRAGONBOAT_REMAINING_FOR_OCTOBER)}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Mid-Autumn Festival Bonus</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Amount（{midAutumn.expectedMonth}）</span>
                  <span className="tabular-nums">{fmt(midAutumn.amount)}</span>
                </div>
                <p className="text-xs text-slate-400">預計 2026/09/25 發放，完全可用於 October</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Q3 House Settlement</p>
              <div className="flex justify-between text-xs text-slate-400 pl-2">
                <span>{houseRec.settlements[1].period}（{houseRec.settlements[1].date}）</span>
                <span className="tabular-nums">{fmt(houseRec.settlements[1].amount ?? 0)}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">House Project Reconciliation</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Amount Required</span>
                  <span className="tabular-nums">{fmt(HOUSE_PROJECT_DIFF)}</span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-2 mb-1">Funding Sources</p>
                <div className="flex justify-between text-xs text-slate-400 pl-2">
                  <span>Q2 Settlement</span>
                  <span className="tabular-nums">{fmt(HOUSE_PROJECT_Q2_SETTLEMENT)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pl-2">
                  <span>Dragon Boat Bonus</span>
                  <span className="tabular-nums">{fmt(HOUSE_PROJECT_DRAGONBOAT_ALLOC)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-emerald-600 mt-1">
                  <span>Status</span>
                  <span>Fully Funded</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Settlement Date</span>
                  <span>{HOUSE_PROJECT_SETTLEMENT_DATE}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Housing Subsidy（Expected）</p>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>4,800/月 × {housingMonths} 個月（5月至9月）</span>
                  <span className="tabular-nums">{fmt(housingProjected)}</span>
                </div>
                <p className="text-xs text-slate-400">Approved — Not Yet Received</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
