const TimetableModule = {
  schedule: [],

  init() {
    this.schedule = StorageEngine.load('timetable', [
      { id: 1, title: 'Calculus I', day: 'Monday', start: '09:00', end: '10:30', location: 'Hall A' },
      { id: 2, title: 'Data Structures Lab', day: 'Wednesday', start: '13:00', end: '15:00', location: 'Lab 302' }
    ]);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('timetable-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('tt-title').value.trim();
      const day = document.getElementById('tt-day').value;
      const start = document.getElementById('tt-start').value;
      const end = document.getElementById('tt-end').value;
      const location = document.getElementById('tt-location').value.trim();

      this.schedule.push({ id: Date.now(), title, day, start, end, location });
      document.getElementById('tt-title').value = '';
      document.getElementById('tt-location').value = '';

      StorageEngine.save('timetable', this.schedule);
      this.render();
      showToast('Schedule block added!');
    });
  },

  deleteItem(id) {
    this.schedule = this.schedule.filter(item => item.id !== id);
    StorageEngine.save('timetable', this.schedule);
    this.render();
    showToast('Schedule block deleted');
  },

  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const matrix = document.getElementById('timetable-matrix');

    matrix.innerHTML = days.map(day => {
      const dayItems = this.schedule
        .filter(item => item.day === day)
        .sort((a, b) => a.start.localeCompare(b.start));

      return `
        <div class="tt-day-col">
          <h5>${day}</h5>
          ${dayItems.length === 0 ? `<div style="color: var(--text-muted); font-size: 0.78rem; text-align: center; padding: 10px;">Free</div>` : ''}
          ${dayItems.map(item => `
            <div class="tt-card">
              <div style="display: flex; justify-content: space-between;">
                <strong>${item.title}</strong>
                <button onclick="TimetableModule.deleteItem(${item.id})" class="btn ghost" style="padding: 0 4px; font-size: 0.7rem; color: var(--danger);">✕</button>
              </div>
              <small style="color: var(--text-muted); display: block; margin-top: 2px;">⏰ ${item.start} - ${item.end}</small>
              ${item.location ? `<small style="color: var(--text-muted); display: block;">📍 ${item.location}</small>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }
};