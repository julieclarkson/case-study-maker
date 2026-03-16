/**
 * Technical Case Study portfolio template — expects global DATA with timeline, commits, screenshots.
 * When generating, the build inlines DATA before this script.
 */
(function () {
  const DATA = window.DATA || { timeline: [], commits: [], screenshots: [] };

  document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
    renderCommits(DATA.commits);
    renderGallery();
    initFilter();
    initLightbox();
    initEvidenceCanvas();
  });

  function initEvidenceCanvas() {
    const canvas = document.getElementById('evidence-canvas');
    const wrap = canvas && canvas.closest('.evidence-canvas-wrap');
    if (!canvas || !wrap) return;
    const diagram = (window.DATA || {}).workflowDiagram;
    if (!diagram || !diagram.nodes || !diagram.nodes.length || !diagram.edges || !diagram.edges.length) {
      wrap.style.display = 'none';
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = canvas.width;
    const height = canvas.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const nodes = layoutWorkflowDiagram(diagram.nodes, diagram.edges, width, height);

    let t = 0;
    function draw() {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#faf5ff');
      bg.addColorStop(1, '#f0f9ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(139, 92, 246, 0.22)';
      ctx.lineWidth = 2;
      diagram.edges.forEach(([a, b]) => {
        if (nodes[a] && nodes[b] && nodes[a].x != null && nodes[b].x != null) {
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      });

      diagram.edges.forEach(([a, b], i) => {
        if (!nodes[a] || !nodes[b] || nodes[a].x == null) return;
        const phase = (t + i * 0.15) % 1;
        const x = nodes[a].x + (nodes[b].x - nodes[a].x) * phase;
        const y = nodes[a].y + (nodes[b].y - nodes[a].y) * phase;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(124, 58, 237, 0.75)';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach((node, idx) => {
        if (node.x == null) return;
        const pulse = 1 + Math.sin(t * 3 + idx) * 0.05;
        const r = Math.min(24, (width / diagram.nodes.length) * 0.08) * pulse;
        ctx.beginPath();
        ctx.fillStyle = node.color || '#60a5fa';
        ctx.globalAlpha = 0.14;
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.fillStyle = node.color || '#60a5fa';
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#374151';
        ctx.font = '500 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        const label = String(node.label || '').slice(0, 20);
        ctx.fillText(label, node.x, node.y + (r + 22));
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function layoutWorkflowDiagram(nodes, edges, w, h) {
    const result = nodes.map((n) => ({ ...n }));
    const layers = computeLayers(nodes.length, edges);
    const padding = 40;
    const usableW = w - 2 * padding;
    const usableH = h - 2 * padding;
    const maxCols = Math.max(1, layers.length);
    const colW = usableW / maxCols;
    layers.forEach((nodeIndices, col) => {
      const n = nodeIndices.length;
      const stepY = n > 1 ? usableH / (n + 1) : 0;
      nodeIndices.forEach((idx, row) => {
        result[idx].x = padding + colW * (col + 0.5);
        result[idx].y = n > 1 ? padding + stepY * (row + 1) : h / 2 - 10;
      });
    });
    return result;
  }

  function computeLayers(numNodes, edges) {
    const incoming = Array(numNodes).fill(null).map(() => []);
    const outgoing = Array(numNodes).fill(null).map(() => []);
    edges.forEach(([a, b]) => {
      if (a >= 0 && a < numNodes && b >= 0 && b < numNodes) {
        outgoing[a].push(b);
        incoming[b].push(a);
      }
    });
    const layers = [];
    const layerOf = Array(numNodes).fill(-1);
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < numNodes; i++) {
        if (layerOf[i] >= 0) continue;
        const predLayers = incoming[i].map((p) => layerOf[p]).filter((l) => l >= 0);
        const allPredPlaced = incoming[i].length === 0 || incoming[i].every((p) => layerOf[p] >= 0);
        if (!allPredPlaced) continue;
        const myLayer = predLayers.length ? Math.max(...predLayers) + 1 : 0;
        layerOf[i] = myLayer;
        changed = true;
      }
    }
    const maxLayer = Math.max(0, ...layerOf);
    for (let i = 0; i < numNodes; i++) {
      if (layerOf[i] < 0) layerOf[i] = maxLayer;
    }
    for (let L = 0; L <= maxLayer; L++) {
      layers.push([...Array(numNodes).keys()].filter((i) => layerOf[i] === L));
    }
    return layers.length ? layers : [[...Array(numNodes).keys()]];
  }

  function renderTimeline() {
    const el = document.getElementById('timeline-el');
    if (!el) return;
    el.innerHTML = DATA.timeline.map(t =>
      '<div class="timeline-item">' +
        '<div class="timeline-date">' + escapeHtml(t.date) + '</div>' +
        '<div class="timeline-label">' + escapeHtml(t.label) + '</div>' +
        '<div class="timeline-detail">' + escapeHtml(t.detail) + '</div>' +
      '</div>'
    ).join('');
    el.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('expanded'));
    });
  }

  function renderCommits(commits) {
    const el = document.getElementById('commit-list');
    if (!el) return;
    const list = commits || DATA.commits || [];
    el.innerHTML = list.map(c =>
      '<li class="commit-item">' +
        '<span class="commit-hash">' + escapeHtml(c.hash) + '</span>' +
        '<span class="commit-msg">' + escapeHtml(c.message) + '</span>' +
        '<span class="commit-date">' + escapeHtml(c.date) + '</span>' +
      '</li>'
    ).join('');
  }

  function initFilter() {
    const input = document.getElementById('commit-filter');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      const filtered = (DATA.commits || []).filter(c =>
        (c.message || '').toLowerCase().includes(q) || (c.hash || '').includes(q)
      );
      renderCommits(filtered);
    });
  }

  function renderGallery() {
    const el = document.getElementById('gallery');
    if (!el) return;
    const screenshots = DATA.screenshots || [];
    el.innerHTML = screenshots.map(s =>
      '<div class="gallery-item" data-src="' + escapeAttr(s.file) + '">' +
        '<img src="' + escapeAttr(s.file) + '" alt="' + escapeAttr(s.caption) + '" loading="lazy">' +
        '<div class="gallery-caption">' + escapeHtml(s.caption) + '</div>' +
      '</div>'
    ).join('');
  }

  function initLightbox() {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    document.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (item) { img.src = item.dataset.src; lb.classList.add('active'); return; }
      if (e.target.closest('.lightbox')) { lb.classList.remove('active'); img.src = ''; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { lb.classList.remove('active'); img.src = ''; }
    });
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }

  function escapeAttr(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
})();
