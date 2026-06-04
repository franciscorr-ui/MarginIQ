// ===== Extracted script block 10 from original HTML =====
(function(){
  function applyHalfScreenLayout(){
    document.querySelectorAll('#stepContent .flat-workspace-shell').forEach(function(shell){
      shell.style.setProperty('display','grid','important');
      if (window.innerWidth > 1100) {
        shell.style.setProperty('grid-template-columns','minmax(0,1fr) minmax(0,1fr)','important');
        shell.style.setProperty('gap','20px','important');
      } else {
        shell.style.setProperty('grid-template-columns','1fr','important');
        shell.style.setProperty('gap','16px','important');
      }
    });
  }
  window.addEventListener('resize', applyHalfScreenLayout);
  var oldRender = window.renderFlatPosition;
  if (typeof oldRender === 'function') {
    window.renderFlatPosition = function(){
      var result = oldRender.apply(this, arguments);
      setTimeout(applyHalfScreenLayout, 0);
      return result;
    };
    try { renderFlatPosition = window.renderFlatPosition; } catch(e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHalfScreenLayout);
  } else {
    applyHalfScreenLayout();
  }
})();


// ===== MarginIQ active layout patch v6: Outputs, Calculated details, clean Inputs, aligned cost columns =====
(function(){
  function esc(value){
    return String(value == null || value === '' ? '—' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }
  function safe(fn, fallback){
    try {
      var v = fn();
      return (v == null || v === '') ? (fallback || '—') : v;
    } catch (_) { return fallback || '—'; }
  }
  function calcValue(fn){
    return safe(function(){
      var v = fn();
      if (typeof window.derivedCalculationValue === 'function') return window.derivedCalculationValue(v);
      if (typeof derivedCalculationValue === 'function') return derivedCalculationValue(v);
      return v;
    }, '—');
  }
  function makeCalculatedDetailsBlock(p, idx){
    p = p || {};
    var itr = safe(function(){ return (typeof window.getImplementationCountryForPosition === 'function' ? window.getImplementationCountryForPosition() : getImplementationCountryForPosition()); });
    var taxStatus = calcValue(function(){ return (typeof window.deriveTaxStatus === 'function' ? window.deriveTaxStatus(p) : deriveTaxStatus(p)); });
    var entity = safe(function(){ return (typeof window.getEffectiveContractingEntity === 'function' ? window.getEffectiveContractingEntity(p) : getEffectiveContractingEntity(p)); });
    var vat = calcValue(function(){
      var raw = (typeof window.deriveVatJurisdiction === 'function' ? window.deriveVatJurisdiction(p) : deriveVatJurisdiction(p));
      return (typeof window.displayVatJurisdiction === 'function' ? window.displayVatJurisdiction(raw) : displayVatJurisdiction(raw));
    });
    var items = [
      ['ITR country', itr],
      ['Tax status', taxStatus],
      ['Contracting entity', entity],
      ['VAT jurisdiction', vat]
    ].map(function(item){
      return '<div class="mi-output-calc-item"><div class="mi-output-calc-label">' + esc(item[0]) + '</div><div class="mi-output-calc-value">' + esc(item[1]) + '</div></div>';
    }).join('');
    return '<div class="invoice-breakdown flat-calculated-output-panel mi-output-calculated"><div class="invoice-section"><div class="invoice-head"><div class="invoice-title">Calculated details</div></div><div class="mi-output-calc-grid">' + items + '</div></div></div>';
  }
  window.calculatedDetailsBlock = makeCalculatedDetailsBlock;

  function installStyle(){
    var id = 'marginiq-active-layout-patch-v6';
    var old = document.getElementById(id);
    if (old) old.remove();
    var css = `
      #stepContent .flat-workspace-shell,
      .flat-workspace-shell { align-items: start !important; overflow: visible !important; }
      #stepContent .flat-workspace-left,
      .flat-workspace-left {
        position: relative !important;
        top: auto !important;
        max-height: none !important;
        height: auto !important;
        overflow: visible !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      #stepContent .flat-workspace-right,
      .flat-workspace-right { overflow: visible !important; }
      .flat-workspace-left .flat-basics-head { display: none !important; }
      .flat-workspace-left .flat-basics-panel {
        border: 0 !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
      .flat-workspace-left .flat-basics-body { display: block !important; }
      .flat-workspace-left .flat-basics-group {
        border: 1px solid var(--line) !important;
        border-radius: 18px !important;
        background: #fff !important;
        overflow: hidden !important;
        margin: 0 0 18px 0 !important;
      }
      .flat-workspace-left .flat-basics-group-head {
        padding: 16px 18px 12px !important;
        border-bottom: 1px solid var(--line) !important;
        background: #fff !important;
      }
      .flat-workspace-left .flat-basics-group-title {
        margin: 0 !important;
        color: #1A497F !important;
        font-size: 18px !important;
        line-height: 1.2 !important;
        font-weight: 900 !important;
      }
      .flat-workspace-left .flat-basics-grid { padding: 16px !important; }
      .flat-workspace-left .mi-cost-field label,
      .flat-workspace-left .mi-cost-total-label,
      .flat-workspace-left .component-field-label,
      .flat-workspace-left .component-mobile-label { display: none !important; }
      #stepContent .flat-workspace-left .mi-cost-row,
      .flat-workspace-left .mi-cost-row,
      #stepContent .flat-workspace-left .mi-cost-column-head,
      .flat-workspace-left .mi-cost-column-head,
      #stepContent .flat-workspace-left .mi-cost-section-total,
      .flat-workspace-left .mi-cost-section-total {
        display: grid !important;
        grid-template-columns: minmax(160px,1fr) 100px 120px 130px !important;
        column-gap: 14px !important;
        align-items: center !important;
      }
      .flat-workspace-left .mi-cost-column-head {
        padding: 10px 18px 8px !important;
        border-bottom: 1px solid #eef2f7 !important;
        background: #fbfdff !important;
        color: #64748b !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        font-weight: 900 !important;
      }
      .flat-workspace-left .mi-cost-column-head > div { text-align: right !important; }
      .flat-workspace-left .mi-cost-column-head > div:first-child { text-align: left !important; }
      .flat-workspace-left .mi-cost-field input { width: 100% !important; min-width: 0 !important; max-width: none !important; }
      .flat-workspace-left .mi-cost-total-cell { justify-items: end !important; grid-column: auto !important; padding-top: 0 !important; }
      .flat-workspace-left .mi-cost-section-total-name { grid-column: 1 / 4 !important; text-align: right !important; }
      .flat-workspace-left .mi-cost-column-head-percent,
      #stepContent .flat-workspace-left .mi-cost-percent-row,
      .flat-workspace-left .mi-cost-percent-row {
        grid-template-columns: minmax(160px,1fr) 120px 130px !important;
      }
      .flat-workspace-right .flat-calculated-output-panel { margin: 0 0 14px 0 !important; }
      .mi-output-calculated .invoice-section { padding: 16px 16px 14px !important; }
      .mi-output-calc-grid { display: grid !important; grid-template-columns: repeat(2,minmax(0,1fr)) !important; gap: 10px !important; margin-top: 12px !important; }
      .mi-output-calc-item { border: 1px solid #eef2f7 !important; border-radius: 12px !important; background: #fbfdff !important; padding: 10px 12px !important; }
      .mi-output-calc-label { font-size: 12px !important; line-height: 1.2 !important; color: #64748b !important; font-weight: 800 !important; }
      .mi-output-calc-value { margin-top: 4px !important; font-size: 14px !important; line-height: 1.25 !important; color: #0f172a !important; font-weight: 800 !important; }
      .flat-workspace-header h4 {
        margin: 0 !important;
        font-size: 18px !important;
        line-height: 1.25 !important;
        font-weight: 900 !important;
        color: #1A497F !important;
      }
      .flat-workspace-header h4::first-letter { color: #1A497F !important; }
      .flat-workspace-left .flat-workspace-panel-title {
        margin: 0 0 10px 0 !important;
        padding: 0 !important;
        border: 0 !important;
        color: #0f172a !important;
        font-size: 20px !important;
        font-weight: 900 !important;
      }
      .flat-workspace-left .flat-subsection-head { display: none !important; }
      .flat-workspace-left .flat-input-breakdown {
        margin-top: 14px !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        overflow: visible !important;
      }
      .flat-workspace-left .mi-cost-section,
      .flat-workspace-left .days-distribution-card {
        border: 1px solid var(--line) !important;
        border-radius: 18px !important;
        background: #fff !important;
        overflow: hidden !important;
        margin: 0 0 14px 0 !important;
      }
      .flat-workspace-left .mi-cost-section-head,
      .flat-workspace-left .days-distribution-head {
        padding: 14px 16px 12px !important;
        border-bottom: 1px solid var(--line) !important;
        background: #fff !important;
      }
      .flat-workspace-left .mi-cost-section-title,
      .flat-workspace-left .days-distribution-title {
        margin: 0 !important;
        color: #0f172a !important;
        font-size: 16px !important;
        line-height: 1.25 !important;
        font-weight: 900 !important;
        letter-spacing: 0 !important;
        text-transform: none !important;
      }
      #stepContent .flat-workspace-left .mi-cost-row,
      .flat-workspace-left .mi-cost-row {
        min-height: 52px !important;
        padding: 10px 16px !important;
        border-bottom: 1px solid #eef2f7 !important;
        background: #fff !important;
      }
      .flat-workspace-left .mi-cost-label-cell {
        display: grid !important;
        grid-template-columns: 22px minmax(0,1fr) !important;
        gap: 10px !important;
        align-items: center !important;
        min-width: 0 !important;
      }
      .flat-workspace-left .mi-cost-index {
        display: block !important;
        width: auto !important;
        height: auto !important;
        min-width: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: #64748b !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        font-weight: 700 !important;
        text-align: right !important;
      }
      .flat-workspace-left .mi-cost-name {
        color: #0f172a !important;
        font-size: 14px !important;
        line-height: 1.25 !important;
        font-weight: 800 !important;
        white-space: normal !important;
      }
      #stepContent .flat-workspace-left .mi-cost-column-head,
      .flat-workspace-left .mi-cost-column-head {
        grid-template-columns: minmax(160px,1fr) 100px 100px 110px !important;
        column-gap: 12px !important;
        padding: 8px 16px !important;
        background: #f8fbff !important;
        border-bottom: 1px solid #eef2f7 !important;
      }
      #stepContent .flat-workspace-left .mi-cost-row,
      .flat-workspace-left .mi-cost-row,
      #stepContent .flat-workspace-left .mi-cost-section-total,
      .flat-workspace-left .mi-cost-section-total {
        grid-template-columns: minmax(160px,1fr) 100px 100px 110px !important;
        column-gap: 12px !important;
      }
      .flat-workspace-left .mi-cost-column-head > div {
        text-align: right !important;
        font-size: 11px !important;
        line-height: 1.2 !important;
        font-weight: 800 !important;
        color: #64748b !important;
      }
      .flat-workspace-left .mi-cost-column-head > div:first-child { text-align: left !important; }
      .flat-workspace-left .mi-cost-field input {
        height: 34px !important;
        min-height: 34px !important;
        padding: 6px 8px !important;
        font-size: 13px !important;
        border-radius: 10px !important;
        text-align: right !important;
      }
      .flat-workspace-left .mi-cost-total {
        font-size: 14px !important;
        line-height: 1.25 !important;
        font-weight: 900 !important;
        color: #0f172a !important;
      }
      .flat-workspace-left .mi-cost-section-total {
        padding: 12px 16px !important;
        border-top: 1px solid #dbe4f0 !important;
        background: #f8fbff !important;
      }
      .flat-workspace-left .mi-cost-section-total-name {
        grid-column: 1 / 4 !important;
        color: #0f172a !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        text-align: right !important;
      }
      .flat-workspace-left .mi-cost-section-total-value {
        color: #0f172a !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        text-align: right !important;
      }
      .flat-workspace-left .mi-cost-column-head-percent,
      #stepContent .flat-workspace-left .mi-cost-percent-row,
      .flat-workspace-left .mi-cost-percent-row {
        grid-template-columns: minmax(160px,1fr) 100px 110px !important;
      }
      .flat-workspace-left .mi-cost-percent-row .mi-cost-total-cell { grid-column: auto !important; }
      .flat-workspace-left .days-distribution-title { text-transform: none !important; }
      .flat-workspace-left .days-distribution-body { padding: 14px 16px 16px !important; }
      .flat-workspace-left .days-distribution-summary { grid-template-columns: repeat(3,minmax(0,1fr)) !important; }
      @media (max-width: 760px){
        .mi-output-calc-grid { grid-template-columns: 1fr !important; }
        .flat-workspace-left .mi-cost-column-head { display: none !important; }
        #stepContent .flat-workspace-left .mi-cost-row,
        .flat-workspace-left .mi-cost-row,
        #stepContent .flat-workspace-left .mi-cost-section-total,
        .flat-workspace-left .mi-cost-section-total { grid-template-columns: 1fr !important; }
        .flat-workspace-left .mi-cost-section-total-name { grid-column: auto !important; text-align: left !important; }
      }
    `;
    var style = document.createElement('style');
    style.id = id;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function insertCalculatedDetails(html, p, idx){
    try {
      html = String(html == null ? '' : html);
      html = html.replace(/<h3>Output<\/h3>/g, '<h3>Outputs</h3>');
      if (html.indexOf('flat-calculated-output-panel') !== -1) return html;
      var block = makeCalculatedDetailsBlock(p || {}, idx || 0);
      var marker = '<div class="flow-results"><h3>Outputs</h3>';
      if (html.indexOf(marker) !== -1) return html.replace(marker, marker + block);
      var marker2 = '<div class="flow-results"><h3>Outputs</h3';
      var at = html.indexOf(marker2);
      if (at === -1) return html;
      var close = html.indexOf('</h3>', at);
      if (close === -1) return html;
      return html.slice(0, close + 5) + block + html.slice(close + 5);
    } catch (_) { return html; }
  }

  function postProcessDom(){
    try {
      document.querySelectorAll('.flow-results > h3').forEach(function(h){ if (h.textContent.trim() === 'Output') h.textContent = 'Outputs'; });
      document.querySelectorAll('.flat-workspace-left .flat-basics-title').forEach(function(el){ el.style.display = 'none'; });
      document.querySelectorAll('.flat-workspace-left .flat-basics-group-title').forEach(function(el){ if (el.textContent.trim() === 'Entered details') el.textContent = 'Basics'; });
      document.querySelectorAll('.days-distribution-title').forEach(function(el){ el.textContent = 'distribution of days'; });
      document.querySelectorAll('.flat-workspace-position').forEach(function(pos){
        var left = pos.querySelector('.flat-workspace-left .flat-input-breakdown');
        var card = pos.querySelector('.flat-workspace-right .days-distribution-card, .flow-results .days-distribution-card');
        if (left && card) {
          var sections = left.querySelectorAll('.mi-cost-section');
          var firstSection = sections && sections[0] ? sections[0] : null;
          if (firstSection && firstSection.nextSibling) left.insertBefore(card, firstSection.nextSibling);
          else left.appendChild(card);
        }
      });
    } catch(_) {}
  }

  function wrapRenderFlatPosition(){
    var base = window.renderFlatPosition || (typeof renderFlatPosition === 'function' ? renderFlatPosition : null);
    if (!base || base.__miqActiveLayoutPatchV6) return;
    function wrapped(p, idx){
      var html = base.apply(this, arguments);
      var result = insertCalculatedDetails(html, p, idx);
      setTimeout(function(){ installStyle(); postProcessDom(); }, 0);
      return result;
    }
    wrapped.__miqActiveLayoutPatchV6 = true;
    window.renderFlatPosition = wrapped;
    try { renderFlatPosition = wrapped; } catch (_) {}
  }

  installStyle();
  wrapRenderFlatPosition();
  postProcessDom();
  window.addEventListener('resize', function(){ installStyle(); postProcessDom(); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ installStyle(); wrapRenderFlatPosition(); postProcessDom(); });
  } else {
    setTimeout(function(){ installStyle(); wrapRenderFlatPosition(); postProcessDom(); }, 0);
  }
})();


// ===== MarginIQ DOM refinement v7: visible position title, no Input heading, left-side distribution, output-like input cards =====
(function(){
  function patchMarginIqDomV7(){
    document.querySelectorAll('.flat-workspace-position').forEach(function(pos){
      var title = pos.querySelector('.flat-workspace-header h4');
      if (title) {
        title.style.setProperty('font-size','20px','important');
        title.style.setProperty('line-height','1.25','important');
        title.style.setProperty('font-weight','900','important');
        title.style.setProperty('color','#1A497F','important');
        title.style.setProperty('margin','0','important');
      }

      var left = pos.querySelector('.flat-workspace-left');
      var right = pos.querySelector('.flat-workspace-right');
      if (left) {
        left.style.setProperty('border','0','important');
        left.style.setProperty('background','transparent','important');
        left.style.setProperty('box-shadow','none','important');
        left.style.setProperty('padding','0','important');
        left.style.setProperty('overflow','visible','important');
        left.style.setProperty('max-height','none','important');
        var leftTitle = left.querySelector('.flat-workspace-panel-title');
        if (leftTitle) leftTitle.textContent = 'Inputs';
        left.querySelectorAll('.flat-subsection-head').forEach(function(el){ el.style.setProperty('display','none','important'); });
        left.querySelectorAll('.flat-basics-title').forEach(function(el){ el.style.setProperty('display','none','important'); });
        left.querySelectorAll('.flat-basics-group-title').forEach(function(el){ if (el.textContent.trim() === 'Entered details') el.textContent = 'Basics'; });
      }
      if (right) {
        var outTitle = right.querySelector('.flow-results > h3');
        if (outTitle) outTitle.textContent = 'Outputs';
        var calc = right.querySelector('.flat-calculated-output-panel');
        var flow = right.querySelector('.flow-results');
        if (calc && flow && outTitle && calc.previousElementSibling !== outTitle) {
          flow.insertBefore(calc, outTitle.nextSibling);
        }
      }
      if (left) {
        var days = pos.querySelector('.days-distribution-card');
        if (days && !left.contains(days)) {
          var inputBreakdown = left.querySelector('.flat-input-breakdown');
          if (inputBreakdown) left.insertBefore(days, inputBreakdown);
          else left.appendChild(days);
        }
        left.querySelectorAll('.days-distribution-title').forEach(function(el){ el.textContent = 'distribution of days'; });
      }
    });
  }

  window.patchMarginIqDomV7 = patchMarginIqDomV7;
  document.addEventListener('DOMContentLoaded', patchMarginIqDomV7);
  window.addEventListener('load', patchMarginIqDomV7);
  setTimeout(patchMarginIqDomV7, 0);
  setTimeout(patchMarginIqDomV7, 250);
  setTimeout(patchMarginIqDomV7, 1000);
  document.addEventListener('input', function(){ setTimeout(patchMarginIqDomV7, 0); }, true);
  document.addEventListener('change', function(){ setTimeout(patchMarginIqDomV7, 0); }, true);
  document.addEventListener('click', function(){ setTimeout(patchMarginIqDomV7, 0); }, true);
  try {
    var observer = new MutationObserver(function(){ patchMarginIqDomV7(); });
    observer.observe(document.getElementById('stepContent') || document.body, {childList:true, subtree:true});
  } catch(e) {}
})();


// ===== MarginIQ v8: make "Open position" buttons leave side panels and open the position editor =====
(function(){
  function leaveSidePanels(){
    try { window.showProjectStaffPanel = false; } catch(_) {}
    try { window.showLegalContractsPanel = false; } catch(_) {}
    try { window.showBudgetPanel = false; } catch(_) {}
    try { showBackstage = false; } catch(_) {}
    try { currentStep = 1; } catch(_) {}
  }

  function installOpenFlatFix(){
    var base = window.openFlat || (typeof openFlat === 'function' ? openFlat : null);
    if (!base || base.__miqOpenPositionFixV8) return;

    function fixedOpenFlat(idx){
      leaveSidePanels();
      var result;
      try {
        result = base.apply(this, arguments);
      } catch (e) {
        try { console.error('MarginIQ openFlat failed before v8 fallback', e); } catch(_) {}
      }
      leaveSidePanels();
      try {
        var nIdx = Number(idx);
        if (Array.isArray(flatRates)) {
          flatRates.forEach(function(p, i){ p._collapsed = i !== nIdx; });
        }
      } catch(_) {}
      try {
        if (typeof renderAll === 'function') renderAll();
        else if (typeof renderStep === 'function') renderStep();
      } catch (e) {
        try { console.error('MarginIQ openFlat v8 render fallback failed', e); } catch(_) {}
      }
      return result;
    }

    fixedOpenFlat.__miqOpenPositionFixV8 = true;
    window.openFlat = fixedOpenFlat;
    try { openFlat = fixedOpenFlat; } catch(_) {}
  }

  installOpenFlatFix();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installOpenFlatFix);
  }
  setTimeout(installOpenFlatFix, 0);
  setTimeout(installOpenFlatFix, 300);
  setTimeout(installOpenFlatFix, 1000);
})();


