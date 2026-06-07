import React from 'react';
import { TRAVEL_PLANS, fmt } from '../types';

export function FutureCashCard() {
  const sorted = [...TRAVEL_PLANS].sort((a, b) => b.budget - a.budget);
  const total = TRAVEL_PLANS.reduce((s, p) => s + p.budget, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        未來現金需求
      </p>

      <div className="space-y-0">
        {sorted.map((plan, idx) => (
          <div
            key={plan.id}
            className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 tabular-nums w-4">
                {idx + 1}
              </span>
              <div>
                <p className="text-sm text-slate-700">{plan.destination}</p>
                <p className="text-xs text-slate-400 mt-0.5">{plan.month}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700 tabular-nums">
              {fmt(plan.budget)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-200">
        <span className="text-xs font-medium text-slate-500">合計</span>
        <span className="text-sm font-bold text-slate-800 tabular-nums">
          {fmt(total)}
        </span>
      </div>
    </div>
  );
}
