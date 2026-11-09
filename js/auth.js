/**
 * Local Account Authentication & User Session Manager
 */
const AuthEngine = {
  getUsers() {
    const users = localStorage.getItem(StorageEngine.KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUsers(users) {
    localStorage.setItem(StorageEngine.KEYS.USERS, JSON.stringify(users));
  },

  register(name, username, password) {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    if (users.find(u => u.username === cleanUsername)) {
      return { success: false, message: 'Username already exists!' };
    }

    const newUser = {
      name: name.trim(),
      username: cleanUsername,
      password: password, // Simple client-side store
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.login(cleanUsername, password);
    return { success: true, user: newUser };
  },

  login(username, password) {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();
    const user = users.find(u => u.username === cleanUsername && u.password === password);

    if (user) {
      localStorage.setItem(StorageEngine.KEYS.CURRENT_USER, user.username);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password!' };
  },

  logout() {
    localStorage.removeItem(StorageEngine.KEYS.CURRENT_USER);
    window.location.reload();
  },

  getCurrentUser() {
    const username = localStorage.getItem(StorageEngine.KEYS.CURRENT_USER);
    if (!username) return null;
    const users = this.getUsers();
    return users.find(u => u.username === username) || null;
  },

  initUI() {
    const authModal = document.getElementById('auth-modal-overlay');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      authModal.classList.remove('hidden');
    } else {
      authModal.classList.add('hidden');
      this.updateProfileUI(currentUser);
    }

    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      document.getElementById('auth-title').innerText = 'Create Local Account';
      document.getElementById('auth-subtitle').innerText = 'Start organizing with your isolated workspace';
    });

    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      document.getElementById('auth-title').innerText = 'Welcome Back';
      document.getElementById('auth-subtitle').innerText = 'Sign in to your local account to access your workspace';
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;
      const res = this.login(u, p);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`);
        authModal.classList.add('hidden');
        window.location.reload();
      } else {
        showToast(res.message);
      }
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = document.getElementById('signup-name').value;
      const u = document.getElementById('signup-username').value;
      const p = document.getElementById('signup-password').value;
      const res = this.register(n, u, p);
      if (res.success) {
        showToast(`Account created for ${res.user.name}!`);
        authModal.classList.add('hidden');
        window.location.reload();
      } else {
        showToast(res.message);
      }
    });

    logoutBtn.addEventListener('click', () => {
      this.logout();
    });
  },

  updateProfileUI(user) {
    const nameEl = document.getElementById('user-display-name');
    const statusEl = document.getElementById('user-status-text');
    const initialsEl = document.getElementById('user-avatar-initials');

    if (nameEl) nameEl.innerText = user.name;
    if (statusEl) statusEl.innerText = '● Active Session';
    if (initialsEl) {
      const parts = user.name.trim().split(' ');
      const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]) : user.name.slice(0, 2);
      initialsEl.innerText = initials.toUpperCase();
    }
  }
};