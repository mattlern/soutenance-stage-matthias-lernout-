gsap.registerPlugin(ScrollTrigger);

/* ---------------- Lenis smooth scroll ---------------- */
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------------- Loader ---------------- */
const loader = document.getElementById('loader');
const loaderCounter = document.getElementById('loaderCounter');
let count = 0;
const counterInterval = setInterval(() => {
  count += Math.ceil(Math.random() * 18);
  if (count >= 100) {
    count = 100;
    clearInterval(counterInterval);
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.2,
      onComplete: () => {
        loader.style.display = 'none';
        playHeroIntro();
        ScrollTrigger.refresh();
      }
    });
  }
  loaderCounter.textContent = count;
}, 90);

/* ---------------- Custom cursor ---------------- */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;
window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
});
function animateCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, .media-placeholder, .stat, .explore-btn').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ---------------- Hero intro animation ---------------- */
function playHeroIntro() {
  gsap.set('.hero-title .chars', { yPercent: 110 });
  gsap.timeline({ delay: 0.1 })
    .to('.eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to('.hero-title .chars', {
      yPercent: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power4.out'
    }, '-=0.3')
    .to('.hero-footer', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
}
gsap.set('.eyebrow, .hero-footer', { opacity: 0, y: 20 });

/* ---------------- Scroll progress rail ---------------- */
const progressFill = document.getElementById('progressFill');
ScrollTrigger.create({
  start: 0,
  end: () => document.documentElement.scrollHeight - window.innerHeight,
  onUpdate: (self) => {
    progressFill.style.width = `${self.progress * 100}%`;
  }
});

/* ---------------- Background color morph per section ---------------- */
document.querySelectorAll('section[data-bg]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 55%',
    end: 'bottom 45%',
    onEnter: () => morphBg(sec),
    onEnterBack: () => morphBg(sec),
  });
});
function morphBg(sec) {
  const bg = sec.getAttribute('data-bg');
  const accent = sec.getAttribute('data-accent');
  gsap.to('body', { backgroundColor: bg, duration: 0.9, ease: 'power2.out' });
  gsap.to(document.documentElement, { '--bg': bg, duration: 0.9 });
  if (accent) {
    document.documentElement.style.setProperty('--accent', accent);
    gsap.to(progressFill, { backgroundColor: accent, duration: 0.6 });
  }
}

/* ---------------- Hero background giant text parallax ---------------- */
gsap.to('.hero-bgtext', {
  yPercent: 30,
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});
gsap.to('.hero-content', {
  yPercent: -25,
  opacity: 0.2,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});
gsap.to('.scroll-cue', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '15% top',
    scrub: true,
  }
});

/* manifesto reveal handled by word-by-word animation in Level 2 */

/* ---------------- Chapters intro title ---------------- */
gsap.from('.chapters-intro-title', {
  clipPath: 'inset(0 0 100% 0)',
  duration: 1.2,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.chapters-intro',
    start: 'top 70%',
  }
});
gsap.from('.chapters-intro-sub', {
  opacity: 0, y: 30, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.chapters-intro', start: 'top 60%' }
});

