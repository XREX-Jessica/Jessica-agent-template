import React from 'react';
import { MonthlyRecord, computeFreedomReserve, fmt } from '../types';

interface Props {
  records: MonthlyRecord[];
}

export function HistoryTable({ records }: Props) {
  const sorted = [...records].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        歷史記錄
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-100">
              {[
                { label: '月份',       align: 'left'  },
                { label: '收入',       align: 'right' },
                { label: '支出',       align: 'right' },
                { label: '自由儲備金', align: 'right' },
                { label: '月增減',     align: 'right' },
                { label: '備註',       align: 'left'  },
              ].map(h => (
                <th
                  key={h.label}
                  className={`pb-3 text-xs font-medium text-slate-400 text-${h.align}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((record, idx) => {
              const reserve = computeFreedomReserve(record);
              const prev = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
              const prevReserve = prev ? computeFreedomReserve(prev) : null;
              const diff = prevReserve !== null ? reserve - prevReserve : null;

              return (
                <tr
                  key={record.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3 font-medium text-slate-700 whitespace-nowrap">
                    {record.month}
                    {record.isBaseline && (
                      <span className="ml-1.5 text-xs text-slate-400 font-normal">基準</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-slate-500 tabular-nums">
                    {fmt(record.income)}
                  </td>
                  <td className="py-3 text-right text-slate-500 tabular-nums">
                    {record.expense !== undefined ? fmt(record.expense) : '—'}
                  </td>
                  <td className="py-3 text-right font-medium text-slate-700 tabular-nums">
                    {fmt(reserve)}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {diff === null ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span className={diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-slate-600' : 'text-slate-400'}>
                        {diff > 0 ? '+' : ''}{fmt(diff)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-xs text-slate-400 max-w-[180px] truncate">
                    {record.note ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
