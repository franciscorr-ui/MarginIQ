// ===== Extracted script block 05 from original HTML =====
(function(){
  function buttonBar(active, handlerName){
    function btn(value, label){
      return '<button type="button" class="' + (active === value ? 'active' : '') + '" onclick="' + handlerName + '(\'' + value + '\')">' + label + '</button>';
    }
    return '<div class="legal-contracts-toolbar-label">View by</div><div class="legal-contracts-filter-buttons">' +
      btn('', 'All') + btn('classification', 'Contract classification') + btn('contractType', 'Provider type') +
      '<button type="button" class="flat-rate-view-pill" aria-current="page">Flat-rate</button></div>';
  }
  function flatSummaryHeader(){
    return '<div class="positions-summary-head"><div class="h">Position</div><div class="h">Name</div><div class="h">Transfer</div><div class="h">Company cost</div><div class="h">Revenue</div><div class="h">Margin %</div><div class="h"></div></div>';
  }
  window.renderStep3 = function(){
    if (!flatRates || !flatRates.length){
      return '<div class="card"><div class="top-actions"><div></div><button type="button" class="primary empty-cta-highlight" onclick="addFlat()" id="addFlatRateBtn">Add position</button></div><div class="flat-empty-state"><div class="flat-empty-copy"><div class="flat-empty-title">No flat-rate positions yet</div><div class="flat-empty-sub">Click <strong>Add position</strong> to start calculating the margin for this project.</div></div></div>' + navButtons() + '</div>';
    }
    var hasOpen = flatRates.some(function(p){ return !p._collapsed; });
    var visibleRows = flatRates.map(function(p, idx){ return {p:p, idx:idx}; }).filter(function(r){ return !hasOpen || !r.p._collapsed; });
    var topControls = hasOpen ? '' : '<div class="flat-rate-top-controls"><div class="flat-rate-classify-toolbar">' + buttonBar(window.flatRatesGroupBy || '', 'setFlatRatesGroupBy') + '</div><button type="button" onclick="addFlat()">Add position</button></div>';
    var list = '';
    if (hasOpen) {
      list = visibleRows.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('');
    } else {
      list = flatSummaryHeader() + (typeof renderGroupedFlatRows === 'function' ? renderGroupedFlatRows(visibleRows) : visibleRows.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('')) + renderFlatSummaryTotals();
    }
    return '<div class="card">' + topControls + (list || '<div class="empty">No Flat-Rate positions yet.</div>') + navButtons() + '</div>';
  };
})();
