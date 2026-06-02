// ===== Extracted script block 08 from original HTML =====
(function(){
  function toCurrencyBefore(value){
    var n = Number(value);
    if (!Number.isFinite(n)) n = 0;
    return '€ ' + new Intl.NumberFormat('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  }
  window.money = toCurrencyBefore;
  try { money = toCurrencyBefore; } catch(_) {}
})();
