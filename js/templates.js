const Templates = (() => {

  function renderSOP(sop, dept) {
    const panel   = document.getElementById('content-panel');
    const hazards = Array.isArray(sop.safety_hazards)      ? sop.safety_hazards      : [];
    const steps   = Array.isArray(sop.steps)               ? sop.steps               : [];
    const qc      = Array.isArray(sop.quality_checkpoints) ? sop.quality_checkpoints : [];
    const tools   = Array.isArray(sop.tools_required)      ? sop.tools_required      : [];
    const mats    = Array.isArray(sop.materials_required)  ? sop.materials_required  : [];
    const parties = Array.isArray(sop.responsible_parties) ? sop.responsible_parties : [];
    const refs    = Array.isArray(sop.doc_references)      ? sop.doc_references      : [];

    const statusChip = {
      active:   'bg-emerald-900/60 text-emerald-400 border-emerald-700/60',
      draft:    'bg-amber-900/60 text-amber-400 border-amber-700/60',
      archived: 'bg-slate-700 text-slate-400 border-slate-600',
    };

    panel.innerHTML = `
      <div class="max-w-4xl mx-auto pb-16" id="printable-doc">
        <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="font-mono text-xs px-2 py-1 rounded-md bg-slate-700/80 text-slate-300 border border-slate-600">${sop.sop_number}</span>
                <span class="text-xs px-2 py-1 rounded-md border ${statusChip[sop.status] || statusChip.active}">${sop.status.toUpperCase()}</span>
                ${dept ? `<span class="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400 border-l-2" style="border-color:${dept.color}">${dept.name}</span>` : ''}
              </div>
              <h1 class="text-2xl font-bold text-white leading-tight">${sop.title}</h1>
              <p class="text-slate-500 text-sm mt-1.5">
                ${sop.revision} &nbsp;·&nbsp; Effective: ${sop.effective_date || 'N/A'} &nbsp;·&nbsp; Review: ${sop.review_date || 'N/A'}
                ${sop.approved_by ? `&nbsp;·&nbsp; Approved by: <span class="text-slate-300">${sop.approved_by}</span>` : ''}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button onclick="Export.printDoc()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors border border-slate-600">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
              </button>
              <button onclick="Export.exportMarkdown()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors border border-slate-600">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                .md
              </button>
            </div>
          </div>
        </div>

        ${(sop.purpose || sop.scope) ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          ${sop.purpose ? `<div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5"><h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose</h3><p class="text-slate-300 text-sm leading-relaxed">${sop.purpose}</p></div>` : ''}
          ${sop.scope   ? `<div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5"><h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scope</h3><p class="text-slate-300 text-sm leading-relaxed">${sop.scope}</p></div>` : ''}
        </div>` : ''}

        ${parties.length > 0 ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Responsible Parties</h3>
          <div class="flex flex-wrap gap-2">
            ${parties.map(p => `<span class="px-3 py-1 bg-blue-900/30 border border-blue-700/40 text-blue-300 text-sm rounded-full">${p}</span>`).join('')}
          </div>
        </div>` : ''}

        ${hazards.length > 0 ? `
        <div class="bg-red-950/30 border border-red-800/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Safety Hazards — Read Before Proceeding
          </h3>
          <div class="space-y-3">
            ${hazards.map(h => `
            <div class="bg-red-900/20 border border-red-800/30 rounded-xl p-4 flex gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center mt-0.5">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              </span>
              <div>
                <p class="font-semibold text-red-200 text-sm">${h.hazard}</p>
                ${h.ppe_required ? `<p class="text-red-300/80 text-xs mt-0.5"><span class="font-semibold">PPE:</span> ${h.ppe_required}</p>` : ''}
                ${h.mitigation   ? `<p class="text-slate-300 text-xs mt-1 bg-slate-900/50 rounded px-2 py-1">${h.mitigation}</p>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>` : ''}

        ${(tools.length > 0 || mats.length > 0) ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          ${tools.length > 0 ? `
          <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tools Required</h3>
            <ul class="space-y-1.5">${tools.map(t => `<li class="text-sm text-slate-300 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0"></span>${t}</li>`).join('')}</ul>
          </div>` : ''}
          ${mats.length > 0 ? `
          <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Materials Required</h3>
            <ul class="space-y-1.5">${mats.map(m => `<li class="text-sm text-slate-300 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0"></span>${m}</li>`).join('')}</ul>
          </div>` : ''}
        </div>` : ''}

        ${steps.length > 0 ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Step-by-Step Instructions</h3>
          <div class="space-y-4">
            ${steps.map(s => `
            <div class="flex gap-4 ${s.warning ? 'bg-amber-950/20 border border-amber-800/30 rounded-xl p-3' : ''}">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600
                flex items-center justify-center text-sm font-bold text-slate-200">${s.step_number}</div>
              <div class="flex-1 pt-0.5">
                ${s.title ? `<p class="font-semibold text-slate-100 text-sm mb-0.5">${s.title}</p>` : ''}
                <p class="text-slate-300 text-sm leading-relaxed">${s.instruction}</p>
                ${s.warning ? `
                <div class="mt-2 flex items-start gap-1.5">
                  <svg class="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  <p class="text-amber-400 text-xs font-semibold">${s.warning}</p>
                </div>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>` : ''}

        ${qc.length > 0 ? `
        <div class="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">Quality Checkpoints</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="border-b border-emerald-800/40">
                  <th class="text-left py-2 pr-4 text-emerald-400/70 text-xs font-semibold uppercase">Checkpoint</th>
                  <th class="text-left py-2 pr-4 text-emerald-400/70 text-xs font-semibold uppercase">Acceptable Range</th>
                  <th class="text-left py-2 text-emerald-400/70 text-xs font-semibold uppercase">If Out of Range</th>
                </tr>
              </thead>
              <tbody>
                ${qc.map(q => `
                <tr class="border-b border-slate-800">
                  <td class="py-2.5 pr-4 text-slate-300 align-top">${q.checkpoint}</td>
                  <td class="py-2.5 pr-4 text-emerald-300 font-mono text-xs align-top">${q.acceptable_range}</td>
                  <td class="py-2.5 text-amber-300 text-xs align-top">${q.action_if_fail}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>` : ''}

        ${(sop.notes || refs.length > 0) ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          ${sop.notes ? `<div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5"><h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</h3><p class="text-slate-400 text-sm leading-relaxed">${sop.notes}</p></div>` : ''}
          ${refs.length > 0 ? `<div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5"><h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">References</h3><ul class="space-y-1">${refs.map(r => `<li class="text-sm text-blue-400">→ ${r}</li>`).join('')}</ul></div>` : ''}
        </div>` : ''}

        <div class="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-600">
          <span>${sop.sop_number} · ${sop.revision}</span>
          <span>Novus Foods Plant 1730</span>
          <span>Effective: ${sop.effective_date || 'N/A'}</span>
        </div>
      </div>`;

    window._currentDoc = { type: 'sop', data: sop };
  }

  function renderOPL(opl, parentSop, dept) {
    const panel   = document.getElementById('content-panel');
    const steps   = Array.isArray(opl.steps)         ? opl.steps         : [];
    const doThis  = Array.isArray(opl.do_this)        ? opl.do_this       : [];
    const notThis = Array.isArray(opl.not_this)       ? opl.not_this      : [];
    const refs    = Array.isArray(opl.doc_references) ? opl.doc_references: [];

    const typeStyle = {
      how_to:        { ring: 'border-blue-700/50',    badge: 'bg-blue-900/40 text-blue-400 border-blue-700/60',      label: 'How To' },
      know_why:      { ring: 'border-purple-700/50',  badge: 'bg-purple-900/40 text-purple-400 border-purple-700/60',label: 'Know Why' },
      safety_alert:  { ring: 'border-red-700/50',     badge: 'bg-red-900/40 text-red-400 border-red-700/60',         label: 'Safety Alert' },
      quality_alert: { ring: 'border-amber-700/50',   badge: 'bg-amber-900/40 text-amber-400 border-amber-700/60',   label: 'Quality Alert' },
    };
    const ts = typeStyle[opl.opl_type] || typeStyle.how_to;

    panel.innerHTML = `
      <div class="max-w-4xl mx-auto pb-16" id="printable-doc">
        <div class="bg-slate-800/60 border-2 ${ts.ring} rounded-2xl p-6 mb-6">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="font-mono text-xs px-2 py-1 rounded-md bg-slate-700/80 text-slate-300 border border-slate-600">${opl.opl_number}</span>
                <span class="text-xs font-bold px-2 py-1 rounded-md border ${ts.badge}">${ts.label}</span>
                ${parentSop ? `<span class="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-500 border border-slate-700">↑ ${parentSop.sop_number}</span>` : ''}
              </div>
              <h1 class="text-2xl font-bold text-white">${opl.title}</h1>
              ${opl.objective ? `<p class="text-slate-400 text-sm mt-2 italic">"${opl.objective}"</p>` : ''}
            </div>
            <div class="flex gap-2">
              <button onclick="Export.printDoc()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors border border-slate-600">Print</button>
              <button onclick="Export.exportMarkdown()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors border border-slate-600">.md</button>
            </div>
          </div>
        </div>

        ${opl.key_point ? `
        <div class="flex items-start gap-3 bg-yellow-900/20 border border-yellow-600/30 rounded-2xl p-4 mb-5">
          <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div>
            <p class="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-0.5">Key Point</p>
            <p class="text-yellow-100 font-medium text-sm">${opl.key_point}</p>
          </div>
        </div>` : ''}

        ${opl.visual_url ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5 text-center">
          <img src="${opl.visual_url}" alt="${opl.visual_caption || ''}" class="max-w-full max-h-80 mx-auto rounded-xl object-contain"/>
          ${opl.visual_caption ? `<p class="text-slate-500 text-xs mt-2 italic">${opl.visual_caption}</p>` : ''}
        </div>` : ''}

        ${steps.length > 0 ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Steps</h3>
          <div class="space-y-3">
            ${steps.map(s => `
            <div class="flex gap-3">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 border border-slate-600
                text-slate-300 text-xs font-bold flex items-center justify-center">${s.step_number}</span>
              <p class="text-slate-300 text-sm pt-0.5 leading-relaxed">${s.instruction}</p>
            </div>`).join('')}
          </div>
        </div>` : ''}

        ${(doThis.length > 0 || notThis.length > 0) ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          ${doThis.length > 0 ? `
          <div class="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-5">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">✓ DO This</h3>
            <ul class="space-y-2">
              ${doThis.map(d => `
              <li class="flex items-start gap-2 text-sm text-emerald-200">
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                ${d}
              </li>`).join('')}
            </ul>
          </div>` : ''}
          ${notThis.length > 0 ? `
          <div class="bg-red-950/20 border border-red-800/40 rounded-2xl p-5">
            <h3 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">✗ DO NOT</h3>
            <ul class="space-y-2">
              ${notThis.map(n => `
              <li class="flex items-start gap-2 text-sm text-red-200">
                <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                ${n}
              </li>`).join('')}
            </ul>
          </div>` : ''}
        </div>` : ''}

        ${opl.why_it_matters ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Why It Matters</h3>
          <p class="text-slate-300 text-sm leading-relaxed">${opl.why_it_matters}</p>
        </div>` : ''}

        ${refs.length > 0 ? `
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">References</h3>
          <ul class="space-y-1">${refs.map(r => `<li class="text-sm text-blue-400">→ ${r}</li>`).join('')}</ul>
        </div>` : ''}

        <div class="border-t border-slate-800 pt-4 flex justify-between text-xs text-slate-600">
          <span>${opl.opl_number}</span>
          <span>Novus Foods Plant 1730</span>
          <span>${opl.effective_date || ''}</span>
        </div>
      </div>`;

    window._currentDoc = { type: 'opl', data: opl };
  }

  // ── FORM BUILDERS (admin use) ───────────────────────────────

  function _esc(v) {
    return (v || '').toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }

  function _strRow(listId, val = '') {
    return `<div class="flex gap-2 items-center" data-list="${listId}">
      <input type="text" class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 str-val" value="${_esc(val)}"/>
      <button type="button" onclick="this.parentElement.remove()" class="p-2 text-red-400 hover:text-red-300 flex-shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`;
  }

  function _hazardRow(idx, d = {}) {
    return `<div class="hazard-row bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-xs font-bold text-red-400">Hazard #${idx + 1}</span>
        <button type="button" onclick="this.closest('.hazard-row').remove()" class="text-red-400 hover:text-red-300">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 h-name" placeholder="Hazard description" value="${_esc(d.hazard)}"/>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 h-ppe"  placeholder="PPE required"       value="${_esc(d.ppe_required)}"/>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 h-mit"  placeholder="Mitigation"         value="${_esc(d.mitigation)}"/>
    </div>`;
  }

  function _stepRow(idx, d = {}) {
    return `<div class="step-row bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-xs font-bold text-slate-400">Step ${idx + 1}</span>
        <button type="button" onclick="this.closest('.step-row').remove()" class="text-red-400 hover:text-red-300">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <input type="text"  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 s-title"      placeholder="Step title"          value="${_esc(d.title)}"/>
      <textarea           class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 s-instruction" placeholder="Instruction…" rows="2">${_esc(d.instruction)}</textarea>
      <input type="text"  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 s-warning"    placeholder="Warning (optional)"  value="${_esc(d.warning)}"/>
    </div>`;
  }

  function _oplStepRow(idx, d = {}) {
    return `<div class="opl-step-row flex gap-2 items-start">
      <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center mt-2">${idx + 1}</span>
      <textarea class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 os-instruction" rows="1" placeholder="Step instruction…">${_esc(d.instruction)}</textarea>
      <button type="button" onclick="this.closest('.opl-step-row').remove()" class="mt-2 p-1.5 text-red-400 hover:text-red-300 flex-shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`;
  }

  function _qcRow(idx, d = {}) {
    return `<div class="qc-row bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-xs font-bold text-emerald-400">Checkpoint #${idx + 1}</span>
        <button type="button" onclick="this.closest('.qc-row').remove()" class="text-red-400 hover:text-red-300">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 qc-cp"     placeholder="What to check"           value="${_esc(d.checkpoint)}"/>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 qc-range"  placeholder="Acceptable range"        value="${_esc(d.acceptable_range)}"/>
      <input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 qc-action" placeholder="Action if out of range"   value="${_esc(d.action_if_fail)}"/>
    </div>`;
  }

  const fi = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500';
  const fl = 'block text-xs font-semibold text-slate-400 mb-1';

  function buildSOPForm(departments, d = null) {
    d = d || {};
    const arr = f => Array.isArray(d[f]) ? d[f] : [];
    return `<div class="space-y-6">
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Document Identity</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="${fl}">Department *</label>
            <select id="f-dept" class="${fi}">
              <option value="">Select…</option>
              ${departments.map(dep => `<option value="${dep.id}" ${d.department_id===dep.id?'selected':''}>${dep.name}</option>`).join('')}
            </select></div>
          <div><label class="${fl}">SOP Number *</label><input type="text" id="f-sop-number" class="${fi}" placeholder="SOP-PROD-002" value="${_esc(d.sop_number)}"/></div>
          <div><label class="${fl}">Revision</label><input type="text" id="f-revision" class="${fi}" value="${_esc(d.revision||'Rev 1.0')}"/></div>
          <div class="col-span-2"><label class="${fl}">Title *</label><input type="text" id="f-title" class="${fi}" placeholder="e.g. Jalapeño Charring Procedure" value="${_esc(d.title)}"/></div>
          <div><label class="${fl}">Status</label>
            <select id="f-status" class="${fi}">
              <option value="draft"    ${d.status==='draft'   ?'selected':''}>Draft</option>
              <option value="active"   ${(!d.status||d.status==='active')?'selected':''}>Active</option>
              <option value="archived" ${d.status==='archived'?'selected':''}>Archived</option>
            </select></div>
          <div><label class="${fl}">Approved By</label><input type="text" id="f-approved" class="${fi}" value="${_esc(d.approved_by)}"/></div>
          <div><label class="${fl}">Effective Date</label><input type="date" id="f-effective" class="${fi}" value="${d.effective_date||''}"/></div>
          <div><label class="${fl}">Review Date</label><input type="date" id="f-review" class="${fi}" value="${d.review_date||''}"/></div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Purpose & Scope</h3>
        <div class="space-y-3">
          <div><label class="${fl}">Purpose</label><textarea id="f-purpose" class="${fi}" rows="2">${_esc(d.purpose)}</textarea></div>
          <div><label class="${fl}">Scope</label><textarea id="f-scope" class="${fi}" rows="2">${_esc(d.scope)}</textarea></div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Responsible Parties</h3>
        <div id="parties-list" class="space-y-2">${arr('responsible_parties').map(v=>_strRow('parties',v)).join('')}</div>
        <button type="button" onclick="Templates.addRow('parties','Role, e.g. Line Lead')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Party</button>
      </div>
      <div class="bg-red-950/10 border border-red-800/30 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Safety Hazards</h3>
        <div id="hazards-list" class="space-y-3">${arr('safety_hazards').map((v,i)=>_hazardRow(i,v)).join('')}</div>
        <button type="button" onclick="Templates.addHazard()" class="mt-2 text-xs text-red-400 hover:text-red-300 font-semibold">+ Add Hazard</button>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tools & Materials</h3>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="${fl} mb-2 block">Tools Required</label>
            <div id="tools-list" class="space-y-2">${arr('tools_required').map(v=>_strRow('tools',v)).join('')}</div>
            <button type="button" onclick="Templates.addRow('tools','e.g. IR Thermometer')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Tool</button>
          </div>
          <div>
            <label class="${fl} mb-2 block">Materials Required</label>
            <div id="materials-list" class="space-y-2">${arr('materials_required').map(v=>_strRow('materials',v)).join('')}</div>
            <button type="button" onclick="Templates.addRow('materials','e.g. Propane tank')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Material</button>
          </div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Step-by-Step Instructions</h3>
        <div id="steps-list" class="space-y-3">${arr('steps').map((v,i)=>_stepRow(i,v)).join('')}</div>
        <button type="button" onclick="Templates.addStep()" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Step</button>
      </div>
      <div class="bg-emerald-950/10 border border-emerald-800/30 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Quality Checkpoints</h3>
        <div id="qc-list" class="space-y-3">${arr('quality_checkpoints').map((v,i)=>_qcRow(i,v)).join('')}</div>
        <button type="button" onclick="Templates.addQC()" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Checkpoint</button>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notes & References</h3>
        <textarea id="f-notes" class="${fi} mb-3" rows="2" placeholder="Additional notes…">${_esc(d.notes)}</textarea>
        <div id="refs-list" class="space-y-2">${arr('doc_references').map(v=>_strRow('refs',v)).join('')}</div>
        <button type="button" onclick="Templates.addRow('refs','e.g. HACCP Plan Section 4')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Reference</button>
      </div>
    </div>`;
  }

  function buildOPLForm(sops, d = null) {
    d = d || {};
    const arr = f => Array.isArray(d[f]) ? d[f] : [];
    return `<div class="space-y-6">
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Document Identity</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="${fl}">Parent SOP *</label>
            <select id="f-sop-id" class="${fi}">
              <option value="">Select parent SOP…</option>
              ${sops.map(s=>`<option value="${s.id}" ${d.sop_id===s.id?'selected':''}>${s.sop_number} — ${s.title}</option>`).join('')}
            </select></div>
          <div><label class="${fl}">OPL Number *</label><input type="text" id="f-opl-number" class="${fi}" placeholder="OPL-PROD-001-A" value="${_esc(d.opl_number)}"/></div>
          <div><label class="${fl}">OPL Type</label>
            <select id="f-opl-type" class="${fi}">
              <option value="how_to"        ${(!d.opl_type||d.opl_type==='how_to')       ?'selected':''}>How To</option>
              <option value="know_why"      ${d.opl_type==='know_why'      ?'selected':''}>Know Why</option>
              <option value="safety_alert"  ${d.opl_type==='safety_alert'  ?'selected':''}>Safety Alert</option>
              <option value="quality_alert" ${d.opl_type==='quality_alert' ?'selected':''}>Quality Alert</option>
            </select></div>
          <div class="col-span-2"><label class="${fl}">Title *</label><input type="text" id="f-title" class="${fi}" value="${_esc(d.title)}"/></div>
          <div><label class="${fl}">Status</label>
            <select id="f-status" class="${fi}">
              <option value="draft"    ${d.status==='draft'   ?'selected':''}>Draft</option>
              <option value="active"   ${(!d.status||d.status==='active')?'selected':''}>Active</option>
              <option value="archived" ${d.status==='archived'?'selected':''}>Archived</option>
            </select></div>
          <div><label class="${fl}">Effective Date</label><input type="date" id="f-effective" class="${fi}" value="${d.effective_date||''}"/></div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Core Content</h3>
        <div class="space-y-3">
          <div><label class="${fl}">Objective</label><input type="text" id="f-objective" class="${fi}" value="${_esc(d.objective)}"/></div>
          <div><label class="${fl}">Key Point</label><input type="text" id="f-key-point" class="${fi}" value="${_esc(d.key_point)}"/></div>
          <div><label class="${fl}">Why It Matters</label><textarea id="f-why" class="${fi}" rows="2">${_esc(d.why_it_matters)}</textarea></div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Visual Aid (Optional)</h3>
        <div class="space-y-3">
          <div><label class="${fl}">Image URL</label><input type="url" id="f-visual-url" class="${fi}" placeholder="https://…" value="${_esc(d.visual_url)}"/></div>
          <div><label class="${fl}">Caption</label><input type="text" id="f-visual-caption" class="${fi}" value="${_esc(d.visual_caption)}"/></div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Steps</h3>
        <div id="opl-steps-list" class="space-y-2">${arr('steps').map((v,i)=>_oplStepRow(i,v)).join('')}</div>
        <button type="button" onclick="Templates.addOPLStep()" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Step</button>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">DO / DO NOT</h3>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="${fl} text-emerald-400 mb-2 block">✓ DO This</label>
            <div id="do-list" class="space-y-2">${arr('do_this').map(v=>_strRow('do',v)).join('')}</div>
            <button type="button" onclick="Templates.addRow('do','e.g. Verify hood is on')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add</button>
          </div>
          <div>
            <label class="${fl} text-red-400 mb-2 block">✗ DO NOT</label>
            <div id="donot-list" class="space-y-2">${arr('not_this').map(v=>_strRow('donot',v)).join('')}</div>
            <button type="button" onclick="Templates.addRow('donot','e.g. Skip calibration')" class="mt-2 text-xs text-red-400 hover:text-red-300 font-semibold">+ Add</button>
          </div>
        </div>
      </div>
      <div class="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">References</h3>
        <div id="opl-refs-list" class="space-y-2">${arr('doc_references').map(v=>_strRow('opl-refs',v)).join('')}</div>
        <button type="button" onclick="Templates.addRow('opl-refs','e.g. SOP-PROD-001 Step 4')" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">+ Add Reference</button>
      </div>
    </div>`;
  }

  function addRow(listId, placeholder) {
    const el = document.getElementById(listId + '-list');
    if (!el) return;
    el.insertAdjacentHTML('beforeend', _strRow(listId, '').replace('value=""', `placeholder="${placeholder}"`));
  }
  function addHazard() {
    const el = document.getElementById('hazards-list');
    if (el) el.insertAdjacentHTML('beforeend', _hazardRow(el.children.length));
  }
  function addStep() {
    const el = document.getElementById('steps-list');
    if (el) el.insertAdjacentHTML('beforeend', _stepRow(el.children.length));
  }
  function addOPLStep() {
    const el = document.getElementById('opl-steps-list');
    if (el) el.insertAdjacentHTML('beforeend', _oplStepRow(el.children.length));
  }
  function addQC() {
    const el = document.getElementById('qc-list');
    if (el) el.insertAdjacentHTML('beforeend', _qcRow(el.children.length));
  }

  function collectSOPFormData() {
    const gv  = id => (document.getElementById(id)?.value || '').trim();
    const ga  = (listId, cls) => [...document.querySelectorAll(`[data-list="${listId}"] .${cls}`)].map(el => el.value.trim()).filter(Boolean);
    const hazards = [...document.querySelectorAll('.hazard-row')].map(r => ({
      hazard: r.querySelector('.h-name')?.value.trim()||'', ppe_required: r.querySelector('.h-ppe')?.value.trim()||'', mitigation: r.querySelector('.h-mit')?.value.trim()||'',
    })).filter(h => h.hazard);
    const steps = [...document.querySelectorAll('.step-row')].map((r,i) => ({
      step_number: i+1, title: r.querySelector('.s-title')?.value.trim()||'', instruction: r.querySelector('.s-instruction')?.value.trim()||'', warning: r.querySelector('.s-warning')?.value.trim()||null,
    })).filter(s => s.instruction);
    const qcs = [...document.querySelectorAll('.qc-row')].map(r => ({
      checkpoint: r.querySelector('.qc-cp')?.value.trim()||'', acceptable_range: r.querySelector('.qc-range')?.value.trim()||'', action_if_fail: r.querySelector('.qc-action')?.value.trim()||'',
    })).filter(q => q.checkpoint);
    return {
      department_id: gv('f-dept'), sop_number: gv('f-sop-number'), title: gv('f-title'),
      revision: gv('f-revision'), status: gv('f-status'), purpose: gv('f-purpose'),
      scope: gv('f-scope'), approved_by: gv('f-approved'),
      effective_date: gv('f-effective')||null, review_date: gv('f-review')||null,
      notes: gv('f-notes'), responsible_parties: ga('parties','str-val'),
      tools_required: ga('tools','str-val'), materials_required: ga('materials','str-val'),
      doc_references: ga('refs','str-val'), safety_hazards: hazards, steps, quality_checkpoints: qcs,
    };
  }

  function collectOPLFormData() {
    const gv = id => (document.getElementById(id)?.value || '').trim();
    const ga = (listId, cls) => [...document.querySelectorAll(`[data-list="${listId}"] .${cls}`)].map(el => el.value.trim()).filter(Boolean);
    const steps = [...document.querySelectorAll('.opl-step-row')].map((r,i) => ({
      step_number: i+1, instruction: r.querySelector('.os-instruction')?.value.trim()||'',
    })).filter(s => s.instruction);
    return {
      sop_id: gv('f-sop-id'), opl_number: gv('f-opl-number'), title: gv('f-title'),
      opl_type: gv('f-opl-type'), status: gv('f-status'), objective: gv('f-objective'),
      key_point: gv('f-key-point'), why_it_matters: gv('f-why'),
      visual_url: gv('f-visual-url')||null, visual_caption: gv('f-visual-caption')||null,
      effective_date: gv('f-effective')||null,
      do_this: ga('do','str-val'), not_this: ga('donot','str-val'),
      doc_references: ga('opl-refs','str-val'), steps,
    };
  }

  return {
    renderSOP, renderOPL, buildSOPForm, buildOPLForm,
    collectSOPFormData, collectOPLFormData,
    addRow, addHazard, addStep, addOPLStep, addQC,
  };
})();
