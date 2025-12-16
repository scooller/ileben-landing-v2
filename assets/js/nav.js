import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';

export function initNav() {
  const navbars = document.querySelectorAll('.navbar');
  if (!navbars.length) return;

  navbars.forEach((navbar) => {
    navbar.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
      new Dropdown(toggle);
    });
  });

  const toggler = document.querySelector('[data-bs-toggle="collapse"][data-bs-target="#primaryMenu"]');
  const menu = document.getElementById('primaryMenu');
  if (toggler && menu) {
    new Collapse(menu, { toggle: false });
    menu.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.closest('a')) {
        const instance = Collapse.getInstance(menu);
        if (instance && window.innerWidth < 992) {
          instance.hide();
        }
      }
    });
  }
}
