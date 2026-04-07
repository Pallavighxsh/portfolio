/* =========================
   1. NAV SCROLL SHADOW
========================= */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* =========================
   2. THOUGHT BUBBLES
========================= */
const bubbleMap = {
  '.hero-avatar':    "yes, this is me. not sure about the rest, but I tried to look the part!",
  '.chip':           "i contain multitudes (and too many tabs).",
  '.bento-card':     "i built this instead of sleeping.",
  '.about-edu-card': "yes i read theory for fun.",
  '.contact-form':   "this could be the start of something fun.",
  '.writing-card':   "words first. then everything else.",
  '.hero-card':      "always thinking about the next thing.",
};

let activeBubble = null;

function showBubble(text) {
  if (activeBubble) activeBubble.remove();
  activeBubble = document.createElement('div');
  activeBubble.className = 'thought-bubble';
  activeBubble.textContent = text;
  document.body.appendChild(activeBubble);
}

function moveBubble(e) {
  if (!activeBubble) return;
  activeBubble.style.left = (e.clientX + 18) + 'px';
  activeBubble.style.top  = (e.clientY - 40) + 'px';
}

function hideBubble() {
  if (activeBubble) { activeBubble.remove(); activeBubble = null; }
}

Object.entries(bubbleMap).forEach(([selector, text]) => {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => showBubble(text));
    el.addEventListener('mousemove', moveBubble);
    el.addEventListener('mouseleave', hideBubble);
  });
});


/* =========================
   3. SCROLL REVEAL (STAGGERED)
========================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const section = entry.target;
    section.classList.add('show');

    const children = section.querySelectorAll(
      '.bento-card, .writing-card, .mindset-card, .about-bio-card, .about-edu-card, .hero-card, .projects-intro, .writing-intro, .projects-note, .writing-note'
    );
    children.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.5s ease ${i * 75}ms, transform 0.5s ease ${i * 75}ms`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 60 + i * 75);
    });

    revealObserver.unobserve(section);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.page-section, .hero').forEach(el => {
  el.classList.add('hidden');
  revealObserver.observe(el);
});


/* =========================
   4. 3D CARD TILT
========================= */
function attachTilt(el) {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-6px) scale(1.02)`;
    el.style.boxShadow = `${-x * 12}px ${-y * 12}px 32px rgba(100,80,200,0.18)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.boxShadow = '';
  });
}
document.querySelectorAll('.bento-card, .writing-card').forEach(attachTilt);


/* =========================
   5. MAGNETIC BUTTONS
========================= */
function attachMagnetic(el, strength = 0.18) {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * strength;
    const y = (e.clientY - r.top  - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}
document.querySelectorAll('.contact-btn, .btn-primary, .btn-secondary, .btn-linkedin').forEach(el => attachMagnetic(el));


/* =========================
   6. CHIP RIPPLE
========================= */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', e => {
    const ripple = document.createElement('span');
    const rect = chip.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute; border-radius: 50%;
      width: ${size}px; height: ${size}px;
      background: rgba(255,255,255,0.45);
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      animation: rippleAnim 0.5s ease-out forwards;
      pointer-events: none;
    `;
    chip.style.position = 'relative';
    chip.style.overflow = 'hidden';
    chip.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { from { transform: scale(0); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }';
document.head.appendChild(rippleStyle);


/* =========================
   7. CONTACT FORM
========================= */
const form = document.getElementById('contactForm');
if (form) {
  const inputs = form.querySelectorAll('input, textarea');

  // Label float effect on focus
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.style.transform = '';
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'sent ✓';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';

      setTimeout(() => {
        btn.textContent = 'send message →';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 900);
  });
}


/* =========================
   8. ACTIVE NAV LINK ON SCROLL
========================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--text)' : '';
        a.style.fontWeight = a.getAttribute('href') === '#' + id ? '600' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* =========================
   9. CARD ENTRANCE COUNTER
========================= */
// Subtle number that counts up on the featured card thumb
const featured = document.querySelector('.bento-card.featured .card-thumb');
if (featured) {
  featured.addEventListener('mouseenter', () => {
    if (featured.dataset.counted) return;
    featured.dataset.counted = true;
    let n = 0;
    const counter = document.createElement('span');
    counter.style.cssText = 'position:absolute;bottom:10px;left:12px;font-size:11px;font-weight:600;color:rgba(42,34,64,0.4);';
    featured.appendChild(counter);
    const tick = setInterval(() => {
      n += 3;
      counter.textContent = n + ' moves analyzed';
      if (n >= 99) { counter.textContent = '♟ 100+ moves analyzed'; clearInterval(tick); }
    }, 18);
  });
}


/* =========================
   10. SMOOTH SCROLL FOR NAV
========================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
