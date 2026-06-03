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
