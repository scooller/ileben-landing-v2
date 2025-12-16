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
        title: __('Bootstrap Carousel', 'bootstrap-theme'),
        description: __('Bootstrap carousel slideshow component', 'bootstrap-theme'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slider'), __('bootstrap')],
        
        attributes: {
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
                attributes.fade ? 'carousel-fade' : ''
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Carousel ID', 'bootstrap-theme'),
                            value: attributes.carouselId,
                            onChange: (value) => setAttributes({ carouselId: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Controls', 'bootstrap-theme'),
                            help: __('Show previous/next arrows', 'bootstrap-theme'),
                            checked: attributes.controls,
                            onChange: (value) => setAttributes({ controls: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Indicators', 'bootstrap-theme'),
                            help: __('Show slide indicator dots', 'bootstrap-theme'),
                            checked: attributes.indicators,
                            onChange: (value) => setAttributes({ indicators: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Auto Play', 'bootstrap-theme'),
                            value: attributes.ride,
                            options: rideOptions,
                            onChange: (value) => setAttributes({ ride: value })
                        }),
                        createElement(TextControl, {
                            label: __('Interval (ms)', 'bootstrap-theme'),
                            help: __('Time between slides in milliseconds', 'bootstrap-theme'),
                            value: attributes.interval,
                            type: 'number',
                            onChange: (value) => setAttributes({ interval: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Wrap', 'bootstrap-theme'),
                            help: __('Loop slides continuously', 'bootstrap-theme'),
                            checked: attributes.wrap,
                            onChange: (value) => setAttributes({ wrap: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Fade Effect', 'bootstrap-theme'),
                            help: __('Use fade transition instead of slide', 'bootstrap-theme'),
                            checked: attributes.fade,
                            onChange: (value) => setAttributes({ fade: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Touch Swipe', 'bootstrap-theme'),
                            help: __('Enable touch/swipe on mobile devices', 'bootstrap-theme'),
                            checked: attributes.touch,
                            onChange: (value) => setAttributes({ touch: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${carouselClasses} ${blockProps.className || ''}`.trim(),
                        id: attributes.carouselId,
                        'data-bs-ride': attributes.ride,
                        'data-bs-interval': attributes.interval,
                        'data-bs-wrap': attributes.wrap.toString(),
                        'data-bs-touch': attributes.touch.toString()
                    }),
                    // Indicators placeholder
                    attributes.indicators && createElement('div', { className: 'carousel-indicators-preview mb-2' },
                        createElement('small', { className: 'text-muted' }, __('Indicators will appear here', 'bootstrap-theme'))
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
                            placeholder: __('Add carousel items...', 'bootstrap-theme')
                        })
                    ),
                    
                    // Controls placeholder
                    attributes.controls && createElement('div', { className: 'carousel-controls-preview mt-2' },
                        createElement('small', { className: 'text-muted' }, __('Previous/Next controls will appear here', 'bootstrap-theme'))
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);