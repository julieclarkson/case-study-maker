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
  });

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
