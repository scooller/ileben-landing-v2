/**
 * Split Carousel Transition Effects
 *
 * Fully replaces Bootstrap's CSS carousel transitions with GSAP animations.
 * Each column (left text / right image) animates independently with
 * selectable effects, duration, and stagger delay.
 */

export function initSplitCarousel() {
  const carousels = document.querySelectorAll('.bs-split-carousel');

  carousels.forEach((carousel) => {
    if (carousel.dataset.splitCarouselInit) return;
    carousel.dataset.splitCarouselInit = '1';

    const leftFx = carousel.dataset.leftTransition || 'fade';
    const rightFx = carousel.dataset.rightTransition || 'fade';
    const duration = parseFloat(carousel.dataset.transitionDuration) || 0.6;
    const stagger = parseFloat(carousel.dataset.staggerDelay) || 0.15;

    // Animate the first active slide on load
    const firstActive = carousel.querySelector('.carousel-item.active');
    if (firstActive) {
      animateItem(firstActive, leftFx, rightFx, duration, stagger);
    }

    // Animate on slide change — use relatedTarget for the INCOMING item
    carousel.addEventListener('slide.bs.carousel', (e) => {
      if (!window.gsap) return;

      const incoming = e.relatedTarget;
      if (!incoming) return;

      // Wait one frame so Bootstrap settles the DOM (adds .active etc.)
      requestAnimationFrame(() => {
        animateItem(incoming, leftFx, rightFx, duration, stagger);
      });
    });
  });
}

function animateItem(item, leftFx, rightFx, duration, stagger) {
  const leftCol = item.querySelector('.split-text-col');
  const rightCol = item.querySelector('.split-image-col');

  if (leftCol) animateColumn(leftCol, leftFx, duration, 0);
  if (rightCol) animateColumn(rightCol, rightFx, duration, stagger);
}

/**
 * Animation presets per effect name.
 * Each returns { from, to } GSAP var objects.
 */
function getEffectVars(effect, duration) {
  const base = { duration, ease: 'power2.out' };

  switch (effect) {
    case 'fadeUp':
      return { from: { opacity: 0, y: 40 }, to: { ...base, opacity: 1, y: 0 } };
    case 'fadeDown':
      return { from: { opacity: 0, y: -40 }, to: { ...base, opacity: 1, y: 0 } };
    case 'fadeLeft':
      return { from: { opacity: 0, x: 60 }, to: { ...base, opacity: 1, x: 0 } };
    case 'fadeRight':
      return { from: { opacity: 0, x: -60 }, to: { ...base, opacity: 1, x: 0 } };
    case 'scaleIn':
      return { from: { opacity: 0, scale: 0.8 }, to: { ...base, opacity: 1, scale: 1 } };
    case 'slideUp':
      return { from: { y: 60 }, to: { ...base, y: 0 } };
    case 'slideLeft':
      return { from: { x: 80 }, to: { ...base, x: 0 } };
    case 'slideRight':
      return { from: { x: -80 }, to: { ...base, x: 0 } };
    case 'flipY':
      return { from: { opacity: 0, rotationY: 90 }, to: { ...base, opacity: 1, rotationY: 0 } };
    case 'flipX':
      return { from: { opacity: 0, rotationX: 90 }, to: { ...base, opacity: 1, rotationX: 0 } };
    case 'backOut':
      return { from: { opacity: 0, scale: 0.7 }, to: { ...base, opacity: 1, scale: 1, ease: 'back.out(1.7)' } };
    case 'blurFocus':
      return { from: { opacity: 0, filter: 'blur(15px)' }, to: { ...base, opacity: 1, filter: 'blur(0px)' } };
    case 'clipReveal':
      return { from: { clipPath: 'inset(0 100% 0 0)' }, to: { ...base, clipPath: 'inset(0 0% 0 0)' } };
    case 'rotateIn':
      return { from: { opacity: 0, rotation: -15, scale: 0.8 }, to: { ...base, opacity: 1, rotation: 0, scale: 1 } };
    // fade / default
    default:
      return { from: { opacity: 0 }, to: { ...base, opacity: 1 } };
  }
}

function animateColumn(el, effect, duration, delay) {
  const { from, to } = getEffectVars(effect, duration);

  gsap.killTweensOf(el);
  gsap.fromTo(el, from, { ...to, delay });
}
