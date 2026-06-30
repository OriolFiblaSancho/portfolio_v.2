(function () {
  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.className = 'fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-[0.7rem] bg-black/90 backdrop-blur-md border-b border-transparent transition-colors duration-300';

  document.body.prepend(nav);

  window.rebuildNav = function (extraLinks) {
    var navEl = document.getElementById('navbar');
    if (!navEl) return;
    navEl.innerHTML = '';

    var logoLink = document.createElement('a');
    logoLink.href = window.__logoHref || '#hero';
    logoLink.className = 'flex items-center w-6';
    logoLink.innerHTML = '<img src="' + (window.__logoSrc || './assets/lambda.svg') + '" alt="Lambda">';
    navEl.appendChild(logoLink);

    var ul = document.createElement('ul');
    ul.className = 'flex gap-8 list-none';
    var allLinks = (window.__navLinks || []).concat(extraLinks || []);
    allLinks.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.className = 'text-muted no-underline text-sm hover:text-white transition-colors duration-200';
      if (item.download) a.download = item.download;
      if (item.id) a.id = item.id;
      li.appendChild(a);
      ul.appendChild(li);
    });
    navEl.appendChild(ul);
  };

  window.rebuildNav();
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
