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


// ===== MarginIQ active layout patch: Output Calculated details + input headers =====
(function(){
  function installStyle(){
    var id = 'marginiq-active-layout-patch-v4';
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
      }
      #stepContent .flat-workspace-right,
      .flat-workspace-right { overflow: visible !important; }
      .flat-workspace-left .mi-cost-field label,
      .flat-workspace-left .mi-cost-total-label,
      .flat-workspace-left .component-field-label,
      .flat-workspace-left .component-mobile-label { display: none !important; }
      .mi-cost-column-head {
        display: grid !important;
        grid-template-columns: minmax(220px,1fr) minmax(116px,150px) minmax(116px,150px) minmax(128px,170px) !important;
        gap: 14px !important;
        padding: 10px 18px 8px !important;
        border-bottom: 1px solid #eef2f7 !important;
        background: #fbfdff !important;
        color: #64748b !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        font-weight: 900 !important;
      }
      .mi-cost-column-head > div { text-align: right !important; }
      .mi-cost-column-head > div:first-child { text-align: left !important; }
      .mi-cost-column-head-percent {
        grid-template-columns: minmax(220px,1fr) minmax(116px,150px) minmax(128px,170px) !important;
      }
      .flat-workspace-right .flat-calculated-output-panel {
        margin: 0 0 14px 0 !important;
      }
      @media (max-width:760px){
        .mi-cost-column-head { display:none !important; }
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
      if (html.indexOf('flat-calculated-output-panel') !== -1) return html;
      if (typeof window.calculatedDetailsBlock !== 'function') return html;
      var block = window.calculatedDetailsBlock(p || {}, idx || 0);
      var marker = '<div class="flow-results"><h3>Output</h3>';
      if (html.indexOf(marker) !== -1) return html.replace(marker, marker + block);
      var marker2 = '<div class="flow-results"><h3>Output</h3';
      var at = html.indexOf(marker2);
      if (at === -1) return html;
      var close = html.indexOf('</h3>', at);
      if (close === -1) return html;
      return html.slice(0, close + 5) + block + html.slice(close + 5);
    } catch (_) { return html; }
  }

  function wrapRenderFlatPosition(){
    var base = window.renderFlatPosition || (typeof renderFlatPosition === 'function' ? renderFlatPosition : null);
    if (!base || base.__miqActiveLayoutPatchV4) return;
    function wrapped(p, idx){
      var html = base.apply(this, arguments);
      return insertCalculatedDetails(html, p, idx);
    }
    wrapped.__miqActiveLayoutPatchV4 = true;
    window.renderFlatPosition = wrapped;
    try { renderFlatPosition = wrapped; } catch (_) {}
  }

  installStyle();
  wrapRenderFlatPosition();
  window.addEventListener('resize', installStyle);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ installStyle(); wrapRenderFlatPosition(); });
  } else {
    setTimeout(function(){ installStyle(); wrapRenderFlatPosition(); }, 0);
  }
})();
