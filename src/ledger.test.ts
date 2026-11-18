import { describe, expect, it } from 'vitest';
import { addEntry, totals, type Entry } from './ledger';

const entries: Entry[] = [
  { id: '1', title: '給与', amount: 300000, type: 'income' },
  { id: '2', title: '家賃', amount: 70000, type: 'expense' },
];

describe('家計簿の計算', () => {
  it('収入・支出・残高を計算できる', () => {
    expect(totals(entries)).toEqual({ income: 300000, expense: 70000, balance: 230000 });
  });

  it('金額が0円なら登録できない', () => {
    expect(() => addEntry([], { id: '3', title: '買い物', amount: 0, type: 'expense' })).toThrow();
  });

  it('元の取引リストを書き換えない', () => {
    const result = addEntry(entries, { id: '3', title: '食費', amount: 1000, type: 'expense' });
    expect(entries).toHaveLength(2);
    expect(result).toHaveLength(3);
  });
});
