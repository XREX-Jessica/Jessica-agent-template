import React from 'react';
import { MonthlyRecord, computeFreedomReserve, fmt } from '../types';

interface Props {
  currentRecord: MonthlyRecord;
  prevRecord: MonthlyRecord | null;
}

export function MonthlyDirectionCard({ currentRecord, prevRecord }: Props) {
  const current = computeFreedomReserve(currentRecord);
  const prev = prevRecord ? computeFreedomReserve(prevRecord) : null;
  const diff = prev !== null ? current - prev : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        本月儲備金變化
      </p>

      <div className="mb-5">
        {diff === null ? (
          <div>
            <span className="text-3xl font-bold text-slate-400">Baseline</span>
            <p className="text-xs text-slate-400 mt-1.5">5月為基準月，無上月可比較。</p>
          </div>
        ) : (
          <span
            className={`text-3xl font-bold tabular-nums ${
              diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            {diff > 0 ? '+' : ''}
            {fmt(diff)}
          </span>
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">本月自由儲備金</span>
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(current)}
          </span>
        </div>
        {prev !== null && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">上月自由儲備金</span>
            <span className="text-sm text-slate-400 tabular-nums">{fmt(prev)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
