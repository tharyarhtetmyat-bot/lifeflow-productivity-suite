const HabitModule = {
  habits: [],

  init() {
    this.habits = StorageEngine.load('habits', [
      { id: 1, name: 'Read CS Papers', category: 'Research', streak: 4, completedToday: false }
    ]);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('habit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('habit-name').value.trim();
      const category = document.getElementById('habit-category').value.trim() || 'General';

      this.habits.push({ id: Date.now(), name, category, streak: 0, completedToday: false });
      document.getElementById('habit-name').value = '';
      document.getElementById('habit-category').value = '';

      StorageEngine.save('habits', this.habits);
      this.render();
      showToast('Habit registered');
    });
  },

  toggleHabit(id) {
    const habit = this.habits.find(h => h.id === id);
    if (habit) {
      habit.completedToday = !habit.completedToday;
      habit.streak = habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
      StorageEngine.save('habits', this.habits);
      this.render();
    }
  },

  deleteHabit(id) {
    this.habits = this.habits.filter(h => h.id !== id);
    StorageEngine.save('habits', this.habits);
    this.render();
    showToast('Habit deleted');
  },

  render() {
    const list = document.getElementById('habit-list');
    if (this.habits.length === 0) {
      list.innerHTML = `<li style="color: var(--text-muted); justify-content: center;">No active habits tracked.</li>`;
      return;
    }

    list.innerHTML = this.habits.map(h => `
      <li>
        <div>
          <strong>${h.name}</strong> 
          <small style="color: var(--text-muted);">(${h.category}) — ${h.streak} day streak</small>
        </div>
        <div style="display: flex; gap: 6px;">
          <button onclick="HabitModule.toggleHabit(${h.id})" class="btn ${h.completedToday ? 'secondary' : 'primary'}" style="padding: 4px 10px; font-size: 0.8rem;">
            ${h.completedToday ? 'Done ✓' : 'Check In'}
          </button>
          <button onclick="HabitModule.deleteHabit(${h.id})" class="btn ghost" style="padding: 4px 8px; font-size: 0.8rem; color: var(--danger);">✕</button>
        </div>
      </li>
    `).join('');
  }
};