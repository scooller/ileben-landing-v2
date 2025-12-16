import Swiper from 'swiper';

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
    ensureSwiperStructure(container);

    const ds = container.dataset;
    const readNum = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined);
    const readBool = (v) => (v === 'true' ? true : v === 'false' ? false : undefined);

    const localNav = readBool(ds.swiperNavigation);
    const enableNav = localNav !== undefined ? localNav : !!globals.enableNavigation;
    const nav = enableNav ? {
      nextEl: container.querySelector('.swiper-button-next'),
      prevEl: container.querySelector('.swiper-button-prev'),
    } : undefined;

    const localPag = readBool(ds.swiperPagination);
    const enablePag = localPag !== undefined ? localPag : !!globals.enablePagination;
    const pagination = enablePag ? {
      el: container.querySelector('.swiper-pagination'),
      clickable: true,
    } : undefined;

    const localAutoplay = readBool(ds.swiperAutoplay);
    const autoplayEnabled = localAutoplay !== undefined ? localAutoplay : !!globals.autoplay;
    const autoplay = autoplayEnabled ? {
      delay: (readNum(ds.swiperAutoplayDelay) ?? Number(globals.autoplayDelay)) || 4000,
      disableOnInteraction: false,
    } : false;

    const config = {
      slidesPerView: (readNum(ds.swiperSlides) ?? Number(globals.slidesPerView)) || 1.1,
      spaceBetween: (readNum(ds.swiperSpace) ?? Number(globals.spaceBetween)) || 16,
      loop: (readBool(ds.swiperLoop) ?? !!globals.loop),
      speed: (readNum(ds.swiperSpeed) ?? Number(globals.speed)) || 500,
      breakpoints: defaultBreakpoints,
      navigation: nav,
      pagination,
      autoplay,
    };

    // eslint-disable-next-line no-new
    new Swiper(container, config);
  });
}
