export function initPreloader() {
  const loader = document.getElementById('site-loader');
  const site = document.getElementById('primary');
  if (!loader) return;
  if (site) site.classList.add('blurry');
  const hide = () => {
    loader.classList.add('d-none');
    if (site) site.classList.remove('blurry');
    setTimeout(() => loader.remove(), 600);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    document.addEventListener('DOMContentLoaded', hide, { once: true });
    // Failsafe in case DOMContentLoaded is delayed
    setTimeout(hide, 2500);
  }
}
