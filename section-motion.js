/* Animasi tiap bagian saat masuk ke layar; foto galeri muncul satu per satu dari atas */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    'main#invitation > .section',
    'main#invitation > footer',
    '.event-card',
    '.story-card',
    '.gift-card',
    '.guestbook',
    '.gallery-grid img'
  ].join(',');

  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('motion-visible'));
    return;
  }

  elements.forEach((element) => {
    element.classList.add('motion-reveal');
    let delay = 0;

    if (element.matches('.gallery-grid img')) {
      const images = Array.from(element.parentElement.querySelectorAll(':scope > img'));
      delay = Math.max(0, images.indexOf(element)) * 420;
    } else if (element.matches('.event-card, .story-card')) {
      const siblings = Array.from(element.parentElement.querySelectorAll(
        ':scope > .event-card, :scope > .story-card'
      ));
      delay = Math.max(0, siblings.indexOf(element)) * 260;
    }

    element.style.setProperty('--motion-delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -25px 0px'
  });

  elements.forEach((element) => observer.observe(element));
})();
