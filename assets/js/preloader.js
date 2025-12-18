export function initPreloader() {
  const loader = document.getElementById('site-loader');
  const site = document.getElementById('primary');
  if (!loader) return;
  site.classList.add('blurry');
  const hide = () => {
    loader.classList.add('d-none');
    site.classList.remove('blurry');
    setTimeout(() => loader.remove(), 600);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Failsafe in case load never fires
    setTimeout(hide, 5000);
  }
}
