// Portafolio — interacciones


(function navToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();

(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

(function carousel() {
  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  if (!track) return;
  const step = () => track.querySelector('.review-card')?.offsetWidth + 16 || 320;
  prev?.addEventListener('click', () => { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next?.addEventListener('click', () => { track.scrollBy({ left: +step(), behavior: 'smooth' }); });
})();

(function year() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

(function smoothScrollAndActive() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const getHeaderHeight = () => header ? header.offsetHeight : 0;

  const links = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
  function setActive(hash) {
    if (!hash) return;
    links.forEach(l => {
      if (l.getAttribute('href') === hash) {
        l.classList.add('active');
        l.setAttribute('aria-current', 'page');
      } else {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      }
    });
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - 8;
      if (prefersReduced) window.scrollTo(0, top);
      else window.scrollTo({ top, behavior: 'smooth' });

      history.pushState(null, '', id);
      setActive(id);

      const menu = document.getElementById('nav-menu');
      const toggle = document.querySelector('.nav-toggle');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const sections = Array.from(document.querySelectorAll('section[id]'));
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        setActive(id);
        history.replaceState(null, '', id);
      }
    }
  }, { root: null, rootMargin: `-${getHeaderHeight()+10}px 0px -40% 0px`, threshold: 0.25 });
  sections.forEach(s => io.observe(s));

  if (location.hash) setActive(location.hash);
})();


(function experiencePagination(){
  const container = document.querySelector('.cards.timeline');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.card'));
  const PAGE = 3;
  let visible = PAGE;

  container.classList.remove('no-js');

  const controls = document.createElement('div');
  controls.className = 'cards-controls';
  const btn = document.createElement('button');
  btn.className = 'btn btn-outline btn-more';
  btn.type = 'button';
  btn.textContent = cards.length > PAGE ? 'Ver más' : '';
  controls.appendChild(btn);
  container.parentNode.insertBefore(controls, container.nextSibling);

  function update() {
    cards.forEach((c, i) => {
      if (i < visible) {
        c.classList.remove('hidden');
        c.classList.add('reveal');
        c.classList.add('visible');
      } else {
        c.classList.add('hidden');
        c.classList.remove('visible');
      }
    });
    if (visible >= cards.length) btn.textContent = 'Ver menos';
    else btn.textContent = 'Ver más';
    if (cards.length <= PAGE) controls.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    if (visible >= cards.length) {
      visible = PAGE;
      update();
      btn.blur();
      const top = container.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header')?.offsetHeight || 80) - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      visible = Math.min(cards.length, visible + PAGE);
      update();
      const idx = Math.max(0, visible - PAGE);
      const el = cards[idx];
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  update();
})();

