const AnalyticsModule = {
  init() {
    this.render();
  },

  render() {
    const tasks = StorageEngine.load('tasks', []);
    const habits = StorageEngine.load('habits', []);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const activeHabits = habits.length;
    const habitsCompleted = habits.filter(h => h.completedToday).length;
    const habitRate = activeHabits > 0 ? Math.round((habitsCompleted / activeHabits) * 100) : 0;

    const taskEl = document.getElementById('analytics-total-tasks');
    const compEl = document.getElementById('analytics-completion-rate');
    const habitEl = document.getElementById('analytics-habit-rate');

    if (taskEl) taskEl.innerText = totalTasks;
    if (compEl) compEl.innerText = `${completionRate}%`;
    if (habitEl) habitEl.innerText = `${habitRate}%`;
  }
};