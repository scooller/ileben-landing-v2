/**
 * Core Blocks Extension - Add animation support to core/heading and core/paragraph
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { addFilter } = wp.hooks;
    const { Fragment, createElement: el } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl } = wp.components;
    const { createHigherOrderComponent } = wp.compose;

    // Bloques que extenderemos
    const allowedBlocks = ['core/heading', 'core/paragraph', 'core/image'];

    // Animation types
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
     * Add animation attributes to core blocks
     */
    function addAnimationAttributes(settings, name) {
        if (!allowedBlocks.includes(name)) {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                // Animation attributes
                animationType: { type: 'string' },
                animationTrigger: { type: 'string' },
                animationDuration: { type: 'number' },
                animationDelay: { type: 'number' },
                animationEase: { type: 'string' },
                animationRepeat: { type: 'number' },
                animationRepeatDelay: { type: 'number' },
                animationYoyo: { type: 'boolean' },
                animationDistance: { type: 'string' },
                animationRotation: { type: 'number' },
                animationScale: { type: 'string' },
                animationParallaxSpeed: { type: 'number' },
                animationHoverEffect: { type: 'string' },
                animationMobileEnabled: { type: 'boolean' },
                // CountUp attributes
                animationCountTo: { type: 'string' },
                animationCountIncrement: { type: 'string' },
                // SplitText attributes
                enableSplitText: { type: 'boolean' },
                splitTextType: { type: 'string' }, // words | chars
                splitTextStagger: { type: 'number' }
            }
        };
    }

    /**
     * Add animation controls to block inspector
     */
    const withAnimationControls = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            if (!allowedBlocks.includes(props.name)) {
                return el(BlockEdit, props);
            }

            const { attributes, setAttributes } = props;
            const animationType = attributes.animationType || '';

            return el(
                Fragment,
                {},
                el(BlockEdit, props),
                el(
                    InspectorControls,
                    {},
                    // Animation Controls Panel
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
                                
                                // Auto-fill duration, delay, trigger and ease if animation type is selected and they're empty
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
                            {},

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
                                {},
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
                                {},
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
                            attributes.animationTrigger === 'on-hover' &&
                            el(SelectControl, {
                                label: __('Hover Effect', 'ileben-landing'),
                                value: attributes.animationHoverEffect || 'scale',
                                options: HOVER_EFFECTS,
                                onChange: (value) => setAttributes({ animationHoverEffect: value })
                            }),

                            // Parallax Speed
                            attributes.animationTrigger === 'on-scroll' &&
                            el(RangeControl, {
                                label: __('Parallax Speed', 'ileben-landing'),
                                value: attributes.animationParallaxSpeed || 0.5,
                                min: 0.1,
                                max: 2,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationParallaxSpeed: value })
                            }),

                            // Mobile enabled
                            el(ToggleControl, {
                                label: __('Enable on Mobile', 'ileben-landing'),
                                checked: attributes.animationMobileEnabled !== false,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    ),
                    
                    // SplitText Panel
                    // si el bloque es heading o paragraph
                    (props.name === 'core/heading' || props.name === 'core/paragraph') &&
                    el(
                        PanelBody,
                        {
                            title: __('SplitText Animation', 'ileben-landing'),
                            initialOpen: false
                        },
                        el(ToggleControl, {
                            label: __('Enable SplitText', 'ileben-landing'),
                            help: __('Split text into words or characters for staggered animations', 'ileben-landing'),
                            checked: attributes.enableSplitText || false,
                            onChange: (value) => setAttributes({ enableSplitText: value })
                        }),

                        attributes.enableSplitText && el(
                            Fragment,
                            {},
                            el(SelectControl, {
                                label: __('Split Type', 'ileben-landing'),
                                value: attributes.splitTextType || 'words',
                                options: [
                                    { label: __('Words', 'ileben-landing'), value: 'words' },
                                    { label: __('Characters', 'ileben-landing'), value: 'chars' }
                                ],
                                onChange: (value) => setAttributes({ splitTextType: value })
                            }),

                            el(RangeControl, {
                                label: __('Stagger Delay (seconds)', 'ileben-landing'),
                                help: __('Delay between each word/character animation', 'ileben-landing'),
                                value: attributes.splitTextStagger || 0.05,
                                min: 0,
                                max: 0.5,
                                step: 0.01,
                                onChange: (value) => setAttributes({ splitTextStagger: value })
                            })
                        )
                    )
                )
            );
        };
    }, 'withAnimationControls');

    /**
     * Add animation data attributes to block wrapper
     * NOTA: No usamos blocks.getSaveContent.extraProps porque causa problemas
     * Los data attributes se agregan din├ímicamente en PHP mediante el filtro render_block
     */
    function addAnimationProps(props, blockType, attributes) {
        // Este filtro ahora solo es informativo, los data attributes
        // se agregan en PHP via inc/core-blocks-animation.php
        return props;
    }

    // Register filters
    addFilter(
        'blocks.registerBlockType',
        'ileben/add-animation-attributes',
        addAnimationAttributes
    );

    addFilter(
        'editor.BlockEdit',
        'ileben/with-animation-controls',
        withAnimationControls
    );

})(window.wp);