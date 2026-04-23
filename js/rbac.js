const RBAC = (() => {
  let _cache = null;

  async function getProfile(userId) {
    if (_cache && _cache.id === userId) return _cache;
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) { console.error('Profile fetch error:', error.message); return null; }
    _cache = data;
    return data;
  }

  async function isAdmin() {
    const user = await Auth.getCurrentUser();
    if (!user) return false;
    const profile = await getProfile(user.id);
    return profile?.role === 'admin';
  }

  function clearCache() { _cache = null; }

  async function logAction(action, tableName, recordId, recordTitle, details = {}) {
    const user = await Auth.getCurrentUser();
    if (!user) return;
    const { error } = await sb.from('audit_log').insert({
      user_id:      user.id,
      user_email:   user.email,
      action,
      table_name:   tableName,
      record_id:    recordId || null,
      record_title: recordTitle || null,
      details,
    });
    if (error) console.error('Audit log error:', error.message);
  }

  return { getProfile, isAdmin, clearCache, logAction };
})();
