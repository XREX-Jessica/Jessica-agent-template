import React from 'react';

const INCLUDED = [
  'Protection Fund',
  'Travel Fund',
  'Dragon Boat Festival Bonus',
  'Q3 House Settlement（9/30）',
];

const DEDUCTED = [
  'Q2 House Project Reconciliation（−48,217）',
];

const EXCLUDED = [
  'Emergency Fund',
  'Entertainment Fund',
];

export function ForecastScopeCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Forecast Scope
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Included</p>
          <div className="space-y-1.5">
            {INCLUDED.map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-xs text-emerald-600 mt-0.5">✓</span>
                <span className="text-xs text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Deducted</p>
          <div className="space-y-1.5">
            {DEDUCTED.map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-xs text-slate-600 mt-0.5">−</span>
                <span className="text-xs text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Excluded</p>
          <div className="space-y-1.5">
            {EXCLUDED.map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-xs text-slate-400 mt-0.5">○</span>
                <span className="text-xs text-slate-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        <p className="text-xs font-medium text-slate-500 mb-1.5">Notes</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Q2 Settlement（22,000）不計為 October 的資金來源，因為它在 6/30 直接用於補足房屋帳戶差額（70,217 − 22,000 = 48,217 需額外支付）。
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Q3 Settlement（9/30）發生於 October 之前，計為確定資金來源。
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          October Position (Conservative) 回答的問題是：「不動用流動性緩衝的情況下，十月的義務是否可以被涵蓋？」
        </p>
      </div>
    </div>
  );
}
