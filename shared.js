(function () {
  const bg = document.createElement('canvas');
  bg.id = 'dotGridBg';
  const fg = document.createElement('canvas');
  fg.id = 'dotGridFg';

  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.className = 'fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-[0.7rem] bg-black/90 backdrop-blur-md border-b border-transparent transition-colors duration-300';

  const logoLink = document.createElement('a');
  logoLink.href = window.__logoHref || '#hero';
  logoLink.className = 'flex items-center w-6';
  logoLink.innerHTML = `<img src="${window.__logoSrc || './assets/lambda.svg'}" alt="Lambda">`;
  nav.appendChild(logoLink);

  const ul = document.createElement('ul');
  ul.className = 'flex gap-8 list-none';
  (window.__navLinks || []).forEach(function (item) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    a.className = 'text-muted no-underline text-sm hover:text-white transition-colors duration-200';
    if (item.download) a.download = item.download;
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);

  document.body.prepend(bg, fg, nav);
})();

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
  }, { passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

var __revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var currentReveals = document.querySelectorAll('.reveal');
      var delay = Array.from(currentReveals).indexOf(entry.target) % 4 * 80;
      setTimeout(function () { entry.target.classList.add('visible'); }, delay);
      __revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (el) { __revealObserver.observe(el); });

(function () {
  var canvasBg = document.getElementById('dotGridBg');
  var canvasFg = document.getElementById('dotGridFg');
  if (!canvasBg || !canvasFg) return;

  var ctxBg = canvasBg.getContext('2d');
  var ctxFg = canvasFg.getContext('2d');

  var SPACING = 13;
  var RADIUS = 0.8;
  var MAX_DIST = 80;
  var LERP = 0.1;

  var target = { x: -9999, y: -9999 };
  var smooth = { x: -9999, y: -9999 };

  function resize() {
    var dpr = devicePixelRatio;
    canvasBg.width = window.innerWidth * dpr;
    canvasBg.height = window.innerHeight * dpr;
    ctxBg.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasFg.width = window.innerWidth * dpr;
    canvasFg.height = window.innerHeight * dpr;
    ctxFg.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function (e) {
    target.x = e.clientX;
    target.y = e.clientY;
    if (smooth.x < 0) { smooth.x = target.x; smooth.y = target.y; }
  });

  window.addEventListener('mouseleave', function () {
    target.x = -9999; target.y = -9999;
    smooth.x = -9999; smooth.y = -9999;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function draw() {
    var W = window.innerWidth;
    var H = window.innerHeight;

    if (target.x > 0) {
      smooth.x = lerp(smooth.x, target.x, LERP);
      smooth.y = lerp(smooth.y, target.y, LERP);
    }

    ctxBg.clearRect(0, 0, W, H);
    ctxFg.clearRect(0, 0, W, H);

    var offX = (W % SPACING) / 2;
    var offY = (H % SPACING) / 2;
    var cols = Math.ceil(W / SPACING) + 1;
    var rows = Math.ceil(H / SPACING) + 1;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = offX + c * SPACING;
        var y = offY + r * SPACING;
        var dist = Math.hypot(x - smooth.x, y - smooth.y);
        if (dist >= MAX_DIST) continue;
        var alpha = easeOut(1 - dist / MAX_DIST) * 0.7;
        ctxBg.beginPath();
        ctxBg.arc(x, y, RADIUS, 0, Math.PI * 2);
        ctxBg.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
        ctxBg.fill();
      }
    }

    if (target.x > 0) {
      ctxFg.save();
      ctxFg.beginPath();
      ctxFg.arc(target.x, target.y, 4, 0, Math.PI * 2);
      ctxFg.fillStyle = 'rgba(255, 255, 255, 1)';
      ctxFg.fill();
      ctxFg.restore();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
