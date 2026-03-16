document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initProductDemo();
  initLightbox();
});

function initScrollAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;
  document.body.classList.add('motion-ready');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
}

function initProductDemo() {
  const canvas = document.getElementById('product-demo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = canvas.width;
  const height = canvas.height;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const defaultNodes = [
    { x: 130, y: 210, label: 'Code + Decisions', color: '#34d399' },
    { x: 420, y: 120, label: 'Capture Reflection', color: '#60a5fa' },
    { x: 420, y: 300, label: 'Screenshot Evidence', color: '#60a5fa' },
    { x: 730, y: 210, label: 'Structured Timeline', color: '#a78bfa' },
    { x: 1030, y: 150, label: 'Portfolio Output', color: '#f59e0b' },
    { x: 1030, y: 270, label: 'Marketing Output', color: '#f59e0b' },
  ];
  const defaultEdges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]];

  let nodes = defaultNodes;
  let edges = defaultEdges;

  const workflowEl = document.getElementById('demo-workflow');
  if (workflowEl && workflowEl.textContent && workflowEl.textContent.trim()) {
    try {
      const raw = JSON.parse(workflowEl.textContent.trim());
      const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#10b981'];

      if (raw && typeof raw === 'object' && !Array.isArray(raw) && raw.input && raw.process) {
        const inputLabel = String(raw.input);
        const processLabel = String(raw.process);

        if (raw.output && Array.isArray(raw.outputFiles) && raw.outputFiles.length >= 1) {
          const outputLabel = String(raw.output);
          const fileLabels = raw.outputFiles.map(o => (o && o.label) ? String(o.label) : String(o)).filter(Boolean);
          if (fileLabels.length >= 1) {
            const pad = 40;
            const inputX = pad + 70;
            const processX = 280;
            const outputX = 520;
            const fileLeft = 680;
            const fileRight = width - pad;
            const fileW = fileRight - fileLeft;
            const fileRows = Math.min(3, Math.ceil(fileLabels.length / 3));
            const fileCols = Math.ceil(fileLabels.length / fileRows);
            const colW = fileW / fileCols;
            const rowH = (height - 50) / fileRows;

            nodes = [
              { x: inputX, y: height / 2, label: inputLabel, color: '#34d399' },
              { x: processX, y: height / 2, label: processLabel, color: '#60a5fa' },
              { x: outputX, y: height / 2, label: outputLabel, color: '#a78bfa' },
            ];
            const fileNodes = [];
            for (let i = 0; i < fileLabels.length; i++) {
              const row = Math.floor(i / fileCols);
              const col = i % fileCols;
              const x = fileLeft + (col + 0.5) * colW;
              const y = 35 + (row + 0.5) * rowH;
              fileNodes.push({ x, y, label: fileLabels[i], color: colors[(i + 3) % colors.length] });
            }
            nodes = nodes.concat(fileNodes);
            edges = [[0, 1], [1, 2]];
            for (let i = 0; i < fileNodes.length; i++) edges.push([2, 3 + i]);
          }
        } else if (Array.isArray(raw.outputs) && raw.outputs.length >= 1) {
          const outputLabels = raw.outputs.map(o => (o && o.label) ? String(o.label) : String(o)).filter(Boolean);
          if (outputLabels.length >= 1) {
            const pad = 50;
            const inputX = pad + 90;
            const processX = 420;
            const outputLeft = 620;
            const outputRight = width - pad;
            const outputW = outputRight - outputLeft;
            const outputRows = Math.min(4, Math.ceil(outputLabels.length / 3));
            const outputCols = Math.ceil(outputLabels.length / outputRows);
            const colW = outputW / outputCols;
            const rowH = (height - 60) / outputRows;

            nodes = [
              { x: inputX, y: height / 2, label: inputLabel, color: '#34d399' },
              { x: processX, y: height / 2, label: processLabel, color: '#60a5fa' },
            ];
            const outputNodes = [];
            for (let i = 0; i < outputLabels.length; i++) {
              const row = Math.floor(i / outputCols);
              const col = i % outputCols;
              const x = outputLeft + (col + 0.5) * colW;
              const y = 40 + (row + 0.5) * rowH;
              outputNodes.push({ x, y, label: outputLabels[i], color: colors[(i + 2) % colors.length] });
            }
            nodes = nodes.concat(outputNodes);
            edges = [[0, 1]];
            for (let i = 0; i < outputNodes.length; i++) edges.push([1, 2 + i]);
          }
        }
      } else {
        const items = Array.isArray(raw) ? raw : [];
        if (items.length >= 2) {
          const pad = 80;
          const span = width - 2 * pad;
          nodes = items.map((item, i) => {
            const label = (item && item.label) ? String(item.label) : `Step ${i + 1}`;
            const color = (item && item.color) ? String(item.color) : colors[i % colors.length];
            const x = pad + (i / Math.max(1, items.length - 1)) * span;
            const y = height / 2;
            return { x, y, label, color };
          });
          edges = [];
          for (let i = 0; i < nodes.length - 1; i++) edges.push([i, i + 1]);
        }
      }
    } catch (_) {}
  }

  let t = 0;
  function draw() {
    t += 0.012;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#f5f3ff');
    bg.addColorStop(1, '#eff6ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
    ctx.lineWidth = 2;
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a].x, nodes[a].y);
      ctx.lineTo(nodes[b].x, nodes[b].y);
      ctx.stroke();
    });

    edges.forEach(([a, b], i) => {
      const phase = (t + i * 0.19) % 1;
      const x = nodes[a].x + (nodes[b].x - nodes[a].x) * phase;
      const y = nodes[a].y + (nodes[b].y - nodes[a].y) * phase;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(124, 58, 237, 0.7)';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    const isOutputsLayout = nodes.length > 3 && edges.some(([a, b]) => (a === 1 || a === 2) && b > 2);
    const mainNodeCount = isOutputsLayout && edges.some(([a, b]) => a === 2 && b > 2) ? 3 : 2;
    const outputNodeRadius = isOutputsLayout ? 22 : 34;
    const outputFontSize = isOutputsLayout ? 10 : 13;

    nodes.forEach((node, idx) => {
      const pulse = 1 + Math.sin(t * 4 + idx) * 0.05;
      const radius = (idx < mainNodeCount ? 34 : outputNodeRadius) * pulse;

      ctx.beginPath();
      ctx.fillStyle = node.color;
      ctx.globalAlpha = 0.1;
      ctx.arc(node.x, node.y, radius + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.fillStyle = node.color;
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = idx < mainNodeCount ? '500 13px Inter, ui-sans-serif, system-ui, sans-serif' : `500 ${outputFontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + (idx < mainNodeCount ? 58 : 42));
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lightbox || !lbImg) return;

  document.querySelectorAll('.gallery-item, [data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.src;
      if (!src) return;
      lbImg.src = src;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lbImg.src = '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      lbImg.src = '';
    }
  });
}
