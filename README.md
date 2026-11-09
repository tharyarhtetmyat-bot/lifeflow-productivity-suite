\# FlowLife — Personal Productivity Suite



FlowLife is a lightweight, responsive web application designed as a personal workspace for managing daily schedules, tasks, habits, expenses, and notes.



\## Features



\- \*\*Local Account Authentication:\*\* Sign up and log in locally with isolated data storage per account.

\- \*\*Notion-Style Interface:\*\* Clean sidebar navigation with light/dark theme support and keyboard shortcuts (`Ctrl+0` through `Ctrl+7`).

\- \*\*Dashboard:\*\* Centralized overview of pending tasks, habits, and financial balance.

\- \*\*Calendar \& Milestones:\*\* Track monthly events and project deadlines.

\- \*\*Weekly Schedule:\*\* Matrix to organize recurring weekly blocks and classes.

\- \*\*Habits Tracker:\*\* Streak-based daily habit check-ins.

\- \*\*Finance \& Bill Splitter:\*\* Expense ledger with a quick group bill calculation tool.

\- \*\*Kanban Board \& Pomodoro Timer:\*\* Manage task workflows and focus intervals with keyboard controls (`Space` to play/pause).

\- \*\*Notes \& Scratchpad:\*\* Fast client-side note creation.

\- \*\*Analytics:\*\* Lightweight workspace metrics and task completion rates.

\- \*\*Backup \& Restore:\*\* Export and import full workspace JSON backups anytime.



\## Technical Architecture



Built using HTML5, CSS Variables, and modular Vanilla ES6+ JavaScript:



```text

lifeflow-productivity-suite/

├── assets/

│   └── icon.png

├── css/

│   ├── variables.css

│   ├── styles.css

│   ├── components.css

│   └── animations.css

├── js/

│   ├── storage.js

│   ├── auth.js

│   ├── calendarModule.js

│   ├── timetableModule.js

│   ├── habitTracker.js

│   ├── budgetTracker.js

│   ├── pomodoroKanban.js

│   ├── notesModule.js

│   ├── analyticsModule.js

│   └── app.js

├── index.html

├── manifest.json

├── sw.js

└── README.md

