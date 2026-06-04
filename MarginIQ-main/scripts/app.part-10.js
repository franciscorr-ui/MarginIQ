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
