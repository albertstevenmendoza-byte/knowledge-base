const Admin = (() => {

  async function saveDepartment(data, existingId = null) {
    const user = await Auth.getCurrentUser();
    const payload = { ...data, updated_by: user.id, ...(existingId ? {} : { created_by: user.id }) };
    const res = existingId
      ? await sb.from('departments').update(payload).eq('id', existingId).select().single()
      : await sb.from('departments').insert(payload).select().single();
    if (res.error) throw res.error;
    await RBAC.logAction(existingId ? 'UPDATE' : 'INSERT', 'departments', res.data.id, res.data.name);
    return res.data;
  }

  async function deleteDepartment(id, name) {
    const { error } = await sb.from('departments').delete().eq('id', id);
    if (error) throw error;
    await RBAC.logAction('DELETE', 'departments', id, name);
  }

  async function saveSOP(data, existingId = null) {
    const user = await Auth.getCurrentUser();
    const payload = { ...data, updated_by: user.id, ...(existingId ? {} : { created_by: user.id }) };
    const res = existingId
      ? await sb.from('sops').update(payload).eq('id', existingId).select().single()
      : await sb.from('sops').insert(payload).select().single();
    if (res.error) throw res.error;
    await RBAC.logAction(existingId ? 'UPDATE' : 'INSERT', 'sops', res.data.id, res.data.title);
    return res.data;
  }

  async function deleteSOP(id, title) {
    const { error } = await sb.from('sops').delete().eq('id', id);
    if (error) throw error;
    await RBAC.logAction('DELETE', 'sops', id, title);
  }

  async function saveOPL(data, existingId = null) {
    const user = await Auth.getCurrentUser();
    const payload = { ...data, updated_by: user.id, ...(existingId ? {} : { created_by: user.id }) };
    const res = existingId
      ? await sb.from('opls').update(payload).eq('id', existingId).select().single()
      : await sb.from('opls').insert(payload).select().single();
    if (res.error) throw res.error;
    await RBAC.logAction(existingId ? 'UPDATE' : 'INSERT', 'opls', res.data.id, res.data.title);
    return res.data;
  }

  async function deleteOPL(id, title) {
    const { error } = await sb.from('opls').delete().eq('id', id);
    if (error) throw error;
    await RBAC.logAction('DELETE', 'opls', id, title);
  }

  async function resetDatabase(confirmationPhrase) {
    if (confirmationPhrase !== 'RESET NOVUS KB') throw new Error('Incorrect confirmation phrase.');
    const user = await Auth.getCurrentUser();
    const { error: o } = await sb.from('opls').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (o) throw o;
    const { error: s } = await sb.from('sops').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (s) throw s;
    const { error: d } = await sb.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (d) throw d;
    await RBAC.logAction('RESET', 'all_tables', null, 'Full database reset', { performed_by: user.email });
  }

  return { saveDepartment, deleteDepartment, saveSOP, deleteSOP, saveOPL, deleteOPL, resetDatabase };
})();
