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
    console.log('🔍 Found parallax elements:', parallaxElements.length);

    parallaxElements.forEach((element, index) => {
        console.log(`\n📍 Processing parallax element ${index + 1}:`, element);
        
        // Find the container parent (.container or .container-fluid)
        const container = element.closest('.container, .container-fluid');
        if (!container) {
            console.warn('⚠️ Parallax element has no .container or .container-fluid parent', element);
            return;
        }
        console.log('✅ Container found:', container);

        // Get speed value (how fast/slow the parallax moves)
        // Positive values = moves down slower than scroll (common parallax)
        // Negative values = moves up faster than scroll
        const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
        
        // Get custom start/end positions if specified
        const start = element.getAttribute('data-parallax-start') || 'top center';
        const end = element.getAttribute('data-parallax-end') || 'bottom center';

        const distance = () => element.offsetHeight * speed;
        // Compensate initial position so it doesn't look offset when speed is high.
        // Defaults to 0.5 (center the travel around the original position).
        const compensate = parseFloat(element.getAttribute('data-parallax-compensate'));
        const baseOffset = isNaN(compensate) ? () => -distance() * 0.5 : () => -distance() * compensate;

        console.log('⚙️ Settings:', { speed, start, end, distance: distance(), baseOffset: baseOffset() });

        // Check if parallax is inside a Bootstrap carousel
        const carouselElement = element.closest('.carousel');
        let carouselOffsetX = 0;
        
        // Store initial dimensions (they change when carousel items are hidden)
        const initialElementWidth = element.offsetWidth;
        const carouselWidth = carouselElement ? carouselElement.offsetWidth : 0;

        if (carouselElement) {
            console.log('🎠 Carousel detected:', carouselElement);
            console.log('📐 Carousel width:', carouselWidth);
            console.log('📐 Element width (initial):', initialElementWidth);
            console.log('📐 Element height:', element.offsetHeight);
            
            // Get carousel animation duration from Bootstrap's default (600ms)
            // This is the time it takes for the slide transition
            const carouselDuration = 600; // Bootstrap default carousel slide duration in milliseconds
            const carouselDurationSeconds = carouselDuration / 1000;
            console.log(`⏱️ Carousel duration: ${carouselDuration}ms`);
            
            // Listen to Bootstrap carousel slide events
            // Use 'slide.bs.carousel' to start animation immediately (not 'slid.bs.carousel' which fires at end)
            carouselElement.addEventListener('slide.bs.carousel', (event) => {
                // Use stored initial width instead of current width (which becomes 0 when hidden)
                const slideX = parseFloat(element.getAttribute('data-parallax-slide-offset')) || initialElementWidth || carouselWidth;
                console.log(`📊 SlideX calculated:`, { 
                    attribute: element.getAttribute('data-parallax-slide-offset'),
                    initialElementWidth: initialElementWidth,
                    carouselWidth: carouselWidth,
                    finalSlideX: slideX,
                    eventIndex: event.to
                });
                
                carouselOffsetX = event.to * slideX;
                console.log(`🎠 Carousel slide changed! Index: ${event.to}, Offset: ${carouselOffsetX}px`);
                
                // Update the animation with carousel duration
                gsap.to(element, {
                    x: carouselOffsetX,
                    duration: carouselDurationSeconds,
                    ease: 'power2.inOut',
                    overwrite: 'auto'
                });
            });
        } else {
            console.log('❌ No carousel detected');
        }

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
                    // markers: true // Uncomment for debugging
                }
            }
        );
        
        console.log('✅ Parallax animation created for element', index + 1);
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
