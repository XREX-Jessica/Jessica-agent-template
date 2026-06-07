import React from 'react';
import {
  MonthlyRecord,
  computeFreedomReserve,
  getDirection,
  getNextMilestone,
  fmt,
  fmtPct,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
  prevRecord: MonthlyRecord | null;
}

export function FreedomReserveCard({ currentRecord, prevRecord }: Props) {
  const fc = computeFreedomReserve(currentRecord);
  const prevFc = prevRecord ? computeFreedomReserve(prevRecord) : null;
  const status = getDirection(fc, prevFc);

  const nextMilestone = getNextMilestone(fc);
  const progressPct = nextMilestone
    ? Math.min((fc / nextMilestone.amount) * 100, 100)
    : 100;
  const remaining = nextMilestone ? nextMilestone.amount - fc : 0;

  const barColor =
    status === 'increasing'
      ? 'bg-emerald-400'
      : status === 'decreasing'
      ? 'bg-slate-400'
      : 'bg-amber-400';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
        Freedom Reserve · 自由儲備金
      </p>

      <div className="mb-2">
        <span className="text-3xl font-bold text-slate-800 tabular-nums">
          {fmt(fc)}
        </span>
        <span className="text-sm text-slate-400 ml-1.5">NT$</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        累積在子帳戶中的自由儲備金，代表未來的選擇權，不是本月可花的錢。
      </p>

      {nextMilestone ? (
        <>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Level {nextMilestone.level} 里程碑</span>
            <span className="font-medium text-slate-600">
              {fmtPct(progressPct / 100)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
            <div
              className={`${barColor} h-2 rounded-full transition-all duration-700`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>目標 NT$ {fmt(nextMilestone.amount)}</span>
            <span>
              還差{' '}
              <span className="font-medium text-slate-600">NT$ {fmt(remaining)}</span>
            </span>
          </div>
        </>
      ) : (
        <p className="text-emerald-600 font-medium text-sm">
          已超越所有里程碑。
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">備用金</p>
          <p className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(currentRecord.reserveFund)}
          </p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-xs text-slate-400 mb-1">旅遊金</p>
          <p className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(currentRecord.travelFund)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">娛樂費</p>
          <p className="text-sm font-medium text-slate-700 tabular-nums">
            {fmt(currentRecord.entertainFund)}
          </p>
        </div>
      </div>
    </div>
  );
}
