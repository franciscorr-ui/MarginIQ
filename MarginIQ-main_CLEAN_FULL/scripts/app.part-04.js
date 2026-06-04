// ===== Extracted script block 04 from original HTML =====
(function(){
  window.flatRatesGroupBy = window.flatRatesGroupBy || '';

  function safeHtml(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function providerName(p, idx){
    var name = p && p.name ? String(p.name).trim() : '';
    return name || 'Unnamed provider ' + (idx + 1);
  }
  function posTitle(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    var title = p && (p.title || p.position || p.role);
    return title ? String(title) : 'Position ' + (idx + 1);
  }
  function classification(p){
    var v = p && p.classification ? String(p.classification).trim() : '';
    return v || 'Not set';
  }
  function residence(p){
    var v = p && p.countryOfResidence ? String(p.countryOfResidence).trim() : '';
    return v || 'Not set';
  }
  function contractType(p){
    var v = p && p.contractualType ? String(p.contractualType).trim() : '';
    return v || 'Not set';
  }
  function groupValue(p, mode){
    if (mode === 'classification') return classification(p);
    if (mode === 'residence') return residence(p);
    if (mode === 'contractType') return contractType(p);
    return '';
  }
  function groupLabel(mode){
    if (mode === 'classification') return 'Contract classification';
    if (mode === 'residence') return 'Country of residence';
    if (mode === 'contractType') return 'Provider type';
    return '';
  }
  function sortedRows(rows, mode){
    return rows.slice().sort(function(a,b){
      var ga = groupValue(a.p, mode).toLowerCase();
      var gb = groupValue(b.p, mode).toLowerCase();
      if (ga !== gb) return ga < gb ? -1 : 1;
      var pa = posTitle(a.p, a.idx).toLowerCase();
      var pb = posTitle(b.p, b.idx).toLowerCase();
      return pa < pb ? -1 : (pa > pb ? 1 : 0);
    });
  }
  function buttonBar(active, handlerName){
    function btn(value, label){
      return '<button type="button" class="' + (active === value ? 'active' : '') + '" onclick="' + handlerName + '(\'' + value + '\')">' + label + '</button>';
    }
    return '<div class="legal-contracts-toolbar-label">View by</div><div class="legal-contracts-filter-buttons">' + btn('', 'All') + btn('classification', 'Contract classification') + btn('contractType', 'Provider type') + '<button type="button" class="flat-rate-view-pill" aria-current="page">Flat-rate</button></div>';
  }
  window.setFlatRatesGroupBy = function(value){
    window.flatRatesGroupBy = value || '';
    if (typeof renderAll === 'function') renderAll();
    else if (typeof renderStep === 'function') renderStep();
  };
  function flatSummaryHeader(){
    return '<div class="positions-summary-head"><div class="h">Position</div><div class="h">Name</div><div class="h">Transfer</div><div class="h">Company cost</div><div class="h">Revenue</div><div class="h">Margin %</div><div class="h"></div></div>';
  }
  function renderGroupedFlatRows(rows){
    var mode = window.flatRatesGroupBy || '';
    var ordered = sortedRows(rows, mode);
    if (!mode) return ordered.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('');
    var html = '';
    var current = null;
    var bucket = [];
    function flush(){
      if (current === null) return;
      html += '<div class="flat-rate-group-head"><span>' + safeHtml(groupLabel(mode) + ': ' + current) + '</span><span>' + bucket.length + ' position' + (bucket.length === 1 ? '' : 's') + '</span></div>';
      html += bucket.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('');
    }
    ordered.forEach(function(r){
      var gv = groupValue(r.p, mode);
      if (current === null) { current = gv; bucket = [r]; return; }
      if (gv !== current) { flush(); current = gv; bucket = [r]; return; }
      bucket.push(r);
    });
    flush();
    return html;
  }
  window.renderStep3 = function(){
    if (!flatRates || flatRates.length === 0){
      return '<div class="card"><div class="top-actions"><div></div><button type="button" class="primary empty-cta-highlight" onclick="addFlat()" id="addFlatRateBtn">Add position</button></div><div class="flat-empty-state"><div class="flat-empty-copy"><div class="flat-empty-title">No flat-rate positions yet</div><div class="flat-empty-sub">Click <strong>Add position</strong> to start calculating the margin for this project.</div></div></div>' + navButtons() + '</div>';
    }
    var hasOpen = flatRates.some(function(p){ return !p._collapsed; });
    var visibleRows = flatRates.map(function(p, idx){ return {p:p, idx:idx}; }).filter(function(r){ return !hasOpen || !r.p._collapsed; });
    var topControls = '<div class="flat-rate-top-controls"><div class="flat-rate-classify-toolbar">' + buttonBar(window.flatRatesGroupBy || '', 'setFlatRatesGroupBy') + '</div><button type="button" onclick="addFlat()">Add position</button></div>';
    var list = '';
    if (hasOpen) {
      list = visibleRows.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('');
    } else {
      list = flatSummaryHeader() + renderGroupedFlatRows(visibleRows) + renderFlatSummaryTotals();
    }
    return '<div class="card">' + topControls + (list || '<div class="empty">No Flat-Rate positions yet.</div>') + navButtons() + '</div>';
  };

  function contractRow(p, idx){
    return '<article class="legal-contracts-row legal-contracts-row-lines">' +
      '<div class="legal-contracts-cell name"><div class="legal-contracts-name">' + safeHtml(providerName(p, idx)) + '</div></div>' +
      '<div class="legal-contracts-cell position"><div class="legal-contracts-position">' + safeHtml(posTitle(p, idx)) + '</div></div>' +
      '<div class="legal-contracts-cell residence"><div class="legal-contracts-meta">' + safeHtml(residence(p)) + '</div></div>' +
      '<div class="legal-contracts-cell"><div class="legal-contracts-actions"><button type="button" class="secondary" onclick="openFlat(' + idx + ')">Open position</button><button type="button" class="primary" onclick="downloadContract(' + idx + ')">Download contract</button></div></div>' +
    '</article>';
  }
  function renderContractButtons(){
    return '<div class="legal-contracts-toolbar">' + buttonBar(window.legalContractsGroupBy || '', 'setLegalContractsGroupBy') + '</div>';
  }
  function renderContractRows(rows){
    var mode = window.legalContractsGroupBy || '';
    var ordered = sortedRows(rows, mode);
    var html = '<div class="legal-contracts-list"><div class="legal-contracts-head legal-contracts-head-lines"><div>Name</div><div>Position</div><div>Country of residency</div><div></div></div>';
    if (!mode) {
      html += ordered.map(function(r){ return contractRow(r.p, r.idx); }).join('');
    } else {
      var current = null;
      var bucket = [];
      function flush(){
        if (current === null) return;
        html += '<div class="legal-contracts-group"><span>' + safeHtml(groupLabel(mode) + ': ' + current) + '</span><span>' + bucket.length + ' contract' + (bucket.length === 1 ? '' : 's') + '</span></div>';
        html += bucket.map(function(r){ return contractRow(r.p, r.idx); }).join('');
      }
      ordered.forEach(function(r){
        var gv = groupValue(r.p, mode);
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
    var content = rows.length ? renderContractButtons() + renderContractRows(rows) : '<div class="legal-contracts-empty">No providers found yet. Add a flat-rate position first, then the provider will appear here with its contract download.</div>';
    return '<div class="card legal-contracts-panel"><div class="legal-contracts-title-row"><div><h2>Contracts</h2><p>All flat-rate contracts in a compact line-by-line view.</p></div><span class="legal-contracts-count">' + rows.length + ' contract' + (rows.length === 1 ? '' : 's') + '</span></div>' + content + '</div>';
  };
})();
