import '../scss/main.scss';
import { initRouter } from './router';
import { initPreloader } from './preloader';
import { initLazyload } from './lazyload';
import { initFacade } from './facade';
import { initSliders } from './sliders';
import { initPlantasSlider } from '../../blocks/bs-plantas-slider/plantas-slider';
import { initPlantasFilter } from './plantas-filter';
import { initFancybox } from './fancybox';
import { initNav } from './nav';
import { initRutValidation } from './rut';
import { applyBootstrapClasses } from './cf7-bootstrap';
import { deferAnalytics } from './defer-analytics';
import { initFontLoader } from './font-loader';
import './parallax';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
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

    // Defer GSAP if there are animations (lazy load)
    if (document.querySelectorAll('[data-animate-type]').length > 0) {
      import('./gsap-loader').then(({ initGsap }) => {
        initGsap();
      });
      import('./animations').then(({ default: GSAPAnimationManager }) => {
        const animationManager = new GSAPAnimationManager();
        animationManager.init();
        window.gsapAnimationManager = animationManager;
      });
    }

    // Defer Bootstrap components (only load if needed)
    const hasCarousels = document.querySelectorAll('.carousel').length > 0;
    const hasCollapse = document.querySelectorAll('[data-bs-toggle="collapse"]').length > 0;

    if (hasCarousels || hasCollapse) {
      const bootstrapImports = [];
      if (hasCarousels) bootstrapImports.push(import('bootstrap/js/dist/carousel'));
      if (hasCollapse) bootstrapImports.push(import('bootstrap/js/dist/collapse'));

      if (bootstrapImports.length > 0) {
        Promise.all(bootstrapImports);
      }
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
