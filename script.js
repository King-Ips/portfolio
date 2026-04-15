/**
 * Ipeleng Tsamai — Portfolio Script
 * Handles: grain canvas, scroll nav, reveal animations,
 * carousel, smooth nav, contact form (REAL EmailJS), hamburger menu.
 */

// ============= GRAIN CANVAS =============
function initGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, frame = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = v; data[i + 1] = v; data[i + 2] = v;
      data[i + 3] = 18 + Math.random() * 15;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function loop() {
    frame++;
    if (frame % 3 === 0) drawGrain();
    requestAnimationFrame(loop);
  }
  loop();
}

// ============= SCROLL NAV =============
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    window.scrollY > 60 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
  });
}

// ============= HAMBURGER =============
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ============= REVEAL ON SCROLL =============
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============= SMOOTH NAV LINKS =============
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============= CONTACT FORM (REAL EMAIL) =============
function initForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  // EmailJS — configured and ready
  emailjs.init("xRuyXrLKCpxHfCalh");

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      form.style.animation = 'shake 0.4s ease';
      setTimeout(() => form.style.animation = '', 400);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message
    };

    emailjs.send("service_qeqsp2u", "template_3g4rbsi", templateParams)
      .then(() => {
        form.reset();
        btn.textContent = 'Send message';
        btn.disabled = false;
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      })
      .catch((err) => {
        console.error(err);
        btn.textContent = 'Send message';
        btn.disabled = false;
        alert("Failed to send. Please try again or email me directly at ipstsamai@gmail.com");
      });
  });
}

// ============= TYPING EFFECT ON HERO =============
function initTyping() {
  const roles = [
    'Junior Software Engineer',
    'Voice AI Builder',
    'Cloud Learner',
    'Problem Solver'
  ];
  const el = document.querySelector('.hero-role');
  if (!el) return;

  let roleIndex = 0, charIndex = 0, deleting = false, paused = false;

  function type() {
    if (paused) {
      setTimeout(type, 1200);
      paused = false;
      return;
    }

    const current = roles[roleIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        paused = true;
        deleting = true;
        setTimeout(type, 80);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }

  setTimeout(type, 2000);
}

// ============= CURSOR DOT (desktop only) =============
function initCursor() {
  if (window.innerWidth < 768) return;
  const dot = document.createElement('div');
  dot.style.cssText = `position:fixed;width:8px;height:8px;background:#eab308;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s,opacity 0.3s;opacity:0;`;
  document.body.appendChild(dot);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    dot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => dot.style.opacity = '0');

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(3)'; dot.style.opacity = '0.5'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; dot.style.opacity = '1'; });
  });
}

// ============= SHAKE KEYFRAME =============
const style = document.createElement('style');
style.textContent = `@keyframes shake {0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(style);

// ============= ACTIVE NAV HIGHLIGHT =============
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = '#eab308';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ============= INIT ALL =============
document.addEventListener('DOMContentLoaded', () => {
  initGrain();
  initNav();
  initHamburger();
  initReveal();
  initSmoothNav();
  initForm();
  initTyping();
  initCursor();
  initActiveNav();

  console.log('%c Ipeleng Tsamai — Portfolio loaded', 'color: #eab308; font-size: 14px; font-weight: bold;');
});