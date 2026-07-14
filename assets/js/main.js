import '../scss/main.scss';
// Bootstrap JS bundle (modal, carousel, dropdown, collapse, offcanvas, tab, toast, tooltip, popover, scrollspy)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { initRouter } from './router';
import { initPreloader } from './preloader';
import { initLazyload } from './lazyload';
import { initFacade } from './facade';
import { initSliders } from './sliders';
import { initPlantasSlider } from '../../blocks/bs-plantas-slider/plantas-slider';
import { initPlantasFilter } from './plantas-filter';
import '../../blocks/bs-plantas-showcase/showcase.js';
import { initFancybox } from './fancybox';
import { initNav } from './nav';
import { initRutValidation } from './rut';
import { applyBootstrapClasses } from './cf7-bootstrap';
import { deferAnalytics } from './defer-analytics';
import { initFontLoader } from './font-loader';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
  const gsapConfig = window.ILEBEN_GSAP || {};
  const gsapEnabled = gsapConfig.enableGsap !== false;
  const scrollTriggerEnabled = gsapConfig.enableScrollTrigger !== false;

  // Critical path: keep only essentials before first interaction
  initPreloader();
  initLazyload();
  initFacade();
  initNav();
  
  // Load Font Awesome asynchronously for non-critical icons
  initFontLoader();

  const runDeferred = () => {
    initFancybox();
    initSliders();
    initPlantasSlider();
    initPlantasFilter();
    initRutValidation();
    applyBootstrapClasses();
    initRouter();

    // Defer analytics signaling to idle/after load
    deferAnalytics();

    // Load parallax module only when GSAP core + ScrollTrigger are enabled
    if (gsapEnabled && scrollTriggerEnabled && document.querySelector('[data-parallax="true"]')) {
      import('./parallax');
    }

    // Defer GSAP if there are animations (lazy load)
    if (gsapEnabled && document.querySelectorAll('[data-animate-type]').length > 0) {
      import('./gsap-loader').then(({ initGsap }) => {
        initGsap();
      });
      import('./animations').then(({ initializeGSAPAnimationManager }) => {
        if (document.readyState === 'complete') {
          initializeGSAPAnimationManager();
          return;
        }

        window.addEventListener('load', initializeGSAPAnimationManager, { once: true });
      });
    }

    // Defer Bootstrap components (only load if needed)
    const hasCarousels = document.querySelectorAll('.carousel').length > 0;
    const hasCollapse = document.querySelectorAll('[data-bs-toggle="collapse"]').length > 0;
    const hasTabs = document.querySelectorAll('[data-bs-toggle="pill"], [data-bs-toggle="tab"]').length > 0;
    const hasPopovers = document.querySelectorAll('[data-bs-toggle="popover"]').length > 0;
    const hasTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]').length > 0;

    if (hasCarousels || hasCollapse || hasTabs || hasPopovers || hasTooltips) {
      const bootstrapImports = [];
      if (hasCarousels) bootstrapImports.push(import('bootstrap/js/dist/carousel'));
      if (hasCollapse) bootstrapImports.push(import('bootstrap/js/dist/collapse'));
      if (hasTabs) bootstrapImports.push(import('bootstrap/js/dist/tab'));
      if (hasPopovers) bootstrapImports.push(import('bootstrap/js/dist/popover'));
      if (hasTooltips) bootstrapImports.push(import('bootstrap/js/dist/tooltip'));

      Promise.all(bootstrapImports).then((modules) => {
        // Bootstrap auto-initializes via data-bs-toggle for popover/tooltip when imported as side-effect
        // But to be safe, explicitly enable all popover/tooltip elements
        let moduleIndex = 0;
        if (hasCarousels) moduleIndex++;
        if (hasCollapse) moduleIndex++;
        if (hasTabs) moduleIndex++;
        if (hasPopovers) {
          const Popover = modules[moduleIndex].default;
          document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new Popover(el));
          moduleIndex++;
        }
        if (hasTooltips) {
          const Tooltip = modules[moduleIndex].default;
          document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new Tooltip(el));
        }
      });
    }

    // Initialize Split Carousel transitions if GSAP is available
    if (gsapEnabled && document.querySelectorAll('.bs-split-carousel').length > 0) {
      import('../../blocks/bs-split-carousel/split-carousel').then(({ initSplitCarousel }) => {
        // Wait for GSAP to be ready, then init
        const tryInit = () => {
          if (window.gsap) {
            initSplitCarousel();
          } else {
            setTimeout(tryInit, 100);
          }
        };
        tryInit();
      });
    }

    // Initialize Interactive Masterplan if exists
    const hasHotspots = document.querySelectorAll('.bs-hotspot-btn').length > 0;
    if (hasHotspots) {
      Promise.all([
        import('bootstrap/js/dist/popover'),
        import('../../blocks/bs-interactive-masterplan/masterplan')
      ]).then(([PopoverModule, { initInteractiveMasterplan }]) => {
        initInteractiveMasterplan(PopoverModule.default);
      }).catch(err => console.error("Error loading interactive masterplan:", err));
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(runDeferred, { timeout: 2000 });
  } else {
    setTimeout(runDeferred, 300);
  }
}

// Make initPlantasSlider globally accessible for reinitializing after AJAX
window.initPlantasSlider = initPlantasSlider;

// Ensure Font Awesome is loaded for icon elements
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    // Font Awesome is loaded inline in assets.php defer script
  }, { once: true });
}
