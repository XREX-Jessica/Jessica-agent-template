import React, { useState } from 'react';
import {
  MonthlyRecord,
  computeFreedomReserve,
  getNextMilestone,
  fmt,
  fmtPct,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
}

export function DecisionSimulator({ currentRecord }: Props) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  const reserve = computeFreedomReserve(currentRecord);
  const costNum = Number(cost) || 0;
  const afterReserve = reserve - costNum;

  const nextBefore = getNextMilestone(reserve);
  const nextAfter = getNextMilestone(afterReserve);

  const remainingBefore = nextBefore ? nextBefore.amount - reserve : 0;
  const remainingAfter = nextAfter ? nextAfter.amount - afterReserve : 0;
  const impactPct = reserve > 0 ? costNum / reserve : 0;

  const hasInput = costNum > 0;

  const INPUT =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        決策試算
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs text-slate-500 mb-1">項目名稱</label>
          <input
            className={INPUT}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="iRent"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">金額</label>
          <input
            className={INPUT}
            type="number"
            min="0"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-xs text-slate-400">目前自由儲備金</span>
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(reserve)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-xs text-slate-400">
            {hasInput && name ? `${name} 後` : '支出後'}
          </span>
          <span className={`text-sm font-medium tabular-nums ${hasInput ? 'text-slate-700' : 'text-slate-300'}`}>
            {hasInput ? fmt(afterReserve) : '—'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-xs text-slate-400">影響金額</span>
          <span className={`text-sm font-semibold tabular-nums ${hasInput ? 'text-slate-700' : 'text-slate-300'}`}>
            {hasInput ? `−${fmt(costNum)}` : '—'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-50">
          <span className="text-xs text-slate-400">佔儲備金比例</span>
          <span className={`text-sm tabular-nums ${hasInput ? 'text-slate-600' : 'text-slate-300'}`}>
            {hasInput ? `−${fmtPct(impactPct)}` : '—'}
          </span>
        </div>

        {nextBefore && (
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2">
              距離里程碑 Level {nextBefore.level}（{fmt(nextBefore.amount)}）
            </p>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-slate-400">支出前</span>
              <span className="text-sm text-slate-600 tabular-nums">
                還差 {fmt(remainingBefore)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-slate-400">支出後</span>
              <span className={`text-sm tabular-nums ${hasInput ? 'text-slate-600' : 'text-slate-300'}`}>
                {hasInput ? `還差 ${fmt(remainingAfter)}` : '—'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
