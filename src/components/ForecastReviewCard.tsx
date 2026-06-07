import React, { useState, useEffect } from 'react';
import { ForecastReview, ForecastActualEntry, fmt } from '../types';

const STORAGE_KEY = 'jfos_forecast_review_oct2026';

// 請根據你的預測項目修改
const FORECAST_ITEMS: { id: string; label: string; forecast: number }[] = [];

function loadReview(): ForecastReview {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ForecastReview;
  } catch { /* ignore */ }
  return {
    month: '2026/10',
    entries: FORECAST_ITEMS.map(i => ({ id: i.id, label: i.label, forecast: i.forecast, actual: null })),
    savedAt: '',
  };
}

function saveReview(review: ForecastReview) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...review, savedAt: new Date().toISOString() }));
}

export function ForecastReviewCard() {
  const [review, setReview] = useState<ForecastReview>(loadReview);
  const [saved, setSaved] = useState(false);

  const setActual = (id: string, value: string) => {
    const num = value === '' ? null : Number(value);
    setReview(prev => ({
      ...prev,
      entries: prev.entries.map(e => e.id === id ? { ...e, actual: num } : e),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    saveReview(review);
    setSaved(true);
  };

  const totalForecast = review.entries.reduce((s, e) => s + e.forecast, 0);
  const totalActual   = review.entries.reduce((s, e) => s + (e.actual ?? 0), 0);
  const totalVariance = review.entries
    .filter(e => e.actual !== null)
    .reduce((s, e) => s + (e.actual! - e.forecast), 0);
  const anyActual = review.entries.some(e => e.actual !== null);

  const INPUT = 'w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-700 placeholder-slate-300 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors tabular-nums text-right';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">
        Forecast Review · 預測對比實際
      </p>
      <p className="text-xs text-slate-400 mb-4">
        收到後填入實際金額，追蹤預測準確度。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-left text-xs font-medium text-slate-400">項目</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-400 pr-3">預測</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-400 pr-3">實際</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-400">差異</th>
            </tr>
          </thead>
          <tbody>
            {review.entries.map(entry => {
              const variance = entry.actual !== null ? entry.actual - entry.forecast : null;
              return (
                <tr key={entry.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 text-xs text-slate-600 pr-3">{entry.label}</td>
                  <td className="py-2.5 text-right text-sm text-slate-500 tabular-nums pr-3">
                    {fmt(entry.forecast)}
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className={INPUT}
                      type="number"
                      min="0"
                      value={entry.actual ?? ''}
                      onChange={e => setActual(entry.id, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    {variance === null ? (
                      <span className="text-slate-300 text-xs">—</span>
                    ) : (
                      <span className={`text-sm font-medium ${variance >= 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {variance > 0 ? '+' : ''}{fmt(variance)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {anyActual && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-slate-400">預測合計</p>
            <p className="text-sm font-medium text-slate-600 tabular-nums">{fmt(totalForecast)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">實際合計</p>
            <p className="text-sm font-medium text-slate-700 tabular-nums">{fmt(totalActual)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">總差異</p>
            <p className={`text-sm font-semibold tabular-nums ${totalVariance >= 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
              {totalVariance > 0 ? '+' : ''}{fmt(totalVariance)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
        >
          儲存
        </button>
        {saved && <span className="text-xs text-emerald-600">✓ 已儲存</span>}
        {review.savedAt && (
          <span className="text-xs text-slate-400 ml-auto">
            上次更新：{new Date(review.savedAt).toLocaleDateString('zh-TW')}
          </span>
        )}
      </div>
    </div>
  );
}
