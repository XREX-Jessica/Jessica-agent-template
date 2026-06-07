import React from 'react';
import {
  MonthlyRecord,
  computeFreedomReserve,
  getNextMilestone,
  fmt,
} from '../types';

interface Props {
  currentRecord: MonthlyRecord;
  prevRecord: MonthlyRecord | null;
}

function buildSummary(
  current: number,
  prev: number | null,
  record: MonthlyRecord
): string[] {
  const nextMilestone = getNextMilestone(current);

  if (prev === null) {
    return [
      `自由儲備金目前為 ${fmt(current)}。`,
      `${record.month} 受搬家與家居支出影響，不代表正常月份基準。`,
      `接下來的核心觀察指標：下個月自由儲備金是否開始回升。`,
      nextMilestone
        ? `若持續累積，距離第一個里程碑 ${fmt(nextMilestone.amount)} 的時間將逐步縮短。`
        : '',
    ].filter(Boolean);
  }

  const diff = current - prev;

  if (diff > 0) {
    const remaining = nextMilestone ? nextMilestone.amount - current : 0;
    return [
      `自由儲備金由 ${fmt(prev)} 成長至 ${fmt(current)}，本月增加 ${fmt(diff)}。`,
      `這代表本月留下的自由儲備金高於上月。`,
      nextMilestone
        ? `距離里程碑 Level ${nextMilestone.level}（${fmt(nextMilestone.amount)}）還差 ${fmt(remaining)}。`
        : `已超越所有設定里程碑。`,
    ];
  }

  if (diff < 0) {
    return [
      `自由儲備金由 ${fmt(prev)} 下降至 ${fmt(current)}，本月減少 ${fmt(Math.abs(diff))}。`,
      `觀察此消耗是否為一次性支出，或持續性的現金流壓力。`,
      nextMilestone
        ? `目前距離里程碑 Level ${nextMilestone.level} 還差 ${fmt(nextMilestone.amount - current)}。`
        : '',
    ].filter(Boolean);
  }

  return [
    `自由儲備金本月與上月持平，維持在 ${fmt(current)}。`,
    `持續追蹤下月是否有方向性變化。`,
  ];
}

export function StatusCard({ currentRecord, prevRecord }: Props) {
  const current = computeFreedomReserve(currentRecord);
  const prev = prevRecord ? computeFreedomReserve(prevRecord) : null;
  const paragraphs = buildSummary(current, prev, currentRecord);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
        本月摘要
      </p>
      <div className="space-y-1.5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              i === 0 ? 'text-slate-700 font-medium' : 'text-slate-500'
            }`}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
