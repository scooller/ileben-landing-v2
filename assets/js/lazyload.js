export function initLazyload() {
  const images = document.querySelectorAll('img.lazyload, [data-bg-src]');
  if (!images.length) return;

  const loadImage = (el) => {
    if (el.dataset.src) {
      el.src = el.dataset.src;
      el.removeAttribute('data-src');
    }
    if (el.dataset.bgSrc) {
      el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
      el.removeAttribute('data-bg-src');
    }
    el.classList.add('is-loaded');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '150px 0px' });

    images.forEach((img) => observer.observe(img));
  } else {
    images.forEach(loadImage);
  }
}
