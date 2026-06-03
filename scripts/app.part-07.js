// ===== Extracted script block 07 from original HTML =====
(function(){
  function htmlEscape(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function flagForCountry(value){
    if (window.marginIqCountryFlagMarkup) return window.marginIqCountryFlagMarkup(value || '');
    return '<span class="country-flag-fallback">•</span>';
  }
  function countryInputHtml(opts){
    opts = opts || {};
    var value = opts.value || '';
    var attrs = opts.attrs || '';
    var inputAttrs = opts.inputAttrs || '';
    return '<div class="country-autocomplete-field flat-country-field"><span class="country-selected-flag">' + flagForCountry(value) + '</span><input ' + attrs + ' value="' + htmlEscape(value) + '" class="flat-input ' + (opts.extraClass || '') + '" data-flat-country-autocomplete="true" list="countryOptions" autocomplete="off" ' + inputAttrs + '></div>';
  }
  function basicGroup(title, body, extraClass){
    return '<section class="flat-basics-group ' + (extraClass || '') + '"><div class="flat-basics-group-head"><h5 class="flat-basics-group-title">' + title + '</h5></div><div class="flat-basics-grid">' + body + '</div></section>';
  }
  window.renderPositionDetails = function(p, idx){
    var entered = '';
    entered += field('Position title', '<input data-idx="' + idx + '" data-field="title" value="' + esc(p.title) + '" class="flat-input" placeholder="Write position title">');
    entered += field('Name', '<input data-idx="' + idx + '" data-field="name" value="' + esc(p.name || '') + '" class="flat-input" placeholder="Write name">');
    entered += field('Country of residence', countryInputHtml({ value:p.countryOfResidence || '', attrs:'data-idx="' + idx + '" data-field="countryOfResidence"', inputAttrs:'placeholder="Select or type a country"' }));
    entered += field('Contract classification', '<select data-idx="' + idx + '" data-field="classification" class="flat-input"><option value="" ' + (!p.classification ? 'selected' : '') + '>Select contract classification</option>' + POSITION_CLASSIFICATIONS.map(function(v){ return '<option value="' + esc(v) + '" ' + (v === p.classification ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>');
    entered += field('Provider type', '<select data-idx="' + idx + '" data-field="contractualType" class="flat-input"><option value="" ' + (!p.contractualType ? 'selected' : '') + '>Select provider type</option>' + CONTRACTUAL_TYPES.map(function(v){ return '<option value="' + esc(v) + '" ' + (v === p.contractualType ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>');
    entered += field('Input mode', '<div><select data-idx="' + idx + '" data-field="inputMode" class="flat-input">' + INPUT_MODES.map(function(v){ return '<option ' + (v === p.inputMode ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>' + ((p.inputMode && String(p.inputMode).toLowerCase() !== 'gross') ? '<div class="inline-warning">It is recommendable to always negotiate gross. Continue only if you are sure.</div>' : '') + '</div>');

    var computedEntity = '<div class="ce-overwrite-wrap ' + (hasContractingEntityOverwrite(p) ? 'is-overwritten' : '') + '"><div class="ce-overwrite-top"><div class="ce-input-with-gear"><input id="computed-contracting-entity-' + idx + '" value="' + esc(getEffectiveContractingEntity(p)) + '" class="flat-input ce-overwrite-input" placeholder="Computed from implementation mode and residence" readonly><button type="button" class="ce-gear-btn" onclick="handleContractingEntityGearClick(' + idx + ')" title="Overwrite" aria-label="Overwrite">⚙</button></div></div>' +
      (hasContractingEntityOverwrite(p)
        ? '<div class="ce-overwrite-meta"><span class="ce-overwrite-badge">Overwritten</span><div class="ce-overwrite-note">Auto: <strong>' + esc(getAutoContractingEntity(p) || '—') + '</strong> → Current: <strong>' + esc(getEffectiveContractingEntity(p) || '—') + '</strong></div><div class="ce-overwrite-note">Reason: ' + esc(p.contractingEntityOverwriteReasonCode || '—') + '</div><div class="ce-overwrite-actions"><button type="button" class="small secondary" onclick="resetContractingEntityOverwrite(' + idx + ')">Reset to automatic</button></div></div>'
        : '<div class="mini-note">Assigned automatically from implementation mode and residence.</div>') + '</div>';

    var calculated = '';
    calculated += field('ITR country', countryInputHtml({ value:getImplementationCountryForPosition(), attrs:'id="computed-ITR-country-' + idx + '"', extraClass:'auto-derived-select', inputAttrs:'placeholder="From backstage ITR country" readonly' }));
    calculated += field('Tax status', '<input id="computed-tax-status-' + idx + '" value="' + esc(derivedCalculationValue(deriveTaxStatus(p))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveTaxStatus(p)) + '" placeholder="Pending calculation" readonly>');
    calculated += field('Contracting entity', computedEntity);
    calculated += field('VAT jurisdiction', '<input id="computed-vat-jurisdiction-' + idx + '" value="' + esc(derivedCalculationValue(displayVatJurisdiction(deriveVatJurisdiction(p)))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveVatJurisdiction(p)) + '" placeholder="Pending calculation" readonly>');

    return '<div class="details-panel flat-basics-panel"><div class="flat-basics-head"><h4 class="flat-basics-title">Basics</h4></div><div class="flat-basics-body">' + basicGroup('Entered details', entered, 'flat-basics-entered') + '</div></div>';
  };

  function norm(value){ return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function countryList(){
    var dl = document.getElementById('countryOptions');
    if (!dl) return [];
    return Array.from(dl.querySelectorAll('option')).map(function(o){ return String(o.value || '').trim(); }).filter(Boolean);
  }
  function ensureDropdown(input){
    var wrap = input.closest('.country-autocomplete-field');
    if (!wrap) return null;
    var selectedFlag = wrap.querySelector('.country-selected-flag');
    if (!selectedFlag) {
      selectedFlag = document.createElement('span');
      selectedFlag.className = 'country-selected-flag';
      wrap.insertBefore(selectedFlag, input);
    }
    selectedFlag.innerHTML = input.value ? flagForCountry(input.value) : '<span class="country-flag-fallback">•</span>';
    var dd = wrap.querySelector('.country-suggest-dropdown');
    if (!dd) {
      dd = document.createElement('div');
      dd.className = 'country-suggest-dropdown';
      dd.hidden = true;
      wrap.appendChild(dd);
    }
    return {wrap:wrap, dd:dd};
  }
  function matches(query){
    var q = norm(query);
    var all = countryList();
    if (!q) return all.slice(0, 14);
    return all.filter(function(c){ return norm(c).startsWith(q); }).concat(all.filter(function(c){ return !norm(c).startsWith(q) && norm(c).indexOf(q) !== -1; })).slice(0, 14);
  }
  function show(input){
    if (!input || input.readOnly || input.disabled) return;
    var parts = ensureDropdown(input); if (!parts) return;
    var list = matches(input.value);
    parts.dd.innerHTML = list.length ? list.map(function(name, i){ return '<button type="button" class="country-suggest-option' + (i === 0 ? ' is-active' : '') + '" data-country-value="' + htmlEscape(name) + '"><span class="country-suggest-flag">' + flagForCountry(name) + '</span><span class="country-suggest-name">' + htmlEscape(name) + '</span></button>'; }).join('') : '<div class="country-suggest-empty">No matching country</div>';
    parts.dd.hidden = false;
  }
  function hide(input){
    var wrap = input && input.closest('.country-autocomplete-field');
    var dd = wrap && wrap.querySelector('.country-suggest-dropdown');
    if (dd) dd.hidden = true;
    if (input) ensureDropdown(input);
  }
  function select(input, value){
    input.value = value;
    ensureDropdown(input);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.dispatchEvent(new Event('change', {bubbles:true}));
    hide(input);
  }
  document.addEventListener('focusin', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (input) show(input);
  });
  document.addEventListener('input', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (input) show(input);
  });
  document.addEventListener('click', function(e){
    var opt = e.target.closest && e.target.closest('.flat-basics-panel .country-suggest-option');
    if (opt) {
      var wrap = opt.closest('.country-autocomplete-field');
      var input = wrap && wrap.querySelector('[data-flat-country-autocomplete]');
      if (input) select(input, opt.dataset.countryValue || opt.textContent.trim());
      return;
    }
    document.querySelectorAll('.flat-basics-panel [data-flat-country-autocomplete]').forEach(function(input){
      var wrap = input.closest('.country-autocomplete-field');
      if (wrap && !wrap.contains(e.target)) hide(input);
    });
  });
  document.addEventListener('keydown', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (!input) return;
    var parts = ensureDropdown(input); if (!parts) return;
    var options = Array.from(parts.dd.querySelectorAll('.country-suggest-option'));
    if (e.key === 'Escape') { hide(input); return; }
    if (!options.length) return;
    var current = Math.max(0, options.findIndex(function(o){ return o.classList.contains('is-active'); }));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var next = e.key === 'ArrowDown' ? Math.min(options.length - 1, current + 1) : Math.max(0, current - 1);
      options.forEach(function(o){ o.classList.remove('is-active'); });
      options[next].classList.add('is-active');
      options[next].scrollIntoView({block:'nearest'});
    }
    if (e.key === 'Enter' && !parts.dd.hidden) {
      e.preventDefault();
      var active = options.find(function(o){ return o.classList.contains('is-active'); }) || options[0];
      if (active) select(input, active.dataset.countryValue || active.textContent.trim());
    }
  });
  function refreshFlatCountryFlags(){
    document.querySelectorAll('.flat-basics-panel [data-flat-country-autocomplete]').forEach(function(input){ ensureDropdown(input); });
  }
  var oldUpdate = window.updateFlatPositionCalculatedOutputs;
  if (typeof oldUpdate === 'function') {
    window.updateFlatPositionCalculatedOutputs = function(idx){
      oldUpdate(idx);
      refreshFlatCountryFlags();
    };
  }
  var oldRenderAll = window.renderAll;
  if (typeof oldRenderAll === 'function') {
    window.renderAll = function(){
      var result = oldRenderAll.apply(this, arguments);
      setTimeout(refreshFlatCountryFlags, 0);
      return result;
    };
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshFlatCountryFlags, {once:true});
  } else {
    setTimeout(refreshFlatCountryFlags, 0);
  }
})();
