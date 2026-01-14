/**
 * Parallax Animation Handler
 * Handles parallax scroll effects using GSAP and ScrollTrigger
 * Uses CSS variables to work independently with other animations
 */

(function() {
    'use strict';

    // Alert para confirmar que el script se cargó
    console.clear();
    console.log('%c🎬 PARALLAX.JS LOADED!', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%cTimestamp:', 'font-weight: bold;', new Date().toLocaleTimeString());

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP NOT FOUND');
        return;
    }
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger NOT FOUND');
        return;
    }

    console.log('✅ GSAP available:', typeof gsap);
    console.log('✅ ScrollTrigger available:', typeof ScrollTrigger);

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ ScrollTrigger plugin registered');

    /**
     * Initialize parallax elements with CSS variables
     * This approach allows parallax to work independently from other animations
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
        // console.log(`🔍 Found ${parallaxElements.length} parallax elements`);

        parallaxElements.forEach((element, index) => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            console.log(`📦 Processing parallax element ${index + 1}, speed: ${speed}`);

            // Find the parent container (closest .container or .container-fluid)
            const container = element.closest('.container, .container-fluid');
            if (!container) {
                console.warn(`⚠️ Element ${index + 1} has no .container or .container-fluid parent - skipping`);
                return;
            }

            // console.log(`✅ Found container for element ${index + 1}`);

            // Initialize CSS variables for parallax
            element.style.setProperty('--parallax-y', '0px');

            // Create parallax animation using CSS variables
            gsap.to(element, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    onUpdate: (self) => {
                        // Calculate parallax offset based on scroll progress
                        const parallaxValue = self.progress() * 150 * speed;
                        // Use CSS variable instead of direct transform
                        element.style.setProperty('--parallax-y', parallaxValue + 'px');
                        // console.log(`🎯 Element ${index + 1} parallax update - progress: ${(self.progress() * 100).toFixed(1)}%, Y: ${parallaxValue.toFixed(2)}px`);
                    },
                    markers: false,
                    invalidateOnRefresh: true
                }
            });
            
            // console.log(`✅ Parallax animation created for element ${index + 1}`);
        });
    }

    /**
     * Alternative: Apply parallax directly with careful timing
     * Allows other animations to coexist by using dedicated properties
     */
    function initCompatibleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
        // console.log(`🔍 [Compatible] Found ${parallaxElements.length} parallax elements`);

        parallaxElements.forEach((element, index) => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            const multiplier = parseFloat(element.getAttribute('data-parallax-multiplier')) || 120;
            const container = element.closest('.container, .container-fluid');

            if (!container) {
                console.warn(`⚠️ [Compatible] Element ${index + 1} has no .container or .container-fluid parent - skipping`);
                return;
            }

            // console.log(`✅ [Compatible] Processing element ${index + 1}, speed: ${speed}`);

            // Initialize CSS variable
            element.style.setProperty('--parallax-y', '0px');
            // console.log(`✅ [Compatible] CSS variable initialized for element ${index + 1}`);

            // Use a simple object to animate for better compatibility
            const parallaxObj = { progress: 0 };

            gsap.to(parallaxObj, {
                progress: 1,
                scrollTrigger: {
                    trigger: container,
                    start: '20% center',
                    end: 'bottom center',
                    scrub: 0.3,
                    onUpdate: () => {
                        const parallaxValue = parallaxObj.progress * multiplier * speed;
                        element.style.setProperty('--parallax-y', parallaxValue + 'px');
                        // console.log(`🎯 [Compatible] Element ${index + 1} - progress: ${(parallaxObj.progress * 100).toFixed(1)}%, Y: ${parallaxValue.toFixed(2)}px`);
                    },
                    markers: false,
                    invalidateOnRefresh: true
                }
            });
            
            // console.log(`✅ [Compatible] Parallax animation created for element ${index + 1}`);
        });
    }

    /**
     * Initialize when DOM is ready
     */
    function init() {
        // Wait for GSAP to be fully loaded
        if (typeof gsap === 'undefined') {
            console.warn('⚠️ GSAP not loaded, retrying in 100ms...');
            setTimeout(init, 100);
            return;
        }

        // console.log('🚀 Initializing parallax system...');

        // Use the compatible parallax implementation (works with other animations)
        initCompatibleParallax();

        // console.log('✅ Parallax system initialized');

        // Refresh ScrollTrigger when images load
        window.addEventListener('load', () => {
            console.log('📷 Images loaded - refreshing ScrollTrigger');
            ScrollTrigger.refresh();
        });
    }

    // Initialize when document is ready
    if (document.readyState === 'loading') {
        // console.log('📄 DOM still loading - waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // console.log('📄 DOM already loaded - initializing immediately');
        init();
    }

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        // console.log('📐 Window resized - refreshing ScrollTrigger');
        ScrollTrigger.refresh();
    });

    // Export for external use
    window.IlebenParallax = {
        init: init,
        initSimple: initParallax,
        initAdvanced: initCompatibleParallax,
        refresh: () => {
            // console.log('🔄 Manual parallax refresh');
            ScrollTrigger.refresh();
        }
    };
    
    // console.log('✅ Parallax module exported to window.IlebenParallax');
})();
