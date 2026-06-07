import { useState, useEffect, useCallback } from 'react';
import { MonthlyRecord } from '../types';

const LS_KEY = 'jfos_v1';

const BASELINE: MonthlyRecord = {
  id: '2026-05',
  month: '2026/05',
  income: 104814,
  expense: 133373,
  reserveFund: 8414,
  travelFund: 6784,
  entertainFund: 1,
  insuranceFund: 10617,
  creditAccount: 17318,
  isBaseline: true,
  note: '搬家與家裡花費，非正常月份',
};

async function fetchFromFile(): Promise<MonthlyRecord[]> {
  const res = await fetch('/api/records');
  if (!res.ok) throw new Error('api unavailable');
  return res.json();
}

async function saveToFile(records: MonthlyRecord[]): Promise<void> {
  await fetch('/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(records),
  });
}

function readLocalStorage(): MonthlyRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MonthlyRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

export function useFinancialData() {
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchFromFile()
      .then(async fileData => {
        if (fileData.length > 0) {
          // File has data — use it, ignore localStorage
          setRecords(fileData);
        } else {
          // File is empty — migrate from localStorage or use baseline
          const lsData = readLocalStorage();
          const initial = lsData.length > 0 ? lsData : [BASELINE];
          setRecords(initial);
          await saveToFile(initial);
          localStorage.removeItem(LS_KEY);
        }
        setReady(true);
      })
      .catch(() => {
        // API not available — fall back to localStorage
        const lsData = readLocalStorage();
        setRecords(lsData.length > 0 ? lsData : [BASELINE]);
        setReady(true);
      });
  }, []);

  const addOrUpdateRecord = useCallback(
    (incoming: Omit<MonthlyRecord, 'id' | 'isBaseline'>) => {
      setRecords(prev => {
        const newRecord: MonthlyRecord = {
          ...incoming,
          id: incoming.month.replace('/', '-'),
          isBaseline: false,
        };
        const existingIdx = prev.findIndex(r => r.month === incoming.month);
        let updated: MonthlyRecord[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = {
            ...newRecord,
            isBaseline: prev[existingIdx].isBaseline,
          };
        } else {
          updated = [...prev, newRecord];
        }
        updated.sort((a, b) => a.month.localeCompare(b.month));
        saveToFile(updated); // fire and forget
        return updated;
      });
    },
    []
  );

  return { records, addOrUpdateRecord, ready };
}
