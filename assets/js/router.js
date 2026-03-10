const routes = {
  common() {
    //on scroll add class to nav - with throttle for better mobile performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nav = document.querySelector('#site-header');
          if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 0);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },
  front_page() {
    // Animations handled externally
  }
};

export function initRouter() {
  const body = document.body;
  if (!body) return;

  routes.common();

  const bodyClasses = body.className.split(/\s+/);
  bodyClasses.forEach((cls) => {
    const fn = routes[cls];
    if (typeof fn === 'function') {
      fn();
    }
  });
}
