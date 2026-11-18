export type EntryType = 'income' | 'expense';

export type Entry = {
  id: string;
  type: EntryType;
  title: string;
  amount: number;
};

export function addEntry(entries: Entry[], entry: Entry): Entry[] {
  if (!entry.title.trim()) throw new Error('内容を入力してください');
  if (!Number.isSafeInteger(entry.amount) || entry.amount <= 0) {
    throw new Error('金額には1以上の整数を入力してください');
  }
  if (entry.type !== 'income' && entry.type !== 'expense') {
    throw new Error('種類が不正です');
  }
  return [...entries, entry];
}

export function totals(entries: Entry[]) {
  const income = entries
    .filter((entry) => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = entries
    .filter((entry) => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  return { income, expense, balance: income - expense };
}

