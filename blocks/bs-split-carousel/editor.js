(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    var transitionOptions = [
        { label: 'Fade', value: 'fade' },
        { label: 'Fade Up', value: 'fadeUp' },
        { label: 'Fade Down', value: 'fadeDown' },
        { label: 'Fade Left', value: 'fadeLeft' },
        { label: 'Fade Right', value: 'fadeRight' },
        { label: 'Scale In', value: 'scaleIn' },
        { label: 'Slide Up', value: 'slideUp' },
        { label: 'Slide Left', value: 'slideLeft' },
        { label: 'Slide Right', value: 'slideRight' },
        { label: 'Flip Y (3D)', value: 'flipY' },
        { label: 'Back Out (rebote)', value: 'backOut' },
        { label: 'Blur Focus', value: 'blurFocus' },
        { label: 'Clip Reveal', value: 'clipReveal' },
        { label: 'Rotate In', value: 'rotateIn' }
    ];

    registerBlockType('bootstrap-theme/bs-split-carousel', {
        apiVersion: 3,
        title: __('Split Carousel', 'ileben-landing'),
        description: __('Carousel layout with split text/image columns', 'ileben-landing'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slider'), __('split')],
        
        attributes: {
            carouselId: {
                type: 'string',
                default: ''
            },
            interval: {
                type: 'string',
                default: '5000'
            },
            leftTransition: {
                type: 'string',
                default: 'fade'
            },
            rightTransition: {
                type: 'string',
                default: 'fade'
            },
            transitionDuration: {
                type: 'number',
                default: 0.6
            },
            staggerDelay: {
                type: 'number',
                default: 0.15
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps({ className: 'bs-split-carousel carousel-fade' });
            
            if (!attributes.carouselId) {
                setAttributes({ carouselId: `split-carousel-${clientId}` });
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Carousel ID', 'ileben-landing'),
                            value: attributes.carouselId,
                            onChange: (value) => setAttributes({ carouselId: value })
                        }),
                        createElement(TextControl, {
                            label: __('Interval (ms)', 'ileben-landing'),
                            help: __('Time between slides in milliseconds', 'ileben-landing'),
                            value: attributes.interval,
                            type: 'number',
                            onChange: (value) => setAttributes({ interval: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Left Column Transition', 'ileben-landing'),
                            help: __('Animation for the text column', 'ileben-landing'),
                            value: attributes.leftTransition,
                            options: transitionOptions,
                            onChange: (value) => setAttributes({ leftTransition: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Right Column Transition', 'ileben-landing'),
                            help: __('Animation for the image column', 'ileben-landing'),
                            value: attributes.rightTransition,
                            options: transitionOptions,
                            onChange: (value) => setAttributes({ rightTransition: value })
                        }),
                        createElement(RangeControl, {
                            label: __('Animation Duration (s)', 'ileben-landing'),
                            value: attributes.transitionDuration,
                            min: 0.2,
                            max: 2,
                            step: 0.1,
                            onChange: (value) => setAttributes({ transitionDuration: value })
                        }),
                        createElement(RangeControl, {
                            label: __('Stagger Delay (s)', 'ileben-landing'),
                            help: __('Delay between left and right column animations', 'ileben-landing'),
                            value: attributes.staggerDelay,
                            min: 0,
                            max: 1,
                            step: 0.05,
                            onChange: (value) => setAttributes({ staggerDelay: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        id: attributes.carouselId,
                        style: { border: '1px dashed #ccc', padding: '20px' }
                    }),
                    createElement('div', { className: 'carousel-inner' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-split-carousel-item'],
                            template: [
                                ['bootstrap-theme/bs-split-carousel-item', { active: true }],
                                ['bootstrap-theme/bs-split-carousel-item']
                            ],
                            placeholder: __('Add split carousel items...', 'ileben-landing')
                        })
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);
