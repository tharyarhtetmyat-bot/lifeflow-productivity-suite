const TaskModule = {
  tasks: [],
  timerInterval: null,
  timeLeft: 25 * 60,

  init() {
    this.tasks = StorageEngine.load('tasks', [
      { id: 1, title: 'Draft Statement of Purpose Essay', status: 'todo' },
      { id: 2, title: 'Finalize GitHub Pages Deployment', status: 'inprogress' }
    ]);
    this.renderTasks();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task-title');
      this.tasks.push({ id: Date.now(), title: input.value.trim(), status: 'todo' });
      input.value = '';
      this.saveAndRender();
    });

    document.getElementById('start-timer-btn').addEventListener('click', () => this.startTimer());
    document.getElementById('pause-timer-btn').addEventListener('click', () => this.pauseTimer());
    document.getElementById('reset-timer-btn').addEventListener('click', () => this.resetTimer());
  },

  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        this.pauseTimer();
        showToast('Focus session complete!');
      }
    }, 1000);
  },

  pauseTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  },

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = 25 * 60;
    this.updateTimerDisplay();
  },

  updateTimerDisplay() {
    const mins = String(Math.floor(this.timeLeft / 60)).padStart(2, '0');
    const secs = String(this.timeLeft % 60).padStart(2, '0');
    document.getElementById('timer-display').innerText = `${mins}:${secs}`;
  },

  moveTask(id, newStatus) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.status = newStatus;
      this.saveAndRender();
    }
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveAndRender();
  },

  saveAndRender() {
    StorageEngine.save('tasks', this.tasks);
    this.renderTasks();
  },

  renderTasks() {
    ['todo', 'inprogress', 'done'].forEach(status => {
      const col = document.getElementById(`col-${status}`);
      const filtered = this.tasks.filter(t => t.status === status);
      
      if (filtered.length === 0) {
        col.innerHTML = `<div style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 12px;">Empty</div>`;
        return;
      }

      col.innerHTML = filtered.map(t => `
        <div class="task-card">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <p style="word-break: break-word; flex: 1;">${t.title}</p>
            <button onclick="TaskModule.deleteTask(${t.id})" class="btn ghost" style="padding: 1px 4px; font-size: 0.7rem; color: var(--danger);">✕</button>
          </div>
          <div style="margin-top:8px; display:flex; gap:4px; flex-wrap:wrap;">
            ${status !== 'todo' ? `<button onclick="TaskModule.moveTask(${t.id}, 'todo')" class="btn ghost" style="padding: 2px 6px; font-size: 0.7rem;">← To Do</button>` : ''}
            ${status !== 'inprogress' ? `<button onclick="TaskModule.moveTask(${t.id}, 'inprogress')" class="btn ghost" style="padding: 2px 6px; font-size: 0.7rem;">In Progress</button>` : ''}
            ${status !== 'done' ? `<button onclick="TaskModule.moveTask(${t.id}, 'done')" class="btn ghost" style="padding: 2px 6px; font-size: 0.7rem;">Done →</button>` : ''}
          </div>
        </div>
      `).join('');
    });
  }
};