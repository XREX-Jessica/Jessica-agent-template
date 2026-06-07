import React from 'react';
import { MonthlyRecord, fmt } from '../types';

interface Props {
  currentRecord: MonthlyRecord;
}

export function MonthlySpendingGuardrailCard({ currentRecord }: Props) {
  const income = currentRecord.income;
  const expense = currentRecord.expense ?? 0;
  const burnGap = expense > 0 ? expense - income : null;

  const emergencyFund = currentRecord.reserveFund;
  const entertainmentFund = currentRecord.entertainFund;
  const availableBuffer = emergencyFund + entertainmentFund;

  const bufferRemaining = burnGap !== null && burnGap > 0
    ? availableBuffer - burnGap
    : availableBuffer;

  const isConsuming = burnGap !== null && burnGap > 0;
  const hasConsumedBuffer = bufferRemaining < availableBuffer;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">
        Monthly Spending Guardrail
      </p>
      <p className="text-xs text-slate-400 mb-4">
        我是不是已經在動用 October 資金了？
      </p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Monthly Income</span>
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(income)}
          </span>
        </div>

        {expense > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Monthly Spending</span>
              <span className="text-sm font-medium text-slate-700 tabular-nums">
                {fmt(expense)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500">Burn Gap</span>
              <span className={`text-lg font-bold tabular-nums ${isConsuming ? 'text-slate-700' : 'text-emerald-600'}`}>
                {burnGap! >= 0 ? `−${fmt(burnGap!)}` : `+${fmt(Math.abs(burnGap!))}`}
              </span>
            </div>
          </>
        )}

        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Available Buffer</p>
          <div className="space-y-1.5 pl-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Emergency Fund</span>
              <span className="text-sm text-slate-600 tabular-nums">{fmt(emergencyFund)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Entertainment Fund</span>
              <span className="text-sm text-slate-600 tabular-nums">{fmt(entertainmentFund)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-600">Total Buffer</span>
              <span className="text-sm font-semibold text-slate-800 tabular-nums">{fmt(availableBuffer)}</span>
            </div>
          </div>
        </div>

        {expense > 0 && burnGap !== null && (
          <div className={`pt-3 border-t-2 flex justify-between items-center py-3 px-3 rounded-lg ${
            hasConsumedBuffer ? 'bg-slate-50 border border-slate-200' : 'bg-emerald-50 border border-emerald-100'
          }`}>
            <div>
              <p className={`text-sm font-medium ${hasConsumedBuffer ? 'text-slate-700' : 'text-emerald-700'}`}>
                Buffer Remaining
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {hasConsumedBuffer
                  ? '已動用部分流動性緩衝'
                  : '尚未動用流動性緩衝'}
              </p>
            </div>
            <span className={`text-xl font-bold tabular-nums ml-4 ${
              bufferRemaining >= availableBuffer ? 'text-emerald-600' : 'text-slate-700'
            }`}>
              {fmt(bufferRemaining)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
