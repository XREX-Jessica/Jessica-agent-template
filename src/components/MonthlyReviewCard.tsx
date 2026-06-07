import React from 'react';
import {
  MonthlyRecord,
  computeFreedomReserve,
  computeAverageMonthlyGrowth,
  getNextMilestone,
  fmt,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
  prevRecord: MonthlyRecord | null;
  records: MonthlyRecord[];
}

function keyObservation(
  current: number,
  prev: number | null,
  record: MonthlyRecord
): string {
  if (prev === null) {
    return `${record.month} 受搬家與家居支出影響，不代表正常月份基準。接下來的核心觀察指標：下個月自由儲備金是否開始回升。`;
  }
  const diff = current - prev;
  if (diff > 0) {
    return `儲備金本月成長 ${fmt(diff)}。這個月留下的比上個月多。繼續追蹤此方向是否能持續至下個月。`;
  }
  if (diff < 0) {
    return `儲備金本月減少 ${fmt(Math.abs(diff))}。觀察此消耗是否為一次性支出，或為持續性的現金流壓力。`;
  }
  return `儲備金本月與上月持平。持續追蹤下月是否有方向性變化。`;
}

export function MonthlyReviewCard({ currentRecord, prevRecord, records }: Props) {
  const current = computeFreedomReserve(currentRecord);
  const prev = prevRecord ? computeFreedomReserve(prevRecord) : null;
  const diff = prev !== null ? current - prev : null;

  const avgGrowth = computeAverageMonthlyGrowth(records);
  const nextMilestone = getNextMilestone(current);
  const observation = keyObservation(current, prev, currentRecord);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Monthly Review · 本月回顧
      </p>

      {/* Key numbers */}
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">月收入</span>
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(currentRecord.income)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">自由儲備金</span>
          <span className="text-sm font-semibold text-slate-800 tabular-nums">
            {fmt(current)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">本月增減</span>
          {diff === null ? (
            <span className="text-sm text-slate-400">Baseline</span>
          ) : (
            <span
              className={`text-sm font-semibold tabular-nums ${
                diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              {diff > 0 ? '+' : ''}{fmt(diff)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">月均成長（歷史）</span>
          {avgGrowth !== null ? (
            <span className={`text-sm font-medium tabular-nums ${avgGrowth >= 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
              {avgGrowth >= 0 ? '+' : ''}{fmt(Math.round(avgGrowth))}
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              需 3 個月數據（目前 {records.length} 筆）
            </span>
          )}
        </div>

        {nextMilestone && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">
              距里程碑 Level {nextMilestone.level}
            </span>
            <span className="text-sm text-slate-500 tabular-nums">
              還差 {fmt(nextMilestone.amount - current)}
            </span>
          </div>
        )}
      </div>

      {/* Key Observation */}
      <div className="border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-slate-400 mb-1.5">本月觀察</p>
        <p className="text-sm text-slate-500 leading-relaxed">{observation}</p>
      </div>
    </div>
  );
}
