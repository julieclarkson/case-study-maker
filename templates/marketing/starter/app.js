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

  const nodes = [
    { x: 130, y: 210, label: 'Code + Decisions', color: '#34d399' },
    { x: 420, y: 120, label: 'Capture Reflection', color: '#60a5fa' },
    { x: 420, y: 300, label: 'Screenshot Evidence', color: '#60a5fa' },
    { x: 730, y: 210, label: 'Structured Timeline', color: '#a78bfa' },
    { x: 1030, y: 150, label: 'Portfolio Output', color: '#f59e0b' },
    { x: 1030, y: 270, label: 'Marketing Output', color: '#f59e0b' },
  ];

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5],
  ];

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

    nodes.forEach((node, idx) => {
      const pulse = 1 + Math.sin(t * 4 + idx) * 0.05;
      const radius = 34 * pulse;

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
      ctx.font = '500 13px Inter, ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 58);
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
