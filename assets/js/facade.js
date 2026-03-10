export function initFacade() {
  const facades = document.querySelectorAll('.iframe-facade');
  if (!facades.length) return;

  const loadedFacades = new WeakSet();

  const createIframe = (facade) => {
    if (loadedFacades.has(facade)) return;
    
    const embedUrl = facade.dataset.embedUrl;
    if (!embedUrl) return;

    const btn = facade.querySelector('.facade-trigger');
    
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.loading = 'lazy';
    iframe.title = btn?.getAttribute('aria-label') || 'Embedded content';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.frameBorder = '0';
    iframe.className = 'w-100 h-100';
    facade.innerHTML = '';
    facade.appendChild(iframe);
    
    loadedFacades.add(facade);
  };

  // Use IntersectionObserver for better performance - load facade before it comes into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          createIframe(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });

    facades.forEach((facade) => observer.observe(facade));
  } else {
    // Fallback: load on button click
    facades.forEach((facade) => {
      const btn = facade.querySelector('.facade-trigger');
      if (btn) {
        btn.addEventListener('click', () => createIframe(facade));
      }
    });
  }
}
