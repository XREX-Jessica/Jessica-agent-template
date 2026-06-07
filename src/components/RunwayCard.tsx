import React from 'react';
import {
  MonthlyRecord,
  computeFreedomReserve,
  computeAverageMonthlyGrowth,
  getNextMilestone,
  fmt,
} from '../types';

interface Props {
  records: MonthlyRecord[];
}

export function RunwayCard({ records }: Props) {
  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
  const current = sorted[sorted.length - 1];
  const currentReserve = computeFreedomReserve(current);

  const nextMilestone = getNextMilestone(currentReserve);
  const remaining = nextMilestone ? nextMilestone.amount - currentReserve : 0;

  const avgGrowth = computeAverageMonthlyGrowth(records);
  const hasEnoughData = records.length >= 3;

  const monthsToMilestone =
    avgGrowth !== null && avgGrowth > 0 && nextMilestone
      ? remaining / avgGrowth
      : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        里程碑倒數
      </p>

      {!nextMilestone ? (
        <p className="text-sm text-slate-500">已超越所有里程碑。</p>
      ) : (
        <>
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>目標</span>
              <span className="tabular-nums">
                Level {nextMilestone.level} · {fmt(nextMilestone.amount)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>目前自由儲備金</span>
              <span className="tabular-nums">{fmt(currentReserve)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>還差</span>
              <span className="tabular-nums">{fmt(remaining)}</span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
            {!hasEnoughData ? (
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  需要至少 3 個月數據才能計算成長速度。
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  目前 {records.length} 筆，還差 {3 - records.length} 筆。
                </p>
              </div>
            ) : avgGrowth === null || avgGrowth <= 0 ? (
              <p className="text-sm text-slate-500 text-center">
                目前月均成長為負，暫無法計算到達時間。
              </p>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-800 tabular-nums">
                  {monthsToMilestone!.toFixed(1)}
                </p>
                <p className="text-xs text-slate-400 mt-1">個月</p>
                <p className="text-xs text-slate-400 mt-1.5 tabular-nums">
                  月均成長 +{fmt(Math.round(avgGrowth))} · {fmt(remaining)} ÷ {fmt(Math.round(avgGrowth))}
                </p>
              </div>
            )}
          </div>

          {hasEnoughData && avgGrowth !== null && avgGrowth > 0 && (
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              月均成長由過去 {records.length - 1} 筆月份差計算得出，為歷史觀察，非預測。
            </p>
          )}
        </>
      )}
    </div>
  );
}
