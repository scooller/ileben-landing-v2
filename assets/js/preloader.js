export function initPreloader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 600);
  };

  window.addEventListener('load', hide);

  // Failsafe in case load never fires
  setTimeout(hide, 5000);
}
