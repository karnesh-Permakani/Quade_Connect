'use strict';
/* =====================================================================
   QuadeConnect PM — app.js
   Completes the remaining interactive modules:
   1. renderDocs: Sheets & Shop Drawings Grid, Multi-Slide PDF Viewer,
      Revision History, Version Sets, Mockup Packages, Publish Log.
   2. renderFiles: AWS S3 / Box Cloud Explorer, Categories, Direct Upload.
   3. renderQC: Internal Quality Control Queue, Checklists, PDF Redlines.
   4. renderSubmittals: Submittal Packages, Transmittals, Ball-in-Court.
   ===================================================================== */

/* ---------- SHEETS & SHOP DRAWINGS (DOCS) ---------- */
function renderDocs(p, ch, type, docId) {
  const isShop = type === 'shop';
  const list = isShop ? ch.shop : ch.sheets;
  const filtered = isClient() ? list.filter(d => d.published) : list;

  if (docId) {
    const docItem = list.find(d => d.id === docId);
    if (!docItem) {
      $('#tabBody').innerHTML = `<div class="denied">Document not found. <a href="#/project/${p.no}/${type}">Back to ${isShop ? 'Shop Drawings' : 'Sheets'}</a></div>`;
      return;
    }
    return renderDocViewer(p, ch, type, docItem);
  }

  // Grid of Documents
  const pendingPublish = list.filter(d => !d.published).length;
  const actions = `
    <div class="actions">
      ${canEditDocs() ? `<button class="btn orange" onclick="openUploadDoc('${p.no}','${type}')">☁ Upload & Process New ${isShop ? 'Shop Drawings' : 'Sheets'}</button>` : ''}
      ${canEditDocs() ? `<button class="btn ghost" onclick="openManageVersions('${p.no}','${type}')">Manage Versions</button>` : ''}
      ${canManage() ? `<button class="btn ghost" onclick="openPublishLog('${p.no}','${type}')">Publish Log (${pendingPublish}/${list.length})</button>` : ''}
    </div>`;

  const rows = filtered.map(d => {
    const curVer = d.versions[d.current] || d.versions[0];
    const wo = isShop && d.woId ? ch.workOrders.find(w => w.id === d.woId) : null;
    return `
      <tr>
        <td><b><a href="#/project/${p.no}/${type}/${d.id}">${esc(d.number)}</a></b></td>
        <td><a href="#/project/${p.no}/${type}/${d.id}">${esc(d.name)}</a></td>
        <td><span class="badge b-blue">${esc(curVer.name)}</span></td>
        <td>${fmtDate(curVer.issue)}</td>
        ${isShop ? `<td>${wo ? `<a href="#/project/${p.no}/workorders">${esc(wo.no)}</a>` : '—'}</td>` : ''}
        <td>
          <span class="sigma" title="${curVer.pages} Slides/Pages in PDF">Σ${curVer.pages}</span>
          ${d.markups ? '<span title="Pinned Markups">📌</span>' : ''}
          ${d.versions.length > 1 ? `<span class="revs">${d.versions.length} Revs</span>` : ''}
        </td>
        <td>${esc(curVer.uploaded)}</td>
        <td>${esc(curVer.by)}</td>
        ${isShop ? `<td><span class="badge ${d.qcStatus === 'QC Approved' ? 'b-green' : d.qcStatus === 'Rejected' ? 'b-red' : 'b-amber'}">${esc(d.qcStatus || 'Pending')}</span></td>` : ''}
        <td><span class="badge ${d.published ? 'b-green' : 'b-gray'}">${d.published ? 'Published' : 'Draft'}</span></td>
      </tr>`;
  }).join('');

  $('#tabBody').innerHTML = `
    ${actions}
    <div class="table-wrap">
      <table class="grid">
        <thead>
          <tr>
            <th>${isShop ? 'Shop Drawing Number' : 'Sheet Number'}</th>
            <th>${isShop ? 'Shop Drawing Name' : 'Sheet Name'}</th>
            <th>Version</th>
            <th>Issue Date</th>
            ${isShop ? '<th>Work Orders</th>' : ''}
            <th>${isShop ? 'Shop Drawing Info' : 'Sheet Info'}</th>
            <th>Upload Date</th>
            <th>Uploaded By</th>
            ${isShop ? '<th>QC Status</th>' : ''}
            <th>Publish Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="${isShop ? 10 : 8}" style="text-align:center;padding:20px;color:#6b7280">No ${isShop ? 'shop drawings' : 'sheets'} available.</td></tr>`}
        </tbody>
      </table>
    </div>
    <p class="hint">Click any number or name to open the split-pane Multi-Slide PDF Viewer with full revision history, slide navigation, and markup tools.</p>`;
}

/* ---------- SINGLE DOCUMENT SPLIT-PANE VIEWER ---------- */
function renderDocViewer(p, ch, type, item) {
  const isShop = type === 'shop';
  const verIdx = ui.viewVer !== undefined && ui.viewVer < item.versions.length ? ui.viewVer : item.current;
  const ver = item.versions[verIdx] || item.versions[0];
  const totalSlides = ver.pages || 1;
  const curSlide = Math.min(ui.slide || 0, totalSlides - 1);

  // SVG Mock Architectural / Millwork Slide
  const svgSlide = generateSlideSVG(item, ver, curSlide, totalSlides, isShop);

  $('#tabBody').innerHTML = `
    <div class="actions">
      <a class="btn ghost small" href="#/project/${p.no}/${type}">‹ Back to ${isShop ? 'Shop Drawings' : 'Sheets'} Grid</a>
      <span class="spacer"></span>
      <button class="btn small ${ui.compare ? 'orange' : 'ghost'}" onclick="toggleCompare('${p.no}','${type}','${item.id}')">
        ${ui.compare ? 'Exit Comparison' : '⇄ Compare Revisions'}
      </button>
      <button class="btn small ghost" onclick="downloadCurrentDoc('${item.number}','${ver.name}')">⤓ Download PDF</button>
    </div>

    <div class="docview">
      <!-- Left Panel: Metadata & Revision History -->
      <div class="docmeta panel">
        <label>${isShop ? 'Shop Drawing Number *' : 'Sheet Number *'}</label>
        <input id="dmNumber" value="${esc(item.number)}" ${canEditDocs() ? '' : 'disabled'}>

        <label>${isShop ? 'Shop Drawing Name' : 'Sheet Name'}</label>
        <input id="dmName" value="${esc(item.name)}" ${canEditDocs() ? '' : 'disabled'}>

        <label>Version Set *</label>
        <select id="dmVersion" onchange="changeDocVersion('${p.no}','${type}','${item.id}',this.value)">
          ${item.versions.map((v, i) => `<option value="${i}" ${i === verIdx ? 'selected' : ''}>${esc(v.name)} (${fmtDate(v.issue)})</option>`).join('')}
        </select>

        ${isShop ? `
          <label>Linked Work Order</label>
          <select id="dmWo" ${canEditDocs() ? '' : 'disabled'}>
            <option value="">— None —</option>
            ${ch.workOrders.map(w => `<option value="${w.id}" ${w.id === item.woId ? 'selected' : ''}>${w.no} - ${esc(w.name)}</option>`).join('')}
          </select>
        ` : ''}

        <label>Tags</label>
        <input id="dmTags" value="${esc((item.tags || []).join(', '))}" ${canEditDocs() ? '' : 'disabled'}>

        ${canEditDocs() ? `<button class="btn primary small" style="margin-top:10px" onclick="saveDocMetadata('${p.no}','${type}','${item.id}')">Save Changes</button>` : ''}

        <!-- Bottom-Left Revision History Timeline -->
        <div class="revlist">
          <h4>Revision History</h4>
          ${item.versions.map((v, i) => `
            <div class="rev ${i === verIdx ? 'viewing' : ''}" onclick="changeDocVersion('${p.no}','${type}','${item.id}',${i})">
              <div class="rname">${esc(v.name)} ${i === verIdx ? '<span style="color:#ea580c;font-size:10px">(now viewing)</span>' : ''}</div>
              <div class="rsub">Issued: ${fmtDate(v.issue)} · ${v.pages} slides · by ${esc(v.by)}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Right Panel: PDF Viewer Canvas & Carousel -->
      <div class="viewer">
        <div class="vtop">
          <b>${esc(item.number)} - ${esc(item.name)}</b>
          <span class="badge b-blue">${esc(ver.name)}</span>
          <span class="sigma">Slide ${curSlide + 1} of ${totalSlides}</span>
          <span class="spacer"></span>
          <button class="btn ghost small" onclick="zoomDoc(-0.2)">−</button>
          <span>${Math.round((ui.zoom || 1) * 100)}%</span>
          <button class="btn ghost small" onclick="zoomDoc(0.2)">+</button>
          <button class="btn ghost small" onclick="openAddMarkupModal('${p.no}','${type}','${item.id}')">✎ Add Markup / Pin</button>
        </div>

        ${ui.compare ? renderCompareSplit(item, verIdx) : `
          <div class="vmain">
            <button class="vnav" onclick="navSlide(-1,${totalSlides})" ${curSlide === 0 ? 'disabled' : ''}>‹</button>
            <div class="vstage" id="pdfStage">
              <div style="transform:scale(${ui.zoom || 1});transition:transform .15s ease">
                ${svgSlide}
              </div>
            </div>
            <button class="vnav" onclick="navSlide(1,${totalSlides})" ${curSlide >= totalSlides - 1 ? 'disabled' : ''}>›</button>
          </div>
          <!-- Thumbnail Strip Carousel -->
          <div class="thumbs">
            ${Array.from({ length: totalSlides }, (_, idx) => `
              <div class="th ${idx === curSlide ? 'active' : ''}" onclick="jumpSlide(${idx})">
                <div class="pg">Slide ${idx + 1}</div>
                <div>${idx === 0 ? 'Cover/Plan' : 'Detail ' + idx}</div>
              </div>`).join('')}
          </div>
        `}
      </div>
    </div>`;
}

function generateSlideSVG(item, ver, slideIdx, total, isShop) {
  const w = 680, h = 480;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="cad-svg-canvas" style="background:var(--surface,#070d18);border:1px solid var(--blue,#00f5ff);box-shadow:var(--accent-glow, 0 0 20px rgba(0,245,255,0.35));border-radius:6px">
      <!-- Outer Border & Title Block Grid -->
      <rect x="15" y="15" width="${w-30}" height="${h-30}" fill="var(--surface-alt,#0c172a)" stroke="var(--blue,#00f5ff)" stroke-width="1.8"/>
      <rect x="${w-220}" y="${h-110}" width="205" height="95" fill="var(--surface,#070d18)" stroke="var(--blue,#00f5ff)" stroke-width="1.2"/>
      
      <!-- Architectural Title Block Details -->
      <text x="${w-210}" y="${h-90}" font-family="Segoe UI, sans-serif" font-size="11" font-weight="bold" fill="var(--blue,#00f5ff)">QUADECONNECT MILLWORK</text>
      <text x="${w-210}" y="${h-75}" font-family="Segoe UI, sans-serif" font-size="8.5" fill="var(--text-muted,#7dd3fc)">PROJECT: ${esc(item.name)}</text>
      <text x="${w-210}" y="${h-60}" font-family="Segoe UI, sans-serif" font-size="8.5" fill="var(--text-muted,#7dd3fc)">SHEET NO: <tspan font-weight="bold" fill="var(--blue,#00f5ff)">${esc(item.number)}</tspan></text>
      <text x="${w-210}" y="${h-45}" font-family="Segoe UI, sans-serif" font-size="8.5" fill="var(--text-muted,#7dd3fc)">VERSION: ${esc(ver.name)}</text>
      <text x="${w-210}" y="${h-30}" font-family="Segoe UI, sans-serif" font-size="8" fill="var(--text-muted,#7dd3fc)">ISSUE: ${fmtDate(ver.issue)} | SLIDE ${slideIdx + 1}/${total}</text>

      <!-- Architectural Drawing Mock Graphic -->
      <g stroke="var(--blue,#00f5ff)" stroke-width="1.2" fill="none">
        ${isShop ? `
          <!-- Millwork Casework Section & Joinery Mockup -->
          <rect x="45" y="60" width="220" height="240" fill="var(--surface,#070d18)" stroke="var(--blue,#00f5ff)" stroke-width="1.5"/>
          <line x1="45" y1="120" x2="265" y2="120" stroke-dasharray="4" stroke="var(--text-muted,#7dd3fc)"/>
          <line x1="45" y1="180" x2="265" y2="180" stroke="var(--text-muted,#7dd3fc)"/>
          <line x1="155" y1="60" x2="155" y2="300" stroke="var(--text-muted,#7dd3fc)"/>
          <!-- Countertop Detail -->
          <rect x="40" y="50" width="230" height="15" fill="var(--surface-alt,#0c172a)" stroke="var(--blue,#00f5ff)" stroke-width="1.5"/>
          <text x="60" y="42" font-family="monospace" font-size="9" fill="var(--blue,#00f5ff)">SOLID SURFACE COUNTERTOP (3/4" THK)</text>
          
          <!-- Elevation & Hardware Annotations -->
          <circle cx="100" cy="90" r="4" fill="var(--blue,#00f5ff)"/>
          <circle cx="210" cy="90" r="4" fill="var(--blue,#00f5ff)"/>
          <text x="100" y="240" font-family="monospace" font-size="9" fill="var(--text-muted,#7dd3fc)">BLUM SOFT-CLOSE HINGES (PAIR)</text>
          
          <!-- Detail View callout on slide 2+ -->
          ${slideIdx > 0 ? `
            <rect x="310" y="60" width="280" height="260" fill="var(--surface-alt,#0c172a)" stroke="var(--orange,#ff007f)" stroke-width="1.5"/>
            <text x="325" y="85" font-family="Segoe UI" font-weight="bold" font-size="11" fill="var(--orange,#ff007f)">ENLARGED JOINERY SECTION (SLIDE ${slideIdx + 1})</text>
            <path d="M 330 110 L 450 110 L 450 200 L 410 200 L 410 240 L 330 240 Z" fill="rgba(255,0,127,0.15)" stroke="var(--orange,#ff007f)" stroke-width="1.5"/>
            <text x="340" y="160" font-family="monospace" font-size="8.5" fill="var(--orange,#ff007f)">3/4" VENEER CORE PLYWOOD</text>
          ` : `
            <!-- Floor Plan Layout -->
            <rect x="310" y="60" width="280" height="240" fill="var(--surface,#070d18)" stroke="var(--border,#132742)"/>
            <text x="330" y="85" font-family="Segoe UI" font-size="10" font-weight="bold" fill="var(--text-muted,#7dd3fc)">PLAN VIEW - RECEPTION / RESTROOM</text>
            <circle cx="450" cy="180" r="45" fill="none" stroke="var(--blue,#00f5ff)" stroke-dasharray="3"/>
          `}
        ` : `
          <!-- Master Architectural Plan Sheet (G0.00 / G0.02) -->
          <rect x="40" y="50" width="360" height="360" fill="var(--surface,#070d18)" stroke="var(--blue,#00f5ff)"/>
          <line x1="40" y1="170" x2="400" y2="170" stroke="var(--border,#132742)"/>
          <line x1="220" y1="50" x2="220" y2="410" stroke="var(--border,#132742)"/>
          <text x="60" y="80" font-family="Segoe UI" font-size="11" font-weight="bold" fill="var(--blue,#00f5ff)">ARCHITECTURAL CODE &amp; LIFE SAFETY</text>
          <text x="60" y="105" font-family="monospace" font-size="8.5" fill="var(--text-muted,#7dd3fc)">AWI PREMIUM GRADE SPECIFICATION 06 41 00</text>
          <text x="60" y="125" font-family="monospace" font-size="8.5" fill="var(--text-muted,#7dd3fc)">FIRE RATING: CLASS A FLAME SPREAD RATED</text>
          <rect x="430" y="50" width="180" height="240" fill="var(--surface-alt,#0c172a)" stroke="var(--blue,#00f5ff)"/>
          <text x="445" y="75" font-family="Segoe UI" font-size="9.5" font-weight="bold" fill="var(--blue,#00f5ff)">GENERAL NOTES</text>
          <text x="445" y="95" font-family="Segoe UI" font-size="8" fill="var(--text-muted,#7dd3fc)">1. VERIFY ALL DIMENSIONS ON SITE</text>
          <text x="445" y="115" font-family="Segoe UI" font-size="8" fill="var(--text-muted,#7dd3fc)">2. COORDINATE MEP BLOCKING</text>
        `}
      </g>
    </svg>`;
}

function renderCompareSplit(item, curVerIdx) {
  const prevVerIdx = curVerIdx > 0 ? curVerIdx - 1 : Math.min(1, item.versions.length - 1);
  const curVer = item.versions[curVerIdx];
  const prevVer = item.versions[prevVerIdx];
  return `
    <div class="vcompare">
      <div>
        <div class="cap" style="color:#b91c1c">Previous: ${esc(prevVer.name)} (${fmtDate(prevVer.issue)})</div>
        <div class="vstage">${generateSlideSVG(item, prevVer, 0, prevVer.pages, true)}</div>
      </div>
      <div>
        <div class="cap" style="color:#15803d">Current: ${esc(curVer.name)} (${fmtDate(curVer.issue)})</div>
        <div class="vstage">${generateSlideSVG(item, curVer, 0, curVer.pages, true)}</div>
      </div>
    </div>`;
}

function toggleCompare(no, type, id) {
  ui.compare = !ui.compare;
  renderProject(no, type, id);
}
function changeDocVersion(no, type, id, vIdx) {
  ui.viewVer = Number(vIdx);
  ui.slide = 0;
  renderProject(no, type, id);
}
function navSlide(delta, total) {
  ui.slide = Math.max(0, Math.min(total - 1, (ui.slide || 0) + delta));
  const curHash = location.hash.split('/');
  renderProject(curHash[2], curHash[3], curHash[4]);
}
function jumpSlide(idx) {
  ui.slide = idx;
  const curHash = location.hash.split('/');
  renderProject(curHash[2], curHash[3], curHash[4]);
}
function zoomDoc(delta) {
  ui.zoom = Math.max(0.6, Math.min(2.0, (ui.zoom || 1) + delta));
  const st = document.querySelector('#pdfStage > div');
  if (st) st.style.transform = `scale(${ui.zoom})`;
}
function downloadCurrentDoc(num, verName) {
  toast(`Streaming pre-signed PDF from AWS S3 / Box for ${num} (${verName})…`);
}
function saveDocMetadata(no, type, id) {
  const list = type === 'shop' ? state.children[no].shop : state.children[no].sheets;
  const item = list.find(d => d.id === id);
  item.number = $('#dmNumber').value.trim();
  item.name = $('#dmName').value.trim();
  if (type === 'shop' && $('#dmWo')) item.woId = $('#dmWo').value;
  item.tags = $('#dmTags').value.split(',').map(s => s.trim()).filter(Boolean);
  log(no, `Updated metadata for ${item.number} - ${item.name}`);
  save();
  toast('Document metadata saved');
  renderProject(no, type, id);
}

/* ---------- UPLOAD DIALOGS (S3/BOX DIRECT STREAM) ---------- */
function openUploadDoc(no, type) {
  const isShop = type === 'shop';
  openModal(
    `Upload & Process New ${isShop ? 'Shop Drawings' : 'Sheets'}`,
    `<div class="form">
      <div class="callout" style="margin-top:0">
        <b>AWS S3 / Box Cloud Engine:</b> When you select a PDF, the file uploads directly via secure pre-signed URL.
        The automated worker extracts <b>total slide count (ΣN)</b>, renders per-slide thumbnails, and scans title blocks.
      </div>
      <label>Select PDF File(s)</label>
      <input type="file" id="docFileInput" accept=".pdf,.dwg,.dxf" onchange="previewUploadInfo(this)">
      <div id="uploadPreviewInfo" style="margin-top:8px;font-size:12px;color:#1e40af"></div>

      <div class="row" style="margin-top:10px">
        <div>
          <label>${isShop ? 'Drawing Number' : 'Sheet Number'}</label>
          <input id="upDocNumber" placeholder="${isShop ? 'e.g. 101.03' : 'e.g. G0.25'}">
        </div>
        <div>
          <label>${isShop ? 'Drawing Name' : 'Sheet Name'}</label>
          <input id="upDocName" placeholder="${isShop ? 'e.g. RESTROOM MOCKUP HARDWARE' : 'e.g. WALL SECTIONS'}">
        </div>
      </div>

      <div class="row">
        <div>
          <label>Version Set Name</label>
          <input id="upDocVersion" value="${isShop ? 'MOCKUP PACKAGE # 1' : '90 IFP'}">
        </div>
        <div>
          <label>Estimated Slides/Pages Count</label>
          <input type="number" id="upDocPages" value="3" min="1">
        </div>
      </div>

      ${isShop ? `
        <label>Link to Work Order</label>
        <select id="upDocWo">
          <option value="">— None —</option>
          ${state.children[no].workOrders.map(w => `<option value="${w.id}">${w.no} - ${esc(w.name)}</option>`).join('')}
        </select>
      ` : ''}
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn primary" onclick="submitDocUpload('${no}','${type}')">Start Upload &amp; Process</button>`
  );
}