// ===== MarginIQ v9: robust Add position handler and global state compatibility =====
(function(){
  function exposeFlatRatesForLegacyPatches(){
    try {
      if (typeof flatRates === 'undefined') return;
      var currentDescriptor = Object.getOwnPropertyDescriptor(window, 'flatRates');
      if (currentDescriptor && currentDescriptor.__miqFlatRatesBridgeV9) return;
      var descriptor = {
        configurable: true,
        enumerable: false,
        get: function(){ return flatRates; },
        set: function(value){
          if (Array.isArray(value)) {
            flatRates.length = 0;
            value.forEach(function(item){ flatRates.push(item); });
          }
        }
      };
      descriptor.__miqFlatRatesBridgeV9 = true;
      Object.defineProperty(window, 'flatRates', descriptor);
    } catch (_) {}
  }

  function leaveSidePanelsForFlatRates(){
    try { window.showProjectStaffPanel = false; } catch(_) {}
    try { window.showLegalContractsPanel = false; } catch(_) {}
    try { window.showBudgetPanel = false; } catch(_) {}
    try { showBackstage = false; } catch(_) {}
    try { currentStep = 1; } catch(_) {}
  }

  function makeFlatRatePositionV9(){
    var position;
    if (typeof createFlatRatePosition === 'function') {
      position = createFlatRatePosition();
    } else {
      position = {};
    }
    try {
      if (typeof syncFlatRateDerivedBasicFields === 'function') {
        position = syncFlatRateDerivedBasicFields(position);
      }
    } catch (_) {}
    position._collapsed = false;
    position._saved = false;
    position._dirty = true;
    return position;
  }

  function renderFlatRatesNow(){
    try {
      if (typeof renderAll === 'function') { renderAll(); return; }
    } catch (e) {
      try { console.error('MarginIQ add position renderAll failed', e); } catch(_) {}
    }
    try {
      if (typeof renderStep === 'function') { renderStep(); return; }
    } catch (e2) {
      try { console.error('MarginIQ add position renderStep failed', e2); } catch(_) {}
    }
  }

  function robustAddFlatPosition(){
    exposeFlatRatesForLegacyPatches();
    leaveSidePanelsForFlatRates();
    try {
      if (!Array.isArray(flatRates)) return;
      flatRates.forEach(function(p){ if (p) p._collapsed = true; });
      flatRates.push(makeFlatRatePositionV9());
      renderFlatRatesNow();
    } catch (e) {
      try { console.error('MarginIQ add position failed', e); } catch(_) {}
      alert('Add position could not run. Please refresh the page and try again.');
    }
  }

  function installAddFlatFix(){
    exposeFlatRatesForLegacyPatches();
    robustAddFlatPosition.__miqAddPositionFixV9 = true;
    window.addFlat = robustAddFlatPosition;
    try { addFlat = robustAddFlatPosition; } catch(_) {}
  }

  function isAddPositionButton(target){
    var button = target && target.closest ? target.closest('button') : null;
    if (!button) return false;
    if (button.id === 'addFlatRateBtn') return true;
    if (button.classList && button.classList.contains('add-position-btn') && /add position/i.test(button.textContent || '')) return true;
    var onclick = button.getAttribute && button.getAttribute('onclick');
    return !!(onclick && /addFlat\s*\(/.test(onclick));
  }

  installAddFlatFix();
  document.addEventListener('click', function(event){
    if (!isAddPositionButton(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    installAddFlatFix();
    window.addFlat();
  }, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installAddFlatFix);
  }
  setTimeout(installAddFlatFix, 0);
  setTimeout(installAddFlatFix, 300);
  setTimeout(installAddFlatFix, 1000);
})();
