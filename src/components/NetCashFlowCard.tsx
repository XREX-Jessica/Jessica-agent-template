import React from 'react';
import { MonthlyRecord, fmt } from '../types';

interface Props {
  record: MonthlyRecord;
}

export function NetCashFlowCard({ record }: Props) {
  const hasExpense = record.expense !== undefined && record.expense > 0;
  const net = hasExpense ? record.income - record.expense! : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        月度現金流
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">收入</span>
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            NT$ {fmt(record.income)}
          </span>
        </div>

        {hasExpense ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">支出</span>
              <span className="text-sm font-medium text-slate-700 tabular-nums">
                NT$ {fmt(record.expense!)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">淨現金流</span>
              <span
                className={`text-xl font-bold tabular-nums ${
                  net! >= 0 ? 'text-emerald-600' : 'text-slate-700'
                }`}
              >
                {net! > 0 ? '+' : ''}
                {fmt(net!)}
              </span>
            </div>
          </>
        ) : (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              支出未記錄 — 月末更新表單中可選填。
            </p>
          </div>
        )}
      </div>

      {record.note && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="mr-1">📌</span>
            {record.note}
          </p>
        </div>
      )}
    </div>
  );
}
