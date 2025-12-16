import '../scss/main.scss';
import { initRouter } from './router';
import { initPreloader } from './preloader';
import { initLazyload } from './lazyload';
import { initFacade } from './facade';
import { initSliders } from './sliders';
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
  initSliders();
  initRouter();
}
