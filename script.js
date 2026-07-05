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

/* ---------------- Manifesto reveal ---------------- */
gsap.from('.manifesto-text', {
  opacity: 0.15,
  scrollTrigger: {
    trigger: '.manifesto',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  }
});

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

/* ---------------- Chapter reveals ---------------- */
document.querySelectorAll('.chapter').forEach((chapter) => {
  const media = chapter.querySelector('.media-placeholder');
  const text = chapter.querySelector('.chapter-text');
  const num = chapter.querySelector('.chapter-num');

  if (media) {
    gsap.from(media, {
      clipPath: 'inset(15% 15% 15% 15%)',
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: { trigger: chapter, start: 'top 65%' }
    });
  }
  if (text) {
    gsap.from(text.children, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: chapter, start: 'top 60%' }
    });
  }
  if (num) {
    gsap.fromTo(num,
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: chapter, start: 'top 75%' }
      }
    );
    gsap.to(num, {
      yPercent: 40,
      ease: 'none',
      scrollTrigger: { trigger: chapter, start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* count-up stats */
  chapter.querySelectorAll('.stat-num').forEach((statEl) => {
    const target = parseInt(statEl.getAttribute('data-count'), 10);
    ScrollTrigger.create({
      trigger: statEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            statEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR');
          }
        });
      }
    });
  });
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

