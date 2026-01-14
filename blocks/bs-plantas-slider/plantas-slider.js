/**
 * Frontend JS for Plantas Slider Block
 */

import Swiper from 'swiper';
import {
  Navigation,
  Pagination,
  Scrollbar,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectCards,
  EffectCreative
} from 'swiper/modules';

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
    const baseSlides = readNum(ds.swiperSlides) ?? Number(globals.slidesPerView);
    const mobileSlides = readNum(ds.swiperSlidesMobile) ?? baseSlides ?? 1;
    const tabletSlides = readNum(ds.swiperSlidesTablet) ?? globals.breakpoints?.[768]?.slidesPerView ?? baseSlides ?? 1.5;
    const desktopSlides = readNum(ds.swiperSlidesDesktop) ?? globals.breakpoints?.[1024]?.slidesPerView ?? baseSlides ?? 3;

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
      modules: [Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards, EffectCreative],
      slidesPerView: mobileSlides,
      spaceBetween,
      loop,
      speed,
      effect,
      centeredSlides: centered,
      preventClicks: false,
      preventClicksPropagation: false,
      allowTouchMove: true,
      touchReleaseOnEdges: true,
      initialSlide: 0,
      breakpoints: {
        768: { slidesPerView: tabletSlides },
        1024: { slidesPerView: desktopSlides }
      }
    };

    // Effect-specific alignment with Swiper API defaults
    switch (effect) {
      case 'fade':
        config.slidesPerView = 1;
        config.spaceBetween = 0;
        config.centeredSlides = false;
        delete config.breakpoints;
        config.fadeEffect = { crossFade: true };
        break;
      case 'cube':
        config.slidesPerView = 1;
        config.spaceBetween = 0;
        config.centeredSlides = false;
        config.grabCursor = true;
        delete config.breakpoints;
        config.cubeEffect = {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        };
        break;
      case 'coverflow':
        config.initialSlide = 1;
        config.slidesPerView = centered ?  'auto' : config.slidesPerView;
        config.spaceBetween = 0;
        config.centeredSlides = config.centeredSlides;
        config.grabCursor = true;
        config.coverflowEffect = {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          scale: 1,
          slideShadows: true
        };
        config.roundLengths = true;
        config.watchSlidesProgress = true;
        delete config.breakpoints;
        break;
      case 'flip':
        config.slidesPerView = 1;
        config.spaceBetween = 0;
        config.centeredSlides = false;
        config.grabCursor = true;
        delete config.breakpoints;
        config.flipEffect = {
          slideShadows: true,
          limitRotation: true
        };
        break;
      case 'cards':
        config.slidesPerView = 1;
        config.spaceBetween = 0;
        config.centeredSlides = false;
        config.grabCursor = true;
        delete config.breakpoints;
        config.cardsEffect = {
          perSlideOffset: 8,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true
        };
        break;
      case 'creative':
        config.slidesPerView = 1;
        config.spaceBetween = 0;
        config.centeredSlides = false;
        config.grabCursor = true;
        delete config.breakpoints;
        config.creativeEffect = {
          prev: {
            shadow: true,
            translate: [0, 0, -400],
            rotate: [0, 0, 0]
          },
          next: {
            translate: ['100%', 0, 0]
          }
        };
        break;
      default:
        break;
    }

    // Add pagination or scrollbar
    if (paginationType === 'scrollbar') {
      config.scrollbar = {
        el: `.swiper-scrollbar-${sliderId}`,
        draggable: true,
        hide: false
      };
    } else if (paginationType !== 'none') {
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
    const swiper = new Swiper(container, config);

    // For coverflow: ensure only active slide is interactive to avoid 3D overlap blocking clicks
    if (effect === 'coverflow') {
      const updatePointer = () => {
        swiper.slides.forEach((slide, idx) => {
          slide.style.pointerEvents = idx === swiper.activeIndex ? 'auto' : 'none';
        });
      };
      swiper.on('setTranslate', updatePointer);
      swiper.on('transitionEnd', updatePointer);
      updatePointer();
    }
  });

  // // custom events or additional logic can be added here
  // if (navArrows) {
  //   //custom onClick events for navigation arrows can be added here
  //   querySelector(`.swiper-button-next-${sliderId}`)?.addEventListener('click', () => {
  //     // custom logic for next button click
  //     console.info('Next button clicked');
  //     swiper.slideNext();
  //   });
  //   querySelector(`.swiper-button-prev-${sliderId}`)?.addEventListener('click', () => {
  //     // custom logic for prev button click
  //     console.info('Prev button clicked');
  //     swiper.slidePrev();
  //   });
  // }
}
