import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards } from 'swiper/modules';

function ensureSwiperStructure(container) {
  // Ensure wrapper exists
  let wrapper = container.querySelector('.swiper-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';
    // Move all element children into wrapper and mark as slides
    const children = Array.from(container.childNodes);
    children.forEach((node) => {
      // skip control elements if already present
      if (node.nodeType === 1 && !node.classList.contains('swiper-pagination') && !node.classList.contains('swiper-button-prev') && !node.classList.contains('swiper-button-next')) {
        node.classList.add('swiper-slide');
        wrapper.appendChild(node);
      }
    });
    container.insertBefore(wrapper, container.firstChild);
  } else {
    // Ensure direct children of wrapper are slides
    Array.from(wrapper.children).forEach((el) => el.classList.add('swiper-slide'));
  }
}

export function initSliders() {
  const globals = window.ILEBEN_SWIPER || {};
  const defaultBreakpoints = globals.breakpoints || { 768: { slidesPerView: 1.5 }, 1024: { slidesPerView: 2.2 } };

  const sliders = document.querySelectorAll('.js-swiper');
  sliders.forEach((container) => {
    // Skip plantas sliders (they're handled by initPlantasSlider)
    let parent = container.parentElement;
    while (parent) {
      if (parent.querySelector('.bs-plantas-filters')) {
        return; // Skip this container
      }
      parent = parent.parentElement;
    }
    ensureSwiperStructure(container);

    const ds = container.dataset;
    const sliderId = ds.sliderId; // Get unique slider ID
    const readNum = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined);
    const readBool = (v) => (v === 'true' ? true : v === 'false' ? false : undefined);

    const localNav = readBool(ds.swiperNavigation);
    const enableNav = localNav !== undefined ? localNav : !!globals.enableNavigation;
    const nav = enableNav ? {
      nextEl: container.querySelector('.swiper-button-next, .carousel-control-next') || (sliderId ? `.swiper-button-next-${sliderId}` : undefined),
      prevEl: container.querySelector('.swiper-button-prev, .carousel-control-prev') || (sliderId ? `.swiper-button-prev-${sliderId}` : undefined),
    } : undefined;

    const localPag = readBool(ds.swiperPagination);
    const enablePag = localPag !== undefined ? localPag : !!globals.enablePagination;
    const indicators = container.querySelector('.carousel-indicators');
    const pagination = enablePag ? {
      el: indicators || (sliderId ? `.swiper-pagination-${sliderId}` : container.querySelector('.swiper-pagination')),
      clickable: true,
      bulletClass: 'carousel-indicator-btn',
      bulletActiveClass: 'active'
    } : undefined;

    const localAutoplay = readBool(ds.swiperAutoplay);
    const autoplayEnabled = localAutoplay !== undefined ? localAutoplay : !!globals.autoplay;
    const autoplay = autoplayEnabled ? {
      delay: (readNum(ds.swiperAutoplayDelay) ?? Number(globals.autoplayDelay)) || 4000,
      disableOnInteraction: false,
    } : false;

    // Viewport-specific slides per view (reusing plantas-slider pattern)
    const baseSlides = readNum(ds.swiperSlides) ?? Number(globals.slidesPerView) ?? 1;
    const mobileSlides = readNum(ds.swiperSlidesMobile) ?? baseSlides;
    const desktopSlides = readNum(ds.swiperSlidesDesktop) ?? baseSlides;
    const tabletSlides = readNum(ds.swiperSlidesTablet) ?? (desktopSlides > 1 ? Math.min(2, desktopSlides) : 1);

    const breakpoints = (ds.swiperSlidesMobile || ds.swiperSlidesDesktop) ? {
      768: { slidesPerView: tabletSlides },
      1024: { slidesPerView: desktopSlides }
    } : defaultBreakpoints;

    const spaceBetween = readNum(ds.swiperSpace) ?? (container.classList.contains('carousel') ? 0 : Number(globals.spaceBetween) || 16);

    const config = {
      modules: [Navigation, Pagination, Scrollbar, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards],
      slidesPerView: mobileSlides,
      spaceBetween,
      loop: (readBool(ds.swiperLoop) ?? !!globals.loop),
      speed: (readNum(ds.swiperSpeed) ?? Number(globals.speed)) || 500,
      breakpoints,
      navigation: nav,
      pagination,
      autoplay,
    };

    // Fancybox gallery overlay for carousel slides
    if (readBool(ds.carouselFancybox) || container.classList.contains('has-fancybox')) {
      const galleryId = ds.sliderId || 'carousel-gallery';
      container.querySelectorAll('.swiper-slide, .carousel-item').forEach((slide) => {
        if (!slide.querySelector('a[data-fancybox]')) {
          const bgUrl = slide.style.getPropertyValue('--carousel-bg-desktop')
            ? slide.style.getPropertyValue('--carousel-bg-desktop').replace(/^url\(["']?|["']?\)$/g, '').trim()
            : null;
          if (bgUrl) {
            slide.style.cursor = 'pointer';
            const caption = slide.querySelector('.carousel-caption p')?.textContent || '';
            const link = document.createElement('a');
            link.href = bgUrl;
            link.dataset.fancybox = `gallery-${galleryId}`;
            if (caption) link.dataset.caption = caption;
            link.className = 'carousel-fancybox-overlay position-absolute top-0 start-0 w-100 h-100';
            link.style.zIndex = '2';
            link.setAttribute('aria-label', caption || 'Ver imagen');
            slide.appendChild(link);
          }
        }
      });
    }

    // eslint-disable-next-line no-new
    new Swiper(container, config);
  });
}
