function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

const tabMeta = {
  dashboard: { title: 'Home', icon: '🏠' },
  calendar: { title: 'Calendar & Milestone Planner', icon: '📅' },
  timetable: { title: 'Weekly Schedule Matrix', icon: '🗓️' },
  habits: { title: 'Habits', icon: '⚡' },
  budget: { title: 'Financial Tracker & Splitter', icon: '💳' },
  tasks: { title: 'Tasks & Focus Timer', icon: '🎯' },
  notes: { title: 'Notes & Scratchpad', icon: '📝' },
  analytics: { title: 'Analytics', icon: '📊' }
};

document.addEventListener('DOMContentLoaded', () => {
  AuthEngine.initUI();
  if (!AuthEngine.getCurrentUser()) return;

  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabKey) {
    navItems.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeNav = document.querySelector(`.nav-item[data-tab="${tabKey}"]`);
    const activeContent = document.getElementById(`tab-${tabKey}`);
    if (activeNav && activeContent) {
      activeNav.classList.add('active');
      activeContent.classList.add('active');

      const meta = tabMeta[tabKey] || { title: 'FlowLife', icon: '📄' };
      document.getElementById('top-bar-icon').innerText = meta.icon;
      document.getElementById('top-bar-title').innerText = meta.title;

      if (tabKey === 'dashboard') updateDashboardMetrics();
      if (tabKey === 'analytics') AnalyticsModule.render();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  function updateDashboardMetrics() {
    const tasks = StorageEngine.load('tasks', []);
    const habits = StorageEngine.load('habits', []);
    const budget = StorageEngine.load('budget', []);

    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const activeHabits = habits.length;
    const income = budget.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = budget.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    document.getElementById('dash-tasks-count').innerText = pendingTasks;
    document.getElementById('dash-habits-count').innerText = activeHabits;
    document.getElementById('dash-balance').innerText = `$${balance.toFixed(2)}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date-display').innerText = new Date().toLocaleDateString(undefined, options);

    const agendaList = document.getElementById('dash-agenda-list');
    const upcomingTasks = tasks.filter(t => t.status !== 'done').slice(0, 3);
    if (agendaList) {
      agendaList.innerHTML = upcomingTasks.length > 0 
        ? upcomingTasks.map(t => `<li><span>📌 ${t.title}</span><small style="color:var(--text-muted);">${t.status}</small></li>`).join('')
        : '<li style="color: var(--text-muted);">No urgent tasks pending.</li>';
    }

    const activityLog = document.getElementById('dash-activity-log');
    if (activityLog) {
      activityLog.innerHTML = `
        <li><span>⚡ Workspace initialized</span><small style="color:var(--text-muted);">Just now</small></li>
        <li><span>🔒 Account session active</span><small style="color:var(--text-muted);">Active</small></li>
      `;
    }
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = StorageEngine.load(StorageEngine.KEYS.THEME, 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeBtn.innerHTML = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    StorageEngine.save(StorageEngine.KEYS.THEME, newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    showToast(`Switched to ${newTheme} mode`);
  });

  document.getElementById('export-data-btn').addEventListener('click', () => {
    StorageEngine.exportAllData();
    showToast('Backup downloaded!');
  });

  document.getElementById('import-data-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (StorageEngine.importData(event.target.result)) {
        showToast('Workspace restored!');
        CalendarModule.init();
        TimetableModule.init();
        HabitModule.init();
        BudgetModule.init();
        TaskModule.init();
        NotesModule.init();
        AnalyticsModule.init();
        updateDashboardMetrics();
      } else {
        showToast('Invalid backup file!');
      }
    };
    reader.readAsText(file);
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

    if (e.ctrlKey && e.key === '0') { e.preventDefault(); switchTab('dashboard'); }
    if (e.ctrlKey && e.key === '1') { e.preventDefault(); switchTab('calendar'); }
    if (e.ctrlKey && e.key === '2') { e.preventDefault(); switchTab('timetable'); }
    if (e.ctrlKey && e.key === '3') { e.preventDefault(); switchTab('habits'); }
    if (e.ctrlKey && e.key === '4') { e.preventDefault(); switchTab('budget'); }
    if (e.ctrlKey && e.key === '5') { e.preventDefault(); switchTab('tasks'); }
    if (e.ctrlKey && e.key === '6') { e.preventDefault(); switchTab('notes'); }
    if (e.ctrlKey && e.key === '7') { e.preventDefault(); switchTab('analytics'); }

    if (e.code === 'Space') {
      const tasksTab = document.getElementById('tab-tasks');
      if (tasksTab && tasksTab.classList.contains('active')) {
        e.preventDefault();
        if (TaskModule.timerInterval) {
          TaskModule.pauseTimer();
          showToast('Timer paused');
        } else {
          TaskModule.startTimer();
          showToast('Timer started');
        }
      }
    }
  });

  CalendarModule.init();
  TimetableModule.init();
  HabitModule.init();
  BudgetModule.init();
  TaskModule.init();
  NotesModule.init();
  AnalyticsModule.init();
  updateDashboardMetrics();
});