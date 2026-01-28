/**
 * Parallax Animation Handler
 * Handles parallax scroll effects using GSAP and ScrollTrigger
 * Uses CSS variables to work independently with other animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
/**
 * Simple parallax implementation using GreenSock's best practices
 * Similar to: https://codepen.io/GreenSock/pen/QWjjYEw
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax="true"]');

    // Track carousels to avoid adding multiple listeners for the same carousel
    const processedCarousels = new Set();
    // Cache a reference element height per carousel so hidden slides use the same value
    const carouselRefHeights = new WeakMap();

    parallaxElements.forEach((element, index) => {
        
        // Find the container parent (.container or .container-fluid)
        const container = element.closest('.container, .container-fluid');
        if (!container) {
            console.error('Parallax element has no .container or .container-fluid parent', element);
            return;
        }

        // Check if parallax is inside a Bootstrap carousel (determine early for height normalization)
        const carouselElement = element.closest('.carousel');
        const carouselWidth = carouselElement ? carouselElement.offsetWidth : 0;

        // Get speed value (how fast/slow the parallax moves)
        // Positive values = moves down slower than scroll (common parallax)
        // Negative values = moves up faster than scroll
        const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
        
        // Get custom start/end positions if specified
        const start = element.getAttribute('data-parallax-start') || 'top center';
        const end = element.getAttribute('data-parallax-end') || 'bottom center';
        // Determine a normalized element height across carousel slides
        // - If inside a carousel: use the first non-zero element height encountered and reuse for all slides
        // - Otherwise: use element's height or fallback to container height
        let elementHeight;
        let refHeightSource = 'element(visible)';
        if (carouselElement) {
            const ref = carouselRefHeights.get(carouselElement);
            if (element.offsetHeight > 0) {
                elementHeight = element.offsetHeight;
                refHeightSource = ref ? 'element(visible-existingRef)' : 'element(visible-setRef)';
                if (!ref) {
                    carouselRefHeights.set(carouselElement, elementHeight);
                }
            } else if (ref) {
                elementHeight = ref;
                refHeightSource = 'carouselRef';
            } else {
                elementHeight = container.offsetHeight; // last-resort fallback
                refHeightSource = 'container(fallback)';
            }
        } else {
            elementHeight = element.offsetHeight > 0 ? element.offsetHeight : container.offsetHeight;
            refHeightSource = element.offsetHeight > 0 ? 'element(visible)' : 'container(fallback)';
        }
        
        const distance = () => elementHeight * speed;
        // Compensate initial position so it doesn't look offset when speed is high.
        // Defaults to 0.5 (center the travel around the original position).
        const compensate = parseFloat(element.getAttribute('data-parallax-compensate'));
        // Cache baseOffset on init to prevent accumulation when element is hidden in carousel
        const baseOffsetValue = isNaN(compensate) ? -distance() * 0.5 : -distance() * compensate;
        const baseOffset = () => baseOffsetValue;

        // init values computed above; only log on errors

        // Add carousel event listener only ONCE per carousel
        if (carouselElement && !processedCarousels.has(carouselElement)) {
            processedCarousels.add(carouselElement);
            
            const carouselDuration = 600; // Bootstrap default carousel slide duration in milliseconds
            const carouselDurationSeconds = carouselDuration / 1000;

            // Listen to Bootstrap carousel slide events
            carouselElement.addEventListener('slide.bs.carousel', (event) => {
                // Get the parallax element that will be active in the next slide
                const nextSlide = carouselElement.querySelectorAll('.carousel-item')[event.to];
                const nextParallaxElement = nextSlide ? nextSlide.querySelector('[data-parallax="true"]') : null;
                const currentParallaxElement = carouselElement.querySelector('.carousel-item.active [data-parallax="true"]');

                if (nextParallaxElement) {
                    
                    // Animate the parallax element to move based on slide transition
                    gsap.fromTo(currentParallaxElement, {
                        x: 0
                    }, {
                        x: carouselWidth / 2,
                        duration: carouselDurationSeconds,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        onComplete: () => {
                            gsap.set(currentParallaxElement, { x: 0 });
                        }
                    });
                }
            });

            // After slide completes, reset position to 0
            // carouselElement.addEventListener('slid.bs.carousel', (event) => {
            //     const activeSlide = carouselElement.querySelector('.carousel-item.active');
            //     const activeParallaxElement = activeSlide ? activeSlide.querySelector('[data-parallax="true"]') : null;

            //     if (activeParallaxElement) {
            //         console.log('✅ Carousel slide complete, resetting position at index', event.to);
            //         gsap.set(activeParallaxElement, { x: 0 });
            //     }
            // });
        }

        // Create the parallax scroll animation
        gsap.fromTo(
            element,
            { y: baseOffset, x: 0 },
            {
                y: () => baseOffset() + distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: start,
                    end: end,
                    scrub: true,
                    invalidateOnRefresh: true, // Recalculates on resize
                    // markers: true
                }
            }
        );
    });
}

/**
 * Initialize when DOM is ready
 */
function init() {
    initParallax();

    // Refresh ScrollTrigger when images load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Export for external use
export const IlebenParallax = {
    init: init,
    refresh: () => ScrollTrigger.refresh()
};

// Also expose to window for backward compatibility
window.IlebenParallax = IlebenParallax;
