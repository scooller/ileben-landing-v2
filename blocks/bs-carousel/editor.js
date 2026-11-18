/**
 * Bootstrap Carousel Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-carousel', {
        apiVersion: 3,
        title: __('Bootstrap Carousel', 'ileben-landing'),
        description: __('Bootstrap carousel slideshow component', 'ileben-landing'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slider'), __('bootstrap')],
        
        attributes: {
            items: {
                type: 'number',
                default: 1
            },
            fancybox: {
                type: 'boolean',
                default: false
            },
            carouselId: {
                type: 'string',
                default: ''
            },
            controls: {
                type: 'boolean',
                default: true
            },
            indicators: {
                type: 'boolean',
                default: true
            },
            ride: {
                type: 'string',
                default: 'carousel'
            },
            interval: {
                type: 'string',
                default: '5000'
            },
            wrap: {
                type: 'boolean',
                default: true
            },
            fade: {
                type: 'boolean',
                default: false
            },
            touch: {
                type: 'boolean',
                default: true
            },
            preview: {
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-carousel/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            // Generate unique ID if not set
            if (!attributes.carouselId) {
                setAttributes({ carouselId: `carousel-${clientId}` });
            }
            const rideOptions = [
                { label: 'Auto', value: 'carousel' },
                { label: 'Manual', value: 'false' }
            ];

            const carouselClasses = [
                'carousel',
                'slide',
                (attributes.fade && (!attributes.items || attributes.items === 1)) ? 'carousel-fade' : '',
                attributes.items > 1 ? 'carousel-multiple' : '',
                attributes.items > 1 ? `carousel-items-${attributes.items}` : ''
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Carousel ID', 'ileben-landing'),
                            value: attributes.carouselId,
                            onChange: (value) => setAttributes({ carouselId: value })
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true,
                            label: __('Items per slide', 'ileben-landing'),
                            help: __('Items visible on desktop (1 on mobile, slides 1-by-1)', 'ileben-landing'),
                            value: attributes.items || 1,
                            options: [
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                                { label: '4', value: 4 }
                            ],
                            onChange: (value) => setAttributes({ items: parseInt(value, 10) })
                        }),
                        createElement(ToggleControl, {
                            label: __('Abrir en Fancybox (Galería)', 'ileben-landing'),
                            help: __('Abre las imágenes en una galería Fancybox al hacer clic', 'ileben-landing'),
                            checked: attributes.fancybox || false,
                            onChange: (value) => setAttributes({ fancybox: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Controls', 'ileben-landing'),
                            help: __('Show previous/next arrows', 'ileben-landing'),
                            checked: attributes.controls,
                            onChange: (value) => setAttributes({ controls: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Indicators', 'ileben-landing'),
                            help: __('Show slide indicator dots', 'ileben-landing'),
                            checked: attributes.indicators,
                            onChange: (value) => setAttributes({ indicators: value })
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Auto Play', 'ileben-landing'),
                            value: attributes.ride,
                            options: rideOptions,
                            onChange: (value) => setAttributes({ ride: value })
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Interval (ms)', 'ileben-landing'),
                            help: __('Time between slides in milliseconds', 'ileben-landing'),
                            value: attributes.interval,
                            type: 'number',
                            onChange: (value) => setAttributes({ interval: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Wrap', 'ileben-landing'),
                            help: __('Loop slides continuously', 'ileben-landing'),
                            checked: attributes.wrap,
                            onChange: (value) => setAttributes({ wrap: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Fade Effect', 'ileben-landing'),
                            help: __('Use fade transition instead of slide', 'ileben-landing'),
                            checked: attributes.fade,
                            onChange: (value) => setAttributes({ fade: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Touch Swipe', 'ileben-landing'),
                            help: __('Enable touch/swipe on mobile devices', 'ileben-landing'),
                            checked: attributes.touch,
                            onChange: (value) => setAttributes({ touch: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${carouselClasses} ${blockProps.className || ''}`.trim(),
                        id: attributes.carouselId,
                        'data-bs-items': (attributes.items && attributes.items > 1) ? attributes.items.toString() : undefined,
                        'data-bs-ride': attributes.ride,
                        'data-bs-interval': attributes.interval,
                        'data-bs-wrap': attributes.wrap.toString(),
                        'data-bs-touch': attributes.touch.toString()
                    }),
                    // Indicators placeholder
                    attributes.indicators && createElement('div', { className: 'carousel-indicators-preview mb-2' },
                        createElement('small', { className: 'text-muted' }, __('Indicators will appear here', 'ileben-landing'))
                    ),
                    
                    // Carousel Inner
                    createElement('div', { className: 'carousel-inner' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-carousel-item'],
                            template: [
                                ['bootstrap-theme/bs-carousel-item', { active: true }],
                                ['bootstrap-theme/bs-carousel-item'],
                                ['bootstrap-theme/bs-carousel-item']
                            ],
                            placeholder: __('Add carousel items...', 'ileben-landing')
                        })
                    ),
                    
                    // Controls placeholder
                    attributes.controls && createElement('div', { className: 'carousel-controls-preview mt-2' },
                        createElement('small', { className: 'text-muted' }, __('Previous/Next controls will appear here', 'ileben-landing'))
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);