// Header blur once the page scrolls, and one scroll-linked moment
// (the hero photo settles from a slight zoom to rest as it comes into view).
(function () {
  const header = document.getElementById('siteHeader');
  const heroImg = document.getElementById('heroImg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function update() {
    ticking = false;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);

    if (heroImg && !reduceMotion) {
      const rect = heroImg.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the photo's top sits at the bottom of the viewport, 1 when it reaches the upper third
      const progress = Math.min(Math.max((vh - rect.top) / (vh * 0.66), 0), 1);
      heroImg.style.transform = 'scale(' + (1.08 - 0.08 * progress).toFixed(4) + ')';
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
