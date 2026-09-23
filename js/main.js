/* Defence Dental Gallery — Interactions */
(function () {
  'use strict';

  const WHATSAPP = '923224222533';
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
      document.body.classList.toggle('nav-open', open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
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
    if (row.getAttribute('data-day') === today) {
      row.classList.add('today');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const date = String(data.get('date') || '').trim();
      const message = String(data.get('message') || '').trim();

      const lines = [
        'Hello Defence Dental Gallery!',
        'I would like to book an appointment.',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        date ? `Preferred date: ${date}` : '',
        message ? `Notes: ${message}` : '',
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank');

      const success = document.getElementById('form-success');
      if (success) success.classList.add('is-visible');
      form.reset();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
