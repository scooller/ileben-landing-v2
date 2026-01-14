/**
 * Bootstrap Column Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-column', {
        title: __('Bootstrap Column', 'bootstrap-theme'),
        description: __('Bootstrap column for grid layout', 'bootstrap-theme'),
        icon: 'columns',
        category: 'ileben-landing',
        keywords: [__('column'), __('bootstrap'), __('grid')],
        parent: ['bootstrap-theme/bs-row'],
        
        attributes: {
            colXs: {
                type: 'string',
                default: ''
            },
            colSm: {
                type: 'string',
                default: ''
            },
            colMd: {
                type: 'string',
                default: ''
            },
            colLg: {
                type: 'string',
                default: ''
            },
            colXl: {
                type: 'string',
                default: ''
            },
            colXxl: {
                type: 'string',
                default: ''
            },
            offset: {
                type: 'string',
                default: ''
            },
            order: {
                type: 'string',
                default: ''
            },
            orderMobile: {
                type: 'string',
                default: ''
            },
            preview: {
                type: 'boolean',
                default: false
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
        example: {
            attributes: {
                preview: true
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-column/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const columnOptions = [
                { label: 'Auto', value: '' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' }
            ];

            const offsetOptions = [
                { label: 'None', value: '' },
                { label: '1', value: 'offset-1' },
                { label: '2', value: 'offset-2' },
                { label: '3', value: 'offset-3' },
                { label: '4', value: 'offset-4' },
                { label: '5', value: 'offset-5' },
                { label: '6', value: 'offset-6' },
                { label: '7', value: 'offset-7' },
                { label: '8', value: 'offset-8' },
                { label: '9', value: 'offset-9' },
                { label: '10', value: 'offset-10' },
                { label: '11', value: 'offset-11' }
            ];

            const orderOptions = [
                { label: 'None', value: '' },
                { label: 'First', value: 'order-first' },
                { label: '1', value: 'order-1' },
                { label: '2', value: 'order-2' },
                { label: '3', value: 'order-3' },
                { label: '4', value: 'order-4' },
                { label: '5', value: 'order-5' },
                { label: 'Last', value: 'order-last' }
            ];

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

            const buildColumnClass = () => {
                let classes = ['col'];
                if (attributes.colXs) classes.push(`col-${attributes.colXs}`);
                if (attributes.colSm) classes.push(`col-sm-${attributes.colSm}`);
                if (attributes.colMd) classes.push(`col-md-${attributes.colMd}`);
                if (attributes.colLg) classes.push(`col-lg-${attributes.colLg}`);
                if (attributes.colXl) classes.push(`col-xl-${attributes.colXl}`);
                if (attributes.colXxl) classes.push(`col-xxl-${attributes.colXxl}`);
                if (attributes.offset) classes.push(attributes.offset);
                if (attributes.orderMobile) classes.push(attributes.orderMobile);
                if (attributes.order) {
                    const desktopOrder = attributes.order.replace(/^order-/, 'order-md-');
                    classes.push(desktopOrder);
                }
                return classes.join(' ');
            };
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Column Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('XS (Mobile/All)', 'bootstrap-theme'),
                            value: attributes.colXs,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXs: value })
                        }),
                        createElement(SelectControl, {
                            label: __('SM (Tablet)', 'bootstrap-theme'),
                            value: attributes.colSm,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colSm: value })
                        }),
                        createElement(SelectControl, {
                            label: __('MD (Desktop)', 'bootstrap-theme'),
                            value: attributes.colMd,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colMd: value })
                        }),
                        createElement(SelectControl, {
                            label: __('LG (Large)', 'bootstrap-theme'),
                            value: attributes.colLg,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colLg: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XL (Extra Large)', 'bootstrap-theme'),
                            value: attributes.colXl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XXL (Extra Extra Large)', 'bootstrap-theme'),
                            value: attributes.colXxl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXxl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Offset', 'bootstrap-theme'),
                            value: attributes.offset,
                            options: offsetOptions,
                            onChange: (value) => setAttributes({ offset: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Order (Mobile)', 'bootstrap-theme'),
                            value: attributes.orderMobile,
                            options: orderOptions,
                            onChange: (value) => setAttributes({ orderMobile: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Order (Desktop)', 'bootstrap-theme'),
                            value: attributes.order,
                            options: orderOptions,
                            onChange: (value) => setAttributes({ order: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, 
                        { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        
                        createElement(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
                            value: animationType,
                            options: animationTypes,
                            onChange: (value) => setAttributes({ animationType: value })
                        }),

                        animationType && createElement(
                            Fragment,
                            null,

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
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${buildColumnClass()} ${blockProps.className || ''}`.trim()
                    }),
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to column...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);