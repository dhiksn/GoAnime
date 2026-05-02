/**
 * auth.js — shared auth utilities
 * Include di setiap halaman yang butuh navbar dengan auth state
 */

const Auth = {
  getToken() { return localStorage.getItem('auth_token'); },
  getUser()  { return JSON.parse(localStorage.getItem('auth_user') || 'null'); },
  isLoggedIn() { return !!this.getToken(); },
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/';
  },
};

/**
 * Render auth button di navbar
 * Panggil setelah DOM ready, pass selector container navbar kanan
 */
function renderAuthNav(containerId = 'navAuth') {
  const el = document.getElementById(containerId);
  if (!el) return;

  const user = Auth.getUser();
  if (Auth.isLoggedIn() && user) {
    const initial = (user.username || '?')[0].toUpperCase();
    el.innerHTML = `
      <a href="/profile" class="nav-profile-btn" title="${user.username}">
        <span class="nav-avatar">${initial}</span>
        <span class="nav-username">${user.username}</span>
      </a>`;
  } else {
    el.innerHTML = `
      <a href="/login" class="nav-auth-link">Masuk</a>
      <a href="/register" class="nav-auth-link nav-auth-register">Daftar</a>`;
  }
}
