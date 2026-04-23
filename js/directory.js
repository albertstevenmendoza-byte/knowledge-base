const Directory = (() => {
  let _data = { departments: [], sops: [], opls: [] };

  async function loadAll() {
    const [dRes, sRes, oRes] = await Promise.all([
      sb.from('departments').select('*').order('display_order'),
      sb.from('sops').select('id,department_id,sop_number,title,revision,status,display_order').order('display_order'),
      sb.from('opls').select('id,sop_id,opl_number,title,opl_type,status,display_order').order('display_order'),
    ]);
    _data.departments = dRes.data || [];
    _data.sops        = sRes.data || [];
    _data.opls        = oRes.data || [];
    return _data;
  }

  function buildTree() {
    const container = document.getElementById('tree-container');
    if (!container) return;
    container.innerHTML = '';

    if (_data.departments.length === 0) {
      container.innerHTML = `
        <div class="px-4 py-10 text-center">
          <p class="text-slate-500 text-sm">No departments yet.</p>
        </div>`;
      return;
    }
    _data.departments.forEach(dept => container.appendChild(createDepartmentNode(dept)));
  }

  function createDepartmentNode(dept) {
    const deptSops = _data.sops.filter(s => s.department_id === dept.id);
    const node = document.createElement('div');
    node.className = 'tree-dept mb-1';
    node.dataset.deptId = dept.id;

    node.innerHTML = `
      <button class="dept-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        hover:bg-slate-700/60 transition-all duration-150 text-left">
        <span class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style="background:${dept.color}20;border:1px solid ${dept.color}50;">
          ${getDeptIconSVG(dept.icon, dept.color)}
        </span>
        <span class="flex-1 text-sm font-semibold text-slate-200 truncate">${dept.name}</span>
        <span class="text-xs text-slate-600 font-mono mr-1">${deptSops.length}</span>
        ${deptSops.length > 0 ? `
        <svg class="chevron-icon w-4 h-4 text-slate-600 transition-transform duration-200 flex-shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>` : ''}
      </button>
      <div class="sop-container pl-3 hidden">
        ${deptSops.map(sop => buildSOPNodeHTML(sop)).join('')}
      </div>
    `;

    node.querySelector('.dept-btn').addEventListener('click', () => {
      const c = node.querySelector('.sop-container');
      const v = node.querySelector('.chevron-icon');
      const isOpen = !c.classList.contains('hidden');
      c.classList.toggle('hidden', isOpen);
      if (v) v.style.transform = isOpen ? '' : 'rotate(90deg)';
    });

    setTimeout(() => {
      node.querySelectorAll('.sop-title-btn').forEach(btn =>
        btn.addEventListener('click', e => { e.stopPropagation(); loadSOP(btn.dataset.sopId); })
      );
      node.querySelectorAll('.sop-expand-btn').forEach(btn =>
        btn.addEventListener('click', e => {
          e.stopPropagation();
          toggleOplList(btn.dataset.sopId, btn.closest('.sop-row'));
        })
      );
      node.querySelectorAll('.opl-btn').forEach(btn =>
        btn.addEventListener('click', () => loadOPL(btn.dataset.oplId))
      );
    }, 0);

    return node;
  }

  function buildSOPNodeHTML(sop) {
    const sopOpls = _data.opls.filter(o => o.sop_id === sop.id);
    const statusBadge = sop.status === 'draft'
      ? `<span class="ml-1 px-1 py-0.5 text-[10px] bg-amber-900/60 text-amber-400 rounded">DRAFT</span>`
      : sop.status === 'archived'
      ? `<span class="ml-1 px-1 py-0.5 text-[10px] bg-slate-700 text-slate-500 rounded">ARCH</span>`
      : '';

    return `
      <div class="sop-row py-0.5" data-sop-id="${sop.id}">
        <div class="flex items-center gap-1">
          <button class="sop-title-btn flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg
            hover:bg-slate-700/50 transition-all text-left group" data-sop-id="${sop.id}">
            <svg class="w-3.5 h-3.5 text-slate-600 flex-shrink-0 group-hover:text-slate-400 transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors truncate flex-1">
              ${sop.sop_number}${statusBadge}
            </span>
          </button>
          ${sopOpls.length > 0 ? `
          <button class="sop-expand-btn p-1.5 rounded hover:bg-slate-700 transition-colors flex-shrink-0"
            data-sop-id="${sop.id}" title="${sopOpls.length} OPL(s)">
            <svg class="opl-chevron w-3 h-3 text-slate-600 transition-transform duration-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>` : ''}
        </div>
        <p class="text-xs text-slate-500 px-2 pb-1 truncate ml-5">${sop.title}</p>
        ${sopOpls.length > 0 ? `
        <div class="opl-container pl-5 hidden">
          ${sopOpls.map(opl => `
            <button class="opl-btn w-full flex items-center gap-2 px-2 py-1.5 rounded-lg
              hover:bg-slate-700/50 transition-all text-left group" data-opl-id="${opl.id}">
              ${getOplTypeIconSVG(opl.opl_type)}
              <span class="text-xs text-slate-500 group-hover:text-slate-300 transition-colors truncate">
                ${opl.opl_number} — ${opl.title}
              </span>
            </button>
          `).join('')}
        </div>` : ''}
      </div>
    `;
  }

  function toggleOplList(sopId, sopRow) {
    const c = sopRow.querySelector('.opl-container');
    const v = sopRow.querySelector('.opl-chevron');
    if (!c) return;
    const isOpen = !c.classList.contains('hidden');
    c.classList.toggle('hidden', isOpen);
    if (v) v.style.transform = isOpen ? '' : 'rotate(90deg)';
  }

  async function loadSOP(sopId) {
    setActiveItem('sop', sopId);
    showLoadingState();
    const { data: sop, error } = await sb.from('sops').select('*').eq('id', sopId).single();
    if (error || !sop) { showErrorState('Could not load SOP.'); return; }
    const dept = _data.departments.find(d => d.id === sop.department_id);
    Templates.renderSOP(sop, dept);
  }

  async function loadOPL(oplId) {
    setActiveItem('opl', oplId);
    showLoadingState();
    const { data: opl, error } = await sb.from('opls').select('*').eq('id', oplId).single();
    if (error || !opl) { showErrorState('Could not load OPL.'); return; }
    const sop  = _data.sops.find(s => s.id === opl.sop_id);
    const dept = sop ? _data.departments.find(d => d.id === sop.department_id) : null;
    Templates.renderOPL(opl, sop, dept);
  }

  function setActiveItem(type, id) {
    document.querySelectorAll('.sop-title-btn, .opl-btn').forEach(el =>
      el.classList.remove('!bg-slate-700', 'active-doc')
    );
    const sel = type === 'sop'
      ? `.sop-title-btn[data-sop-id="${id}"]`
      : `.opl-btn[data-opl-id="${id}"]`;
    document.querySelector(sel)?.classList.add('!bg-slate-700', 'active-doc');
  }

  function showLoadingState() {
    document.getElementById('content-panel').innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center gap-3 text-slate-500">
          <div class="w-8 h-8 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <span class="text-sm">Loading document...</span>
        </div>
      </div>`;
  }

  function showErrorState(msg) {
    document.getElementById('content-panel').innerHTML = `
      <div class="flex items-center justify-center h-64">
        <p class="text-red-400 text-sm">${msg}</p>
      </div>`;
  }

  function showWelcomeState() {
    document.getElementById('content-panel').innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[480px] text-center px-8 py-12">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800
          flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/30">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
                 C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
                 C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13
                 C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Plant 1730 Knowledge Base</h2>
        <p class="text-slate-500 text-sm max-w-xs leading-relaxed">
          Select a department from the directory on the left, then open an SOP or OPL to view its full documentation.
        </p>
        <div class="mt-10 grid grid-cols-3 gap-4 w-full max-w-sm">
          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center gap-1">
            <span class="text-2xl font-bold text-emerald-400" id="stat-depts">—</span>
            <span class="text-xs text-slate-500">Departments</span>
          </div>
          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center gap-1">
            <span class="text-2xl font-bold text-blue-400" id="stat-sops">—</span>
            <span class="text-xs text-slate-500">SOPs</span>
          </div>
          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center gap-1">
            <span class="text-2xl font-bold text-purple-400" id="stat-opls">—</span>
            <span class="text-xs text-slate-500">OPLs</span>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const de = document.getElementById('stat-depts');
      const se = document.getElementById('stat-sops');
      const oe = document.getElementById('stat-opls');
      if (de) de.textContent = _data.departments.length;
      if (se) se.textContent = _data.sops.length;
      if (oe) oe.textContent = _data.opls.length;
    }, 50);
  }

  async function refresh() {
    await loadAll();
    buildTree();
  }

  function getDeptIconSVG(key, color) {
    const svgs = {
      archive:       `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`,
      flame:         `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>`,
      'shield-check':`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
      wrench:        `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
      microscope:    `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-6 0a2 2 0 002 2h4a2 2 0 002-2m-6 0V9"/></svg>`,
      truck:         `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" stroke="${color}" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h10a1 1 0 001-1zM13 8h4l3 3v4h-7V8z"/></svg>`,
      shield:        `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
      factory:       `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="${color}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
    };
    return svgs[key] || svgs.factory;
  }

  function getOplTypeIconSVG(type) {
    const svgs = {
      how_to:        `<svg class="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      know_why:      `<svg class="w-3 h-3 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
      safety_alert:  `<svg class="w-3 h-3 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
      quality_alert: `<svg class="w-3 h-3 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    };
    return svgs[type] || svgs.how_to;
  }

  return { loadAll, buildTree, refresh, loadSOP, loadOPL, showWelcomeState };
})();
