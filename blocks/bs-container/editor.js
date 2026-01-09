/**
 * Bootstrap Container Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, PanelColorSettings, MediaUpload } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl, Button, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-container', {
        title: __('Bootstrap Container', 'bootstrap-theme'),
        description: __('Bootstrap container for layout structure', 'bootstrap-theme'),
        icon: 'editor-table',
        category: 'ileben-landing',
        keywords: [__('container'), __('bootstrap'), __('layout')],
        supports: {
            html: false,
            anchor: true
        },
        attributes: {
            anchor: {
                type: 'string',
                default: ''
            },
            type: {
                type: 'string',
                default: 'container'
            },
            fluid: {
                type: 'boolean',
                default: false
            },
            bgType: {
                type: 'string', // 'none' | 'solid' | 'gradient'
                default: 'none'
            },
            bgColor: {
                type: 'string',
                default: ''
            },
            bgGradientFrom: {
                type: 'string',
                default: ''
            },
            bgGradientTo: {
                type: 'string',
                default: ''
            },
            bgGradientDirection: {
                type: 'string',
                default: 'to right'
            },
            // Image background
            bgImageID: {
                type: 'number',
                default: 0
            },
            bgImageURL: {
                type: 'string',
                default: ''
            },
            bgImageSize: {
                type: 'string',
                default: 'cover' // cover | contain | auto
            },
            bgImagePosition: {
                type: 'string',
                default: 'center center'
            },
            bgImageRepeat: {
                type: 'string',
                default: 'no-repeat'
            },
            bgImageAttachment: {
                type: 'string',
                default: 'scroll' // scroll | fixed
            },
            isSwiper: {
                type: 'boolean',
                default: false
            },
            swiperSlidesPerView: {
                type: 'string',
                default: ''
            },
            swiperSpaceBetween: {
                type: 'string',
                default: ''
            },
            swiperLoop: {
                type: 'boolean',
                default: null
            },
            swiperSpeed: {
                type: 'string',
                default: ''
            },
            swiperAutoplay: {
                type: 'boolean',
                default: null
            },
            swiperAutoplayDelay: {
                type: 'string',
                default: ''
            },
            swiperPagination: {
                type: 'boolean',
                default: null
            },
            swiperNavigation: {
                type: 'boolean',
                default: null
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-container/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const containerTypes = [
                { label: 'Standard Container', value: 'container' },
                { label: 'Small Container', value: 'container-sm' },
                { label: 'Medium Container', value: 'container-md' },
                { label: 'Large Container', value: 'container-lg' },
                { label: 'Extra Large Container', value: 'container-xl' },
                { label: 'XXL Container', value: 'container-xxl' }
            ];

            const bgTypeOptions = [
                { label: __('None', 'bootstrap-theme'), value: 'none' },
                { label: __('Solid color', 'bootstrap-theme'), value: 'solid' },
                { label: __('Gradient', 'bootstrap-theme'), value: 'gradient' },
                { label: __('Image', 'bootstrap-theme'), value: 'image' }
            ];

            const gradientDirections = [
                { label: __('To right', 'bootstrap-theme'), value: 'to right' },
                { label: __('To left', 'bootstrap-theme'), value: 'to left' },
                { label: __('To bottom', 'bootstrap-theme'), value: 'to bottom' },
                { label: __('To top', 'bootstrap-theme'), value: 'to top' },                    
                { label: __('45°', 'bootstrap-theme'), value: '45deg' },
                { label: __('135°', 'bootstrap-theme'), value: '135deg' }
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


            // Build preview style for editor
            const buildStyle = () => {
                const style = {};
                if (attributes.bgType === 'solid' && attributes.bgColor) {
                    style.backgroundColor = attributes.bgColor;
                } else if (
                    attributes.bgType === 'gradient' &&
                    attributes.bgGradientFrom && attributes.bgGradientTo
                ) {
                    style.backgroundImage = `linear-gradient(${attributes.bgGradientDirection || 'to right'}, ${attributes.bgGradientFrom}, ${attributes.bgGradientTo})`;
                } else if (attributes.bgType === 'image' && attributes.bgImageURL) {
                    style.backgroundImage = `url(${attributes.bgImageURL})`;
                    style.backgroundSize = attributes.bgImageSize || 'cover';
                    style.backgroundPosition = attributes.bgImagePosition || 'center center';
                    style.backgroundRepeat = attributes.bgImageRepeat || 'no-repeat';
                    style.backgroundAttachment = attributes.bgImageAttachment || 'scroll';
                }
                return style;
            };
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Container Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Fluid Container', 'bootstrap-theme'),
                            checked: attributes.fluid,
                            onChange: (value) => setAttributes({ fluid: value })
                        }),
                        !attributes.fluid && createElement(SelectControl, {
                            label: __('Container Type', 'bootstrap-theme'),
                            value: attributes.type,
                            options: containerTypes,
                            onChange: (value) => setAttributes({ type: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Use as Swiper', 'bootstrap-theme'),
                            checked: attributes.isSwiper,
                            onChange: (value) => setAttributes({ isSwiper: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('Background', 'bootstrap-theme'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Background Type', 'bootstrap-theme'),
                            value: attributes.bgType,
                            options: bgTypeOptions,
                            onChange: (value) => setAttributes({ bgType: value })
                        }),
                        attributes.bgType === 'solid' && createElement(PanelColorSettings, {
                            title: __('Solid color', 'bootstrap-theme'),
                            colorSettings: [
                                {
                                    value: attributes.bgColor,
                                    onChange: (value) => setAttributes({ bgColor: value || '' }),
                                    label: __('Background color', 'bootstrap-theme')
                                }
                            ]
                        }),
                        attributes.bgType === 'gradient' && createElement(Fragment, {},
                            createElement(SelectControl, {
                                label: __('Direction', 'bootstrap-theme'),
                                value: attributes.bgGradientDirection,
                                options: gradientDirections,
                                onChange: (value) => setAttributes({ bgGradientDirection: value })
                            }),
                            createElement(PanelColorSettings, {
                                title: __('Gradient colors', 'bootstrap-theme'),
                                colorSettings: [
                                    {
                                        value: attributes.bgGradientFrom,
                                        onChange: (value) => setAttributes({ bgGradientFrom: value || '' }),
                                        label: __('From', 'bootstrap-theme')
                                    },
                                    {
                                        value: attributes.bgGradientTo,
                                        onChange: (value) => setAttributes({ bgGradientTo: value || '' }),
                                        label: __('To', 'bootstrap-theme')
                                    }
                                ]
                            })
                        ),
                        attributes.bgType === 'image' && createElement(Fragment, {},
                            createElement(MediaUpload, {
                                onSelect: (media) => {
                                    setAttributes({ bgImageID: media.id || 0, bgImageURL: media.url || '' });
                                },
                                allowedTypes: ['image'],
                                value: attributes.bgImageID,
                                render: ({ open }) => createElement(Button, { variant: 'primary', onClick: open }, attributes.bgImageURL ? __('Change image', 'bootstrap-theme') : __('Select image', 'bootstrap-theme'))
                            }),
                            attributes.bgImageURL && createElement('div', { style: { marginTop: '8px' } },
                                createElement('img', { src: attributes.bgImageURL, alt: '', style: { maxWidth: '100%', height: 'auto', display: 'block' } }),
                                createElement(Button, { variant: 'secondary', onClick: () => setAttributes({ bgImageID: 0, bgImageURL: '' }) }, __('Remove image', 'bootstrap-theme'))
                            ),
                            createElement(SelectControl, {
                                label: __('Size', 'bootstrap-theme'),
                                value: attributes.bgImageSize,
                                options: [
                                    { label: 'Cover', value: 'cover' },
                                    { label: 'Contain', value: 'contain' },
                                    { label: 'Auto', value: 'auto' }
                                ],
                                onChange: (value) => setAttributes({ bgImageSize: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Position', 'bootstrap-theme'),
                                value: attributes.bgImagePosition,
                                options: [
                                    { label: 'Center Center', value: 'center center' },
                                    { label: 'Center Top', value: 'center top' },
                                    { label: 'Center Bottom', value: 'center bottom' },
                                    { label: 'Left Center', value: 'left center' },
                                    { label: 'Right Center', value: 'right center' }
                                ],
                                onChange: (value) => setAttributes({ bgImagePosition: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Repeat', 'bootstrap-theme'),
                                value: attributes.bgImageRepeat,
                                options: [
                                    { label: 'No repeat', value: 'no-repeat' },
                                    { label: 'Repeat', value: 'repeat' },
                                    { label: 'Repeat X', value: 'repeat-x' },
                                    { label: 'Repeat Y', value: 'repeat-y' }
                                ],
                                onChange: (value) => setAttributes({ bgImageRepeat: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Attachment', 'bootstrap-theme'),
                                value: attributes.bgImageAttachment,
                                options: [
                                    { label: 'Scroll', value: 'scroll' },
                                    { label: 'Fixed', value: 'fixed' }
                                ],
                                onChange: (value) => setAttributes({ bgImageAttachment: value })
                            })
                        )
                    ),
                    attributes.isSwiper && createElement(PanelBody, { title: __('Swiper Settings', 'bootstrap-theme'), initialOpen: true },
                        createElement(ToggleControl, {
                            label: __('Pagination (bullets)', 'bootstrap-theme'),
                            checked: !!attributes.swiperPagination,
                            onChange: (value) => setAttributes({ swiperPagination: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Navigation (prev/next)', 'bootstrap-theme'),
                            checked: !!attributes.swiperNavigation,
                            onChange: (value) => setAttributes({ swiperNavigation: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Loop', 'bootstrap-theme'),
                            checked: !!attributes.swiperLoop,
                            onChange: (value) => setAttributes({ swiperLoop: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Autoplay', 'bootstrap-theme'),
                            checked: !!attributes.swiperAutoplay,
                            onChange: (value) => setAttributes({ swiperAutoplay: value })
                        }),
                        createElement(TextControl, {
                            label: __('Slides per view', 'bootstrap-theme'),
                            value: attributes.swiperSlidesPerView,
                            onChange: (value) => setAttributes({ swiperSlidesPerView: value }),
                            placeholder: '1.1'
                        }),
                        createElement(TextControl, {
                            label: __('Space between (px)', 'bootstrap-theme'),
                            value: attributes.swiperSpaceBetween,
                            onChange: (value) => setAttributes({ swiperSpaceBetween: value }),
                            placeholder: '16'
                        }),
                        createElement(TextControl, {
                            label: __('Speed (ms)', 'bootstrap-theme'),
                            value: attributes.swiperSpeed,
                            onChange: (value) => setAttributes({ swiperSpeed: value }),
                            placeholder: '500'
                        }),
                        createElement(TextControl, {
                            label: __('Autoplay delay (ms)', 'bootstrap-theme'),
                            value: attributes.swiperAutoplayDelay,
                            onChange: (value) => setAttributes({ swiperAutoplayDelay: value }),
                            placeholder: '4000'
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
                        className: `${attributes.fluid ? 'container-fluid' : attributes.type} ${attributes.isSwiper ? 'swiper js-swiper' : ''} ${blockProps.className || ''}`,
                        style: Object.assign({}, blockProps.style || {}, buildStyle())
                    }),
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to container...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);