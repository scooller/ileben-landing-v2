import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';

function getHeaderOffset() {
  const header = document.getElementById('site-header');
  if (!header) return 0;

  const styles = window.getComputedStyle(header);
  const isFixed = styles.position === 'fixed' || header.classList.contains('fixed-top');
  return isFixed ? header.offsetHeight : 0;
}

function smoothScrollToTarget(target) {
  const offset = getHeaderOffset();
  const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canUseGsapScroll = Boolean(window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollToPlugin);

  if (canUseGsapScroll && !prefersReducedMotion) {
    window.gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: targetY, autoKill: true },
      ease: 'power2.out'
    });
  } else {
    window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
}

function initSmoothScrollAnchors() {
  const links = Array.from(
    document.querySelectorAll('a[href*="#"]:not([href="#"]):not([href="#0"])')
  ).filter((link) => {
    const href = link.getAttribute('href') || '';
    if (link.hasAttribute('data-bs-toggle')) return false;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return false;
    }

    const isSamePage =
      url.origin === window.location.origin &&
      url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');

    return Boolean(url.hash) && (href.startsWith('#') || isSamePage);
  });

  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href') || '';

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (error) {
        return;
      }

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      smoothScrollToTarget(target);

      if (history.pushState) {
        history.pushState(null, '', url.hash);
      }
    });
  });
}

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

  initSmoothScrollAnchors();
}
