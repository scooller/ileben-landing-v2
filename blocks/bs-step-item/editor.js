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
        title: __('Step Item', 'bootstrap-theme'),
        description: __('Individual step for the steps component', 'bootstrap-theme'),
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
            },
            animationDelay: {
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

            const animationTriggers = [
                { label: __('On Load', 'bootstrap-theme'), value: 'on-load' },
                { label: __('On Scroll', 'bootstrap-theme'), value: 'on-scroll' },
                { label: __('On Hover', 'bootstrap-theme'), value: 'on-hover' },
                { label: __('On Click', 'bootstrap-theme'), value: 'on-click' },
            ];

            const easeOptions = [
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

            const animationType = attributes.animationType || '';

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Step Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Step Title', 'bootstrap-theme'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
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
                                label: __('Trigger', 'bootstrap-theme'),
                                value: attributes.animationTrigger,
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase,
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'bootstrap-theme'),
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
                            placeholder: __('Step title...', 'bootstrap-theme'),
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
