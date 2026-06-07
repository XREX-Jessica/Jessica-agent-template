import React from 'react';
import {
  MonthlyRecord,
  INSURANCE_TOTAL,
  INSURANCE_MONTHLY_ALLOC,
  INSURANCE_FIRST_MONTH,
  projectedInsuranceFund,
  projectedSingaporeFund,
  TRAVEL_MONTHLY_ALLOCATION,
  monthsBetween,
  fmt,
} from '../types';

const SINGAPORE_REQUIRED = 49639;

interface FundingRow {
  label: string;
  required: number;
  currentFund: number;
  monthlyAlloc: number;
  targetMonth: string;
  projected: number;
}

interface Props {
  currentRecord: MonthlyRecord;
}

export function FundingStatusCard({ currentRecord }: Props) {
  const insProjected = projectedInsuranceFund(currentRecord.insuranceFund, currentRecord.month);
  const insGap = Math.max(0, INSURANCE_TOTAL - insProjected);
  const insMonths = Math.max(0, monthsBetween(currentRecord.month, INSURANCE_FIRST_MONTH));

  const sgpProjected = projectedSingaporeFund(currentRecord.travelFund, currentRecord.month);
  const sgpGap = Math.max(0, SINGAPORE_REQUIRED - sgpProjected);
  const sgpMonths = Math.max(0, monthsBetween(currentRecord.month, '2026/10') - 1);

  const rows: { label: string; required: number; current: number; monthlyAlloc: number; allocationMonths: number; projected: number; gap: number }[] = [
    {
      label: '保費（全部）',
      required: INSURANCE_TOTAL,
      current: currentRecord.insuranceFund,
      monthlyAlloc: INSURANCE_MONTHLY_ALLOC,
      allocationMonths: insMonths,
      projected: insProjected,
      gap: insGap,
    },
    {
      label: '新加坡行程',
      required: SINGAPORE_REQUIRED,
      current: currentRecord.travelFund,
      monthlyAlloc: TRAVEL_MONTHLY_ALLOCATION,
      allocationMonths: sgpMonths,
      projected: sgpProjected,
      gap: sgpGap,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Funding Status · 資金準備狀況
      </p>

      <div className="space-y-5">
        {rows.map(row => (
          <div key={row.label} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-slate-700 mb-3">{row.label}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">需求金額</p>
                <p className="text-sm font-semibold text-slate-800 tabular-nums">
                  {fmt(row.required)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">目前餘額</p>
                <p className="text-sm font-medium text-slate-600 tabular-nums">
                  {fmt(row.current)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">
                  預計撥款（×{row.allocationMonths} 月）
                </p>
                <p className="text-sm font-medium text-slate-600 tabular-nums">
                  +{fmt(row.monthlyAlloc * row.allocationMonths)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">預計可用</p>
                <p className="text-sm font-medium text-slate-600 tabular-nums">
                  {fmt(Math.round(row.projected))}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center py-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">資金缺口</span>
              <span className={`text-sm font-semibold tabular-nums ${row.gap > 0 ? 'text-slate-700' : 'text-emerald-600'}`}>
                {row.gap > 0 ? fmt(Math.round(row.gap)) : '已涵蓋'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