/* ---------------- Chapter reveals (one timeline + one ST per chapter) ---------------- */
document.querySelectorAll('.chapter').forEach((chapter) => {
  const media = chapter.querySelector('.media-placeholder');
  const text  = chapter.querySelector('.chapter-text');
  const num   = chapter.querySelector('.chapter-num');

  /* single timeline per chapter, triggered once */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: chapter, start: 'top 68%', once: true }
  });

  if (num)   tl.fromTo(num,  { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, 0);
  if (media) tl.fromTo(media,{ clipPath: 'inset(12% 12% 12% 12%)', opacity: 0, scale: 0.92 },
                               { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, duration: 1, ease: 'power4.out' }, 0.05);
  if (text)  tl.from(Array.from(text.children), { opacity: 0, y: 32, duration: 0.75, stagger: 0.09, ease: 'power3.out' }, 0.1);

  /* num parallax — separate scrub (lightweight) */
  if (num) {
    gsap.to(num, {
      yPercent: 35, ease: 'none',
      scrollTrigger: { trigger: chapter, start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* count-up stats — one ST per chapter (not per stat) */
  const statEls = chapter.querySelectorAll('.stat-num');
  if (statEls.length) {
    ScrollTrigger.create({
      trigger: chapter, start: 'top 70%', once: true,
      onEnter: () => {
        statEls.forEach(statEl => {
          const target = parseInt(statEl.getAttribute('data-count'), 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power2.out',
            onUpdate: () => { statEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR'); }
          });
        });
      }
    });
  }
});

/* ---------------- Fifteen Partners glitch pulse ---------------- */
const glitch = document.querySelector('.glitch');
if (glitch) {
  ScrollTrigger.create({
    trigger: '#ch03',
    start: 'top 60%',
    end: 'bottom top',
    onEnter: () => startGlitch(),
    onLeave: () => stopGlitch(),
    onEnterBack: () => startGlitch(),
    onLeaveBack: () => stopGlitch(),
  });
}
let glitchInterval;
function startGlitch() {
  glitchInterval = setInterval(() => {
    glitch.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 4}px)`;
    if (Math.random() > 0.85) {
      gsap.to(glitch, { opacity: 0.4, duration: 0.04, yoyo: true, repeat: 1 });
    }
  }, 120);
}
function stopGlitch() {
  clearInterval(glitchInterval);
  if (glitch) glitch.style.transform = 'none';
}

/* ---------------- Closing items ---------------- */
gsap.from('.closing-item', {
  opacity: 0,
  x: -30,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.closing-list', start: 'top 75%' }
});
gsap.from('.closing-final', {
  opacity: 0, y: 20, duration: 1,
  scrollTrigger: { trigger: '.closing-final', start: 'top 85%' }
});

/* ================================================================
   OVERLAY SYSTEM
   ================================================================ */

const projectsOrder = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05'];

/* SVG icons for section types (index 0-4) */
const sectionIcons = [
  /* 0 — context */
  `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/><circle cx="8" cy="6" r="1.5"/></svg>`,
  /* 1 — approach/démarchage */
  `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/></svg>`,
  /* 2 — process/creative */
  `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,4 8,1 14,4 14,12 8,15 2,12 2,4"/><polyline points="8,1 8,15"/><line x1="2" y1="4" x2="14" y2="4"/></svg>`,
  /* 3 — difficulty */
  `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5L4.5 9H8l-1.5 5.5 7-8.5H10L12 1.5z"/></svg>`,
  /* 4 — results */
  `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5,11 5,7.5 8,9.5 11,5 14.5,2.5"/><line x1="1.5" y1="14" x2="14.5" y2="14"/></svg>`,
];

const projectData = {
  ch01: {
    num: '01', kicker: 'BTP · Site vitrine', title: 'Ranc & Genevois',
    accent: '#8fa6bd', url: 'https://rancetgenevoisconstruction.com', demoType: 'web',
    sections: [
      { heading: 'Contexte',        keywords: ['BTP · Lyon', 'Zéro présence web', 'Secteur traditionnel', 'Pas de logo vectorisé'] },
      { heading: 'Démarchage',      keywords: ['Email pro → appel', 'Pas "dev web"', 'Visibilité locale', 'Google Maps'] },
      { heading: 'Process',         keywords: ['Logo SVG from scratch', '6 pages', 'Textes rédigés par moi', '3 cycles d\'itération'] },
      { heading: 'Difficultés',     keywords: ['Validation 5-7 jours', 'Client peu disponible', 'Exports statiques'] },
      { heading: 'Résultats',       keywords: ['6 pages livrées', 'Premier acompte', 'Cycle complet validé', 'Mise en ligne ✓'] },
    ]
  },
  ch02: {
    num: '02', kicker: 'Boucherie artisanale · Démarchage direct', title: 'Maison Rouffiange',
    accent: '#c85c3a', url: 'https://www.maison-rouffiange.com/index.html', demoType: 'web',
    sections: [
      { heading: 'Contexte',        keywords: ['Boucherie artisanale', 'Zéro présence', 'Démarchage froid'] },
      { heading: 'Technique',       keywords: ['Prototype avant RDV', '"Je n\'ai pas besoin..."', 'Montrer > proposer'] },
      { heading: 'Différenciateur', keywords: ['Affiches anatomiques', 'Tradition × numérique', 'Élément signature'] },
      { heading: 'Difficultés',     keywords: ['Séance photo in situ', 'Livraison mi-juillet', 'Identité terroir'] },
      { heading: 'Résultats',       keywords: ['8 pages livrées', '2 RDV terrain', 'Méthode prototype adoptée'] },
    ]
  },
  ch03: {
    num: '03', kicker: 'Gestion de patrimoine · Projet avorté', title: 'Fifteen Partners',
    accent: '#8a2b2b', url: null, demoType: 'none',
    sections: [
      { heading: 'Contexte',        keywords: ['Gestion de patrimoine', 'Devis 4 000€+', 'Projet le + ambitieux'] },
      { heading: 'La promesse',     keywords: ['"On travaillera ensemble"', 'Maquettes sans contrat', 'Erreur de débutant'] },
      { heading: 'Le silence',      keywords: ['Appels sans réponse', '3 semaines d\'attente', 'Coût mental réel'] },
      { heading: 'Le dénouement',   keywords: ['Site IA générative', 'Stagiaire interne', 'Zéro explication'] },
      { heading: 'La règle',        keywords: ['Contrat avant tout', 'Acompte sans exception', 'Projet le + formateur'] },
    ]
  },
  ch04: {
    num: '04', kicker: 'Restaurant · Community management', title: 'Sacré-Alphonse',
    accent: '#e0a530', url: null, demoType: 'reel', videoSrc: 'sacre-alphonse-reel.mp4',
    sections: [
      { heading: 'Contexte',        keywords: ['Restaurant Lyon', 'CM Instagram · 3 mois', 'Total autonomie'] },
      { heading: 'Production',      keywords: ['14 contenus', '7 Reels + 7 photos', 'Brief interne', 'Même semaine'] },
      { heading: 'Technique',       keywords: ['iPhone 15 Pro', 'Hook 3 premières sec.', 'CapCut + Premiere', 'Epidemic Sound'] },
      { heading: '500 000 vues',    keywords: ['Behind the scenes', 'Zéro promotion payante', 'Authenticité > mise en scène'] },
      { heading: 'Résultats',       keywords: ['+200 abonnés organiques', '500K vues', 'Mission toujours active'] },
    ]
  },
  ch05: {
    num: '05', kicker: 'Scène électro lyonnaise · Production vidéo', title: 'DJs Lyonnais',
    accent: '#a06be0', url: null, demoType: 'video-gallery', videoSrcs: ['dj-set-01-web.mp4', 'dj-set-02-web.mp4', 'dj-set-03-web.mp4'],
    sections: [
      { heading: 'Contexte',        keywords: ['Scène électro Lyon', 'Teasers · sets · aftermovies', 'Avant l\'entreprise'] },
      { heading: 'Formats',         keywords: ['Teaser 30s = urgence', 'Aftermovie 2-3min = émotion', 'Story = 3 secondes'] },
      { heading: 'Technique',       keywords: ['Sony ZV-E10 · 35mm f/1.8', 'Lumière scène difficile', 'Look cinéma électro'] },
      { heading: 'Statut',          keywords: ['Non publiées à ce jour', 'Sorties coordonnées DJs', 'Réalité du freelance'] },
      { heading: 'Bilan',           keywords: ['Pluridisciplinarité', 'Web + vidéo + motion', 'L\'activité continue'] },
    ]
  }
};

/* -- DOM refs -- */
const overlay        = document.getElementById('overlay');
/* position overlay off-screen on load (no CSS transform conflict) */
gsap.set(overlay, { xPercent: 100 });
const overlayAccLine = document.getElementById('overlayAccentLine');
const overlayClose   = document.getElementById('overlayClose');
const overlayPrev    = document.getElementById('overlayPrev');
const overlayNext    = document.getElementById('overlayNext');
const overlayNavCount= document.getElementById('overlayNavCount');
const overlayKicker  = document.getElementById('overlayKicker');
const overlayTitle   = document.getElementById('overlayTitle');
const overlaySections= document.getElementById('overlaySections');
const overlayTextPanel= document.getElementById('overlayTextPanel');
const overlayIframe  = document.getElementById('overlayIframe');
const overlayVideo        = document.getElementById('overlayVideo');
const overlayVideoSwitcher= document.getElementById('overlayVideoSwitcher');
const demoPlaceholder= document.getElementById('demoPlaceholder');
const demoPHNum      = document.getElementById('demoPHNum');
const demoPHLabel    = document.getElementById('demoPHLabel');
const demoPHSub      = document.getElementById('demoPHSub');
const browserUrlText = document.getElementById('browserUrlText');
const browserOpenLink= document.getElementById('browserOpenLink');

let currentProjectId = null;
let previousFocus    = null;
const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* -- populate content (no animation) -- */
function populateOverlay(id) {
  const data = projectData[id];
  if (!data) return;
  currentProjectId = id;

  /* accent color */
  overlay.style.setProperty('--overlay-accent', data.accent);
  overlayAccLine.style.background = data.accent;

  /* header */
  overlayKicker.textContent = data.kicker;
  overlayTitle.textContent  = data.title;

  /* nav counter */
  const idx = projectsOrder.indexOf(id);
  overlayNavCount.textContent = `${String(idx + 1).padStart(2,'0')} / 0${projectsOrder.length}`;

  /* sections — keyword pills with SVG icons */
  overlaySections.innerHTML = data.sections.map((s, i) => `
    <div class="overlay-section">
      <div class="section-icon-label">
        <span class="section-icon">${sectionIcons[i] || sectionIcons[0]}</span>
        <h4 class="overlay-section-heading">${s.heading}</h4>
      </div>
      <div class="section-keywords">
        ${s.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
    </div>`).join('');

  overlayTextPanel.scrollTop = 0;

  /* demo panel — reset all */
  overlayIframe.style.display = 'none';
  overlayIframe.src = '';
  overlayVideo.style.display = 'none';
  overlayVideo.pause();
  overlayVideo.src = '';
  overlayVideoSwitcher.style.display = 'none';
  overlayVideoSwitcher.innerHTML = '';
  demoPlaceholder.classList.add('hidden');
  browserOpenLink.classList.add('hidden');

  if (data.demoType === 'video-gallery' && data.videoSrcs?.length) {
    /* multi-video carousel for DJ sets */
    overlayVideo.style.display = 'block';
    browserUrlText.textContent = 'productions vidéo · scène électro lyon';
    overlayVideoSwitcher.style.display = 'flex';

    function loadVideo(idx) {
      overlayVideo.src = data.videoSrcs[idx];
      overlayVideo.load();
      overlayVideo.play().catch(() => {});
      overlayVideoSwitcher.querySelectorAll('.video-switcher-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
    }

    data.videoSrcs.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'video-switcher-btn' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Vidéo ${i + 1}`);
      btn.addEventListener('click', () => loadVideo(i));
      btn.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      btn.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      overlayVideoSwitcher.appendChild(btn);
    });

    loadVideo(0);

  } else if (data.demoType === 'reel' && data.videoSrc) {
    /* single vertical Reels video */
    overlayVideo.style.display = 'block';
    overlayVideo.src = data.videoSrc;
    overlayVideo.load();
    overlayVideo.play().catch(() => {});
    browserUrlText.textContent = '@sacre.alphonse · instagram';
  } else if (data.url) {
    /* live website iframe */
    overlayIframe.style.display = 'block';
    overlayIframe.src = data.url;
    browserUrlText.textContent = data.url.replace(/^https?:\/\//, '');
    browserOpenLink.href = data.url;
    browserOpenLink.classList.remove('hidden');
  } else {
    /* placeholder */
    demoPlaceholder.classList.remove('hidden');
    demoPHNum.textContent = data.num;
    const states = {
      'web-pending': { url: 'mise en ligne prochainement', label: 'Site en cours de mise en ligne', sub: 'L\'URL sera renseignée prochainement' },
      'none':        { url: 'projet non livré',            label: 'Projet non livré',               sub: 'Remplacé par un site IA générative' },
      'video':       { url: 'productions non publiées',    label: 'Productions vidéo',              sub: 'Sorties prévues post-soutenance' },
    };
    const s = states[data.demoType] || states['web-pending'];
    browserUrlText.textContent = s.url;
    demoPHLabel.textContent    = s.label;
    demoPHSub.textContent      = s.sub;
    if (data.demoType === 'none') demoPHNum.textContent = '✕';
  }
}

/* -- wheel blocker: stop events from bubbling to Lenis at window level -- */
function stopWheelPropagation(e) { e.stopPropagation(); }

/* -- open overlay with slide-in -- */
function openOverlay(id) {
  previousFocus = document.activeElement;
  populateOverlay(id);
  overlay.classList.add('is-open');
  lenis.stop();
  /* allow native scroll inside overlay panels */
  overlayTextPanel.addEventListener('wheel', stopWheelPropagation);
  overlayTextPanel.addEventListener('touchmove', stopWheelPropagation);

  if (prefersReduced) {
    gsap.set(overlay, { xPercent: 0 });
    overlayClose.focus();
  } else {
    gsap.fromTo(overlay,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.65, ease: 'power4.out', onComplete: () => overlayClose.focus() }
    );
  }
}

/* -- close with slide-out -- */
function closeOverlay() {
  overlayTextPanel.removeEventListener('wheel', stopWheelPropagation);
  overlayTextPanel.removeEventListener('touchmove', stopWheelPropagation);
  const done = () => {
    overlay.classList.remove('is-open');
    overlayIframe.src = '';
    overlayVideo.pause();
    overlayVideo.src = '';
    currentProjectId = null;
    lenis.start();
    if (previousFocus) previousFocus.focus();
  };
  if (prefersReduced) { gsap.set(overlay, { xPercent: 100 }); done(); }
  else gsap.to(overlay, { xPercent: 100, duration: 0.42, ease: 'power3.in', onComplete: done });
}

/* -- navigate between projects with content fade -- */
function navigateTo(id) {
  if (prefersReduced) { populateOverlay(id); return; }
  gsap.to(overlaySections, {
    opacity: 0, y: -10, duration: 0.15,
    onComplete: () => {
      populateOverlay(id);
      gsap.fromTo(overlaySections, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
    }
  });
}

/* -- event listeners -- */
document.querySelectorAll('.explore-btn').forEach(btn =>
  btn.addEventListener('click', () => openOverlay(btn.dataset.project))
);

overlayClose.addEventListener('click', closeOverlay);

overlayPrev.addEventListener('click', () => {
  const idx = projectsOrder.indexOf(currentProjectId);
  navigateTo(projectsOrder[(idx - 1 + projectsOrder.length) % projectsOrder.length]);
});
overlayNext.addEventListener('click', () => {
  const idx = projectsOrder.indexOf(currentProjectId);
  navigateTo(projectsOrder[(idx + 1) % projectsOrder.length]);
});

document.addEventListener('keydown', e => {
  if (!overlay.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeOverlay();
  if (e.key === 'ArrowRight') { const i = projectsOrder.indexOf(currentProjectId); navigateTo(projectsOrder[(i+1)%projectsOrder.length]); }
  if (e.key === 'ArrowLeft')  { const i = projectsOrder.indexOf(currentProjectId); navigateTo(projectsOrder[(i-1+projectsOrder.length)%projectsOrder.length]); }
});

/* -- cursor hover for overlay controls -- */
document.querySelectorAll('.overlay-close,.overlay-nav-btn,.browser-open-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ================================================================
   LEVEL 2 — BEST TRANSITIONS
   ================================================================ */

/* -- Manifesto: word-by-word reveal (readable, triggered early) -- */
(function wrapManifestoWords() {
  const mt = document.querySelector('.manifesto-text');
  if (!mt) return;
  mt.innerHTML = mt.innerHTML.replace(/(\S+)/g, '<span class="word">$1</span>');
  const words = mt.querySelectorAll('.word');
  gsap.set(words, { opacity: 0.12, y: 8 });
  gsap.to(words, {
    opacity: 1,
    y: 0,
    stagger: 0.025,
    duration: 0.45,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.manifesto',
      start: 'top 85%',
      once: true,
    }
  });
})();

/* -- Chapter dots: show when chapters start, update active -- */
(function initChapterDots() {
  const dots = document.getElementById('chapterDots');
  if (!dots) return;

  const chapters = document.querySelectorAll('.chapter');
  const firstChapter = chapters[0];
  const lastChapter  = chapters[chapters.length - 1];

  /* show/hide */
  ScrollTrigger.create({
    trigger: firstChapter,
    start: 'top 60%',
    onEnter: () => dots.classList.add('visible'),
    onLeaveBack: () => dots.classList.remove('visible'),
  });
  ScrollTrigger.create({
    trigger: lastChapter,
    start: 'bottom 50%',
    onEnter: () => dots.classList.remove('visible'),
    onLeaveBack: () => dots.classList.add('visible'),
  });

  /* active state per chapter */
  chapters.forEach((ch) => {
    const id = ch.id;
    const dot = dots.querySelector(`[data-ch="${id}"]`);
    if (!dot) return;
    ScrollTrigger.create({
      trigger: ch,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        dots.querySelectorAll('.chapter-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      },
      onEnterBack: () => {
        dots.querySelectorAll('.chapter-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  });

  /* click to scroll */
  dots.querySelectorAll('.chapter-dot').forEach(dot => {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.ch);
      if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });
})();

/* -- Chapter punch border line-in -- */
document.querySelectorAll('.chapter-punch').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () => el.classList.add('line-in'),
  });
});

/* -- Chapters intro HR reveal -- */
(function initIntroHr() {
  const intro = document.querySelector('.chapters-intro');
  if (!intro) return;
  const hr = document.createElement('div');
  hr.className = 'chapters-intro-hr';
  intro.appendChild(hr);
  ScrollTrigger.create({
    trigger: intro,
    start: 'top 65%',
    once: true,
    onEnter: () => hr.classList.add('in-view'),
  });
})();

/* velocity skew removed — caused layout jank */

/* -- Magnetic cursor on explore buttons -- */
document.querySelectorAll('.explore-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(btn, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.5)' });
  });
});

/* -- Hero ticker pause on hover -- */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => gsap.to(tickerTrack, { timeScale: 0, duration: 0.4 }));
  tickerTrack.addEventListener('mouseleave', () => gsap.to(tickerTrack, { timeScale: 1, duration: 0.4 }));
}

/* chapter-title, kicker, stats, closing-title — handled by original chapter reveal system */
