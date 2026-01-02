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
    const allowedBlocks = ['core/heading', 'core/paragraph'];

    // Animation types
    const ANIMATION_TYPES = [
        { label: __('None', 'bootstrap-theme'), value: '' },
        { label: __('--- Fade ---', 'bootstrap-theme'), value: '' },
        { label: __('Fade In', 'bootstrap-theme'), value: 'fadeIn' },
        { label: __('Fade In Up', 'bootstrap-theme'), value: 'fadeInUp' },
        { label: __('Fade In Down', 'bootstrap-theme'), value: 'fadeInDown' },
        { label: __('Fade In Left', 'bootstrap-theme'), value: 'fadeInLeft' },
        { label: __('Fade In Right', 'bootstrap-theme'), value: 'fadeInRight' },
        { label: __('--- Slide ---', 'bootstrap-theme'), value: '' },
        { label: __('Slide Up', 'bootstrap-theme'), value: 'slideUp' },
        { label: __('Slide Down', 'bootstrap-theme'), value: 'slideDown' },
        { label: __('Slide Left', 'bootstrap-theme'), value: 'slideLeft' },
        { label: __('Slide Right', 'bootstrap-theme'), value: 'slideRight' },
        { label: __('--- Scale ---', 'bootstrap-theme'), value: '' },
        { label: __('Scale In', 'bootstrap-theme'), value: 'scaleIn' },
        { label: __('Scale Up', 'bootstrap-theme'), value: 'scaleUp' },
        { label: __('Scale Down', 'bootstrap-theme'), value: 'scaleDown' },
        { label: __('--- Rotate ---', 'bootstrap-theme'), value: '' },
        { label: __('Rotate', 'bootstrap-theme'), value: 'rotate' },
        { label: __('Rotate Fast', 'bootstrap-theme'), value: 'rotateFast' },
        { label: __('--- Effects ---', 'bootstrap-theme'), value: '' },
        { label: __('Bounce', 'bootstrap-theme'), value: 'bounce' },
        { label: __('Elastic', 'bootstrap-theme'), value: 'elastic' },
        { label: __('Flip', 'bootstrap-theme'), value: 'flip' },
        { label: __('Flip X', 'bootstrap-theme'), value: 'flipX' },
        { label: __('Pulse', 'bootstrap-theme'), value: 'pulse' },
    ];

    const ANIMATION_TRIGGERS = [
        { label: __('On Load', 'bootstrap-theme'), value: 'on-load' },
        { label: __('On Scroll', 'bootstrap-theme'), value: 'on-scroll' },
        { label: __('On Hover', 'bootstrap-theme'), value: 'on-hover' },
        { label: __('On Click', 'bootstrap-theme'), value: 'on-click' },
    ];

    const EASE_OPTIONS = [
        { label: __('Linear', 'bootstrap-theme'), value: 'linear' },
        { label: __('Power 1 In Out', 'bootstrap-theme'), value: 'power1.inOut' },
        { label: __('Power 2 In Out', 'bootstrap-theme'), value: 'power2.inOut' },
        { label: __('Power 3 In Out', 'bootstrap-theme'), value: 'power3.inOut' },
        { label: __('Power 4 In Out', 'bootstrap-theme'), value: 'power4.inOut' },
        { label: __('Back Out', 'bootstrap-theme'), value: 'back.out' },
        { label: __('Elastic Out', 'bootstrap-theme'), value: 'elastic.out' },
        { label: __('Bounce Out', 'bootstrap-theme'), value: 'bounce.out' },
        { label: __('Circ In Out', 'bootstrap-theme'), value: 'circ.inOut' },
        { label: __('Sine In Out', 'bootstrap-theme'), value: 'sine.inOut' },
    ];

    const HOVER_EFFECTS = [
        { label: __('Scale', 'bootstrap-theme'), value: 'scale' },
        { label: __('Brightness', 'bootstrap-theme'), value: 'brightness' },
        { label: __('Shadow', 'bootstrap-theme'), value: 'shadow' },
        { label: __('Lift', 'bootstrap-theme'), value: 'lift' },
        { label: __('Glow', 'bootstrap-theme'), value: 'glow' },
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
                        { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        
                        // Animation Type
                        el(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
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
                                label: __('Trigger', 'bootstrap-theme'),
                                value: attributes.animationTrigger || 'on-load',
                                options: ANIMATION_TRIGGERS,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),

                            // Duration
                            el(RangeControl, {
                                label: __('Duration (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDuration || 0.6,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),

                            // Delay
                            el(RangeControl, {
                                label: __('Delay (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDelay || 0,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),

                            // Easing
                            el(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase || 'power2.inOut',
                                options: EASE_OPTIONS,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),

                            // Distance (para slides/fades directional)
                            ['fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'bounce'].includes(animationType) &&
                            el(TextControl, {
                                label: __('Distance (px)', 'bootstrap-theme'),
                                value: attributes.animationDistance || '30',
                                onChange: (value) => setAttributes({ animationDistance: value })
                            }),

                            // Scale (para scale animations)
                            ['scaleIn', 'scaleUp', 'scaleDown'].includes(animationType) &&
                            el(RangeControl, {
                                label: __('Scale From', 'bootstrap-theme'),
                                value: parseFloat(attributes.animationScale || '0.8'),
                                min: 0.1,
                                max: 2,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationScale: value.toString() })
                            }),

                            // Rotation (para rotate animations)
                            ['rotate', 'rotateFast', 'flip', 'flipX'].includes(animationType) &&
                            el(RangeControl, {
                                label: __('Rotation (degrees)', 'bootstrap-theme'),
                                value: attributes.animationRotation || 360,
                                min: 0,
                                max: 720,
                                step: 45,
                                onChange: (value) => setAttributes({ animationRotation: value })
                            }),

                            // Repeat options
                            el(RangeControl, {
                                label: __('Repeat Count', 'bootstrap-theme'),
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
                                    label: __('Repeat Delay (seconds)', 'bootstrap-theme'),
                                    value: attributes.animationRepeatDelay || 0.5,
                                    min: 0,
                                    max: 3,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ animationRepeatDelay: value })
                                }),

                                el(ToggleControl, {
                                    label: __('Yoyo (reverse animation)', 'bootstrap-theme'),
                                    checked: attributes.animationYoyo || false,
                                    onChange: (value) => setAttributes({ animationYoyo: value })
                                })
                            ),

                            // Hover Effect
                            attributes.animationTrigger === 'on-hover' &&
                            el(SelectControl, {
                                label: __('Hover Effect', 'bootstrap-theme'),
                                value: attributes.animationHoverEffect || 'scale',
                                options: HOVER_EFFECTS,
                                onChange: (value) => setAttributes({ animationHoverEffect: value })
                            }),

                            // Parallax Speed
                            attributes.animationTrigger === 'on-scroll' &&
                            el(RangeControl, {
                                label: __('Parallax Speed', 'bootstrap-theme'),
                                value: attributes.animationParallaxSpeed || 0.5,
                                min: 0.1,
                                max: 2,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationParallaxSpeed: value })
                            }),

                            // Mobile enabled
                            el(ToggleControl, {
                                label: __('Enable on Mobile', 'bootstrap-theme'),
                                checked: attributes.animationMobileEnabled !== false,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    ),
                    
                    // SplitText Panel
                    el(
                        PanelBody,
                        {
                            title: __('SplitText Animation', 'bootstrap-theme'),
                            initialOpen: false
                        },
                        el(ToggleControl, {
                            label: __('Enable SplitText', 'bootstrap-theme'),
                            help: __('Split text into words or characters for staggered animations', 'bootstrap-theme'),
                            checked: attributes.enableSplitText || false,
                            onChange: (value) => setAttributes({ enableSplitText: value })
                        }),

                        attributes.enableSplitText && el(
                            Fragment,
                            {},
                            el(SelectControl, {
                                label: __('Split Type', 'bootstrap-theme'),
                                value: attributes.splitTextType || 'words',
                                options: [
                                    { label: __('Words', 'bootstrap-theme'), value: 'words' },
                                    { label: __('Characters', 'bootstrap-theme'), value: 'chars' }
                                ],
                                onChange: (value) => setAttributes({ splitTextType: value })
                            }),

                            el(RangeControl, {
                                label: __('Stagger Delay (seconds)', 'bootstrap-theme'),
                                help: __('Delay between each word/character animation', 'bootstrap-theme'),
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
     * Los data attributes se agregan dinámicamente en PHP mediante el filtro render_block
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
