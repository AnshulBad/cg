/* ═══════════════════════════════════════════════════════════
   Compliance Quest — Intro Slideshow Controller
   Plays 4 slides before the login screen:
     1. Cybersecurity teaser
     2. POSH teaser
     3. Business Continuity teaser
     4. UI Tour (annotated mock-HUD with animated cursor pointers)
   Tracks dwell time per domain slide and pre-selects the winner.
═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── Slide Definitions ─────────────────────────────────── */
    const SLIDES = [
        {
            domain: 'cyber',
            icon: '🛡️',
            title: 'Is Your Data Safe?',
            sub: 'CYBERSECURITY',
            tagline: 'Every click, every email, every link — a potential threat. Learn to detect and defend your digital workspace.',
            accent: '#38bdf8',
            accentRgb: '56,189,248',
            bg: 'radial-gradient(ellipse at 25% 15%, rgba(56,189,248,.18), transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(56,189,248,.1), transparent 55%), #04111f',
            theme: 'cyber',
            duration: 8000,
        },
        {
            domain: 'posh',
            icon: '🤝',
            title: 'Respect Starts With Awareness',
            sub: 'POSH',
            tagline: 'A safe workplace is everyone\'s responsibility. Know the limits. Speak up. Be the change others need.',
            accent: '#f472b6',
            accentRgb: '244,114,182',
            bg: 'radial-gradient(ellipse at 25% 15%, rgba(244,114,182,.18), transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(167,139,250,.12), transparent 55%), #120917',
            theme: 'posh',
            duration: 8000,
        },
        {
            domain: 'business',
            icon: '🏢',
            title: 'When Things Go Wrong—\nAre You Ready?',
            sub: 'BUSINESS CONTINUITY',
            tagline: 'Disruptions happen. Crises hit without warning. The question is: does your team know what to do next?',
            accent: '#fbbf24',
            accentRgb: '251,191,36',
            bg: 'radial-gradient(ellipse at 25% 15%, rgba(251,191,36,.14), transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(251,191,36,.07), transparent 55%), #0e0900',
            theme: 'business',
            duration: 8000,
        },
        {
            domain: null,
            icon: '🖱️',
            title: 'Here\'s How You Play',
            sub: 'QUICK LOOK',
            tagline: 'Walk the office, meet NPCs, and answer compliance scenarios before time runs out.',
            accent: '#818cf8',
            accentRgb: '129,140,248',
            bg: 'radial-gradient(ellipse at center, rgba(129,140,248,.12), transparent 60%), #080e1a',
            theme: 'tour',
            duration: 14000,
        },
        {
            domain: null,
            icon: '🛡️',
            title: 'Maintain Your Reputation',
            sub: 'OFFICE RULES',
            tagline: 'Your professional reputation drops if you ignore queries or provide unsafe advice. Walk around, help colleagues, and stay alert to maintain high health!',
            accent: '#34d399',
            accentRgb: '52,211,153',
            bg: 'radial-gradient(ellipse at center, rgba(52,211,153,.1), transparent 60%), #051412',
            theme: 'rules',
            duration: 9000,
        },
        {
            domain: null,
            icon: '⌨️',
            title: 'Game Controls',
            sub: 'HOW TO PLAY',
            tagline: 'Use Arrow Keys or W-A-S-D to walk around the office. Press ESC anytime to pause the game and save your progress to log out.',
            accent: '#a78bfa',
            accentRgb: '167,139,250',
            bg: 'radial-gradient(ellipse at center, rgba(167,139,250,.12), transparent 60%), #0d0a15',
            theme: 'controls',
            duration: 8000,
        },
    ];

    /* ── State ─────────────────────────────────────────────── */
    let currentIndex = 0;
    let slideTimer = null;
    let slideStartTime = null;
    const dwellTime = { cyber: 0, posh: 0, business: 0 };

    /* ── DOM refs ──────────────────────────────────────────── */
    const introScreen = document.getElementById('introScreen');
    const skipBtn = document.getElementById('introSkipBtn');
    const dotsWrap = document.getElementById('introDots');
    const slideContent = document.getElementById('introSlideContent');
    const progressBar = document.getElementById('introProgressBar');

    if (!introScreen) return; // guard: html hasn't included intro yet

    // Skip intro if already played in this session
    if (sessionStorage.getItem('cg_intro_played')) {
        introScreen.style.display = 'none';
        return;
    }

    /* ── Build navigation dots ─────────────────────────────── */
    SLIDES.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'intro-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
    });

    skipBtn.addEventListener('click', finishIntro);

    /* ── Slide navigation ──────────────────────────────────── */
    function goToSlide(index) {
        recordDwell();
        currentIndex = index;
        showSlide(index);
    }

    function recordDwell() {
        const domain = SLIDES[currentIndex].domain;
        if (domain && slideStartTime) {
            dwellTime[domain] += Date.now() - slideStartTime;
        }
    }

    function showSlide(index) {
        const slide = SLIDES[index];
        slideStartTime = Date.now();

        // Dots
        document.querySelectorAll('.intro-dot').forEach((d, i) =>
            d.classList.toggle('active', i === index)
        );

        // Background
        introScreen.style.background = slide.bg;

        // Content
        slideContent.innerHTML = '';
        slideContent.classList.remove('visible');
        void slideContent.offsetWidth; // reflow to restart animation
        slideContent.classList.add('visible');

        if (slide.theme === 'tour') {
            buildTourSlide(slide);
        } else {
            buildDomainSlide(slide);
        }

        // Progress bar
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        progressBar.style.background = `linear-gradient(90deg,
      rgba(${slide.accentRgb},.6),
      rgba(${slide.accentRgb},1),
      rgba(${slide.accentRgb},.6))`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            progressBar.style.transition = `width ${slide.duration}ms linear`;
            progressBar.style.width = '100%';
        }));

        // Auto-advance
        clearTimeout(slideTimer);
        slideTimer = setTimeout(() => {
            if (index < SLIDES.length - 1) goToSlide(index + 1);
            else finishIntro();
        }, slide.duration);
    }

    /* ── Domain slide builder ──────────────────────────────── */
    function buildDomainSlide(slide) {
        const wrap = document.createElement('div');
        wrap.className = `slide-domain slide-theme-${slide.theme}`;

        wrap.innerHTML = `
      <div class="slide-theme-fx"></div>
      <div class="slide-domain-inner">
        <div class="slide-pill" style="color:${slide.accent};background:rgba(${slide.accentRgb},.1);border-color:rgba(${slide.accentRgb},.3)">
          ${slide.sub}
        </div>
        <div class="slide-icon">${slide.icon}</div>
        <h2 class="slide-title">${slide.title}</h2>
        <p class="slide-tagline">${slide.tagline}</p>
        <div class="slide-cta" style="color:${slide.accent}">↓ Keep watching to learn more</div>
      </div>
    `;
        slideContent.appendChild(wrap);
    }

    /* ── UI Tour slide builder ─────────────────────────────── */
    function buildTourSlide(slide) {
        const wrap = document.createElement('div');
        wrap.className = 'slide-tour-wrap';
        wrap.innerHTML = `
      <div class="tour-heading">
        <div class="slide-pill" style="color:${slide.accent};background:rgba(${slide.accentRgb},.1);border-color:rgba(${slide.accentRgb},.3)">
          ${slide.sub}
        </div>
        <h2 class="slide-title" style="margin-bottom:6px">${slide.title}</h2>
        <p class="slide-tagline" style="font-size:.88rem">${slide.tagline}</p>
      </div>

      <!-- Mock in-game HUD -->
      <div class="mock-hud" id="tourHud">
        <div class="mock-hud-brand">⚡ <span>Compliance Quest</span></div>
        <div class="mock-sep"></div>
        <div class="mock-hearts" id="tourHearts">
          <svg class="mock-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg class="mock-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg class="mock-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <div class="mock-sep"></div>
        <div class="mock-tag cyan" id="tourDomain">🛡️ CYBER</div>
        <div class="mock-tag gold" id="tourLevel">LVL 1</div>
        <div class="mock-sep"></div>
        <div class="mock-stat">Score: <span id="tourScore">120</span></div>
        <div style="margin-left:auto">
          <span class="mock-timer" id="tourTimer">⏱ 0:28</span>
        </div>
      </div>

      <!-- Mock Scenario Card -->
      <div class="mock-scenario" id="tourScenario">
        <div class="mock-cloud-hdr">
          <div class="mock-avatar">👤</div>
          <div>
            <div class="mock-npc-name">Maya — HR Manager</div>
            <div class="mock-npc-sub">L2 · Cybersecurity</div>
          </div>
        </div>
        <div class="mock-question">You receive an urgent email asking you to reset your password. What do you do?</div>
        <div class="mock-opts">
          <div class="mock-opt" data-letter="A">Ignore it and continue working</div>
          <div class="mock-opt" data-letter="B">Report it to the IT Security Team</div>
          <div class="mock-opt" data-letter="C">Click the link and reset your password</div>
        </div>
      </div>

      <!-- Cursor annotations injected here -->
      <div id="cursorLayer"></div>
    `;
        slideContent.appendChild(wrap);

        // Kick off cursor sequence after everything renders
        setTimeout(startCursorSequence, 900);
    }

    /* ── Cursor annotation sequence ────────────────────────── */
    const ANNOTATIONS = [
        {
            id: 'tourHearts',
            label: 'Health Units — your professional standing in the firm',
            color: '#38bdf8',
            anchorX: 0.5, anchorY: 1,
            tipPos: 'below',
        },
        {
            id: 'tourScore',
            label: 'Score — earn points for correct choices',
            color: '#34d399',
            anchorX: 0.5, anchorY: 1,
            tipPos: 'below',
        },
        {
            id: 'tourLevel',
            label: 'Level — difficulty increases as you progress',
            color: '#fbbf24',
            anchorX: 0.5, anchorY: 1,
            tipPos: 'below',
        },
        {
            id: 'tourTimer',
            label: 'Timer — answer before time runs out!',
            color: '#fb923c',
            anchorX: 0.5, anchorY: 1,
            tipPos: 'below',
        },
        {
            id: 'tourScenario',
            label: 'Scenario Card — read carefully and choose wisely!',
            color: '#818cf8',
            anchorX: 0.5, anchorY: 0,
            tipPos: 'above',
        },
    ];

    let annIdx = 0;
    let activeCursor = null;
    let twTimer = null;

    function startCursorSequence() {
        annIdx = 0;
        placeNextCursor();
    }

    function placeNextCursor() {
        if (annIdx >= ANNOTATIONS.length) return;
        const ann = ANNOTATIONS[annIdx++];

        const target = document.getElementById(ann.id);
        const layer = document.getElementById('cursorLayer');
        if (!target || !layer) return;

        const tRect = target.getBoundingClientRect();
        const lRect = introScreen.getBoundingClientRect();

        const cx = (tRect.left - lRect.left) + tRect.width * ann.anchorX;
        const cy = (tRect.top - lRect.top) + tRect.height * ann.anchorY + (ann.tipPos === 'below' ? 6 : -6);

        /* Dismiss previous cursor smoothly */
        if (activeCursor) {
            activeCursor.classList.add('exiting');
            const old = activeCursor;
            setTimeout(() => old.remove(), 350);
        }

        /* Build new cursor element */
        const el = document.createElement('div');
        el.className = 'cursor-ann' + (ann.tipPos === 'above' ? ' tip-above' : '');
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';

        const rgb = hexToRgb(ann.color);
        el.innerHTML = `
      <svg class="cursor-svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 2L24 14L15 15.8L11.5 24Z"
          fill="${ann.color}"
          stroke="rgba(255,255,255,.9)"
          stroke-width="1.2"
          stroke-linejoin="round"/>
      </svg>
      <div class="cursor-tip"
           style="border-color:rgba(${rgb},.45);
                  box-shadow:0 4px 24px rgba(${rgb},.25),0 0 0 1px rgba(${rgb},.15)">
        <span class="cursor-tip-accent" style="background:rgba(${rgb},.15);color:${ann.color}"></span>
        <span class="cursor-tip-text"></span>
      </div>
    `;
        layer.appendChild(el);
        activeCursor = el;

        /* Typewriter for the label text */
        const accentEl = el.querySelector('.cursor-tip-accent');
        const textEl = el.querySelector('.cursor-tip-text');
        // First word goes in the accent badge
        const words = ann.label.split('—');
        const badge = words[0].trim();
        const rest = words.length > 1 ? '— ' + words[1].trim() : '';

        let i = 0;
        clearInterval(twTimer);
        accentEl.textContent = badge;
        twTimer = setInterval(() => {
            if (i < rest.length) {
                textEl.textContent += rest[i++];
            } else {
                clearInterval(twTimer);
            }
        }, 26);

        setTimeout(placeNextCursor, 2400);
    }

    /* ── Finish intro → show login ─────────────────────────── */
    function finishIntro() {
        recordDwell();
        clearTimeout(slideTimer);
        clearInterval(twTimer);

        // Find dominant domain
        let dominant = 'cyber';
        let maxTime = 0;
        for (const [d, t] of Object.entries(dwellTime)) {
            if (t > maxTime) { maxTime = t; dominant = d; }
        }

        // Fade out
        introScreen.style.transition = 'opacity .65s ease';
        introScreen.style.opacity = '0';

        setTimeout(() => {
            introScreen.style.display = 'none';

            // Pre-select the most-watched domain
            document.querySelectorAll('.domain-card').forEach(card => {
                card.classList.toggle('active', card.dataset.domain === dominant);
            });
            // Sync the JS variable used by the login script
            if (typeof window.selectedDomain !== 'undefined') {
                window.selectedDomain = dominant;
            }
            // Expose for the inline login script that uses `let selectedDomain`
            window.__introDomain = dominant;
        }, 650);
    }

    /* ── Utility ───────────────────────────────────────────── */
    function hexToRgb(hex) {
        if (!hex.startsWith('#')) return '255,255,255';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    }

    /* ── Start ─────────────────────────────────────────────── */
    showSlide(0);

})();
