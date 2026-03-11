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
        title: __('Bootstrap Container', 'ileben-landing'),
        description: __('Bootstrap container for layout structure', 'ileben-landing'),
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
            breakpoint: {
                type: 'string',
                default: ''
            },
            backgroundColor: {
                type: 'string',
                default: ''
            },
            textColor: {
                type: 'string',
                default: ''
            },
            padding: {
                type: 'string',
                default: ''
            },
            margin: {
                type: 'string',
                default: ''
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
                { label: __('None', 'ileben-landing'), value: 'none' },
                { label: __('Solid color', 'ileben-landing'), value: 'solid' },
                { label: __('Gradient', 'ileben-landing'), value: 'gradient' },
                { label: __('Image', 'ileben-landing'), value: 'image' }
            ];

            const gradientDirections = [
                { label: __('To right', 'ileben-landing'), value: 'to right' },
                { label: __('To left', 'ileben-landing'), value: 'to left' },
                { label: __('To bottom', 'ileben-landing'), value: 'to bottom' },
                { label: __('To top', 'ileben-landing'), value: 'to top' },                    
                { label: __('45┬░', 'ileben-landing'), value: '45deg' },
                { label: __('135┬░', 'ileben-landing'), value: '135deg' }
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
                    createElement(PanelBody, { title: __('Container Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Fluid Container', 'ileben-landing'),
                            checked: attributes.fluid,
                            onChange: (value) => setAttributes({ fluid: value })
                        }),
                        !attributes.fluid && createElement(SelectControl, {
                            label: __('Container Type', 'ileben-landing'),
                            value: attributes.type,
                            options: containerTypes,
                            onChange: (value) => setAttributes({ type: value })
                        }),
                        !attributes.fluid && createElement(SelectControl, {
                            label: __('Breakpoint', 'ileben-landing'),
                            help: __('Container breakpoint responsive', 'ileben-landing'),
                            value: attributes.breakpoint || '',
                            options: [
                                { label: __('None', 'ileben-landing'), value: '' },
                                { label: __('Small', 'ileben-landing'), value: 'sm' },
                                { label: __('Medium', 'ileben-landing'), value: 'md' },
                                { label: __('Large', 'ileben-landing'), value: 'lg' },
                                { label: __('Extra Large', 'ileben-landing'), value: 'xl' },
                                { label: __('XXL', 'ileben-landing'), value: 'xxl' }
                            ],
                            onChange: (value) => setAttributes({ breakpoint: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Background Color', 'ileben-landing'),
                            help: __('Bootstrap background color utility class', 'ileben-landing'),
                            value: attributes.backgroundColor || '',
                            options: [
                                { label: __('None', 'ileben-landing'), value: '' },
                                { label: __('Primary', 'ileben-landing'), value: 'bg-primary' },
                                { label: __('Secondary', 'ileben-landing'), value: 'bg-secondary' },
                                { label: __('Success', 'ileben-landing'), value: 'bg-success' },
                                { label: __('Danger', 'ileben-landing'), value: 'bg-danger' },
                                { label: __('Warning', 'ileben-landing'), value: 'bg-warning' },
                                { label: __('Info', 'ileben-landing'), value: 'bg-info' },
                                { label: __('Light', 'ileben-landing'), value: 'bg-light' },
                                { label: __('Dark', 'ileben-landing'), value: 'bg-dark' },
                                { label: __('White', 'ileben-landing'), value: 'bg-white' },
                                { label: __('Transparent', 'ileben-landing'), value: 'bg-transparent' }
                            ],
                            onChange: (value) => setAttributes({ backgroundColor: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Text Color', 'ileben-landing'),
                            help: __('Bootstrap text color utility class', 'ileben-landing'),
                            value: attributes.textColor || '',
                            options: [
                                { label: __('None', 'ileben-landing'), value: '' },
                                { label: __('Primary', 'ileben-landing'), value: 'text-primary' },
                                { label: __('Secondary', 'ileben-landing'), value: 'text-secondary' },
                                { label: __('Success', 'ileben-landing'), value: 'text-success' },
                                { label: __('Danger', 'ileben-landing'), value: 'text-danger' },
                                { label: __('Warning', 'ileben-landing'), value: 'text-warning' },
                                { label: __('Info', 'ileben-landing'), value: 'text-info' },
                                { label: __('Light', 'ileben-landing'), value: 'text-light' },
                                { label: __('Dark', 'ileben-landing'), value: 'text-dark' },
                                { label: __('White', 'ileben-landing'), value: 'text-white' },
                                { label: __('Muted', 'ileben-landing'), value: 'text-muted' }
                            ],
                            onChange: (value) => setAttributes({ textColor: value })
                        }),
                        createElement(TextControl, {
                            label: __('Padding', 'ileben-landing'),
                            help: __('Bootstrap padding utility classes (e.g., p-3, py-4, px-5)', 'ileben-landing'),
                            value: attributes.padding || '',
                            onChange: (value) => setAttributes({ padding: value })
                        }),
                        createElement(TextControl, {
                            label: __('Margin', 'ileben-landing'),
                            help: __('Bootstrap margin utility classes (e.g., m-3, my-4, mx-auto)', 'ileben-landing'),
                            value: attributes.margin || '',
                            onChange: (value) => setAttributes({ margin: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Use as Swiper', 'ileben-landing'),
                            checked: attributes.isSwiper,
                            onChange: (value) => setAttributes({ isSwiper: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('Background', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Background Type', 'ileben-landing'),
                            value: attributes.bgType,
                            options: bgTypeOptions,
                            onChange: (value) => setAttributes({ bgType: value })
                        }),
                        attributes.bgType === 'solid' && createElement(PanelColorSettings, {
                            title: __('Solid color', 'ileben-landing'),
                            colorSettings: [
                                {
                                    value: attributes.bgColor,
                                    onChange: (value) => setAttributes({ bgColor: value || '' }),
                                    label: __('Background color', 'ileben-landing')
                                }
                            ]
                        }),
                        attributes.bgType === 'gradient' && createElement(Fragment, {},
                            createElement(SelectControl, {
                                label: __('Direction', 'ileben-landing'),
                                value: attributes.bgGradientDirection,
                                options: gradientDirections,
                                onChange: (value) => setAttributes({ bgGradientDirection: value })
                            }),
                            createElement(PanelColorSettings, {
                                title: __('Gradient colors', 'ileben-landing'),
                                colorSettings: [
                                    {
                                        value: attributes.bgGradientFrom,
                                        onChange: (value) => setAttributes({ bgGradientFrom: value || '' }),
                                        label: __('From', 'ileben-landing')
                                    },
                                    {
                                        value: attributes.bgGradientTo,
                                        onChange: (value) => setAttributes({ bgGradientTo: value || '' }),
                                        label: __('To', 'ileben-landing')
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
                                render: ({ open }) => createElement(Button, { variant: 'primary', onClick: open }, attributes.bgImageURL ? __('Change image', 'ileben-landing') : __('Select image', 'ileben-landing'))
                            }),
                            attributes.bgImageURL && createElement('div', { style: { marginTop: '8px' } },
                                createElement('img', { src: attributes.bgImageURL, alt: '', style: { maxWidth: '100%', height: 'auto', display: 'block' } }),
                                createElement(Button, { variant: 'secondary', onClick: () => setAttributes({ bgImageID: 0, bgImageURL: '' }) }, __('Remove image', 'ileben-landing'))
                            ),
                            createElement(SelectControl, {
                                label: __('Size', 'ileben-landing'),
                                value: attributes.bgImageSize,
                                options: [
                                    { label: 'Cover', value: 'cover' },
                                    { label: 'Contain', value: 'contain' },
                                    { label: 'Auto', value: 'auto' }
                                ],
                                onChange: (value) => setAttributes({ bgImageSize: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Position', 'ileben-landing'),
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
                                label: __('Repeat', 'ileben-landing'),
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
                                label: __('Attachment', 'ileben-landing'),
                                value: attributes.bgImageAttachment,
                                options: [
                                    { label: 'Scroll', value: 'scroll' },
                                    { label: 'Fixed', value: 'fixed' }
                                ],
                                onChange: (value) => setAttributes({ bgImageAttachment: value })
                            })
                        )
                    ),
                    attributes.isSwiper && createElement(PanelBody, { title: __('Swiper Settings', 'ileben-landing'), initialOpen: true },
                        createElement(ToggleControl, {
                            label: __('Pagination (bullets)', 'ileben-landing'),
                            checked: !!attributes.swiperPagination,
                            onChange: (value) => setAttributes({ swiperPagination: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Navigation (prev/next)', 'ileben-landing'),
                            checked: !!attributes.swiperNavigation,
                            onChange: (value) => setAttributes({ swiperNavigation: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Loop', 'ileben-landing'),
                            checked: !!attributes.swiperLoop,
                            onChange: (value) => setAttributes({ swiperLoop: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Autoplay', 'ileben-landing'),
                            checked: !!attributes.swiperAutoplay,
                            onChange: (value) => setAttributes({ swiperAutoplay: value })
                        }),
                        createElement(TextControl, {
                            label: __('Slides per view', 'ileben-landing'),
                            value: attributes.swiperSlidesPerView,
                            onChange: (value) => setAttributes({ swiperSlidesPerView: value }),
                            placeholder: '1.1'
                        }),
                        createElement(TextControl, {
                            label: __('Space between (px)', 'ileben-landing'),
                            value: attributes.swiperSpaceBetween,
                            onChange: (value) => setAttributes({ swiperSpaceBetween: value }),
                            placeholder: '16'
                        }),
                        createElement(TextControl, {
                            label: __('Speed (ms)', 'ileben-landing'),
                            value: attributes.swiperSpeed,
                            onChange: (value) => setAttributes({ swiperSpeed: value }),
                            placeholder: '500'
                        }),
                        createElement(TextControl, {
                            label: __('Autoplay delay (ms)', 'ileben-landing'),
                            value: attributes.swiperAutoplayDelay,
                            onChange: (value) => setAttributes({ swiperAutoplayDelay: value }),
                            placeholder: '4000'
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
                        className: `${attributes.fluid ? 'container-fluid' : attributes.type} ${attributes.isSwiper ? 'swiper js-swiper' : ''} ${blockProps.className || ''}`,
                        style: Object.assign({}, blockProps.style || {}, buildStyle())
                    }),
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to container...', 'ileben-landing')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);