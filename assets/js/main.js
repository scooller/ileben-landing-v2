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
import { initGsap } from './gsap-loader';
import GSAPAnimationManager from './animations';
import { initRutValidation } from './rut';
import { applyBootstrapClasses } from './cf7-bootstrap';
import './parallax';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  initGsap(); // Init GSAP first so it's available globally
  initPreloader();
  initLazyload();
  initFacade();
  initFancybox();
  initNav();
  // Init general sliders, then plantas-specific (block-scoped) sliders
  initSliders();
  initPlantasSlider();
  initPlantasFilter();
  initRutValidation();
  applyBootstrapClasses(); // Apply CF7 Bootstrap classes
  initRouter();
  
  // Initialize GSAP animations manager
  if (window.gsap && document.querySelectorAll('[data-animate-type]').length > 0) {
    const animationManager = new GSAPAnimationManager();
    animationManager.init();
    window.gsapAnimationManager = animationManager;
  }
}

// Make initPlantasSlider globally accessible for reinitializing after AJAX
window.initPlantasSlider = initPlantasSlider;
