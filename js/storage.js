/**
 * User-Isolated Data Storage & Local Persistence Engine
 */
const StorageEngine = {
  KEYS: {
    USERS: 'flowlife_users',
    CURRENT_USER: 'flowlife_session_user',
    THEME: 'flowlife_theme'
  },

  getUserKey(key, username) {
    return `flowlife_${username}_${key}`;
  },

  getCurrentUsername() {
    return localStorage.getItem(this.KEYS.CURRENT_USER);
  },

  load(key, fallback) {
    try {
      const username = this.getCurrentUsername();
      if (!username) return fallback;
      const userKey = this.getUserKey(key, username);
      const data = localStorage.getItem(userKey);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Storage Read Error:', e);
      return fallback;
    }
  },

  save(key, data) {
    try {
      const username = this.getCurrentUsername();
      if (!username) return;
      const userKey = this.getUserKey(key, username);
      localStorage.setItem(userKey, JSON.stringify(data));
    } catch (e) {
      console.error('Storage Write Error:', e);
    }
  },

  exportAllData() {
    const username = this.getCurrentUsername();
    if (!username) return;

    const backup = {
      user: username,
      habits: this.load('habits', []),
      budget: this.load('budget', []),
      tasks: this.load('tasks', []),
      events: this.load('events', []),
      timetable: this.load('timetable', []),
      notes: this.load('notes', []),
      schemaVersion: "4.0",
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flowlife_${username}_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.habits) this.save('habits', parsed.habits);
      if (parsed.budget) this.save('budget', parsed.budget);
      if (parsed.tasks) this.save('tasks', parsed.tasks);
      if (parsed.events) this.save('events', parsed.events);
      if (parsed.timetable) this.save('timetable', parsed.timetable);
      if (parsed.notes) this.save('notes', parsed.notes);
      return true;
    } catch (e) {
      return false;
    }
  }
};