const Auth = (() => {

  async function requireAuth() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      window.location.replace('login.html');
      return null;
    }
    return session;
  }

  async function requireAdmin() {
    const session = await requireAuth();
    if (!session) return null;
    const profile = await RBAC.getProfile(session.user.id);
    if (!profile || profile.role !== 'admin') {
      window.location.replace('index.html');
      return null;
    }
    return { session, profile };
  }

  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function logout() {
    await sb.auth.signOut();
    window.location.replace('login.html');
  }

  async function getCurrentUser() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.user || null;
  }

  async function redirectIfLoggedIn() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) window.location.replace('index.html');
  }

  return { requireAuth, requireAdmin, login, logout, getCurrentUser, redirectIfLoggedIn };
})();
