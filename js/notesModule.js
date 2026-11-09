const NotesModule = {
  notes: [],

  init() {
    this.notes = StorageEngine.load('notes', [
      { id: 1, title: 'System Architecture Note', content: 'FlowLife workspace features isolated local account persistence and offline caching.', updated: '2026-11-09' }
    ]);
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('note-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('note-title').value.trim();
      const content = document.getElementById('note-content').value.trim();
      const today = new Date().toISOString().split('T')[0];

      this.notes.unshift({ id: Date.now(), title, content, updated: today });
      document.getElementById('note-title').value = '';
      document.getElementById('note-content').value = '';

      StorageEngine.save('notes', this.notes);
      this.render();
      showToast('Note saved successfully!');
    });
  },

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    StorageEngine.save('notes', this.notes);
    this.render();
    showToast('Note deleted');
  },

  render() {
    const container = document.getElementById('notes-grid');
    if (this.notes.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); grid-column: span 3; text-align: center;">No notes saved.</p>`;
      return;
    }

    container.innerHTML = this.notes.map(n => `
      <div class="panel" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${n.title}</h4>
            <button onclick="NotesModule.deleteNote(${n.id})" class="btn ghost" style="padding: 1px 4px; font-size: 0.7rem; color: var(--danger);">✕</button>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); white-space: pre-wrap; word-break: break-word; margin-bottom: 12px;">${n.content}</p>
        </div>
        <small style="font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 6px;">Updated: ${n.updated}</small>
      </div>
    `).join('');
  }
};