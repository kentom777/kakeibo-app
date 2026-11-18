import './style.css';
import { addEntry, totals, type Entry, type EntryType } from './ledger';

const storageKey = 'kakeibo-entries-v1';
const money = (amount: number) => `${amount.toLocaleString('ja-JP')}円`;

function loadEntries(): Entry[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is Entry =>
      typeof item === 'object' && item !== null &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      (item.type === 'income' || item.type === 'expense') &&
      Number.isSafeInteger(item.amount) && item.amount > 0,
    );
  } catch {
    return [];
  }
}

let entries = loadEntries();
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('アプリの表示先がありません');

app.innerHTML = `
  <main class="container">
    <header><p class="eyebrow">シンプルな家計管理</p><h1>わたしの家計簿</h1></header>
    <section class="summary" aria-label="収支サマリー">
      <article><p>収入</p><strong id="income">0円</strong></article>
      <article><p>支出</p><strong id="expense">0円</strong></article>
      <article><p>残高</p><strong id="balance">0円</strong></article>
    </section>
    <section class="panel">
      <h2>取引を追加</h2>
      <form id="entry-form">
        <label>種類<select id="type"><option value="expense">支出</option><option value="income">収入</option></select></label>
        <label>内容<input id="title" required maxlength="60" placeholder="例：スーパー" /></label>
        <label>金額（円）<input id="amount" type="number" required min="1" step="1" placeholder="例：1200" /></label>
        <button type="submit">登録する</button>
      </form>
      <p role="alert" id="error"></p>
    </section>
    <section class="panel">
      <h2>取引履歴</h2><ul id="entries"></ul>
    </section>
    <p class="notice">データはこのブラウザ内に保存されます。金融機関との連携はありません。</p>
  </main>
`;

const form = document.querySelector<HTMLFormElement>('#entry-form')!;
const typeInput = document.querySelector<HTMLSelectElement>('#type')!;
const titleInput = document.querySelector<HTMLInputElement>('#title')!;
const amountInput = document.querySelector<HTMLInputElement>('#amount')!;
const error = document.querySelector<HTMLElement>('#error')!;
const list = document.querySelector<HTMLUListElement>('#entries')!;

function render() {
  const result = totals(entries);
  document.querySelector<HTMLElement>('#income')!.textContent = money(result.income);
  document.querySelector<HTMLElement>('#expense')!.textContent = money(result.expense);
  document.querySelector<HTMLElement>('#balance')!.textContent = money(result.balance);
  list.replaceChildren();
  if (entries.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'まだ取引がありません';
    list.append(empty);
  }
  for (const entry of [...entries].reverse()) {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = `${entry.title}：${entry.type === 'income' ? '+' : '-'}${money(entry.amount)}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '削除';
    button.setAttribute('aria-label', `${entry.title}を削除`);
    button.addEventListener('click', () => {
      entries = entries.filter((item) => item.id !== entry.id);
      localStorage.setItem(storageKey, JSON.stringify(entries));
      render();
    });
    li.append(text, button);
    list.append(li);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  error.textContent = '';
  try {
    const type = typeInput.value as EntryType;
    entries = addEntry(entries, {
      id: crypto.randomUUID(),
      type,
      title: titleInput.value.trim(),
      amount: Number(amountInput.value),
    });
    localStorage.setItem(storageKey, JSON.stringify(entries));
    form.reset();
    render();
  } catch (reason) {
    error.textContent = reason instanceof Error ? reason.message : '登録に失敗しました';
  }
});

render();
