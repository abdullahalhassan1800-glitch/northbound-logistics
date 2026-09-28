/* Northbound Logistics — interactions */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document;

  /* ---------------------------------------------------------------
     1. Sticky header
  --------------------------------------------------------------- */
  var header = d.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     2. Mobile drawer
  --------------------------------------------------------------- */
  var burger = d.querySelector('.burger');
  var drawer = d.querySelector('.drawer');

  if (burger && drawer) {
    var links = drawer.querySelectorAll('.drawer__link');
    var delay = 60;

    var setOpen = function (open) {
      d.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
      if (open) {
        delay = 60;
        links.forEach(function (link) {
          link.style.transitionDelay = (delay += 45) + 'ms';
        });
      } else {
        links.forEach(function (link) { link.style.transitionDelay = '0ms'; });
      }
    };

    burger.addEventListener('click', function () {
      setOpen(!d.body.classList.contains('nav-open'));
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && d.body.classList.contains('nav-open')) {
        setOpen(false);
        burger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
     3. Scroll reveal
  --------------------------------------------------------------- */
  var revealables = d.querySelectorAll('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var stagger = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, stagger);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------
     4. Marquee — duplicate track for seamless loop
  --------------------------------------------------------------- */
  d.querySelectorAll('.marquee').forEach(function (mq) {
    var track = mq.querySelector('.marquee__track');
    if (!track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    mq.appendChild(clone);
  });

  /* ---------------------------------------------------------------
     5. Animated counters
  --------------------------------------------------------------- */
  var counters = d.querySelectorAll('[data-count]');

  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var duration = 1600;
    var start = null;

    var frame = function (t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (reduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------------------------------------------------------------
     6. Accordion
  --------------------------------------------------------------- */
  d.querySelectorAll('.acc').forEach(function (group) {
    var items = group.querySelectorAll('.acc__item');

    items.forEach(function (item) {
      var btn = item.querySelector('.acc__btn');
      var panel = item.querySelector('.acc__panel');
      if (!btn || !panel) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          var ob = other.querySelector('.acc__btn');
          var op = other.querySelector('.acc__panel');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.height = '0px';
        });

        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          panel.style.height = '0px';
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.height = panel.firstElementChild.offsetHeight + 'px';
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     7. Active nav link
  --------------------------------------------------------------- */
  var here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  d.querySelectorAll('.nav__link, .drawer__link').forEach(function (link) {
    var target = (link.getAttribute('href') || '').toLowerCase();
    if (target === here || (here === '' && target === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------------------------------------------------------------
     8. Contact form validation
  --------------------------------------------------------------- */
  var form = d.querySelector('[data-form]');

  if (form) {
    var status = form.querySelector('.form__status');

    var showError = function (field, on) {
      field.closest('.field, .check')?.classList.toggle('has-error', on);
    };

    var validate = function (input) {
      var value = (input.value || '').trim();
      var ok = true;

      if (input.type === 'checkbox') {
        ok = input.checked;
      } else if (input.hasAttribute('required') && !value) {
        ok = false;
      } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        ok = false;
      } else if (input.type === 'tel' && value && !/^[+\d][\d\s().-]{6,}$/.test(value)) {
        ok = false;
      }

      showError(input, !ok);
      return ok;
    };

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field, .check')?.classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var bad = fields.filter(function (i) { return !validate(i); });

      if (bad.length) {
        bad[0].focus();
        if (status) {
          status.className = 'form__status is-visible is-err';
          status.textContent = 'Please fix the highlighted fields and try again.';
        }
        return;
      }

      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      setTimeout(function () {
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = original; }
        if (status) {
          status.className = 'form__status is-visible is-ok';
          status.textContent = 'Thanks — your enquiry has been queued. Our team replies within one business day.';
        }
      }, 900);
    });
  }

  /* ---------------------------------------------------------------
     9. Footer year
  --------------------------------------------------------------- */
  d.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
