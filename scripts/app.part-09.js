// ===== Extracted script block 09 from original HTML =====
(function(){
  function moneySafe(value){
    if (typeof money === 'function') return money(value || 0);
    var n = Number(value || 0);
    return '€ ' + n.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2});
  }
  function plain(value){
    if (typeof formatPlainNumber === 'function') return formatPlainNumber(value);
    return (value == null || value === '') ? '' : String(value);
  }
  function escAttr(value){
    return String(value == null ? '' : value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function inputCell(label, p, idx, field, rowLabel, placeholder){
    return '<div class="mi-cost-field"><label>' + label + '</label><input type="text" inputmode="decimal" class="flat-input formatted-number-input" data-idx="' + idx + '" data-field="' + field + '" value="' + escAttr(plain(p[field])) + '" placeholder="' + placeholder + '" aria-label="' + label + ' for ' + escAttr(rowLabel) + '"></div>';
  }
  function amountCell(idx, key, amount, isPercent){
    return '<div class="mi-cost-total-cell"><div class="mi-cost-total-label">Total</div><div class="mi-cost-total" id="component-total-' + idx + '-' + key + '">' + (isPercent ? escAttr(plain(amount)) + '%' : moneySafe(amount)) + '</div></div>';
  }
  function normalRow(row, p, idx, number){
    return '<div class="mi-cost-row">' +
      '<div class="mi-cost-label-cell"><span class="mi-cost-index">' + number + '</span><div class="mi-cost-name">' + row.label + '</div></div>' +
      inputCell('Qty', p, idx, row.qtyField, row.label, '0') +
      inputCell('Rate', p, idx, row.rateField, row.label, '0.00') +
      amountCell(idx, row.key, row.total, false) +
    '</div>';
  }
  function percentRow(row, p, idx, number){
    return '<div class="mi-cost-row mi-cost-percent-row">' +
      '<div class="mi-cost-label-cell"><span class="mi-cost-index">' + number + '</span><div class="mi-cost-name">' + row.label + '</div></div>' +
      '<div class="mi-cost-field"><label>Rate</label><div class="mi-rate-wrap"><input type="text" inputmode="decimal" class="flat-input formatted-number-input" data-idx="' + idx + '" data-field="' + row.rateField + '" value="' + escAttr(plain(p[row.rateField])) + '" placeholder="0" aria-label="Rate for ' + escAttr(row.label) + '"><span class="mi-rate-suffix">%</span></div></div>' +
      amountCell(idx, row.key, row.total, true) +
    '</div>';
  }
  function sectionHtml(section, p, idx){
    var rows = section.rows.map(function(row, i){ return row.special === 'percent' ? percentRow(row, p, idx, i + 1) : normalRow(row, p, idx, i + 1); }).join('');
    var total = section.totalValue == null ? '' : '<div class="mi-cost-section-total"><div class="mi-cost-section-total-name">Section total</div><div class="mi-cost-section-total-value">' + moneySafe(section.totalValue) + '</div></div>';
    return '<section class="mi-cost-section"><div class="mi-cost-section-head"><h4 class="mi-cost-section-title">' + section.title + '</h4></div><div class="mi-cost-rows">' + rows + '</div>' + total + '</section>';
  }
  window.renderSmartComponentRows = function(p, c, idx){
    var sections = [
      { title:'Provider remuneration', totalValue:c.remunerationTotal || 0, rows:[
        { key:'fee', label:'Base fee', rateField:'feeRate', qtyField:'feeQty', total:c.fee },
        { key:'perDiem', label:'Per diems', rateField:'perDiemRate', qtyField:'perDiemQty', total:c.perDiem },
        { key:'other', label:'Other remuneration', rateField:'otherRate', qtyField:'otherQty', total:c.other }
      ]},
      { title:'Non-remuneration costs', totalValue:c.nonRemunerationTotal || 0, rows:[
        { key:'housing', label:'Short-term accommodation', rateField:'housingRate', qtyField:'housingQty', total:c.housing },
        { key:'insurance', label:'Insurance', rateField:'insuranceRate', qtyField:'insuranceQty', total:c.insurance },
        { key:'transport', label:'Travel costs', rateField:'transportRate', qtyField:'transportQty', total:c.transport },
        { key:'otherCost', label:'Other costs', rateField:'otherCostRate', qtyField:'otherCostQty', total:c.otherCost }
      ]},
      { title:'Margin', totalValue:null, rows:[
        { key:'marginRate', label:'Margin rate', rateField:'marginRate', total:(c.marginRateDecimal || 0) * 100, special:'percent' }
      ]}
    ];
    return '<div class="flat-subsection-head"><h4 class="flat-subsection-title">Input</h4></div><div class="component-breakdown flat-input-breakdown mi-cost-breakdown">' + sections.map(function(section){ return sectionHtml(section, p, idx); }).join('') + '</div>';
  };
  try { renderSmartComponentRows = window.renderSmartComponentRows; } catch(e) {}
})();
