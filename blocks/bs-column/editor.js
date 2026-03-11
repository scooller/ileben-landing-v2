/**
 * Bootstrap Column Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-column', {
        title: __('Bootstrap Column', 'ileben-landing'),
        description: __('Bootstrap column for grid layout', 'ileben-landing'),
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
            },
            animationScrollStart: {
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
                    createElement(PanelBody, { title: __('Column Settings', 'ileben-landing') },
                        createElement(SelectControl, {
                            label: __('XS (Mobile/All)', 'ileben-landing'),
                            value: attributes.colXs,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXs: value })
                        }),
                        createElement(SelectControl, {
                            label: __('SM (Tablet)', 'ileben-landing'),
                            value: attributes.colSm,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colSm: value })
                        }),
                        createElement(SelectControl, {
                            label: __('MD (Desktop)', 'ileben-landing'),
                            value: attributes.colMd,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colMd: value })
                        }),
                        createElement(SelectControl, {
                            label: __('LG (Large)', 'ileben-landing'),
                            value: attributes.colLg,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colLg: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XL (Extra Large)', 'ileben-landing'),
                            value: attributes.colXl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XXL (Extra Extra Large)', 'ileben-landing'),
                            value: attributes.colXxl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXxl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Offset', 'ileben-landing'),
                            value: attributes.offset,
                            options: offsetOptions,
                            onChange: (value) => setAttributes({ offset: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Order (Mobile)', 'ileben-landing'),
                            value: attributes.orderMobile,
                            options: orderOptions,
                            onChange: (value) => setAttributes({ orderMobile: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Order (Desktop)', 'ileben-landing'),
                            value: attributes.order,
                            options: orderOptions,
                            onChange: (value) => setAttributes({ order: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, 
                        { title: __('Animation', 'ileben-landing'), initialOpen: false },
                        
                        createElement(SelectControl, {
                            label: __('Animation Type', 'ileben-landing'),
                            value: animationType,
                            options: animationTypes,
                            onChange: (value) => setAttributes({ animationType: value })
                        }),

                        animationType && createElement(
                            Fragment,
                            null,

                            createElement(SelectControl, {
                                label: __('Trigger', 'ileben-landing'),
                                value: attributes.animationTrigger,
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'ileben-landing'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'ileben-landing'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),

                            createElement(SelectControl, {
                                label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase,
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),

                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                label: __('Scroll Start', 'ileben-landing'),
                                value: attributes.animationScrollStart || 'top 70%',
                                onChange: (value) => setAttributes({ animationScrollStart: value }),
                                help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                            }),

                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                label: __('Scroll End', 'ileben-landing'),
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
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${buildColumnClass()} ${blockProps.className || ''}`.trim()
                    }),
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to column...', 'ileben-landing')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);