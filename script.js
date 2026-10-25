/* ============================================================
   Nikita & Hari — Engagement Invitation
   Countdown · Add to Calendar · Petals · Reveal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- event configuration ---------- */
  /* 6 Dec 2026, 12:00 PM – 12:25 PM IST (UTC+05:30) */
  var EVENT = {
    title: 'Engagement of Nikita Nair & Hari Nair',
    startMs: Date.UTC(2026, 11, 6, 6, 30, 0),
    endMs:   Date.UTC(2026, 11, 6, 6, 55, 0),
    startIcs: '20261206T063000Z',
    endIcs:   '20261206T065500Z',
    location: 'Shri Krishna Temple, Nigidi, Pune'
  };

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dismiss the loading veil ---------- */
  /* The veil must never trap the invitation, so this runs on its own path with
     three independent triggers: fonts ready, window load, and a hard cap. */
  var loaderDone = false;
  var afterLoader = [];

  function onLoaderDone(fn) {
    if (loaderDone) fn();
    else afterLoader.push(fn);
  }

  (function dismissLoader() {
    var root = document.documentElement;
    if (!root.classList.contains('js-loading')) { loaderDone = true; return; }

    var start  = window.__ldrStart || Date.now();
    var MIN_MS = reduceMotion ? 0 : 1900;   /* let the diya light up */
    var MAX_MS = 5000;                      /* never wait longer than this */
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      root.classList.remove('js-loading');
      root.classList.add('js-loading--done');
      loaderDone = true;
      afterLoader.splice(0).forEach(function (fn) { fn(); });
      var veil = document.getElementById('loader');
      if (veil && veil.parentNode) {
        setTimeout(function () { veil.parentNode.removeChild(veil); }, 900);
      }
    }

    function schedule() {
      var waited = Date.now() - start;
      setTimeout(finish, Math.max(0, Math.min(MIN_MS - waited, MAX_MS - waited)));
    }

    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(schedule)['catch'](schedule);
    } else {
      schedule();
    }

    window.addEventListener('load', schedule);
    setTimeout(finish, MAX_MS);          /* absolute backstop */
    setTimeout(finish, MIN_MS);
  })();

  /* ---------- live countdown ---------- */
  var countdownEl = document.getElementById('countdown');
  var grid  = countdownEl && countdownEl.querySelector('.countdown__grid');
  var title = countdownEl && countdownEl.querySelector('.countdown__title');
  var done  = countdownEl && countdownEl.querySelector('.countdown__done');
  var timer = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function setUnit(name, value) {
    var el = countdownEl && countdownEl.querySelector('[data-unit="' + name + '"]');
    if (el) el.textContent = value;
  }

  function showCelebration() {
    if (grid)  grid.hidden  = true;
    if (title) title.hidden = true;
    if (done)  done.hidden  = false;
    if (timer) clearInterval(timer);
  }

  function tick() {
    if (!countdownEl) return;

    var diff = EVENT.startMs - Date.now();
    if (diff <= 0) { showCelebration(); return; }

    var s = Math.floor(diff / 1000);
    setUnit('days',    String(Math.floor(s / 86400)));
    setUnit('hours',   pad(Math.floor(s / 3600) % 24));
    setUnit('minutes', pad(Math.floor(s / 60) % 60));
    setUnit('seconds', pad(s % 60));
  }

  tick();
  timer = setInterval(tick, 1000);

  /* ---------- add to calendar (.ics download) ---------- */
  var calBtn = document.getElementById('addToCalendar');
  if (calBtn) {
    calBtn.addEventListener('click', function () {
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//NikitaHari//Engagement//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:nikita-hari-engagement-20261206@invitation',
        'DTSTAMP:' + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''),
        'DTSTART:' + EVENT.startIcs,
        'DTEND:' + EVENT.endIcs,
        'SUMMARY:' + EVENT.title,
        'LOCATION:' + EVENT.location,
        'DESCRIPTION:Together with our families, we cordially invite you to the engagement of Nikita Nair and Hari Nair. Your presence will make our joy complete.',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Engagement of Nikita and Hari tomorrow',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ];

      var blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'nikita-hari-engagement.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);

      var original = calBtn.innerHTML;
      calBtn.textContent = 'Added \u2713';
      setTimeout(function () { calBtn.innerHTML = original; }, 2200);
    });
  }

  /* ---------- floating flower petals ---------- */
  var petalHost = document.getElementById('petals');

  if (petalHost && !reduceMotion) {
    var kinds = ['', 'petal--jasmine', 'petal--marigold', 'petal--rose'];
    var count = window.innerWidth < 640 ? 16 : 30;

    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      var size = 7 + Math.random() * 10;
      p.className = 'petal ' + kinds[i % kinds.length];
      p.style.left = (Math.random() * 100).toFixed(2) + 'vw';
      p.style.width = size.toFixed(1) + 'px';
      p.style.height = size.toFixed(1) + 'px';
      p.style.animationDuration = (11 + Math.random() * 13).toFixed(2) + 's';
      p.style.animationDelay = (-Math.random() * 22).toFixed(2) + 's';
      petalHost.appendChild(p);
    }
  }

  /* ---------- staggered reveal ---------- */
  var selectors = [
    '.shloka', '.ganesha', '.torana', '.invite__lead', '.names', '.divider',
    '.details', '.blessing', '.countdown', '.actions', '.couple',
    '.closing__line', '.closing__families', '.closing__shloka'
  ];

  var items = [];
  selectors.forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) items.push(el);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    onLoaderDone(function () {
      items.forEach(function (el, idx) {
        el.style.setProperty('--delay', Math.min(idx * 0.08, 0.4).toFixed(2) + 's');
        el.classList.add('reveal');
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });

      items.forEach(function (el) { io.observe(el); });

      /* safety net: never leave content hidden */
      window.addEventListener('load', function () {
        items.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add('is-visible');
        });
      });
    });
  }
})();
