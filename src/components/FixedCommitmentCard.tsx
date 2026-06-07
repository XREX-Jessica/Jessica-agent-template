import React from 'react';
import { MonthlyRecord, FIXED_COMMITMENTS, FIXED_BREAKDOWN, fmt, fmtPct } from '../types';

interface Props {
  record: MonthlyRecord;
}

export function FixedCommitmentCard({ record }: Props) {
  const ratio = record.income > 0 ? FIXED_COMMITMENTS / record.income : 0;
  const isHighRatio = ratio > 0.6;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
        固定支出
      </p>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-2xl font-bold text-slate-800 tabular-nums">
          NT$ {fmt(FIXED_COMMITMENTS)}
        </span>
        <span
          className={`text-sm font-medium ${
            isHighRatio ? 'text-orange-500' : 'text-slate-400'
          }`}
        >
          佔收入 {fmtPct(ratio)}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${
            isHighRatio ? 'bg-orange-300' : 'bg-slate-300'
          }`}
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>

      <div className="space-y-2">
        {FIXED_BREAKDOWN.map(item => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{item.label}</span>
            <span className="text-xs text-slate-500 tabular-nums">
              {fmt(item.amount)}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500">合計</span>
          <span className="text-xs font-medium text-slate-700 tabular-nums">
            {fmt(FIXED_COMMITMENTS)}
          </span>
        </div>
      </div>
    </div>
  );
}
