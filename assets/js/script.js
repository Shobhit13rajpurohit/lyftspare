/* ============================================================
   LyftSpare — Premium Industrial JS
   Vanilla JS | No Frameworks | Full Interactivity
   ============================================================ */

'use strict';

/* ── Loader ────────────────────────────────────────────────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const bar     = document.querySelector('.loader-bar');
  const loaderText = document.querySelector('.loader-text');
  if (!loader) return;

  const messages = ['Initialising systems…', 'Loading components…', 'Calibrating precision…', 'Almost ready…'];
  let progress = 0;
  let msgIdx   = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    bar.style.width = progress + '%';

    const newMsgIdx = Math.min(Math.floor(progress / 28), messages.length - 1);
    if (newMsgIdx !== msgIdx) {
      msgIdx = newMsgIdx;
      if (loaderText) loaderText.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        revealInit();
      }, 400);
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ── Navbar Scroll ─────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Hamburger / Mobile Nav ────────────────────────────────── */
(function initMobileNav() {
  const burger    = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Particle Canvas ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const BRAND_ORANGE = 'rgba(232,75,14,';
  const count = Math.min(Math.floor(W / 14), 90);

  function mkParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.4 + 0.3,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:  -(Math.random() * 0.5 + 0.15),
      life: Math.random(),
      maxLife: Math.random() * 0.6 + 0.4,
    };
  }

  for (let i = 0; i < count; i++) {
    const p = mkParticle(); p.life = Math.random(); particles.push(p);
  }

  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.life += 0.003;
      if (p.life > p.maxLife) { particles[i] = mkParticle(); return; }

      const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55;

      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.04;
        p.vy += (dy / dist) * 0.04;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = BRAND_ORANGE + a + ')';
      ctx.fill();
    });

    // Lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 9000) {
          const alpha = (1 - d2 / 9000) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = BRAND_ORANGE + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Scroll Reveal ─────────────────────────────────────────── */
function revealInit() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
}

// Also call on DOMContentLoaded in case loader skipped
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealInit, 100);
  initCounters();
  initTilt();
  initTestimonials();
  initScrollTop();
  initFormHandler();
  initSmoothAnchor();
  initParallaxHero();
  initHeroTitleSplit();
});

/* ── Counter Animation ─────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.count;
      const dur    = 2000;
      const start  = performance.now();

      function step(now) {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ── 3D Card Tilt ──────────────────────────────────────────── */
function initTilt() {
  const cards = document.querySelectorAll('.product-card, .step-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 7;
      const rotY   =  dx * 7;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Testimonials Slider ───────────────────────────────────── */
function initTestimonials() {
  const track    = document.querySelector('.testimonials-track');
  const cards    = document.querySelectorAll('.testimonial-card');
  const dots     = document.querySelectorAll('.t-dot');
  const prevBtn  = document.getElementById('t-prev');
  const nextBtn  = document.getElementById('t-next');
  if (!track || !cards.length) return;

  let current = 0;
  let perView = getPerView();
  let maxIdx  = Math.max(0, cards.length - perView);
  let autoTimer;

  function getPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function slide(idx) {
    current = Math.max(0, Math.min(idx, maxIdx));
    const cardW = cards[0].offsetWidth;
    const gap   = 24;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => slide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => slide(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => slide(i)));

  function startAuto() {
    autoTimer = setInterval(() => slide(current >= maxIdx ? 0 : current + 1), 4500);
  }
  startAuto();
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slide(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => {
    perView = getPerView();
    maxIdx  = Math.max(0, cards.length - perView);
    slide(0);
  }, { passive: true });
}

/* ── Scroll to Top ─────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Form Handler ──────────────────────────────────────────── */
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<span>✓ Message Sent!</span>';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1600);
  });

  // Floating label effect
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => el.parentElement.classList.add('focused'));
    el.addEventListener('blur',  () => el.parentElement.classList.remove('focused'));
  });
}

/* ── Smooth Anchor Scroll ──────────────────────────────────── */
function initSmoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Hero Parallax ─────────────────────────────────────────── */
function initParallaxHero() {
  const heroBg   = document.querySelector('.hero-bg-img');
  const heroGrid = document.querySelector('.hero-grid');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (heroBg)   heroBg.style.transform   = `scale(1.06) translateY(${sy * 0.25}px)`;
        if (heroGrid) heroGrid.style.transform  = `translateY(${sy * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Hero Title Split Animation ─────────────────────────────── */
function initHeroTitleSplit() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    line.style.animationDelay = (0.4 + i * 0.18) + 's';
    line.style.animationFillMode = 'both';
    line.style.animationName = 'fadeInUp';
    line.style.animationDuration = '0.9s';
    line.style.animationTimingFunction = 'cubic-bezier(0.23, 1, 0.32, 1)';
  });
}

/* ── Gear 3D Mouse Parallax ────────────────────────────────── */
(function initGearParallax() {
  const wrap = document.querySelector('.hero-gear-3d');
  if (!wrap) return;

  document.addEventListener('mousemove', e => {
    const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    const rotX   = -yRatio * 10;
    const rotY   =  xRatio * 12;
    wrap.style.transform = `translateY(-50%) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
})();

/* ── Floating Orbs ─────────────────────────────────────────── */
(function initOrbs() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const orbDefs = [
    { w: 400, h: 400, top: '10%',  left: '-5%',  bg: 'radial-gradient(circle, rgba(232,75,14,0.06) 0%, transparent 70%)', dur: 10, tx: '30px', ty: '-20px', sc: 1.1 },
    { w: 500, h: 500, top: '40%',  left: '55%',  bg: 'radial-gradient(circle, rgba(30,60,100,0.1) 0%, transparent 70%)',  dur: 13, tx: '-40px',ty: '30px',  sc: 1.15 },
    { w: 300, h: 300, top: '70%',  left: '20%',  bg: 'radial-gradient(circle, rgba(232,75,14,0.04) 0%, transparent 70%)', dur: 9,  tx: '20px', ty: '-40px', sc: 1.08 },
  ];

  orbDefs.forEach(def => {
    const orb = document.createElement('div');
    orb.className = 'float-orb';
    Object.assign(orb.style, {
      width:      def.w + 'px', height: def.h + 'px',
      top:        def.top,      left:   def.left,
      background: def.bg,
      '--dur':    def.dur + 's',
      '--tx':     def.tx,
      '--ty':     def.ty,
      '--sc':     def.sc,
    });
    hero.appendChild(orb);
  });
})();

/* ── Active Nav Link Highlight ─────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── Number Format Utility ─────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Add active-nav style dynamically
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active-nav { color: var(--gold) !important; } .nav-links a.active-nav::after { width: 100% !important; }`;
  document.head.appendChild(style);
});