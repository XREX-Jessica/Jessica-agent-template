import React, { useState } from 'react';
import { MonthlyRecord } from '../types';

interface FormData {
  month: string;
  income: string;
  reserveFund: string;
  travelFund: string;
  entertainFund: string;
  insuranceFund: string;
  houseAccountDiff: string;
  expense: string;
  note: string;
}

interface Props {
  latestMonth: string;
  onSave: (record: Omit<MonthlyRecord, 'id' | 'isBaseline'>) => void;
}

function nextMonthStr(month: string): string {
  const [y, m] = month.split('/').map(Number);
  return m === 12 ? `${y + 1}/01` : `${y}/${String(m + 1).padStart(2, '0')}`;
}

function emptyForm(month: string): FormData {
  return { month, income: '', reserveFund: '', travelFund: '', entertainFund: '', insuranceFund: '', houseAccountDiff: '', expense: '', note: '' };
}

const INPUT = 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors';
const LABEL = 'block text-xs font-medium text-slate-500 mb-1';
const SECTION = 'text-xs font-medium text-slate-400 uppercase tracking-widest mb-3';

export function UpdateForm({ latestMonth, onSave }: Props) {
  const [form, setForm] = useState<FormData>(() => emptyForm(nextMonthStr(latestMonth)));
  const [saved, setSaved] = useState(false);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setSaved(false);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      month:            form.month,
      income:           Number(form.income) || 0,
      reserveFund:      Number(form.reserveFund) || 0,
      travelFund:       Number(form.travelFund) || 0,
      entertainFund:    Number(form.entertainFund) || 0,
      insuranceFund:    Number(form.insuranceFund) || 0,
      creditAccount:    0,
      houseAccountDiff: form.houseAccountDiff ? Number(form.houseAccountDiff) : undefined,
      expense:          form.expense ? Number(form.expense) : undefined,
      note:             form.note || undefined,
    });
    setSaved(true);
    setForm(emptyForm(nextMonthStr(form.month)));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          Monthly Review · 月末更新
        </p>
        <p className="text-xs text-slate-400">5 分鐘完成 · 只需帳戶餘額</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Month + Income */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>月份 (YYYY/MM)</label>
            <input className={INPUT} value={form.month} onChange={set('month')} placeholder="2026/06" pattern="\d{4}/\d{2}" required />
          </div>
          <div>
            <label className={LABEL}>月淨收入（實際入帳）</label>
            <input className={INPUT} type="number" min="0" value={form.income} onChange={set('income')} placeholder="104814" required />
          </div>
        </div>

        {/* Freedom Reserve accounts */}
        <div>
          <p className={SECTION}>自由儲備金帳戶餘額</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>Emergency Fund（備用金）</label>
              <input className={INPUT} type="number" min="0" value={form.reserveFund} onChange={set('reserveFund')} placeholder="8414" required />
            </div>
            <div>
              <label className={LABEL}>Travel Fund（旅遊金）</label>
              <input className={INPUT} type="number" min="0" value={form.travelFund} onChange={set('travelFund')} placeholder="6784" required />
            </div>
            <div>
              <label className={LABEL}>Entertainment Fund（娛樂費）</label>
              <input className={INPUT} type="number" min="0" value={form.entertainFund} onChange={set('entertainFund')} placeholder="0" required />
            </div>
          </div>
        </div>

        {/* Protection Fund + House Account Diff */}
        <div>
          <p className={SECTION}>其他帳戶</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Protection Fund（保教30健）</label>
              <input className={INPUT} type="number" min="0" value={form.insuranceFund} onChange={set('insuranceFund')} placeholder="10617" required />
            </div>
            <div>
              <label className={LABEL}>House Account Difference（房屋帳戶差額）</label>
              <input className={INPUT} type="number" min="0" value={form.houseAccountDiff} onChange={set('houseAccountDiff')} placeholder="70217" />
            </div>
          </div>
        </div>

        {/* Optional */}
        <div>
          <p className={SECTION}>選填</p>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className={LABEL}>月支出（選填）</label>
              <input className={INPUT} type="number" min="0" value={form.expense} onChange={set('expense')} placeholder="80000" />
            </div>
          </div>
          <div>
            <label className={LABEL}>備註（選填）</label>
            <textarea className={`${INPUT} resize-none`} rows={2} value={form.note} onChange={set('note')} placeholder="新加坡住宿付款・coaching fee・年繳保費..." />
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 active:bg-slate-900 transition-colors">
          儲存本月記錄
        </button>

        {saved && <p className="text-center text-sm text-emerald-600">✓ 已儲存</p>}
      </form>
    </div>
  );
}