const projectData = {
  ch01: {
    num: '01', kicker: 'BTP · Site vitrine', title: 'Ranc & Genevois',
    accent: '#8fa6bd', url: null, demoType: 'web-pending',
    sections: [
      { heading: 'Contexte', body: 'Ranc & Genevois est une entreprise du BTP implantée à Lyon. Zéro présence en ligne au départ — pas de site, pas de réseaux sociaux, pas même un logo vectorisé. Dans un secteur où la réputation se bâtit encore par le bouche-à-oreille, la transition numérique n\'était pas une priorité pour le client.' },
      { heading: 'Démarchage', body: 'Premier contact par email professionnel, suivi d\'un appel téléphonique. L\'approche : se présenter comme spécialiste en visibilité d\'entreprises artisanales, pas comme un développeur web. Discours ancré dans leur réalité — crédibilité face aux grands groupes, visibilité Google Maps, référencement local.' },
      { heading: 'Process créatif', body: 'Partir de rien : logotype créé de A à Z en SVG, palette inspirée des matériaux de chantier (béton, acier, terre), contenus texte entièrement rédigés faute de brief client. Six pages structurées : accueil, services, réalisations, équipe, devis, contact. Trois cycles d\'itérations pour affiner les textes et la hiérarchie visuelle.' },
      { heading: 'Difficultés', body: 'Disponibilité réduite du client — chaque validation prenait 5 à 7 jours. J\'ai appris à envoyer des exports statiques plutôt que des liens de prévisualisation bruts : ça réduit le temps de décision. Autre point dur : la rédaction des textes, entièrement à ma charge faute de brief.' },
      { heading: 'Résultats', body: '6 pages livrées en 5 semaines. Nom de domaine co-sélectionné avec le client. Premier contrat signé avec acompte — première validation en conditions réelles du cycle complet : devis → signature → acompte → itérations → livraison.' }
    ]
  },
  ch02: {
    num: '02', kicker: 'Boucherie artisanale · Démarchage direct', title: 'Maison Rouffiange',
    accent: '#c85c3a', url: null, demoType: 'web-pending',
    sections: [
      { heading: 'Contexte', body: 'Maison Rouffiange est une boucherie artisanale lyonnaise à forte identité locale. Le patron n\'avait pas de présence numérique — et ne la cherchait pas. C\'est moi qui suis allé le chercher, sans invitation, sans brief, sans commande.' },
      { heading: 'La technique du prototype', body: '« Je n\'ai pas besoin de site internet. » — première réponse du client, en face à face dans sa boutique. J\'avais construit une maquette complète du site avant même d\'avoir rendez-vous, uniquement à partir de ce qui était disponible en ligne. Montrer quelque chose de déjà concret change tout : on ne vend plus une idée, on montre une réalité.' },
      { heading: 'L\'élément différenciateur', body: 'Les affiches pédagogiques de boucherie — schémas anatomiques des morceaux de viande, typographie traditionnelle de boucher — intégrées comme éléments graphiques animés dans le design. Un pari entre tradition artisanale et modernité numérique. C\'est cet élément qui a transformé la curiosité en signature.' },
      { heading: 'Difficultés', body: 'Timing serré : livraison prévue début juillet, juste avant la soutenance. La gestion des photos produit en haute qualité a nécessité une séance photo en boutique. Défi créatif : rester fidèle à l\'identité terroir sans tomber dans le cliché rustique.' },
      { heading: 'Résultats', body: '8 pages livrées. 2 rendez-vous terrain. Le projet a redéfini ma méthode de prospection : le prototype pré-livraison est désormais mon approche systématique pour tous les démarchages directs.' }
    ]
  },
  ch03: {
    num: '03', kicker: 'Gestion de patrimoine · Projet avorté', title: 'Fifteen Partners',
    accent: '#8a2b2b', url: null, demoType: 'none',
    sections: [
      { heading: 'Le contexte', body: 'Fifteen Partners est un cabinet de conseil en gestion de patrimoine. Devis à plus de 4 000 € — le plus ambitieux du stage. Site complexe avec espace client, contenu juridique structuré, identité visuelle haut de gamme. Tout semblait parfaitement aligné.' },
      { heading: 'La promesse verbale', body: '« On travaillera ensemble dans tous les cas. » — cette phrase prononcée lors du premier rendez-vous m\'a conduit à commencer les maquettes avant même la signature du devis. Pas de contrat. Pas d\'acompte. Juste une parole.' },
      { heading: 'Le silence', body: 'Appels sans réponse. Messages promettant un rappel qui ne vient jamais. Deux semaines, puis trois. J\'ai dû continuer les autres projets en parallèle sans laisser cette incertitude bloquer le reste de l\'activité — mais l\'attente a un coût réel en énergie mentale.' },
      { heading: 'Le dénouement', body: 'Un mail, des semaines plus tard. Un stagiaire de l\'entreprise avait produit un site avec une IA générative. Aucune explication supplémentaire. Aucun geste commercial. Fin de l\'histoire.' },
      { heading: 'La règle immuable', body: 'Aucun travail ne commence sans contrat signé et acompte versé — sans exception, quelle que soit la relation ou le montant. Ce projet avorté est paradoxalement l\'un des plus formateurs du stage : il a structuré définitivement mes pratiques commerciales.' }
    ]
  },
  ch04: {
    num: '04', kicker: 'Restaurant · Community management', title: 'Sacré-Alphonse',
    accent: '#e0a530', url: null, demoType: 'social',
    sections: [
      { heading: 'Contexte', body: 'Sacré-Alphonse est un restaurant lyonnais avec une identité forte — bistronomie décomplexée, ambiance chaleureuse, clientèle fidèle. Mission : community management Instagram sur 3 mois, avec production de contenus originaux en total autonomie.' },
      { heading: 'Process créatif', body: '14 contenus produits : 7 Reels, 7 photos. Brief interne établi dès le départ — ton chaleureux, décalé, jamais forcé. Chaque contenu planifié, shooté sur place, monté et publié dans la même semaine.' },
      { heading: 'Technique de production', body: 'Captation smartphone (iPhone 15 Pro) + réflecteur portatif pour les intérieurs. Montage sur CapCut et Premiere Pro. Sous-titres natifs corrigés manuellement. Musique depuis Epidemic Sound. Chaque Reels optimisé pour les 3 premières secondes — hook narratif et accroche visuelle immédiats.' },
      { heading: 'Le Reels à 500 000 vues', body: 'Un format « behind the scenes cuisine » — simple, authentique, zéro mise en scène forcée — a atteint 500 000 vues sans aucune promotion payante. Résultat qui dépasse les performances de la page depuis sa création. Leçon : la régularité crée la base, l\'authenticité déclenche la viralité.' },
      { heading: 'Résultats', body: '+200 abonnés organiques en 3 mois. 500 000 vues sur le meilleur Reels. Taux d\'engagement supérieur au benchmark restauration. La mission se poursuit au-delà de la fin du stage.' }
    ]
  },
  ch05: {
    num: '05', kicker: 'Scène électro lyonnaise · Production vidéo', title: 'DJs Lyonnais',
    accent: '#a06be0', url: null, demoType: 'video',
    sections: [
      { heading: 'Contexte', body: 'En parallèle des projets web, la vidéo — le médium par lequel tout a commencé, avant même la création de l\'entreprise. Teasers d\'événements, captation de sets live, aftermovies, motion design pour plusieurs DJs de la scène électronique lyonnaise.' },
      { heading: 'Formats produits', body: 'Plusieurs livrables : teasers 30s pour des soirées, aftermovies 2-3 min, visuels animés pour stories Instagram. Chaque format répond à une logique différente — le teaser crée l\'urgence, l\'aftermovie capture l\'émotion, le visuel story retient en 3 secondes.' },
      { heading: 'Technique', body: 'Captation en conditions difficiles : lumière artificielle intense, mouvement constant. Sony ZV-E10 + 35mm f/1.8. Post-production sur Premiere Pro + After Effects pour les motion graphics. Étalonnage colorimétrique spécifique — teintes froides, hauts contrastes, look cinéma électro.' },
      { heading: 'Statut des productions', body: 'Ces productions ne sont pas publiées à la date de la soutenance — les DJs les conservent pour des sorties coordonnées avec leurs dates d\'événements. C\'est la réalité du freelance dans ce secteur : les délais de publication ne dépendent pas du prestataire.' },
      { heading: 'Ce que ça dit', body: 'Ce projet rappelle pourquoi la pluridisciplinarité est ma vraie valeur ajoutée. Web, vidéo, réseaux sociaux, motion design — je peux tout livrer pour un même client. Le stage se termine. L\'activité, non.' }
    ]
  }
};

