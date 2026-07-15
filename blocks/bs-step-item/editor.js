/**
 * Bootstrap Step Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, RangeControl, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-step-item', {
        apiVersion: 3,
        title: __('Step Item', 'ileben-landing'),
        description: __('Individual step for the steps component', 'ileben-landing'),
        icon: 'marker',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-steps'],
        
        attributes: {
            title: {
                type: 'string',
                default: 'Step'
            },
            // Animation attributes
            animationType: {
                type: 'string'
            },
            animationTrigger: {
                type: 'string',
                default: 'on-scroll'
            },
            animationDuration: {
                type: 'number',
                default: 0.8
            },            animationScrollStart: {
                type: 'string',
                default: 'top 70%'
            },
            animationScrollEnd: {
                type: 'string',
                default: 'top 10%'
            },
            animationScrollMarkers: {
                type: 'boolean',
                default: false
            },            animationDelay: {
                type: 'number',
                default: 0
            },
            animationEase: {
                type: 'string'
            },
            animationRepeat: {
                type: 'number'
            },
            animationRepeatDelay: {
                type: 'number',
                default: 0
            },
            animationYoyo: {
                type: 'boolean'
            },
            animationDistance: {
                type: 'string'
            },
            animationRotation: {
                type: 'number'
            },
            animationScale: {
                type: 'string'
            },
            animationParallaxSpeed: {
                type: 'number'
            },
            animationHoverEffect: {
                type: 'string'
            },
            animationMobileEnabled: {
                type: 'boolean'
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            const animationTypes = [
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
            ];

            const animationTriggers = [
                { label: __('On Load', 'ileben-landing'), value: 'on-load' },
                { label: __('On Scroll', 'ileben-landing'), value: 'on-scroll' },
                { label: __('On Hover', 'ileben-landing'), value: 'on-hover' },
                { label: __('On Click', 'ileben-landing'), value: 'on-click' },
            ];

            const easeOptions = [
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

            const animationType = attributes.animationType || '';

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Step Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Step Title', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, { title: __('Animation', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Animation Type', 'ileben-landing'),
                            value: animationType,
                            options: animationTypes,
                            onChange: (value) => {
                                const updates = { animationType: value };
                                if (value && value !== '') {
                                    if (!attributes.animationDuration || attributes.animationDuration === '') {
                                        updates.animationDuration = 0.6;
                                    }
                                    if (!attributes.animationDelay || attributes.animationDelay === '') {
                                        updates.animationDelay = 0;
                                    }
                                    if (!attributes.animationTrigger || attributes.animationTrigger === '') {
                                        updates.animationTrigger = 'on-scroll';
                                    }
                                    if (!attributes.animationEase || attributes.animationEase === '') {
                                        updates.animationEase = 'power2.inOut';
                                    }
                                }
                                setAttributes(updates);
                            }
                        }),
                        animationType && createElement(Fragment, null,
                            createElement(SelectControl, {
                                __next40pxDefaultSize: true, label: __('Trigger', 'ileben-landing'),
                                value: attributes.animationTrigger,
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                __next40pxDefaultSize: true, label: __('Duration (seconds)', 'ileben-landing'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                __next40pxDefaultSize: true, label: __('Delay (seconds)', 'ileben-landing'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                __next40pxDefaultSize: true, label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase,
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                __next40pxDefaultSize: true, label: __('Scroll Start', 'ileben-landing'),
                                value: attributes.animationScrollStart || 'top 70%',
                                onChange: (value) => setAttributes({ animationScrollStart: value }),
                                help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                __next40pxDefaultSize: true, label: __('Scroll End', 'ileben-landing'),
                                value: attributes.animationScrollEnd || 'top 10%',
                                onChange: (value) => setAttributes({ animationScrollEnd: value }),
                                help: __('Ej: "top 10%", "bottom center"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(ToggleControl, {
                                label: __('Show ScrollTrigger Markers', 'ileben-landing'),
                                checked: attributes.animationScrollMarkers || false,
                                onChange: (value) => setAttributes({ animationScrollMarkers: value }),
                                help: __('Muestra lineas de debug en la pagina', 'ileben-landing')
                            }),
                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'ileben-landing'),
                                checked: attributes.animationMobileEnabled === true,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'bs-step-item-editor border rounded p-3 text-center' },
                        createElement(RichText, {
                            tagName: 'div',
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value }),
                            placeholder: __('Step title...', 'ileben-landing'),
                            className: 'fw-bold'
                        })
                    )
                )
            );
        },

        save: function() {
            return null;
        }
    });

})(window.wp);