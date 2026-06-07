import React from 'react';
import { CASH_EVENTS, CATEGORY_LABELS, fmt } from '../types';

export function FutureCashEventsCard() {
  const total    = CASH_EVENTS.reduce((s, e) => s + e.amount, 0);
  const required = CASH_EVENTS.filter(e => e.type === 'required').reduce((s, e) => s + e.amount, 0);
  const optional = CASH_EVENTS.filter(e => e.type === 'optional').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Future Cash Events · 未來現金事件
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">日期</th>
              <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">事件</th>
              <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">類別</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-400 pr-4">金額</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-400">性質</th>
            </tr>
          </thead>
          <tbody>
            {CASH_EVENTS.map(event => (
              <tr key={event.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-xs text-slate-400 tabular-nums whitespace-nowrap pr-4">
                  {event.date}
                </td>
                <td className="py-2.5 text-sm text-slate-700 pr-4">
                  {event.event}
                </td>
                <td className="py-2.5 text-xs text-slate-400 pr-4">
                  {CATEGORY_LABELS[event.category] ?? event.category}
                </td>
                <td className="py-2.5 text-sm text-slate-700 tabular-nums text-right pr-4">
                  {fmt(event.amount)}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-xs ${event.type === 'required' ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    {event.type === 'required' ? 'Required' : 'Optional'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-slate-400">Required 合計</p>
          <p className="text-sm font-medium text-slate-700 tabular-nums">{fmt(required)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Optional 合計</p>
          <p className="text-sm font-medium text-slate-700 tabular-nums">{fmt(optional)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">總計</p>
          <p className="text-sm font-semibold text-slate-800 tabular-nums">{fmt(total)}</p>
        </div>
      </div>
    </div>
  );
}
