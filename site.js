/* ===================================================================
   MAGGU BROTHERS — SHARED BEHAVIOUR
   =================================================================== */

/* === Preloader === */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const pct = document.getElementById('preLoadPct');
  if (!pre) return;
  let p = 0;
  const tick = () => {
    p = Math.min(p + Math.random() * 12, 100);
    if (pct) pct.textContent = String(Math.floor(p)).padStart(3, '0');
    if (p < 100) setTimeout(tick, 80);
    else setTimeout(() => pre.classList.add('done'), 300);
  };
  tick();
});

/* === Custom cursor === */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  const label = document.getElementById('cursorLabel');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll('a, button, [data-cursor], input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover'); ring.classList.add('hover');
      if (label) label.textContent = el.dataset.label || '';
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover'); ring.classList.remove('hover');
      if (label) label.textContent = '';
    });
  });
})();

/* === Scroll progress bar === */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* === Section indicator === */
(function () {
  const indicator = document.querySelector('.section-indicator');
  const cur = document.getElementById('sectionCurrent');
  if (!indicator || !cur) return;
  const sections = document.querySelectorAll('[data-section]');
  if (!sections.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) cur.textContent = String(e.target.dataset.section).padStart(2, '0');
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
  window.addEventListener('scroll', () => {
    indicator.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  }, { passive: true });
})();

/* === Live IST clock === */
(function () {
  const el = document.getElementById('navClock');
  if (!el) return;
  const fmt = () => {
    const now = new Date();
    // IST = UTC+5:30
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 5.5 * 3600000);
    const hh = String(ist.getHours()).padStart(2, '0');
    const mm = String(ist.getMinutes()).padStart(2, '0');
    el.textContent = `${hh}:${mm}`;
  };
  fmt(); setInterval(fmt, 30000);
})();

/* === Reveal on scroll === */
(function () {
  const targets = document.querySelectorAll('.reveal, .reveal-words, .split-text, .split-words');
  if (!targets.length) return;
  // Word-wrap for reveal-words
  document.querySelectorAll('.reveal-words').forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const html = el.innerHTML;
    el.innerHTML = `<span>${html}</span>`;
  });
  document.querySelectorAll('.split-words, .split-text').forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const html = el.innerHTML;
    el.innerHTML = `<span>${html}</span>`;
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
})();

/* === Count-up stats === */
(function () {
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

/* === Hero mouse parallax === */
(function () {
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;
  const hero = document.querySelector('.video-hero');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    items.forEach(el => {
      const s = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translate(${x * -20 * s}px, ${y * -20 * s}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    items.forEach(el => el.style.transform = '');
  });
})();

/* === Horizontal case scroller — drag to scroll === */
(function () {
  const scroller = document.querySelector('.case-scroller');
  if (!scroller) return;
  let down = false, startX = 0, startScroll = 0;
  scroller.addEventListener('mousedown', e => {
    down = true; startX = e.pageX; startScroll = scroller.scrollLeft;
    scroller.classList.add('grabbing');
  });
  ['mouseup', 'mouseleave'].forEach(ev =>
    scroller.addEventListener(ev, () => { down = false; scroller.classList.remove('grabbing'); })
  );
  scroller.addEventListener('mousemove', e => {
    if (!down) return; e.preventDefault();
    scroller.scrollLeft = startScroll - (e.pageX - startX) * 1.4;
  });
})();

/* === Responsive video loader (hero only) === */
(function () {
  const video = document.getElementById('heroVideo');
  const src = document.getElementById('videoSource');
  if (!video || !src) return;
  const update = () => {
    const path = window.innerWidth < 768 ? 'videos/mobilevideo.mp4' : 'videos/laptopvideo.mp4';
    if (src.getAttribute('src') !== path) {
      src.setAttribute('src', path);
      video.load();
      video.play().catch(() => { });
    }
  };
  update();
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(update, 300);
  });
})();

/* === Mobile nav (hamburger + overlay) === */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const navMeta = nav.querySelector('.site-nav-meta');
  if (!navMeta) return;

  // Inject hamburger toggle
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  navMeta.appendChild(toggle);

  // Active page detection
  const path = location.pathname.split('/').pop() || 'index.html';

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.innerHTML = `
    <div class="nav-overlay-meta">— Index · 5 ways through the studio</div>
    <div class="nav-overlay-links">
      <a href="index.html" class="nav-overlay-link" data-page="index.html">
        <span><span class="num">01 ·&nbsp;</span>Home</span><span class="num">→</span>
      </a>
      <a href="services.html" class="nav-overlay-link" data-page="services.html">
        <span><span class="num">02 ·&nbsp;</span><span class="display-italic">Services</span></span><span class="num">→</span>
      </a>
      <a href="gallery.html" class="nav-overlay-link" data-page="gallery.html">
        <span><span class="num">03 ·&nbsp;</span>Gallery</span><span class="num">→</span>
      </a>
      <a href="index.html#about" class="nav-overlay-link">
        <span><span class="num">04 ·&nbsp;</span><span class="display-italic">Studio</span></span><span class="num">→</span>
      </a>
      <a href="booking.html" class="nav-overlay-link" data-page="booking.html">
        <span><span class="num">05 ·&nbsp;</span>Reserve</span><span class="num">→</span>
      </a>
    </div>
    <div class="nav-overlay-footer">
      <a href="booking.html" class="btn btn-blood">Book a build →</a>
      <div class="address">
        SCO 122 · Sector 28 D<br>
        Chandigarh · IN<br>
        <span style="color: var(--bone); font-style: italic; font-family: 'Fraunces', serif; font-size: 14px; letter-spacing: -0.01em; text-transform: none;">Open · ${' '}<span id="navClockMobile">--:--</span> CDH</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Mark active page
  overlay.querySelectorAll('.nav-overlay-link').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });

  // Toggle behaviour
  const setOpen = (open) => {
    toggle.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!overlay.classList.contains('open')));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // Sync mobile clock
  const sync = () => {
    const main = document.getElementById('navClock');
    const mob = document.getElementById('navClockMobile');
    if (main && mob) mob.textContent = main.textContent;
  };
  setInterval(sync, 1000);
  sync();
})();

/* === Nav background darken on scroll === */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(10, 10, 10, 0.85)' : 'rgba(10, 10, 10, 0.55)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