/* -- DOM refs -- */
const overlay        = document.getElementById('overlay');
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

  /* sections */
  overlaySections.innerHTML = data.sections.map(s => `
    <div class="overlay-section">
      <h4 class="overlay-section-heading">${s.heading}</h4>
      <p class="overlay-section-body">${s.body}</p>
    </div>`).join('');

  overlayTextPanel.scrollTop = 0;

  /* demo panel */
  if (data.url) {
    overlayIframe.style.display = 'block';
    overlayIframe.src = data.url;
    demoPlaceholder.classList.add('hidden');
    browserUrlText.textContent = data.url.replace(/^https?:\/\//, '');
    browserOpenLink.href = data.url;
    browserOpenLink.classList.remove('hidden');
  } else {
    overlayIframe.style.display = 'none';
    overlayIframe.src = '';
    demoPlaceholder.classList.remove('hidden');
    browserOpenLink.classList.add('hidden');
    demoPHNum.textContent = data.num;

    const states = {
      'web-pending': { url: 'mise en ligne prochainement', label: 'Site en cours de mise en ligne',   sub: 'L\'URL sera renseignée prochainement' },
      'none':        { url: 'projet non livré',            label: 'Projet non livré',                 sub: 'Remplacé par un site IA générative' },
      'social':      { url: '@sacre.alphonse · instagram', label: 'Mission community management',     sub: 'Contenu disponible sur Instagram' },
      'video':       { url: 'productions non publiées',    label: 'Productions vidéo',                sub: 'Sorties prévues post-soutenance' }
    };
    const s = states[data.demoType] || states['web-pending'];
    browserUrlText.textContent = s.url;
    demoPHLabel.textContent    = s.label;
    demoPHSub.textContent      = s.sub;

    if (data.demoType === 'none') demoPHNum.textContent = '✕';
  }
}

/* -- open overlay with slide-in -- */
function openOverlay(id) {
  previousFocus = document.activeElement;
  populateOverlay(id);
  overlay.classList.add('is-open');
  lenis.stop();

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
  const done = () => {
    overlay.classList.remove('is-open');
    overlayIframe.src = '';
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

/* -- Manifesto: word-by-word scrubbed reveal -- */
(function wrapManifestoWords() {
  const mt = document.querySelector('.manifesto-text');
  if (!mt) return;
  mt.innerHTML = mt.innerHTML.replace(/(\S+)/g, '<span class="word">$1</span>');
  const words = mt.querySelectorAll('.word');
  gsap.set(words, { opacity: 0.08 });
  gsap.to(words, {
    opacity: 1,
    stagger: 0.05,
    ease: 'none',
    scrollTrigger: {
      trigger: '.manifesto',
      start: 'top 75%',
      end: 'bottom 35%',
      scrub: 0.6,
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

/* -- Scroll velocity: subtle skew on chapter grids -- */
(function initVelocitySkew() {
  const grids = document.querySelectorAll('.chapter-grid');
  let lastY = 0;
  let skewAmt = 0;
  lenis.on('scroll', ({ scroll }) => {
    const delta = scroll - lastY;
    lastY = scroll;
    skewAmt += (-delta * 0.018 - skewAmt) * 0.12;
    grids.forEach(g => gsap.set(g, { skewY: Math.max(-2.5, Math.min(2.5, skewAmt)) }));
  });
})();

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

/* -- Chapter title staggered clip-path reveal (enhanced) -- */
document.querySelectorAll('.chapter-title').forEach(title => {
  gsap.fromTo(title,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 80%', once: true }
    }
  );
});

/* -- Chapter kicker slide up -- */
document.querySelectorAll('.chapter-kicker').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 18, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
  });
});

/* -- Stats stagger entrance -- */
document.querySelectorAll('.chapter-stats').forEach(stats => {
  gsap.from(stats.querySelectorAll('.stat'), {
    opacity: 0, y: 22, scale: 0.92, duration: 0.7,
    stagger: 0.12, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: stats, start: 'top 82%', once: true }
  });
});

/* -- Closing title clip reveal -- */
gsap.fromTo('.closing-title',
  { clipPath: 'inset(0 0 100% 0)' },
  {
    clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out',
    scrollTrigger: { trigger: '.closing-title', start: 'top 75%', once: true }
  }
);
