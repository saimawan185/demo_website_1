/* Pawtopia Pet Clinic — Interactions */
(function () {
  'use strict';

  const WHATSAPP = '923369335048';
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const form = document.getElementById('booking-form');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayMap[new Date().getDay()];
  document.querySelectorAll('.hours-table tr[data-day]').forEach((row) => {
    if (row.getAttribute('data-day') === today) row.classList.add('today');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [
        'Hello Pawtopia Pet Clinic!',
        'I would like to book an appointment.',
        '',
        `Name: ${String(data.get('name') || '').trim()}`,
        `Phone: ${String(data.get('phone') || '').trim()}`,
        `Service: ${String(data.get('service') || '').trim()}`,
        data.get('date') ? `Preferred date: ${String(data.get('date')).trim()}` : '',
        data.get('message') ? `Notes: ${String(data.get('message')).trim()}` : '',
      ].filter(Boolean);

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
      const success = document.getElementById('form-success');
      if (success) success.classList.add('is-visible');
      form.reset();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Real dog hero: chromakey studio pink, play once, freeze */
  const dogVideo = document.querySelector('.hero-dog-source');
  const dogCanvas = document.querySelector('.hero-dog-canvas');
  if (dogVideo && dogCanvas) {
    const ctx = dogCanvas.getContext('2d', { willReadFrequently: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playing = false;
    let frozen = false;

    const sizeCanvas = () => {
      const w = dogVideo.videoWidth || 960;
      const h = dogVideo.videoHeight || 256;
      if (dogCanvas.width !== w || dogCanvas.height !== h) {
        dogCanvas.width = w;
        dogCanvas.height = h;
      }
    };

    const keyFrame = () => {
      if (!ctx || !dogVideo.videoWidth) return;
      sizeCanvas();
      ctx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
      ctx.drawImage(dogVideo, 0, 0, dogCanvas.width, dogCanvas.height);
      const frame = ctx.getImageData(0, 0, dogCanvas.width, dogCanvas.height);
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const chroma = max - min;
        const luma = (r + g + b) / 3;
        /* Keep white fur (low chroma) and brown coat (lower luma / warmer) */
        if (chroma < 14 || luma < 155) continue;
        /* Studio blush: light, red+blue over green */
        const isBlush = r > 185 && b > 175 && g > 165 && r >= g && b >= g - 8 && chroma < 48;
        if (isBlush) data[i + 3] = 0;
      }
      ctx.putImageData(frame, 0, 0);
    };

    const tick = () => {
      if (frozen) return;
      keyFrame();
      if (playing) requestAnimationFrame(tick);
    };

    const start = () => {
      sizeCanvas();
      if (reduceMotion) {
        dogVideo.currentTime = Math.min(0.9, (dogVideo.duration || 1) * 0.45);
        dogVideo.pause();
        dogVideo.addEventListener('seeked', () => {
          keyFrame();
          frozen = true;
        }, { once: true });
        return;
      }
      playing = true;
      dogVideo.play().catch(() => {});
      requestAnimationFrame(tick);
    };

    dogVideo.addEventListener('ended', () => {
      playing = false;
      /* Freeze while the dog is still fully on screen */
      const holdAt = Math.min(1.15, Math.max(0.8, (dogVideo.duration || 2) * 0.55));
      dogVideo.currentTime = holdAt;
      dogVideo.addEventListener(
        'seeked',
        () => {
          keyFrame();
          frozen = true;
        },
        { once: true }
      );
    });

    if (dogVideo.readyState >= 2) start();
    else dogVideo.addEventListener('loadeddata', start, { once: true });
  }
})();
