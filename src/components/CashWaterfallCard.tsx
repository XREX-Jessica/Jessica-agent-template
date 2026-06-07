import React from 'react';
import {
  MonthlyRecord,
  FIXED_COMMITMENTS,
  FIXED_ALLOCATIONS,
  FIXED_BREAKDOWN,
  ALLOCATION_BREAKDOWN,
  computeAvailableLivingRoom,
  fmt,
} from '../types';

interface Props {
  record: MonthlyRecord;
}

export function CashWaterfallCard({ record }: Props) {
  const availableRoom = computeAvailableLivingRoom(record.income);
  const isNegative = availableRoom < 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        現金分配
      </p>

      {/* Waterfall rows */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center py-2.5">
          <span className="text-sm text-slate-700 font-medium">月收入</span>
          <span className="text-sm font-semibold text-slate-800 tabular-nums">
            {fmt(record.income)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-t border-dashed border-slate-100">
          <div>
            <span className="text-sm text-slate-500">固定支出</span>
            <span className="ml-1.5 text-xs text-slate-400">
              （房貸、房租、信貸、學貸）
            </span>
          </div>
          <span className="text-sm text-slate-500 tabular-nums">
            − {fmt(FIXED_COMMITMENTS)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-t border-dashed border-slate-100">
          <div>
            <span className="text-sm text-slate-500">固定撥款</span>
            <span className="ml-1.5 text-xs text-slate-400">
              （備用金、旅遊、學習等）
            </span>
          </div>
          <span className="text-sm text-slate-500 tabular-nums">
            − {fmt(FIXED_ALLOCATIONS)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-t-2 border-slate-200 mt-1">
          <div>
            <p className="text-sm font-medium text-slate-700">可用生活空間</p>
            <p className="text-xs text-slate-400 mt-0.5">
              月收入扣除所有固定項目後，真正可自由運用的部分
            </p>
          </div>
          <span
            className={`text-xl font-bold tabular-nums ml-4 ${
              isNegative ? 'text-orange-500' : 'text-emerald-600'
            }`}
          >
            {isNegative ? '− ' : ''}{fmt(Math.abs(availableRoom))}
          </span>
        </div>
      </div>

      {/* Detail tables */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-lg bg-slate-50 px-3 py-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">固定支出</p>
          <div className="space-y-1.5">
            {FIXED_BREAKDOWN.map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-xs text-slate-500 tabular-nums">
                  {fmt(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">固定撥款</p>
          <div className="space-y-1.5">
            {ALLOCATION_BREAKDOWN.map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-xs text-slate-500 tabular-nums">
                  {fmt(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
