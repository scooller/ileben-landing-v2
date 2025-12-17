import '../scss/main.scss';
import { initRouter } from './router';
import { initPreloader } from './preloader';
import { initLazyload } from './lazyload';
import { initFacade } from './facade';
import { initSliders } from './sliders';
import { initPlantasSlider } from './plantas-slider';
import { initPlantasFilter } from './plantas-filter';
import { initFancybox } from './fancybox';
import { initNav } from './nav';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  initPreloader();
  initLazyload();
  initFacade();
  initFancybox();
  initNav();
  // Init general sliders, then plantas-specific (block-scoped) sliders
  initSliders();
  initPlantasSlider();
  initPlantasFilter();
  initRouter();
}

// Make initPlantasSlider globally accessible for reinitializing after AJAX
window.initPlantasSlider = initPlantasSlider;
