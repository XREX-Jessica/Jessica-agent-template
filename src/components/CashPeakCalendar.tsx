import React from 'react';
import { cashPeaksByMonth, fmt } from '../types';

export function CashPeakCalendar() {
  const peaks = cashPeaksByMonth();
  const maxTotal = Math.max(...peaks.map(p => p.total));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">
        Cash Peak Calendar · 月度現金集中度
      </p>
      <p className="text-xs text-slate-400 mb-4">哪個月需要最多現金？</p>

      <div className="space-y-3">
        {peaks.map(peak => {
          const barPct = (peak.total / maxTotal) * 100;
          const isPeak = peak.total === maxTotal;

          return (
            <div key={peak.month}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 w-16 shrink-0">{peak.month}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${isPeak ? 'bg-slate-600' : 'bg-slate-300'}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
                <span className={`text-sm tabular-nums text-right w-20 shrink-0 ${isPeak ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                  {fmt(peak.total)}
                </span>
              </div>
              {isPeak && (
                <div className="ml-16 pl-3">
                  {peak.events.map(e => (
                    <p key={e.id} className="text-xs text-slate-400 tabular-nums">
                      {e.event}：{fmt(e.amount)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
        <span>總計（所有事件）</span>
        <span className="tabular-nums font-medium text-slate-600">
          {fmt(peaks.reduce((s, p) => s + p.total, 0))}
        </span>
      </div>
    </div>
  );
}
