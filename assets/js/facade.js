export function initFacade() {
  const facades = document.querySelectorAll('.iframe-facade');
  if (!facades.length) return;

  facades.forEach((facade) => {
    const btn = facade.querySelector('.facade-trigger');
    const embedUrl = facade.dataset.embedUrl;
    if (!btn || !embedUrl) return;

    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.loading = 'lazy';
      iframe.title = btn.getAttribute('aria-label') || 'Embedded content';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.frameBorder = '0';
      iframe.className = 'w-100 h-100';
      facade.innerHTML = '';
      facade.appendChild(iframe);
    });
  });
}
