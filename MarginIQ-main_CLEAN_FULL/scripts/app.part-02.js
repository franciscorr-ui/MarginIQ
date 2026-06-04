// ===== Extracted script block 02 from original HTML =====
(function(){
  var previousOpenMenuItem = window.openMenuItem;
  var previousUpdateMainMenuState = window.updateMainMenuState;
  var previousRenderStep = window.renderStep;
  window.showProjectStaffPanel = window.showProjectStaffPanel || false;

  function toNumProjectStaff(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g,'');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g,'').replace(',','.'); else s = s.replace(/,/g,'');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function htmlProjectStaff(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function moneyProjectStaff(value){
    try { if (typeof money === 'function') return money(toNumProjectStaff(value)); } catch(_) {}
    return '€ ' + toNumProjectStaff(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function pctProjectStaff(value){
    var x = toNumProjectStaff(value);
    return (Number.isFinite(x) ? x : 0).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%';
  }
  function titleProjectStaff(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    var title = p && (p.title || p.name);
    return title ? String(title) : 'Position ' + (idx + 1);
  }
  function nameProjectStaff(p, idx){
    var name = p && p.name ? String(p.name).trim() : '';
    return name || 'Unnamed project staff ' + (idx + 1);
  }
  function contractTypeProjectStaff(p){
    return String(p && p.contractualType || '').trim();
  }
  function isIndividualProjectStaff(p){
    var type = contractTypeProjectStaff(p).toLowerCase();
    return type === 'individual freelancer' || type === 'individual employee';
  }
  function staffTypeLabel(p){
    var type = contractTypeProjectStaff(p);
    if (type === 'Individual Freelancer') return 'Freelancer';
    if (type === 'Individual Employee') return 'Employee';
    return type || 'Individual';
  }
  function computedProjectStaff(p){
    try { return computePosition(p || {}); } catch(_) { return {}; }
  }
  function effectiveEntityProjectStaff(p){
    try { if (typeof getEffectiveContractingEntity === 'function') return getEffectiveContractingEntity(p); } catch(_) {}
    return p && p.contractingEntity ? p.contractingEntity : '';
  }
  function rowProjectStaff(p, idx){
    var c = computedProjectStaff(p);
    var role = titleProjectStaff(p, idx);
    var person = nameProjectStaff(p, idx);
    var type = staffTypeLabel(p);
    var country = p && p.countryOfResidence ? p.countryOfResidence : 'Not set';
    var classification = p && p.classification ? p.classification : 'Not set';
    var entity = effectiveEntityProjectStaff(p) || 'Not set';
    var mode = p && p.inputMode ? p.inputMode : 'Gross';
    var feeRate = toNumProjectStaff(p && p.feeRate);
    var feeQty = toNumProjectStaff(p && p.feeQty);
    var marginRate = p && String(p.marginRate || '').trim() ? pctProjectStaff(p.marginRate) : 'Not set';
    return '<article class="project-staff-card">' +
      '<div class="project-staff-card-head"><div><h3 class="project-staff-name">' + htmlProjectStaff(person) + '</h3><div class="project-staff-role">' + htmlProjectStaff(role) + '</div></div><span class="project-staff-badge">' + htmlProjectStaff(type) + '</span></div>' +
      '<div class="project-staff-body"><div class="project-staff-facts">' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Country</div><div class="project-staff-fact-value">' + htmlProjectStaff(country) + '</div></div>' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Classification</div><div class="project-staff-fact-value">' + htmlProjectStaff(classification) + '</div></div>' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Contracting entity</div><div class="project-staff-fact-value">' + htmlProjectStaff(entity) + '</div></div>' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Input mode / margin</div><div class="project-staff-fact-value">' + htmlProjectStaff(mode) + ' / ' + htmlProjectStaff(marginRate) + '</div></div>' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Fee rate</div><div class="project-staff-fact-value">' + htmlProjectStaff(moneyProjectStaff(feeRate)) + '</div></div>' +
        '<div class="project-staff-fact"><div class="project-staff-fact-label">Quantity</div><div class="project-staff-fact-value">' + htmlProjectStaff(feeQty) + ' ' + htmlProjectStaff((p && p.feeUnit) || '') + '</div></div>' +
      '</div><div class="project-staff-money-row">' +
        '<div class="project-staff-money"><div class="project-staff-fact-label">Company cost</div><div class="project-staff-fact-value">' + htmlProjectStaff(moneyProjectStaff(c.companyCost || 0)) + '</div></div>' +
        '<div class="project-staff-money"><div class="project-staff-fact-label">Revenue</div><div class="project-staff-fact-value">' + htmlProjectStaff(moneyProjectStaff(c.revenue || 0)) + '</div></div>' +
        '<div class="project-staff-money"><div class="project-staff-fact-label">Transfer</div><div class="project-staff-fact-value">' + htmlProjectStaff(moneyProjectStaff(c.transfer || 0)) + '</div></div>' +
      '</div><div class="project-staff-actions"><button type="button" class="secondary" onclick="openFlat(' + idx + ')">Open position</button><button type="button" class="primary" onclick="downloadContract(' + idx + ')">Download contract</button></div></div></article>';
  }
  window.renderProjectStaffPanel = function(){
    var rows = [];
    try {
      if (Array.isArray(flatRates)) {
        flatRates.forEach(function(p, idx){ if (isIndividualProjectStaff(p)) rows.push({p:p, idx:idx}); });
      }
    } catch(_) {}
    var content = rows.length ? '<div class="project-staff-grid">' + rows.map(function(r){ return rowProjectStaff(r.p, r.idx); }).join('') + '</div>' : '<div class="project-staff-empty">No individual project staff found yet. Add a flat-rate position and choose <strong>Individual Freelancer</strong> or <strong>Individual Employee</strong> as the provider type.</div>';
    return '<div class="card project-staff-panel"><div class="project-staff-title-row"><div><h2>Project staff</h2><p>Summary of individual freelancers and employees entered in the Flat-rate section. Contract downloads use the same contract generator as the Flat-rate position.</p></div><span class="project-staff-count">' + rows.length + ' listed</span></div>' + content + '</div>';
  };
  function syncProjectStaffMenuLabel(){
    var menu = document.getElementById('mainMenuPopover');
    if (!menu) return;
    var item = menu.querySelector('[data-menu-action="employees"]');
    if (!item) return;
    item.classList.remove('disabled');
    item.removeAttribute('aria-disabled');
    var firstSpan = item.querySelector('span:first-child');
    if (firstSpan) firstSpan.textContent = 'Project staff';
    var status = item.querySelector('.menu-status');
    if (!status) { status = document.createElement('span'); status.className = 'menu-status'; item.appendChild(status); }
    status.textContent = window.showProjectStaffPanel ? 'Open' : '';
    item.classList.toggle('active', !!window.showProjectStaffPanel);
  }
  window.openMenuItem = function(action){
    if (action === 'employees') {
      window.showProjectStaffPanel = true;
      try { window.showBudgetPanel = false; } catch(_) {}
      try { showBackstage = false; } catch(_) {}
      if (typeof renderAll === 'function') renderAll();
      else if (typeof renderStep === 'function') renderStep();
      return;
    }
    window.showProjectStaffPanel = false;
    if (typeof previousOpenMenuItem === 'function') return previousOpenMenuItem.apply(this, arguments);
  };
  window.updateMainMenuState = function(){
    if (typeof previousUpdateMainMenuState === 'function') previousUpdateMainMenuState.apply(this, arguments);
    syncProjectStaffMenuLabel();
  };
  window.renderStep = function(){
    if (window.showProjectStaffPanel) {
      var el = document.getElementById('stepContent');
      if (el && typeof window.renderProjectStaffPanel === 'function') el.innerHTML = window.renderProjectStaffPanel();
      try { document.body.classList.toggle('is-intro', false); } catch(_) {}
      try { var hero = document.querySelector('.hero'); if (hero) hero.style.display = ''; } catch(_) {}
      try { var steps = document.getElementById('stepsBar'); if (steps) steps.style.display = ''; } catch(_) {}
      try { var progress = document.querySelector('.progressWrap'); if (progress) progress.style.display = ''; } catch(_) {}
      if (typeof updateProgress === 'function') updateProgress();
      if (typeof updateMainMenuState === 'function') updateMainMenuState();
      return;
    }
    if (typeof previousRenderStep === 'function') return previousRenderStep.apply(this, arguments);
  };
  document.addEventListener('DOMContentLoaded', syncProjectStaffMenuLabel);
  setTimeout(syncProjectStaffMenuLabel, 0);
})();
