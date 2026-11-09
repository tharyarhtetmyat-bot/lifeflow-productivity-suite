const BudgetModule = {
  transactions: [],

  init() {
    this.transactions = StorageEngine.load('budget', []);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('trans-title').value.trim();
      const amount = parseFloat(document.getElementById('trans-amount').value);
      const type = document.getElementById('trans-type').value;

      this.transactions.push({ id: Date.now(), title, amount, type });
      document.getElementById('trans-title').value = '';
      document.getElementById('trans-amount').value = '';

      StorageEngine.save('budget', this.transactions);
      this.render();
      showToast('Transaction recorded');
    });

    document.getElementById('calc-split-btn').addEventListener('click', () => {
      const total = parseFloat(document.getElementById('split-total').value) || 0;
      const people = parseInt(document.getElementById('split-people').value) || 1;
      const perPerson = (total / people).toFixed(2);
      document.getElementById('split-result').innerHTML = `Each person pays: <strong>$${perPerson}</strong>`;
    });
  },

  render() {
    const income = this.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = this.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    document.getElementById('total-balance').innerText = `$${balance.toFixed(2)}`;
    document.getElementById('total-income').innerText = `$${income.toFixed(2)}`;
    document.getElementById('total-expenses').innerText = `$${expenses.toFixed(2)}`;

    const list = document.getElementById('transaction-list');
    if (this.transactions.length === 0) {
      list.innerHTML = `<li style="color: var(--text-muted); justify-content: center;">No transactions logged.</li>`;
      return;
    }

    list.innerHTML = this.transactions.map(t => `
      <li>
        <span>${t.title}</span>
        <strong class="${t.type === 'income' ? 'positive' : 'negative'}">
          ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
        </strong>
      </li>
    `).join('');
  }
};