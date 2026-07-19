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

    // Use matchMedia for responsive refresh that re-creates triggers on breakpoint crossing
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {

    const anyMarkers = Array.from(parallaxElements).some(el => el.getAttribute('data-parallax-markers') === 'true');
    if (anyMarkers) console.log('%c[Parallax] initParallax — elementos encontrados:', 'color:cyan;font-weight:bold', parallaxElements.length);

    parallaxElements.forEach((element, i) => {
        const container = element.closest('.container, .container-fluid');
        const bgElement = element.querySelector('[data-parallax-bg]') || element;
        const carouselElement = element.closest('.carousel');
        const carouselWidth = carouselElement ? carouselElement.offsetWidth : 0;

        const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
        const start = element.getAttribute('data-parallax-start') || 'top bottom';
        const end = element.getAttribute('data-parallax-end') || 'bottom top';
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

        if (showMarkers) console.log(`%c[Parallax #${i}]`, 'color:lime;font-weight:bold', {
            element,
            classes: element.className,
            offsetHeight: element.offsetHeight,
            offsetTop: element.offsetTop,
            getBoundingClientRect: element.getBoundingClientRect(),
            containerHeight: container?.offsetHeight,
            elementHeight,
            speed,
            distance: distance(),
            baseOffset: baseOffset(),
            start,
            end,
            bgElement,
            bgOffsetHeight: bgElement.offsetHeight,
            carousel: !!carouselElement,
            windowWidth: window.innerWidth,
        });

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
    }); // end mm.add
}

function waitForImages(container) {
    const images = container.querySelectorAll('img');
    const pending = Array.from(images).filter(img => !img.complete);
    if (pending.length === 0) return Promise.resolve();
    return Promise.all(pending.map(img =>
        new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        })
    ));
}

function init() {
    initParallax();
    // Refresh after everything loads (images, fonts, layout)
    window.addEventListener('load', () => {
        waitForImages(document).then(() => {
            const anyMarkers = Array.from(document.querySelectorAll('[data-parallax="true"]')).some(el => el.getAttribute('data-parallax-markers') === 'true');
            if (anyMarkers) console.log('%c[Parallax] window.load + imágenes cargadas — ScrollTrigger.refresh()', 'color:orange;font-weight:bold');
            if (anyMarkers) {
                document.querySelectorAll('[data-parallax="true"]').forEach((el, i) => {
                    console.log(`%c[Parallax #${i} post-load]`, 'color:yellow', {
                        offsetHeight: el.offsetHeight,
                        offsetTop: el.offsetTop,
                        rect: el.getBoundingClientRect(),
                    });
                });
            }
            ScrollTrigger.refresh();
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});

export const IlebenParallax = {
    init,
    refresh: () => ScrollTrigger.refresh()
};

window.IlebenParallax = IlebenParallax;
