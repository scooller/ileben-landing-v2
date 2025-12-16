const routes = {
  common() {
    // Common scripts for all pages.
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
