import React from 'react';
import {
  MonthlyRecord,
  TRAVEL_PLANS,
  projectedTravelFund,
  monthsBetween,
  fmt,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
}

export function TravelCard({ currentRecord }: Props) {
  const startMonth = currentRecord.month;
  const currentFund = currentRecord.travelFund;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          旅遊資金時間軸
        </p>
        <p className="text-xs text-slate-400">
          目前旅遊金 <span className="font-medium text-slate-600">{fmt(currentFund)}</span>・月撥 2,000
        </p>
      </div>

      <div className="mt-4 space-y-0">
        {TRAVEL_PLANS.map(plan => {
          const months = monthsBetween(startMonth, plan.month);
          const projected = months > 0 ? projectedTravelFund(currentFund, months) : currentFund;
          const diff = projected - plan.budget;
          const isCovered = diff >= 0;

          return (
            <div
              key={plan.id}
              className="py-4 border-b border-slate-50 last:border-0"
            >
              {/* Row 1: date + destination + budget */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs tabular-nums text-slate-400 w-14 shrink-0">
                    {plan.month}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-medium text-slate-700">
                        {plan.destination}
                      </span>
                      {plan.flightPaid && (
                        <span className="text-xs text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                          機票已付
                        </span>
                      )}
                    </div>
                    {/* Breakdown if available */}
                    {plan.breakdown && (
                      <div className="mt-1 space-y-0.5">
                        {plan.breakdown.map(item => (
                          <p key={item.label} className="text-xs text-slate-400 tabular-nums">
                            {item.label}：{fmt(item.amount)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 tabular-nums shrink-0 ml-4">
                  {fmt(plan.budget)}
                </span>
              </div>

              {/* Row 2: projected fund + diff */}
              <div className="flex items-center justify-between pl-[66px]">
                <span className="text-xs text-slate-400">
                  行程前預估旅遊金：
                  <span className="text-slate-600 font-medium tabular-nums ml-1">
                    {fmt(Math.round(projected))}
                  </span>
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isCovered ? 'text-emerald-600' : 'text-slate-700'
                  }`}
                >
                  {diff > 0 ? '+' : ''}
                  {fmt(Math.round(diff))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
