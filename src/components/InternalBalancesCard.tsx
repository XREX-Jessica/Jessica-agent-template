import React from 'react';
import {
  HOUSE_PROJECT_DIFF,
  HOUSE_PROJECT_Q2_SETTLEMENT,
  HOUSE_PROJECT_DRAGONBOAT_ALLOC,
  HOUSE_PROJECT_SETTLEMENT_DATE,
  fmt,
} from '../types';

export function InternalBalancesCard() {
  const totalFunding = HOUSE_PROJECT_Q2_SETTLEMENT + HOUSE_PROJECT_DRAGONBOAT_ALLOC;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-2">
        Internal Balances · 內部餘額追蹤
      </p>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        非負債、非逾期。房屋帳戶曾暫代支付搬家費、奇盾首飾等個人支出，季度結算時全額對帳。
      </p>

      <p className="text-sm font-medium text-slate-700 mb-3">房屋專案帳戶</p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Current Difference（目前差額）</span>
          <span className="text-sm font-semibold text-slate-800 tabular-nums">
            {fmt(HOUSE_PROJECT_DIFF)}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-600 mb-2">Funding Plan（資金安排）</p>
          <div className="space-y-1.5 pl-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Q2 Settlement</span>
              <span className="text-sm text-slate-600 tabular-nums">{fmt(HOUSE_PROJECT_Q2_SETTLEMENT)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Dragon Boat Bonus Allocation</span>
              <span className="text-sm text-slate-600 tabular-nums">{fmt(HOUSE_PROJECT_DRAGONBOAT_ALLOC)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-600">Total Funding</span>
              <span className="text-sm font-semibold text-slate-800 tabular-nums">{fmt(totalFunding)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-2.5 bg-emerald-50 rounded-lg px-3 border border-emerald-100">
          <div>
            <p className="text-xs font-medium text-emerald-700">Status</p>
            <p className="text-xs text-emerald-600 mt-0.5">Fully Funded（資金到位）</p>
          </div>
          <span className="text-sm font-medium text-emerald-700">{HOUSE_PROJECT_SETTLEMENT_DATE}</span>
        </div>
      </div>
    </div>
  );
}
