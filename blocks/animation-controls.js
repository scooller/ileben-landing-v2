/**
 * Animation Controls Utility for Gutenberg Blocks
 * Componentes reutilizables para controlar animaciones GSAP
 */

(function() {
const { __ } = wp.i18n;
const {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
} = wp.components;
const { createElement: el, Fragment } = wp.element;

/**
 * Animaci├│n types disponibles
 */
const ANIMATION_TYPES = [
    { label: __('None', 'ileben-landing'), value: '' },
    { label: __('--- Fade ---', 'ileben-landing'), value: '' },
    { label: __('Fade In', 'ileben-landing'), value: 'fadeIn' },
    { label: __('Fade In Up', 'ileben-landing'), value: 'fadeInUp' },
    { label: __('Fade In Down', 'ileben-landing'), value: 'fadeInDown' },
    { label: __('Fade In Left', 'ileben-landing'), value: 'fadeInLeft' },
    { label: __('Fade In Right', 'ileben-landing'), value: 'fadeInRight' },
    { label: __('--- Slide ---', 'ileben-landing'), value: '' },
    { label: __('Slide Up', 'ileben-landing'), value: 'slideUp' },
    { label: __('Slide Down', 'ileben-landing'), value: 'slideDown' },
    { label: __('Slide Left', 'ileben-landing'), value: 'slideLeft' },
    { label: __('Slide Right', 'ileben-landing'), value: 'slideRight' },
    { label: __('--- Scale ---', 'ileben-landing'), value: '' },
    { label: __('Scale In', 'ileben-landing'), value: 'scaleIn' },
    { label: __('Scale Up', 'ileben-landing'), value: 'scaleUp' },
    { label: __('Scale Down', 'ileben-landing'), value: 'scaleDown' },
    { label: __('--- Rotate ---', 'ileben-landing'), value: '' },
    { label: __('Rotate', 'ileben-landing'), value: 'rotate' },
    { label: __('Rotate Fast', 'ileben-landing'), value: 'rotateFast' },
    { label: __('--- Effects ---', 'ileben-landing'), value: '' },
    { label: __('Bounce', 'ileben-landing'), value: 'bounce' },
    { label: __('Elastic', 'ileben-landing'), value: 'elastic' },
    { label: __('Flip', 'ileben-landing'), value: 'flip' },
    { label: __('Flip X', 'ileben-landing'), value: 'flipX' },
    { label: __('Pulse', 'ileben-landing'), value: 'pulse' },
    { label: __('--- Special ---', 'ileben-landing'), value: '' },
    { label: __('Count Up', 'ileben-landing'), value: 'countup' },
];

const ANIMATION_TRIGGERS = [
    { label: __('On Load', 'ileben-landing'), value: 'on-load' },
    { label: __('On Scroll', 'ileben-landing'), value: 'on-scroll' },
    { label: __('On Hover', 'ileben-landing'), value: 'on-hover' },
    { label: __('On Click', 'ileben-landing'), value: 'on-click' },
];

const EASE_OPTIONS = [
    { label: __('Linear', 'ileben-landing'), value: 'linear' },
    { label: __('Power 1 In Out', 'ileben-landing'), value: 'power1.inOut' },
    { label: __('Power 2 In Out', 'ileben-landing'), value: 'power2.inOut' },
    { label: __('Power 3 In Out', 'ileben-landing'), value: 'power3.inOut' },
    { label: __('Power 4 In Out', 'ileben-landing'), value: 'power4.inOut' },
    { label: __('Back Out', 'ileben-landing'), value: 'back.out' },
    { label: __('Elastic Out', 'ileben-landing'), value: 'elastic.out' },
    { label: __('Bounce Out', 'ileben-landing'), value: 'bounce.out' },
    { label: __('Circ In Out', 'ileben-landing'), value: 'circ.inOut' },
    { label: __('Sine In Out', 'ileben-landing'), value: 'sine.inOut' },
];

const HOVER_EFFECTS = [
    { label: __('Scale', 'ileben-landing'), value: 'scale' },
    { label: __('Brightness', 'ileben-landing'), value: 'brightness' },
    { label: __('Shadow', 'ileben-landing'), value: 'shadow' },
    { label: __('Lift', 'ileben-landing'), value: 'lift' },
    { label: __('Glow', 'ileben-landing'), value: 'glow' },
];

/**
 * Componente principal de controles de animaci├│n
 */
function AnimationControls({ attributes, setAttributes, allowHover = true, allowScroll = true }) {
    const animationType = attributes.animationType || '';

    return el(
        Fragment,
        null,
        el(
            PanelBody,
            { title: __('Animation', 'ileben-landing'), initialOpen: false },
            
            // Animation Type
            el(SelectControl, {
                label: __('Animation Type', 'ileben-landing'),
                value: animationType,
                options: ANIMATION_TYPES,
                onChange: (value) => {
                    const updates = { animationType: value };
                    
                    // Auto-fill duration and delay if animation type is selected and they're empty
                    if (value && value !== '') {
                        if (!attributes.animationDuration || attributes.animationDuration === '') {
                            updates.animationDuration = 0.6;
                        }
                        if (!attributes.animationDelay || attributes.animationDelay === '') {
                            updates.animationDelay = 0;
                        }
                        if (!attributes.animationTrigger || attributes.animationTrigger === '') {
                            updates.animationTrigger = 'on-load';
                        }
                        if (!attributes.animationEase || attributes.animationEase === '') {
                            updates.animationEase = 'power2.inOut';
                        }
                    }
                    
                    setAttributes(updates);
                }
            }),

            animationType && el(
                Fragment,
                null,

                // Animation Trigger
                el(SelectControl, {
                    label: __('Trigger', 'ileben-landing'),
                    value: attributes.animationTrigger || 'on-load',
                    options: ANIMATION_TRIGGERS,
                    onChange: (value) => setAttributes({ animationTrigger: value })
                }),

                // Duration
                el(RangeControl, {
                    label: __('Duration (seconds)', 'ileben-landing'),
                    value: attributes.animationDuration || 0.6,
                    min: 0.1,
                    max: 3,
                    step: 0.1,
                    onChange: (value) => setAttributes({ animationDuration: value })
                }),

                // Delay
                el(RangeControl, {
                    label: __('Delay (seconds)', 'ileben-landing'),
                    value: attributes.animationDelay || 0,
                    min: 0,
                    max: 5,
                    step: 0.1,
                    onChange: (value) => setAttributes({ animationDelay: value })
                }),

                // Easing
                el(SelectControl, {
                    label: __('Easing', 'ileben-landing'),
                    value: attributes.animationEase || 'power2.inOut',
                    options: EASE_OPTIONS,
                    onChange: (value) => setAttributes({ animationEase: value })
                }),

                // Distance (para slides/fades directional)
                ['fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'bounce'].includes(animationType) &&
                el(TextControl, {
                    label: __('Distance (px)', 'ileben-landing'),
                    value: attributes.animationDistance || '30',
                    onChange: (value) => setAttributes({ animationDistance: value })
                }),

                // Scale (para scale animations)
                ['scaleIn', 'scaleUp', 'scaleDown'].includes(animationType) &&
                el(RangeControl, {
                    label: __('Scale From', 'ileben-landing'),
                    value: parseFloat(attributes.animationScale || '0.8'),
                    min: 0.1,
                    max: 2,
                    step: 0.1,
                    onChange: (value) => setAttributes({ animationScale: value.toString() })
                }),

                // Rotation (para rotate animations)
                ['rotate', 'rotateFast', 'flip', 'flipX'].includes(animationType) &&
                el(RangeControl, {
                    label: __('Rotation (degrees)', 'ileben-landing'),
                    value: attributes.animationRotation || 360,
                    min: 0,
                    max: 720,
                    step: 45,
                    onChange: (value) => setAttributes({ animationRotation: value })
                }),

                // Count To (para countup animation)
                animationType === 'countup' &&
                el(
                    Fragment,
                    null,
                    el(TextControl, {
                        label: __('Count To (target value)', 'ileben-landing'),
                        type: 'number',
                        value: attributes.animationCountTo || '100',
                        onChange: (value) => setAttributes({ animationCountTo: value })
                    }),
                    el(TextControl, {
                        label: __('Increment Step', 'ileben-landing'),
                        type: 'number',
                        value: attributes.animationCountIncrement || '1',
                        onChange: (value) => setAttributes({ animationCountIncrement: value }),
                        help: __('El valor de incremento para cada paso del contador (ej: 1, 5, 10)', 'ileben-landing')
                    })
                ),

                // Repeat options
                el(RangeControl, {
                    label: __('Repeat Count', 'ileben-landing'),
                    value: attributes.animationRepeat || 0,
                    min: 0,
                    max: 5,
                    step: 1,
                    onChange: (value) => setAttributes({ animationRepeat: value })
                }),

                (attributes.animationRepeat || 0) > 0 && el(
                    Fragment,
                    null,
                    el(RangeControl, {
                        label: __('Repeat Delay (seconds)', 'ileben-landing'),
                        value: attributes.animationRepeatDelay || 0.5,
                        min: 0,
                        max: 3,
                        step: 0.1,
                        onChange: (value) => setAttributes({ animationRepeatDelay: value })
                    }),

                    el(ToggleControl, {
                        label: __('Yoyo (reverse animation)', 'ileben-landing'),
                        checked: attributes.animationYoyo || false,
                        onChange: (value) => setAttributes({ animationYoyo: value })
                    })
                ),

                // Hover Effect
                allowHover && attributes.animationTrigger === 'on-hover' &&
                el(SelectControl, {
                    label: __('Hover Effect', 'ileben-landing'),
                    value: attributes.animationHoverEffect || 'scale',
                    options: HOVER_EFFECTS,
                    onChange: (value) => setAttributes({ animationHoverEffect: value })
                }),

                // Parallax Speed
                allowScroll && attributes.animationTrigger === 'on-scroll' &&
                el(RangeControl, {
                    label: __('Parallax Speed', 'ileben-landing'),
                    value: attributes.animationParallaxSpeed || 0.5,
                    min: 0.1,
                    max: 2,
                    step: 0.1,
                    onChange: (value) => setAttributes({ animationParallaxSpeed: value })
                }),

                // ScrollTrigger Start Position
                allowScroll && attributes.animationTrigger === 'on-scroll' &&
                el(TextControl, {
                    label: __('Scroll Start', 'ileben-landing'),
                    value: attributes.animationScrollStart || 'top 70%',
                    onChange: (value) => setAttributes({ animationScrollStart: value }),
                    help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                }),

                // ScrollTrigger End Position
                allowScroll && attributes.animationTrigger === 'on-scroll' &&
                el(TextControl, {
                    label: __('Scroll End', 'ileben-landing'),
                    value: attributes.animationScrollEnd || 'top 10%',
                    onChange: (value) => setAttributes({ animationScrollEnd: value }),
                    help: __('Ej: "top 10%", "bottom center"', 'ileben-landing')
                }),

                // ScrollTrigger Markers
                allowScroll && attributes.animationTrigger === 'on-scroll' &&
                el(ToggleControl, {
                    label: __('Show ScrollTrigger Markers', 'ileben-landing'),
                    checked: attributes.animationScrollMarkers || false,
                    onChange: (value) => setAttributes({ animationScrollMarkers: value }),
                    help: __('Muestra l├¡neas de debug en la p├ígina', 'ileben-landing')
                }),

                // Mobile enabled
                el(ToggleControl, {
                    label: __('Enable on Mobile', 'ileben-landing'),
                    checked: attributes.animationMobileEnabled !== false,
                    onChange: (value) => setAttributes({ animationMobileEnabled: value })
                })
            )
        )
    );
}

// Exportar para uso global
window.ilebenAnimationControls = {
    AnimationControls,
    ANIMATION_TYPES,
    ANIMATION_TRIGGERS,
    EASE_OPTIONS,
    HOVER_EFFECTS
};
})();