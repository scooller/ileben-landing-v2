/**
 * Parallax Animation Handler — GSAP ScrollTrigger
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initParallax() {
    if (window.innerWidth < 768) return;

    const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
    const processedCarousels = new Set();
    const carouselRefHeights = new WeakMap();

    parallaxElements.forEach((element) => {
        const container = element.closest('.container, .container-fluid');
        const bgElement = element.querySelector('[data-parallax-bg]') || element;
        const carouselElement = element.closest('.carousel');
        const carouselWidth = carouselElement ? carouselElement.offsetWidth : 0;

        const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
        const start = element.getAttribute('data-parallax-start') || 'top center';
        const end = element.getAttribute('data-parallax-end') || 'bottom center';
        const showMarkers = element.getAttribute('data-parallax-markers') === 'true';

        // Normalized height (carousel-aware)
        let elementHeight;
        if (carouselElement) {
            const ref = carouselRefHeights.get(carouselElement);
            if (element.offsetHeight > 0) {
                elementHeight = element.offsetHeight;
                if (!ref) carouselRefHeights.set(carouselElement, elementHeight);
            } else if (ref) {
                elementHeight = ref;
            } else {
                elementHeight = container.offsetHeight;
            }
        } else {
            elementHeight = element.offsetHeight > 0 ? element.offsetHeight : container.offsetHeight;
        }

        const distance = () => elementHeight * speed;
        const compensate = parseFloat(element.getAttribute('data-parallax-compensate'));
        const baseOffsetValue = isNaN(compensate) ? -distance() * 0.5 : -distance() * compensate;
        const baseOffset = () => baseOffsetValue;

        // Carousel slide transition (once per carousel)
        if (carouselElement && !processedCarousels.has(carouselElement)) {
            processedCarousels.add(carouselElement);

            carouselElement.addEventListener('slide.bs.carousel', () => {
                const currentParallaxElement = carouselElement.querySelector('.carousel-item.active [data-parallax="true"]');
                if (!currentParallaxElement) return;

                gsap.fromTo(currentParallaxElement,
                    { x: 0 },
                    {
                        x: carouselWidth / 2,
                        duration: 0.6,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        onComplete: () => gsap.set(currentParallaxElement, { x: 0 })
                    }
                );
            });
        }

        // Background parallax
        gsap.fromTo(bgElement,
            { y: baseOffset, x: 0 },
            {
                y: () => baseOffset() + distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: element, start, end, scrub: true,
                    invalidateOnRefresh: true, markers: showMarkers
                }
            }
        );

        // Blur: blurry → sharp (centered) → blurry
        const blurPx = 8;
        gsap.timeline({
            scrollTrigger: {
                trigger: element, start: 'top bottom', end: 'bottom top',
                scrub: true, invalidateOnRefresh: true
            }
        })
        .fromTo(bgElement,
            { filter: `blur(${blurPx}px)` },
            { filter: 'blur(0px)', duration: 0.5, ease: 'none' }
        )
        .to(bgElement,
            { filter: `blur(${blurPx}px)`, duration: 0.5, ease: 'none' }
        );

        // Content parallax (layered depth)
        const contentElement = element.querySelector('[data-parallax-content-move="true"]');
        if (contentElement) {
            const contentSpeed = speed * 0.3;
            const contentDistance = () => elementHeight * contentSpeed;
            const contentBaseOffset = () => -contentDistance() * 0.5;

            gsap.fromTo(contentElement,
                { y: contentBaseOffset },
                {
                    y: () => contentBaseOffset() + contentDistance(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element, start, end, scrub: true,
                        invalidateOnRefresh: true, markers: showMarkers
                    }
                }
            );
        }
    });
}

function init() {
    initParallax();
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('resize', () => ScrollTrigger.refresh());

export const IlebenParallax = {
    init,
    refresh: () => ScrollTrigger.refresh()
};

window.IlebenParallax = IlebenParallax;
