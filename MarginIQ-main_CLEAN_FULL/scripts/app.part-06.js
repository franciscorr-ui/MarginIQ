// ===== Extracted script block 06 from original HTML =====
(function(){
  function buttonBar(active, handlerName){
    function btn(value, label){
      return '<button type="button" class="' + (active === value ? 'active' : '') + '" onclick="' + handlerName + '(\'' + value + '\')">' + label + '</button>';
    }
    return '<div class="viewby-static-slot" aria-hidden="true">View by</div>' +
      btn('', 'All') + btn('contractType', 'Provider type') + btn('classification', 'Contract classification');
  }
  function flatSummaryHeader(){
    return '<div class="positions-summary-head"><div class="h">Position</div><div class="h">Name</div><div class="h">Transfer</div><div class="h">Company cost</div><div class="h">Revenue</div><div class="h">Margin %</div><div class="h"></div></div>';
  }
  window.renderStep3 = function(){
    if (!flatRates || !flatRates.length){
      return '<div class="card"><div class="flat-rate-top-controls flat-rate-viewby-steps"><div class="viewby-static-slot" aria-hidden="true">View by</div><button type="button" class="active" disabled>All</button><button type="button" disabled>Provider type</button><button type="button" disabled>Contract classification</button><button type="button" class="add-position-btn" onclick="return miqAddFlatFromButton(event)" id="addFlatRateBtn">Add position</button></div><div class="flat-empty-state"><div class="flat-empty-copy"><div class="flat-empty-title">No flat-rate positions yet</div><div class="flat-empty-sub">Click <strong>Add position</strong> to start calculating the margin for this project.</div></div></div>' + navButtons() + '</div>';
    }
    var hasOpen = flatRates.some(function(p){ return !p._collapsed; });
    var visibleRows = flatRates.map(function(p, idx){ return {p:p, idx:idx}; }).filter(function(r){ return !hasOpen || !r.p._collapsed; });
    var topControls = hasOpen ? '' : '<div class="flat-rate-top-controls flat-rate-viewby-steps">' + buttonBar(window.flatRatesGroupBy || '', 'setFlatRatesGroupBy') + '<button type="button" class="add-position-btn" onclick="return miqAddFlatFromButton(event)">Add position</button></div>';
    var list = '';
    if (hasOpen) {
      list = visibleRows.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('');
    } else {
      list = flatSummaryHeader() + (typeof renderGroupedFlatRows === 'function' ? renderGroupedFlatRows(visibleRows) : visibleRows.map(function(r){ return renderFlatPosition(r.p, r.idx); }).join('')) + renderFlatSummaryTotals();
    }
    return '<div class="card">' + topControls + (list || '<div class="empty">No Flat-Rate positions yet.</div>') + navButtons() + '</div>';
  };
})();