function previewUploadInfo(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const info = $('#uploadPreviewInfo');
  info.innerHTML = `Selected: <b>${esc(file.name)}</b> (${(file.size / 1024 / 1024).toFixed(2)} MB). Analyzing slides…`;
  // If PDF.js is available, count exact pages in real time!
  if (window.pdfjsLib && file.type === 'application/pdf') {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        $('#upDocPages').value = pdf.numPages;
        info.innerHTML = `Selected: <b>${esc(file.name)}</b> — Detected <b>${pdf.numPages} slides/pages</b> via PDF engine.`;
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}

function submitDocUpload(no, type) {
  const isShop = type === 'shop';
  const num = $('#upDocNumber').value.trim();
  const name = $('#upDocName').value.trim();
  const verName = $('#upDocVersion').value.trim() || 'Rev 0';
  const pages = Number($('#upDocPages').value) || 1;
  const woId = isShop && $('#upDocWo') ? $('#upDocWo').value : null;

  if (!num || !name) return toast('Number and name are required.');

  const list = isShop ? state.children[no].shop : state.children[no].sheets;
  let existing = list.find(d => d.number.toLowerCase() === num.toLowerCase());

  if (existing) {
    // Add new version to existing document
    existing.versions.push({
      id: uid(),
      name: verName,
      issue: todayIso(),
      pages: pages,
      by: me().name,
      uploaded: nowStr()
    });
    existing.current = existing.versions.length - 1;
    existing.name = name;
    if (woId) existing.woId = woId;
    log(no, `Uploaded new version ${verName} for ${num} (${pages} slides)`);
  } else {
    // Create new document
    const newDoc = {
      id: uid(),
      number: num,
      name: name,
      woId: woId,
      versions: [{
        id: uid(),
        name: verName,
        issue: todayIso(),
        pages: pages,
        by: me().name,
        uploaded: nowStr()
      }],
      current: 0,
      tags: ['New Intake'],
      published: false,
      qcStatus: isShop ? 'Pending QC' : undefined,
      markups: false
    };
    list.unshift(newDoc);
    log(no, `Uploaded & processed new ${isShop ? 'Shop Drawing' : 'Sheet'} ${num} - ${name} (${pages} slides)`);
  }

  save();
  closeModal();
  toast(`${num} successfully processed & stored in S3/Box`);
  renderProject(no, type);
}

function openPublishLog(no, type) {
  const list = type === 'shop' ? state.children[no].shop : state.children[no].sheets;
  const unpublished = list.filter(d => !d.published);

  openModal(
    `Publish Log (${unpublished.length} Pending Release)`,
    `<div>
      <p class="hint">Select drawings/sheets to release to the Client Workspace and Field Installers:</p>
      ${unpublished.length === 0 ? '<p>All items are already published.</p>' : `
        <table class="mini">
          <thead><tr><th><input type="checkbox" onchange="toggleAllPublish(this)"></th><th>Number</th><th>Name</th><th>Version</th></tr></thead>
          <tbody>
            ${unpublished.map(d => `
              <tr>
                <td><input type="checkbox" class="pubCheck" value="${d.id}"></td>
                <td><b>${d.number}</b></td>
                <td>${esc(d.name)}</td>
                <td>${esc(d.versions[d.current].name)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      `}
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn green" onclick="commitPublish('${no}','${type}')" ${unpublished.length === 0 ? 'disabled' : ''}>Publish Selected to Client</button>`
  );
}

function toggleAllPublish(master) {
  document.querySelectorAll('.pubCheck').forEach(cb => cb.checked = master.checked);
}
function commitPublish(no, type) {
  const checkedIds = Array.from(document.querySelectorAll('.pubCheck:checked')).map(cb => cb.value);
  if (!checkedIds.length) return toast('Select at least one item.');
  const list = type === 'shop' ? state.children[no].shop : state.children[no].sheets;
  list.forEach(d => { if (checkedIds.includes(d.id)) d.published = true; });
  log(no, `Published ${checkedIds.length} ${type} item(s) to Client Portal`);
  save();
  closeModal();
  toast(`${checkedIds.length} items published successfully`);
  renderProject(no, type);
}

function openManageVersions(no, type) {
  const list = type === 'shop' ? state.children[no].shop : state.children[no].sheets;
  openModal(
    'Manage Version Sets',
    `<div class="form">
      <p class="hint">Active Version Sets across ${type}:</p>
      <ul style="padding-left:18px">
        ${Array.from(new Set(list.flatMap(d => d.versions.map(v => v.name)))).map(v => `<li><b>${esc(v)}</b></li>`).join('')}
      </ul>
      <label>Create New Batch Version Set</label>
      <input id="newBatchVer" placeholder="e.g. Bulletin 02 or Mockup Package # 6">
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Close</button>
     <button class="btn primary" onclick="toast('Batch version set created');closeModal();">Save</button>`
  );
}

function openAddMarkupModal(no, type, id) {
  openModal(
    'Add PDF Markup / Pinned Comment',
    `<div class="form">
      <label>Comment / Redline Instruction</label>
      <textarea id="mkText" rows="3" placeholder="e.g. Check field dimensions with GC; clarify laminate finish match."></textarea>
      <label>Pin Category</label>
      <select id="mkType">
        <option>Architectural Question (RFI)</option>
        <option>QC Non-Conformance</option>
        <option>Field Verification Required</option>
        <option>Finish / Hardware Coordination</option>
      </select>
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn orange" onclick="saveMarkupPin('${no}','${type}','${id}')">Place Pin &amp; Notify</button>`
  );
}
function saveMarkupPin(no, type, id) {
  const list = type === 'shop' ? state.children[no].shop : state.children[no].sheets;
  const item = list.find(d => d.id === id);
  item.markups = true;
  log(no, `Added markup pin to ${item.number}: ${$('#mkText').value}`);
  save();
  closeModal();
  toast('Markup annotation pinned to slide.');
  renderProject(no, type, id);
}

/* ---------- FILES (AWS S3 / BOX EXPLORER) ---------- */
function renderFiles(p, ch) {
  const activeCat = ui.fileCat || 'All';
  const allowedCats = isClient() ? CLIENT_FILE_CATS : FILE_CATS;
  const files = ch.files.filter(f => (activeCat === 'All' || f.cat === activeCat) && (!isClient() || CLIENT_FILE_CATS.includes(f.cat)));

  $('#tabBody').innerHTML = `
    <div class="actions">
      <button class="btn orange" onclick="openUploadFile('${p.no}')">☁ Upload to AWS S3 / Box</button>
      <span class="spacer"></span>
      <span class="hint">Connected Storage: AWS S3 Bucket (us-east-1) · Box Enterprise Sync Active</span>
    </div>

    <div class="files">
      <!-- Folder Directory -->
      <div class="folders panel">
        <h4 style="margin:0 0 10px;font-size:12px;color:#475569">FOLDERS</h4>
        <a class="${activeCat === 'All' ? 'active' : ''}" onclick="ui.fileCat='All';renderFiles(state.projects.find(x=>x.no==='${p.no}'),state.children['${p.no}'])">
          📁 All Files <span>${ch.files.length}</span>
        </a>
        ${allowedCats.map(c => `
          <a class="${activeCat === c ? 'active' : ''}" onclick="ui.fileCat='${c}';renderFiles(state.projects.find(x=>x.no==='${p.no}'),state.children['${p.no}'])">
            📁 ${c} <span>${ch.files.filter(f => f.cat === c).length}</span>
          </a>`).join('')}
      </div>

      <!-- File Grid -->
      <div class="table-wrap">
        <table class="grid">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>S3 / Box URI</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${files.map(f => `
              <tr>
                <td><b>${esc(f.name)}</b></td>
                <td><span class="badge b-gray">${esc(f.cat)}</span></td>
                <td>${esc(f.size)}</td>
                <td>${esc(f.by)}</td>
                <td>${esc(f.date)}</td>
                <td><span class="key">${esc(f.key)}</span></td>
                <td>
                  <button class="btn ghost small" onclick="openFilePreview('${esc(f.name)}')">View</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function openUploadFile(no) {
  openModal(
    'Upload File to AWS S3 / Box',
    `<div class="form">
      <label>Select File</label>
      <input type="file" id="fUploadInput">
      <label>Folder / Category</label>
      <select id="fUploadCat">
        ${(isClient() ? CLIENT_FILE_CATS : FILE_CATS).map(c => `<option>${c}</option>`).join('')}
      </select>
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn primary" onclick="submitFileUpload('${no}')">Upload to Cloud</button>`
  );
}
function submitFileUpload(no) {
  const fin = $('#fUploadInput');
  const file = fin.files && fin.files[0];
  const cat = $('#fUploadCat').value;
  const name = file ? file.name : 'Client_Uploaded_Document.pdf';
  const size = file ? (file.size / 1024 > 1024 ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : Math.round(file.size / 1024) + ' KB') : '1.5 MB';

  state.children[no].files.unshift({
    id: uid(),
    name: name,
    cat: cat,
    size: size,
    by: me().name,
    date: fmtDate(todayIso()),
    key: `s3://quadeconnect-prod/projects/${no}/files/${slug(cat)}/${name}`
  });
  log(no, `Uploaded file to S3/Box: ${name} [${cat}]`);
  save();
  closeModal();
  toast('File uploaded to AWS S3 / Box');
  renderProject(no, 'files');
}

function openFilePreview(name) {
  openModal(
    `Preview: ${name}`,
    `<div style="text-align:center;padding:30px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px">
      <h3>Viewing via Secure Pre-Signed URL</h3>
      <p style="color:#475569;font-size:12px">Document: <b>${esc(name)}</b></p>
      <p class="hint">In production, AWS S3 / Box streams this PDF or image straight into the browser canvas.</p>
    </div>`,
    '<button class="btn ghost" onclick="closeModal()">Close</button>'
  );
}

/* ---------- QC REVIEW MODULE ---------- */
function renderQC(p, ch) {
  const pending = ch.shop.filter(s => s.qcStatus === 'Pending QC');
  const approved = ch.shop.filter(s => s.qcStatus === 'QC Approved');
  const rejected = ch.shop.filter(s => s.qcStatus === 'Rejected');

  $('#tabBody').innerHTML = `
    <div class="cards" style="margin-bottom:14px">
      <div class="card" style="border-left:4px solid #7c3aed">
        <h3>Pending QC Inspection</h3>
        <div style="font-size:24px;font-weight:bold;color:#7c3aed">${pending.length}</div>
        <p class="hint">Drawings awaiting technical checklist review.</p>
      </div>
      <div class="card" style="border-left:4px solid #16a34a">
        <h3>QC Approved</h3>
        <div style="font-size:24px;font-weight:bold;color:#16a34a">${approved.length}</div>
        <p class="hint">Verified against AWI quality standards.</p>
      </div>
      <div class="card" style="border-left:4px solid #dc2626">
        <h3>Rejected / In Revision</h3>
        <div style="font-size:24px;font-weight:bold;color:#dc2626">${rejected.length}</div>
        <p class="hint">Returned to Engineering drafters with redlines.</p>
      </div>
    </div>

    <div class="table-wrap">
      <table class="grid">
        <thead>
          <tr>
            <th>Drawing Number</th>
            <th>Name</th>
            <th>Version Set</th>
            <th>Slide Count</th>
            <th>QC Status</th>
            <th>Uploaded By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${ch.shop.map(d => `
            <tr>
              <td><b><a href="#/project/${p.no}/shop/${d.id}">${d.number}</a></b></td>
              <td>${esc(d.name)}</td>
              <td>${esc(d.versions[d.current].name)}</td>
              <td><span class="sigma">Σ${d.versions[d.current].pages}</span></td>
              <td><span class="badge ${d.qcStatus === 'QC Approved' ? 'b-green' : d.qcStatus === 'Rejected' ? 'b-red' : 'b-purple'}">${d.qcStatus}</span></td>
              <td>${esc(d.versions[d.current].by)}</td>
              <td>
                ${canQC() ? `<button class="btn small primary" onclick="openQCInspectionModal('${p.no}','${d.id}')">Conduct QC Review</button>` : `<a href="#/project/${p.no}/shop/${d.id}">View Drawing</a>`}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function openQCInspectionModal(no, drawingId) {
  const d = state.children[no].shop.find(s => s.id === drawingId);
  openModal(
    `QC Review Inspection: ${d.number} - ${d.name}`,
    `<div>
      <p><b>Version:</b> ${esc(d.versions[d.current].name)} | <b>Slides:</b> ${d.versions[d.current].pages}</p>
      <h4 style="margin:12px 0 6px">AWI Architectural Millwork QC Checklist</h4>
      ${QC_CHECKLIST.map((item, idx) => `
        <label class="check">
          <input type="checkbox" class="qccb" id="qc_${idx}">
          <span>${item}</span>
        </label>`).join('')}
      <label style="display:block;margin-top:12px;font-weight:bold">QC Inspection Notes / Redline Summary</label>
      <textarea id="qcNotes" rows="2" style="width:100%;border:1px solid var(--border);border-radius:4px" placeholder="e.g. Dimensions verified; veneer matching approved."></textarea>
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn red" onclick="submitQCResult('${no}','${drawingId}','Rejected')">Reject &amp; Return to Drafter</button>
     <button class="btn green" onclick="submitQCResult('${no}','${drawingId}','QC Approved')">Approve Drawing</button>`,
    true
  );
}

function submitQCResult(no, drawingId, status) {
  const d = state.children[no].shop.find(s => s.id === drawingId);
  d.qcStatus = status;
  const notes = $('#qcNotes').value;
  log(no, `QC ${status} for Shop Drawing ${d.number}${notes ? ': ' + notes : ''}`);
  save();
  closeModal();
  toast(`Shop Drawing ${d.number} marked as ${status}`);
  renderProject(no, 'qc');
}

/* ---------- SUBMITTALS WORKFLOW ---------- */
function renderSubmittals(p, ch) {
  const list = isClient() ? ch.submittals.filter(s => s.status !== 'Draft') : ch.submittals;

  $('#tabBody').innerHTML = `
    <div class="actions">
      ${canManage() ? `<button class="btn orange" onclick="openCreateSubmittal('${p.no}')">+ New Submittal Package</button>` : ''}
      <span class="spacer"></span>
      <span class="hint">Architectural Woodwork Institute (AWI) Submittal Transmittal Tracker</span>
    </div>

    <div class="table-wrap">
      <table class="grid">
        <thead>
          <tr>
            <th>Submittal No.</th>
            <th>Title</th>
            <th>Spec Section</th>
            <th>Rev</th>
            <th>Status</th>
            <th>Ball-in-Court</th>
            <th>Attached Drawings</th>
            <th>Date Sent</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(s => `
            <tr>
              <td><b>${s.no}</b></td>
              <td>${esc(s.title)}</td>
              <td>${esc(s.spec)}</td>
              <td>Rev ${s.rev}</td>
              <td><span class="badge ${s.status === 'Approved' ? 'b-green' : s.status === 'Submitted' ? 'b-amber' : 'b-gray'}">${s.status}</span></td>
              <td><b>${s.ball}</b></td>
              <td>${s.drawings.length} Shop Dwgs</td>
              <td>${fmtDate(s.sent)}</td>
              <td>${fmtDate(s.due)}</td>
              <td>
                ${isClient() && s.status === 'Submitted' ? `
                  <button class="btn green small" onclick="clientSignSubmittal('${p.no}','${s.id}','Approved')">Approve</button>
                  <button class="btn red small" onclick="clientSignSubmittal('${p.no}','${s.id}','Revise & Resubmit')">Revise</button>
                ` : `
                  <button class="btn ghost small" onclick="viewSubmittalDetail('${p.no}','${s.id}')">View Details</button>
                `}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function openCreateSubmittal(no) {
  const approvedShop = state.children[no].shop.filter(s => s.qcStatus === 'QC Approved');
  openModal(
    'Create Submittal Package',
    `<div class="form">
      <label>Submittal Title</label>
      <input id="subTitle" placeholder="e.g. Wall Panels & Mockup Shop Drawings">
      <label>Spec Section</label>
      <input id="subSpec" value="06 41 00 Architectural Wood Casework">
      <label>Select QC-Approved Shop Drawings to Attach</label>
      ${approvedShop.length === 0 ? '<p class="hint">No QC-Approved shop drawings available. Approve drawings in QC Review tab first.</p>' : `
        <div style="max-height:140px;overflow:auto;border:1px solid var(--border);padding:6px">
          ${approvedShop.map(d => `<label class="check"><input type="checkbox" class="subDwgCb" value="${d.id}"> <span><b>${d.number}</b> - ${esc(d.name)}</span></label>`).join('')}
        </div>
      `}
      <div class="row">
        <div>
          <label>Issue Date</label>
          <input type="date" id="subSent" value="${todayIso()}">
        </div>
        <div>
          <label>Contractual Response Due Date</label>
          <input type="date" id="subDue" value="${isoAdd(todayIso(), 14)}">
        </div>
      </div>
    </div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button>
     <button class="btn primary" onclick="submitCreateSubmittal('${no}')">Generate Transmittal &amp; Send</button>`
  );
}

function submitCreateSubmittal(no) {
  const title = $('#subTitle').value.trim();
  if (!title) return toast('Title is required.');
  const dwgIds = Array.from(document.querySelectorAll('.subDwgCb:checked')).map(cb => cb.value);

  const sub = {
    id: uid(),
    no: `SUB-00${state.children[no].submittals.length + 1}`,
    title: title,
    spec: $('#subSpec').value,
    rev: 0,
    status: 'Submitted',
    ball: 'Client / Architect',
    drawings: dwgIds,
    sent: $('#subSent').value,
    due: $('#subDue').value,
    history: [{ t: nowStr(), user: me().name, text: 'Submitted package to Architect' }]
  };

  state.children[no].submittals.unshift(sub);
  log(no, `Created and issued ${sub.no}: ${title}`);
  save();
  closeModal();
  toast(`${sub.no} issued to Client Portal`);
  renderProject(no, 'submittals');
}

function clientSignSubmittal(no, subId, decision) {
  const sub = state.children[no].submittals.find(s => s.id === subId);
  sub.status = decision === 'Approved' ? 'Approved' : 'Revise & Resubmit';
  sub.ball = decision === 'Approved' ? '—' : 'Engineering';
  sub.history.unshift({ t: nowStr(), user: me().name + ' (Client)', text: decision });
  log(no, `Client marked ${sub.no} as ${decision}`);
  save();
  toast(`Submittal ${decision}`);
  renderProject(no, 'submittals');
}

function viewSubmittalDetail(no, subId) {
  const sub = state.children[no].submittals.find(s => s.id === subId);
  openModal(
    `${sub.no} — ${sub.title}`,
    `<div>
      <p><b>Spec Section:</b> ${esc(sub.spec)} | <b>Status:</b> ${sub.status} | <b>Ball-in-Court:</b> ${sub.ball}</p>
      <p><b>Sent:</b> ${fmtDate(sub.sent)} | <b>Due:</b> ${fmtDate(sub.due)}</p>
      <h4 style="margin:12px 0 6px">Audit Log</h4>
      <div style="font-size:12px;background:#f8fafc;padding:8px;border:1px solid #e2e8f0;border-radius:4px">
        ${sub.history.map(h => `<div>${h.t} — <b>${esc(h.user)}</b>: ${esc(h.text)}</div>`).join('')}
      </div>
    </div>`,
    '<button class="btn ghost" onclick="closeModal()">Close</button>'
  );
}

