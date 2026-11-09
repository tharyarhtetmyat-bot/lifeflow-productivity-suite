const CalendarModule = {
  events: [],
  currentDate: new Date(),

  init() {
    this.events = StorageEngine.load('events', [
      { id: 1, title: 'KMUTT CS Application Deadline', date: '2026-10-30' }
    ]);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('cal-prev').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });

    document.getElementById('cal-next').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });

    document.getElementById('cal-today').addEventListener('click', () => {
      this.currentDate = new Date();
      this.render();
    });

    document.getElementById('event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const date = document.getElementById('event-date').value;

      if (!title || !date) return;

      this.events.push({ id: Date.now(), title, date });
      document.getElementById('event-title').value = '';
      document.getElementById('event-date').value = '';

      StorageEngine.save('events', this.events);
      this.render();
      showToast('Calendar event added');
    });
  },

  handleDayClick(dateStr) {
    const dateInput = document.getElementById('event-date');
    const titleInput = document.getElementById('event-title');
    if (dateInput) {
      dateInput.value = dateStr;
    }
    if (titleInput) {
      titleInput.focus();
    }
    showToast(`Selected date: ${dateStr}`);
  },

  deleteEvent(id) {
    this.events = this.events.filter(ev => ev.id !== id);
    StorageEngine.save('events', this.events);
    this.render();
    showToast('Event removed');
  },

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('cal-month-year').innerText = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const grid = document.getElementById('calendar-grid');
    let cellsHTML = '';

    for (let i = 0; i < firstDayIndex; i++) {
      cellsHTML += `<div class="cal-cell empty"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= totalDays; day++) {
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

      const dayEvents = this.events.filter(ev => ev.date === dateStr);
      const isToday = dateStr === todayStr;

      cellsHTML += `
        <div class="cal-cell ${isToday ? 'today' : ''}" onclick="CalendarModule.handleDayClick('${dateStr}')">
          <strong>${day}</strong>
          <div class="cal-events">
            ${dayEvents.map(ev => `<span class="cal-event-tag" title="${ev.title}">${ev.title}</span>`).join('')}
          </div>
        </div>
      `;
    }

    grid.innerHTML = cellsHTML;

    const eventList = document.getElementById('event-list');
    if (this.events.length === 0) {
      eventList.innerHTML = `<li style="color: var(--text-muted); justify-content: center;">No scheduled milestones.</li>`;
      return;
    }

    eventList.innerHTML = this.events.sort((a,b) => a.date.localeCompare(b.date)).map(ev => `
      <li>
        <div>
          <strong>${ev.title}</strong>
          <small style="color: var(--text-muted); display: block;">${ev.date}</small>
        </div>
        <button onclick="CalendarModule.deleteEvent(${ev.id})" class="btn ghost" style="padding: 2px 6px; font-size: 0.75rem; color: var(--danger);">✕</button>
      </li>
    `).join('');
  }
};