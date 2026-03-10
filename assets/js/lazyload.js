export function initLazyload() {
  const images = document.querySelectorAll('img.lazyload, [data-bg-src]');
  const videos = document.querySelectorAll('video[data-video-lazy="1"]');
  if (!images.length && !videos.length) return;

  const loadImage = (el) => {
    if (el.dataset.src) {
      el.src = el.dataset.src;
      el.removeAttribute('data-src');
    }
    // Support for srcset lazy loading
    if (el.dataset.srcset) {
      el.srcset = el.dataset.srcset;
      el.removeAttribute('data-srcset');
    }
    // Support for sizes attribute
    if (el.dataset.sizes) {
      el.sizes = el.dataset.sizes;
      el.removeAttribute('data-sizes');
    }
    if (el.dataset.bgSrc) {
      el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
      el.removeAttribute('data-bg-src');
    }
    el.classList.add('is-loaded');
  };

  const loadVideo = (video) => {
    const sources = video.querySelectorAll('source[data-src]');
    if (!sources.length) {
      video.classList.add('is-loaded');
      return;
    }

    sources.forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });

    if (video.dataset.videoPreload) {
      video.preload = video.dataset.videoPreload;
      video.removeAttribute('data-video-preload');
    }

    video.load();

    if (video.autoplay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }

    video.classList.add('is-loaded');
    video.removeAttribute('data-video-lazy');
  };

  if ('IntersectionObserver' in window) {
    // Optimize margin for mobile vs desktop
    const isMobile = window.innerWidth < 768;
    const rootMargin = isMobile ? '50px 0px' : '150px 0px';

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.tagName === 'VIDEO') {
          loadVideo(entry.target);
        } else {
          loadImage(entry.target);
        }

        obs.unobserve(entry.target);
      });
    }, { rootMargin });

    images.forEach((img) => observer.observe(img));
    videos.forEach((video) => observer.observe(video));
  } else {
    images.forEach(loadImage);
    videos.forEach(loadVideo);
  }
}
