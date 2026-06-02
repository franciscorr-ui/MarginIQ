// ===== Extracted script block 03 from original HTML =====
(function(){
  var previousOpenMenuItem = window.openMenuItem;
  var previousUpdateMainMenuState = window.updateMainMenuState;
  var previousRenderStep = window.renderStep;
  window.showLegalContractsPanel = window.showLegalContractsPanel || false;
  window.legalContractsGroupBy = window.legalContractsGroupBy || '';

  function htmlLegalContracts(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function providerNameLegalContracts(p, idx){
    var name = p && p.name ? String(p.name).trim() : '';
    return name || 'Unnamed provider ' + (idx + 1);
  }
  function positionLegalContracts(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    var title = p && (p.title || p.position || p.role);
    return title ? String(title) : 'Position ' + (idx + 1);
  }
  function classificationLegalContracts(p){
    var v = p && p.classification ? String(p.classification).trim() : '';
    return v || 'Not set';
  }
  function residenceLegalContracts(p){
    var v = p && p.countryOfResidence ? String(p.countryOfResidence).trim() : '';
    return v || 'Not set';
  }
  function contractTypeLegalContracts(p){
    var type = p && p.contractualType ? String(p.contractualType).trim() : '';
    return type || 'Not set';
  }
  function groupValueLegalContracts(row){
    if (window.legalContractsGroupBy === 'classification') return classificationLegalContracts(row.p);
    if (window.legalContractsGroupBy === 'residence') return residenceLegalContracts(row.p);
    if (window.legalContractsGroupBy === 'contractType') return contractTypeLegalContracts(row.p);
    return '';
  }
  function groupLabelLegalContracts(){
    if (window.legalContractsGroupBy === 'classification') return 'Contract classification';
    if (window.legalContractsGroupBy === 'residence') return 'Country of residence';
    if (window.legalContractsGroupBy === 'contractType') return 'Provider type';
    return '';
  }
  function rowLegalContracts(p, idx){
    var provider = providerNameLegalContracts(p, idx);
    var position = positionLegalContracts(p, idx);
    var classification = classificationLegalContracts(p);
    var residence = residenceLegalContracts(p);
    var type = contractTypeLegalContracts(p);
    return '<article class="legal-contracts-row">' +
      '<div class="legal-contracts-cell position"><div class="legal-contracts-provider">' + htmlLegalContracts(provider) + '</div><div class="legal-contracts-position">' + htmlLegalContracts(position) + '</div></div>' +
      '<div class="legal-contracts-cell classification"><div class="legal-contracts-meta">' + htmlLegalContracts(classification) + '</div></div>' +
      '<div class="legal-contracts-cell residence"><div class="legal-contracts-meta">' + htmlLegalContracts(residence) + '</div></div>' +
      '<div class="legal-contracts-cell type"><span class="legal-contracts-type">' + htmlLegalContracts(type) + '</span></div>' +
      '<div class="legal-contracts-cell"><div class="legal-contracts-actions"><button type="button" class="secondary" onclick="openFlat(' + idx + ')">Open position</button><button type="button" class="primary" onclick="downloadContract(' + idx + ')">Download contract</button></div></div>' +
    '</article>';
  }
  function sortedRowsLegalContracts(rows){
    return rows.slice().sort(function(a,b){
      var ga = groupValueLegalContracts(a).toLowerCase();
      var gb = groupValueLegalContracts(b).toLowerCase();
      if (ga !== gb) return ga < gb ? -1 : 1;
      var pa = positionLegalContracts(a.p, a.idx).toLowerCase();
      var pb = positionLegalContracts(b.p, b.idx).toLowerCase();
      return pa < pb ? -1 : (pa > pb ? 1 : 0);
    });
  }
  function renderButtonsLegalContracts(){
    var active = window.legalContractsGroupBy || '';
    function btn(value, label){
      return '<button type="button" class="' + (active === value ? 'active' : '') + '" onclick="setLegalContractsGroupBy(\'' + value + '\')">' + label + '</button>';
    }
    return '<div class="legal-contracts-toolbar"><div class="legal-contracts-toolbar-label">View by</div><div class="legal-contracts-filter-buttons">' + btn('', 'All') + btn('classification', 'Contract classification') + btn('contractType', 'Provider type') + '<button type="button" class="flat-rate-view-pill" aria-current="page">Flat-rate</button></div></div>';
  }
  window.setLegalContractsGroupBy = function(value){
    window.legalContractsGroupBy = value || '';
    if (typeof renderAll === 'function') renderAll();
    else if (typeof renderStep === 'function') renderStep();
  };
  function renderRowsLegalContracts(rows){
    var ordered = sortedRowsLegalContracts(rows);
    var html = '<div class="legal-contracts-list"><div class="legal-contracts-head"><div>Position</div><div>Contract classification</div><div>Residence</div><div>Provider type</div><div></div></div>';
    if (!window.legalContractsGroupBy) {
      html += ordered.map(function(r){ return rowLegalContracts(r.p, r.idx); }).join('');
    } else {
      var current = null;
      var bucket = [];
      function flush(){
        if (current === null) return;
        html += '<div class="legal-contracts-group"><span>' + htmlLegalContracts(groupLabelLegalContracts() + ': ' + current) + '</span><span>' + bucket.length + ' position' + (bucket.length === 1 ? '' : 's') + '</span></div>';
        html += bucket.map(function(r){ return rowLegalContracts(r.p, r.idx); }).join('');
      }
      ordered.forEach(function(r){
        var gv = groupValueLegalContracts(r);
        if (current === null) { current = gv; bucket = [r]; return; }
        if (gv !== current) { flush(); current = gv; bucket = [r]; return; }
        bucket.push(r);
      });
      flush();
    }
    html += '</div>';
    return html;
  }
  window.renderLegalContractsPanel = function(){
    var rows = [];
    try { if (Array.isArray(flatRates)) flatRates.forEach(function(p, idx){ rows.push({p:p, idx:idx}); }); } catch(_) {}
    var content = rows.length ? renderButtonsLegalContracts() + renderRowsLegalContracts(rows) : '<div class="legal-contracts-empty">No providers found yet. Add a flat-rate position first, then the provider will appear here with its contract download.</div>';
    return '<div class="card legal-contracts-panel"><div class="legal-contracts-title-row"><div><h2>Contracts</h2><p>Compact legal overview of all flat-rate positions with contract downloads.</p></div><span class="legal-contracts-count">' + rows.length + ' position' + (rows.length === 1 ? '' : 's') + '</span></div>' + content + '</div>';
  };
  function syncLegalContractsMenuLabel(){
    var menu = document.getElementById('mainMenuPopover');
    if (!menu) return;
    var item = menu.querySelector('[data-menu-action="contracts"]');
    if (!item) {
      var legalGroup = Array.prototype.slice.call(menu.querySelectorAll('.menu-group')).find(function(group){
        var title = group.querySelector('.menu-group-title');
        return title && title.textContent.trim() === 'Legal';
      });
      var body = legalGroup && legalGroup.querySelector('.menu-group-body');
      if (body) {
        item = document.createElement('button');
        item.type = 'button';
        item.className = 'menu-option';
        item.setAttribute('data-menu-action','contracts');
        item.setAttribute('onclick',"openMenuItem('contracts')");
        item.innerHTML = '<span>Contracts</span><span class="menu-status">Empty</span>';
        body.appendChild(item);
      }
    }
    if (!item) return;
    item.classList.remove('disabled');
    item.removeAttribute('aria-disabled');
    var firstSpan = item.querySelector('span:first-child');
    if (firstSpan) firstSpan.textContent = 'Contracts';
    var status = item.querySelector('.menu-status');
    if (!status) { status = document.createElement('span'); status.className = 'menu-status'; item.appendChild(status); }
    var count = 0;
    try { count = Array.isArray(flatRates) ? flatRates.length : 0; } catch(_) {}
    status.textContent = window.showLegalContractsPanel ? 'Open' : (count ? count + ' positions' : 'Empty');
    item.classList.toggle('active', !!window.showLegalContractsPanel);
  }
  window.openMenuItem = function(action){
    if (action === 'contracts') {
      window.showLegalContractsPanel = true;
      try { window.showProjectStaffPanel = false; } catch(_) {}
      try { window.showBudgetPanel = false; } catch(_) {}
      try { showBackstage = false; } catch(_) {}
      if (typeof renderAll === 'function') renderAll();
      else if (typeof renderStep === 'function') renderStep();
      return;
    }
    window.showLegalContractsPanel = false;
    if (typeof previousOpenMenuItem === 'function') return previousOpenMenuItem.apply(this, arguments);
  };
  window.updateMainMenuState = function(){
    if (typeof previousUpdateMainMenuState === 'function') previousUpdateMainMenuState.apply(this, arguments);
    syncLegalContractsMenuLabel();
  };
  window.renderStep = function(){
    if (window.showLegalContractsPanel) {
      var el = document.getElementById('stepContent');
      if (el && typeof window.renderLegalContractsPanel === 'function') el.innerHTML = window.renderLegalContractsPanel();
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
  document.addEventListener('DOMContentLoaded', syncLegalContractsMenuLabel);
  setTimeout(syncLegalContractsMenuLabel, 0);
})();
