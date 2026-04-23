const Export = (() => {

  function printDoc() {
    window.print();
  }

  function exportMarkdown() {
    const doc = window._currentDoc;
    if (!doc) { showToast('No document loaded.', 'error'); return; }
    const md = doc.type === 'sop' ? sopToMarkdown(doc.data) : oplToMarkdown(doc.data);
    downloadFile(`${doc.data.sop_number || doc.data.opl_number}.md`, md);
  }

  function sopToMarkdown(s) {
    const arr = (f) => Array.isArray(s[f]) ? s[f] : [];
    let md = `# ${s.title}\n\n`;
    md += `**SOP Number:** ${s.sop_number}  \n`;
    md += `**Revision:** ${s.revision}  \n`;
    md += `**Status:** ${s.status}  \n`;
    md += `**Effective:** ${s.effective_date || 'N/A'}  \n`;
    md += `**Review Date:** ${s.review_date || 'N/A'}  \n`;
    md += `**Approved By:** ${s.approved_by || 'N/A'}  \n\n---\n\n`;
    if (s.purpose) md += `## Purpose\n${s.purpose}\n\n`;
    if (s.scope)   md += `## Scope\n${s.scope}\n\n`;
    const parties = arr('responsible_parties');
    if (parties.length) md += `## Responsible Parties\n${parties.map(p=>`- ${p}`).join('\n')}\n\n`;
    const hazards = arr('safety_hazards');
    if (hazards.length) {
      md += `## ⚠ Safety Hazards\n`;
      hazards.forEach(h => {
        md += `\n### ${h.hazard}\n`;
        if (h.ppe_required) md += `**PPE:** ${h.ppe_required}  \n`;
        if (h.mitigation)   md += `**Mitigation:** ${h.mitigation}  \n`;
      });
      md += '\n';
    }
    const tools = arr('tools_required');
    if (tools.length) md += `## Tools Required\n${tools.map(t=>`- ${t}`).join('\n')}\n\n`;
    const mats = arr('materials_required');
    if (mats.length) md += `## Materials Required\n${mats.map(m=>`- ${m}`).join('\n')}\n\n`;
    const steps = arr('steps');
    if (steps.length) {
      md += `## Step-by-Step Instructions\n`;
      steps.forEach(s => {
        md += `\n**Step ${s.step_number}${s.title ? ': ' + s.title : ''}**  \n${s.instruction}  \n`;
        if (s.warning) md += `> ⚠ ${s.warning}\n`;
      });
      md += '\n';
    }
    const qc = arr('quality_checkpoints');
    if (qc.length) {
      md += `## Quality Checkpoints\n\n| Checkpoint | Acceptable Range | If Out of Range |\n|---|---|---|\n`;
      qc.forEach(q => md += `| ${q.checkpoint} | ${q.acceptable_range} | ${q.action_if_fail} |\n`);
      md += '\n';
    }
    if (s.notes) md += `## Notes\n${s.notes}\n\n`;
    const refs = arr('doc_references');
    if (refs.length) md += `## References\n${refs.map(r=>`- ${r}`).join('\n')}\n\n`;
    md += `---\n*Novus Foods Plant 1730 · ${s.sop_number} · ${s.revision}*\n`;
    return md;
  }

  function oplToMarkdown(o) {
    const arr = (f) => Array.isArray(o[f]) ? o[f] : [];
    let md = `# OPL: ${o.title}\n\n`;
    md += `**OPL Number:** ${o.opl_number}  \n`;
    md += `**Type:** ${o.opl_type}  \n`;
    md += `**Status:** ${o.status}  \n`;
    md += `**Effective:** ${o.effective_date || 'N/A'}  \n\n---\n\n`;
    if (o.objective)    md += `## Objective\n${o.objective}\n\n`;
    if (o.key_point)    md += `## 💡 Key Point\n> ${o.key_point}\n\n`;
    const steps = arr('steps');
    if (steps.length) {
      md += `## Steps\n`;
      steps.forEach(s => md += `${s.step_number}. ${s.instruction}\n`);
      md += '\n';
    }
    const doThis = arr('do_this');
    if (doThis.length) md += `## ✓ DO This\n${doThis.map(d=>`- ✓ ${d}`).join('\n')}\n\n`;
    const notThis = arr('not_this');
    if (notThis.length) md += `## ✗ DO NOT\n${notThis.map(n=>`- ✗ ${n}`).join('\n')}\n\n`;
    if (o.why_it_matters) md += `## Why It Matters\n${o.why_it_matters}\n\n`;
    const refs = arr('doc_references');
    if (refs.length) md += `## References\n${refs.map(r=>`- ${r}`).join('\n')}\n\n`;
    md += `---\n*Novus Foods Plant 1730 · ${o.opl_number}*\n`;
    return md;
  }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { printDoc, exportMarkdown };
})();
