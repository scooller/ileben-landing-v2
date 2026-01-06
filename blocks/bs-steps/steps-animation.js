/**
 * Steps Progress Animation
 */

(function() {
    'use strict';

    function animateProgressBar(element) {
        const progressBar = element.querySelector('.bs-steps-progress-bar');
        if (!progressBar) return;

        const shouldAnimate = element.dataset.animate === 'true';
        const currentStep = parseInt(element.dataset.currentStep, 10);
        const totalSteps = parseInt(element.dataset.totalSteps, 10);
        
        // Get all step circles to calculate exact position
        const stepCircles = element.querySelectorAll('.bs-step-circle');
        if (stepCircles.length === 0 || currentStep < 1) return;

        // Calculate exact percentage based on circle positions
        let targetWidth = 0;
        if (currentStep === 1) {
            targetWidth = 0;
        } else if (currentStep >= totalSteps) {
            targetWidth = 100;
        } else {
            // Calculate based on actual DOM position for pixel-perfect alignment
            const stepElements = element.querySelectorAll('.bs-step');
            const currentStepElement = stepElements[currentStep - 1];
            
            if (currentStepElement) {
                const containerRect = element.querySelector('.bs-steps-header').getBoundingClientRect();
                const currentRect = currentStepElement.getBoundingClientRect();
                
                // Calculate position of center of current circle relative to container
                const circleCenter = currentRect.left + (currentRect.width / 2) - containerRect.left;
                const totalWidth = containerRect.width;
                
                targetWidth = (circleCenter / totalWidth) * 100;
                targetWidth = Math.max(0, Math.min(100, targetWidth)); // Clamp between 0-100
            } else {
                // Fallback to mathematical calculation
                targetWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
            }
            // refresh data-porcentage attribute
            element.dataset.porcentage = targetWidth;
        }

        if (!shouldAnimate || isNaN(targetWidth)) {
            progressBar.style.width = targetWidth + '%';
            return;
        }

        // Use GSAP for smooth animation
        if (window.gsap) {
            window.gsap.fromTo(progressBar, 
                { width: '0%' },
                { 
                    width: targetWidth + '%',
                    duration: 1,
                    ease: 'power3.out'
                }
            );
        } else {
            // Fallback if GSAP is not loaded
            progressBar.style.width = targetWidth + '%';
        }
    }

    function initSteps() {
        const stepsElements = document.querySelectorAll('.bs-steps[data-animate]');
        
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Delay to ensure layout is complete
                        setTimeout(() => {
                            animateProgressBar(entry.target);
                        }, 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            stepsElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers
            setTimeout(() => {
                stepsElements.forEach(element => {
                    animateProgressBar(element);
                });
            }, 100);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSteps);
    } else {
        initSteps();
    }

    // Re-initialize on dynamic content (AJAX, SPA navigation, etc.)
    window.addEventListener('load', initSteps);

    // Recalculate on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const stepsElements = document.querySelectorAll('.bs-steps[data-animate]');
            stepsElements.forEach(element => {
                const progressBar = element.querySelector('.bs-steps-progress-bar');
                if (progressBar) {
                    // Re-animate without the starting animation
                    element.dataset.animate = 'false';
                    animateProgressBar(element);
                }
            });
        }, 250);
    });

})();
