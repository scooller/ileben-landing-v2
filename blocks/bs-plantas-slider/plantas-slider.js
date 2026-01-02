/**
 * Frontend JS for Plantas Slider Block
 */

import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards } from 'swiper/modules';

export function initPlantasSlider() {
  const globals = window.ILEBEN_SWIPER || {};
  const sliders = document.querySelectorAll('.bs-plantas-slider-container .js-swiper');
  
  sliders.forEach((container) => {
    const ds = container.dataset;
    const sliderId = ds.sliderId;
    
    if (!sliderId) {
      console.warn('Plantas slider missing data-slider-id');
      return;
    }

    const readNum = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined);
    const readBool = (v) => (v === 'true' ? true : v === 'false' ? false : undefined);

    // Viewport-specific slides per view with fallback to globals
    const mobileSlides = (readNum(ds.swiperSlidesMobile) ?? Number(globals.slidesPerView)) || 1;
    const tabletSlides = (readNum(ds.swiperSlidesTablet) ?? (globals.breakpoints?.[768]?.slidesPerView)) || 1.5;
    const desktopSlides = (readNum(ds.swiperSlidesDesktop) ?? (globals.breakpoints?.[1024]?.slidesPerView)) || 3;

    // Navigation and pagination with globals fallback
    const navArrows = readBool(ds.swiperNavArrows) ?? !!globals.enableNavigation;
    const paginationType = ds.swiperPaginationType || (globals.enablePagination ? 'bullets' : 'none');
    const effect = ds.swiperEffect || 'slide';
    const centered = readBool(ds.swiperCentered) || false;

    // Other options from globals
    const spaceBetween = (readNum(ds.swiperSpace) ?? Number(globals.spaceBetween)) || 16;
    const loop = readBool(ds.swiperLoop) ?? !!globals.loop;
    const speed = (readNum(ds.swiperSpeed) ?? Number(globals.speed)) || 500;

    const config = {
      modules: [Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards],
      slidesPerView: mobileSlides,
      spaceBetween,
      loop,
      speed,
      effect,
      centeredSlides: centered,
      breakpoints: {
        768: { slidesPerView: tabletSlides },
        1024: { slidesPerView: desktopSlides }
      }
    };

    // Add pagination if not 'none'
    if (paginationType !== 'none') {
      config.pagination = {
        el: `.swiper-pagination-${sliderId}`,
        type: paginationType,
        clickable: true
      };
    }

    // Add navigation arrows
    if (navArrows) {
      config.navigation = {
        nextEl: `.swiper-button-next-${sliderId}`,
        prevEl: `.swiper-button-prev-${sliderId}`
      };
    }

    // Initialize Swiper
    // eslint-disable-next-line no-new
    new Swiper(container, config);
  });
}
