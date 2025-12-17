import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards } from 'swiper/modules';

function readNum(v) {
  return v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined;
}
function readBool(v) {
  return v === 'true' ? true : v === 'false' ? false : undefined;
}

function ensureSwiperStructure(container) {
  let wrapper = container.querySelector('.swiper-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';
    const children = Array.from(container.childNodes);
    children.forEach((node) => {
      if (node.nodeType === 1 && !node.classList.contains('swiper-pagination') && !node.classList.contains('swiper-button-prev') && !node.classList.contains('swiper-button-next')) {
        node.classList.add('swiper-slide');
        wrapper.appendChild(node);
      }
    });
    container.insertBefore(wrapper, container.firstChild);
  } else {
    Array.from(wrapper.children).forEach((el) => el.classList.add('swiper-slide'));
  }
}

export function initPlantasSlider() {
  const globals = window.ILEBEN_SWIPER || {};
  const defaultBreakpoints = globals.breakpoints || { 768: { slidesPerView: 1.5 }, 1024: { slidesPerView: 2.2 } };

  // Target .js-swiper containers that have .bs-plantas-filters nearby (plantas block markers)
  const containers = [];
  document.querySelectorAll('.js-swiper').forEach((container) => {
    // Check if this slider is preceded by a .bs-plantas-filters form (plantas block indicator)
    let parent = container.parentElement;
    while (parent) {
      if (parent.querySelector('.bs-plantas-filters')) {
        containers.push(container);
        break;
      }
      parent = parent.parentElement;
    }
  });

  if (containers.length > 0) {
    console.log('Found ' + containers.length + ' plantas sliders');
  }

  containers.forEach((container, index) => {
    ensureSwiperStructure(container);
    const ds = container.dataset;

    // Build dynamic breakpoints from block data attributes
    const breakpoints = {};
    const mobileSlides = (readNum(ds.swiperSlidesMobile) ?? Number(globals.slidesPerView)) || 1;
    const tabletSlides = (readNum(ds.swiperSlidesTablet) ?? (globals.breakpoints && globals.breakpoints[768] && globals.breakpoints[768].slidesPerView)) || 1.5;
    const desktopSlides = (readNum(ds.swiperSlidesDesktop) ?? (globals.breakpoints && globals.breakpoints[1024] && globals.breakpoints[1024].slidesPerView)) || 2.2;

    // 768px breakpoint for tablet
    breakpoints[768] = {
      slidesPerView: tabletSlides,
    };
    // 1024px breakpoint for desktop
    breakpoints[1024] = {
      slidesPerView: desktopSlides,
    };

    // Merge: block data attrs override globals
    const config = {
      modules: [Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards],
      slidesPerView: mobileSlides,
      spaceBetween: (readNum(ds.swiperSpace) ?? Number(globals.spaceBetween)) || 16,
      loop: (readBool(ds.swiperLoop) ?? !!globals.loop),
      speed: (readNum(ds.swiperSpeed) ?? Number(globals.speed)) || 500,
      breakpoints,
    };

    // Handle navigation arrows
    const enableNav = readBool(ds.swiperNavArrows);
    if (enableNav === true) {
      config.navigation = {
        nextEl: container.querySelector('.swiper-button-next'),
        prevEl: container.querySelector('.swiper-button-prev'),
      };
    }

    // Handle pagination type
    const paginationType = ds.swiperPaginationType || 'bullets';
    if (paginationType && paginationType !== 'none') {
      config.pagination = { el: container.querySelector('.swiper-pagination') };
      switch (paginationType) {
        case 'fraction':
          config.pagination.type = 'fraction';
          break;
        case 'progressbar':
          config.pagination.type = 'progressbar';
          break;
        case 'scrollbar':
          config.pagination.type = 'scrollbar';
          config.scrollbar = { el: container.querySelector('.swiper-scrollbar'), draggable: true };
          break;
        case 'bullets':
        default:
          config.pagination.type = 'bullets';
          config.pagination.clickable = true;
          break;
      }
    }

    // Handle effect
    const effect = ds.swiperEffect || 'slide';
    if (effect && effect !== 'slide') {
      config.effect = effect;
      // Add effect-specific modules if needed
      if (effect === 'fade') {
        config.fadeEffect = { crossFade: true };
      } else if (effect === 'cube') {
        config.cubeEffect = { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 };
      } else if (effect === 'coverflow') {
        config.coverflowEffect = { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true };
      } else if (effect === 'flip') {
        config.flipEffect = { slideShadows: true, limitRotation: true };
      } else if (effect === 'cards') {
        config.cardsEffect = { perSlideOffset: 8, perSlideRotate: 2, rotate: true, slideShadows: true };
      }
    }

    // Handle centered slide
    const centered = readBool(ds.swiperCentered);
    if (centered === true) {
      config.centeredSlides = true;
    }
    const autoplayEnabled = (readBool(ds.swiperAutoplay) ?? !!globals.autoplay) === true;
    config.autoplay = autoplayEnabled ? {
      delay: (readNum(ds.swiperAutoplayDelay) ?? Number(globals.autoplayDelay)) || 4000,
      disableOnInteraction: false,
    } : false;

    // console.log('Initializing plantas slider with config:', config);
    // eslint-disable-next-line no-new
    new Swiper(container, config);
  });
}
