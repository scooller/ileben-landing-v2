/**
 * Bootstrap Card Block Editor
 */

(function(wp) {
    //console.log('BS-CARD EDITOR.JS LOADED!', wp);
    
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl, Button, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-card', {
        title: __('Bootstrap Card', 'ileben-landing'),
        description: __('A flexible Bootstrap card component with GSAP animations', 'ileben-landing'),
        icon: 'id-alt',
        category: 'ileben-landing',
        keywords: [__('card'), __('bootstrap'), __('content'), __('animation')],
        
        attributes: {
            title: {
                type: 'string',
                default: ''
            },
            subtitle: {
                type: 'string',
                default: ''
            },
            image: {
                type: 'string',
                default: ''
            },
            imageAlt: {
                type: 'string',
                default: ''
            },
            imageFull: {
                type: 'boolean',
                default: false
            },
            link: {
                type: 'string',
                default: ''
            },
            target: {
                type: 'string',
                default: '_self'
            },
            variant: {
                type: 'string',
                default: ''
            },
            textAlign: {
                type: 'string',
                default: ''
            },
            headerBg: {
                type: 'string',
                default: ''
            },
            footerBg: {
                type: 'string',
                default: ''
            },
            bodyClasses: {
                type: 'string',
                default: ''
            },
            titleClasses: {
                type: 'string',
                default: ''
            },
            textClasses: {
                type: 'string',
                default: ''
            },
            className: {
                type: 'string',
                default: ''
            },
            // Animation attributes
            animationType: {
                type: 'string'
            },
            animationTrigger: {
                type: 'string'
            },
            animationDuration: {
                type: 'number'
            },
            animationDelay: {
                type: 'number'
            },
            animationEase: {
                type: 'string'
            },
            animationRepeat: {
                type: 'number'
            },
            animationRepeatDelay: {
                type: 'number'
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
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const animationType = attributes.animationType || '';

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

            const hoverEffects = [
                { label: __('Scale', 'ileben-landing'), value: 'scale' },
                { label: __('Brightness', 'ileben-landing'), value: 'brightness' },
                { label: __('Shadow', 'ileben-landing'), value: 'shadow' },
                { label: __('Lift', 'ileben-landing'), value: 'lift' },
                { label: __('Glow', 'ileben-landing'), value: 'glow' },
            ];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Card Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Card Title', 'ileben-landing'),
                            value: attributes.title || '',
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        createElement(TextControl, {
                            label: __('Card Subtitle', 'ileben-landing'),
                            value: attributes.subtitle || '',
                            onChange: (value) => setAttributes({ subtitle: value })
                        }),
                        createElement(MediaUpload, {
                            onSelect: (media) => setAttributes({ 
                                image: media.url,
                                imageAlt: media.alt 
                            }),
                            allowedTypes: ['image'],
                            value: attributes.image,
                            render: ({ open }) => createElement(Button, {
                                onClick: open,
                                className: attributes.image ? 'image-button' : 'button button-large'
                            }, attributes.image ? __('Change Image', 'ileben-landing') : __('Select Image', 'ileben-landing'))
                        }),
                        attributes.image && createElement(ToggleControl, {
                            label: __('Imagen Full', 'ileben-landing'),
                            help: __('Hacer que la imagen ocupe el ancho completo del card', 'ileben-landing'),
                            checked: attributes.imageFull || false,
                            onChange: (value) => setAttributes({ imageFull: value })
                        }),
                        createElement(TextControl, {
                            label: __('Link URL', 'ileben-landing'),
                            help: __('URL a la que enlaza la tarjeta completa', 'ileben-landing'),
                            value: attributes.link || '',
                            onChange: (value) => setAttributes({ link: value })
                        }),
                        attributes.link && createElement(SelectControl, {
                            label: __('Link Target', 'ileben-landing'),
                            value: attributes.target || '_self',
                            options: [
                                { label: __('Same Window', 'ileben-landing'), value: '_self' },
                                { label: __('New Window', 'ileben-landing'), value: '_blank' }
                            ],
                            onChange: (value) => setAttributes({ target: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Variant', 'ileben-landing'),
                            help: __('Estilo de la tarjeta', 'ileben-landing'),
                            value: attributes.variant || '',
                            options: [
                                { label: __('Default', 'ileben-landing'), value: '' },
                                { label: __('Primary', 'ileben-landing'), value: 'bg-primary text-white' },
                                { label: __('Secondary', 'ileben-landing'), value: 'bg-secondary text-white' },
                                { label: __('Success', 'ileben-landing'), value: 'bg-success text-white' },
                                { label: __('Danger', 'ileben-landing'), value: 'bg-danger text-white' },
                                { label: __('Warning', 'ileben-landing'), value: 'bg-warning' },
                                { label: __('Info', 'ileben-landing'), value: 'bg-info text-white' },
                                { label: __('Light', 'ileben-landing'), value: 'bg-light' },
                                { label: __('Dark', 'ileben-landing'), value: 'bg-dark text-white' },
                                { label: __('Border Primary', 'ileben-landing'), value: 'border-primary' },
                                { label: __('Border Secondary', 'ileben-landing'), value: 'border-secondary' },
                                { label: __('Border Success', 'ileben-landing'), value: 'border-success' },
                                { label: __('Border Danger', 'ileben-landing'), value: 'border-danger' },
                                { label: __('Border Warning', 'ileben-landing'), value: 'border-warning' },
                                { label: __('Border Info', 'ileben-landing'), value: 'border-info' }
                            ],
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Text Alignment', 'ileben-landing'),
                            value: attributes.textAlign || '',
                            options: [
                                { label: __('Default', 'ileben-landing'), value: '' },
                                { label: __('Left', 'ileben-landing'), value: 'start' },
                                { label: __('Center', 'ileben-landing'), value: 'center' },
                                { label: __('Right', 'ileben-landing'), value: 'end' }
                            ],
                            onChange: (value) => setAttributes({ textAlign: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('CSS Classes', 'ileben-landing'), initialOpen: false },
                        createElement(TextControl, {
                            label: __('Card Body Extra Classes', 'ileben-landing'),
                            help: __('Agregar clases al card-body', 'ileben-landing'),
                            value: attributes.bodyClasses || '',
                            onChange: (value) => setAttributes({ bodyClasses: value })
                        }),
                        createElement(TextControl, {
                            label: __('Title Extra Classes', 'ileben-landing'),
                            help: __('Agregar clases al card-title', 'ileben-landing'),
                            value: attributes.titleClasses || '',
                            onChange: (value) => setAttributes({ titleClasses: value })
                        }),
                        createElement(TextControl, {
                            label: __('Text Extra Classes', 'ileben-landing'),
                            help: __('Agregar clases al card-text', 'ileben-landing'),
                            value: attributes.textClasses || '',
                            onChange: (value) => setAttributes({ textClasses: value })
                        })
                    ),
                    // Animation Controls Panel - Same as Background Panel
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
                                value: attributes.animationTrigger || 'on-load',
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'ileben-landing'),
                                value: attributes.animationDuration || 0.6,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'ileben-landing'),
                                value: attributes.animationDelay || 0,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),

                            createElement(SelectControl, {
                                label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase || 'power2.inOut',
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),

                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'ileben-landing'),
                                checked: attributes.animationMobileEnabled !== false,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    )
                ),
                createElement('div', Object.assign({}, blockProps, { className: 'card wp-block-bootstrap-theme-bs-card' }),
                    attributes.image && createElement('img', {
                        src: attributes.image,
                        className: 'card-img-top',
                        alt: attributes.imageAlt || ''
                    }),
                    createElement('div', { className: 'card-body' },
                        attributes.title && createElement('h5', { className: 'card-title' }, attributes.title),
                        attributes.subtitle && createElement('h6', { className: 'card-subtitle mb-2 text-muted' }, attributes.subtitle),
                        createElement(InnerBlocks, {
                            placeholder: __('Add card content...', 'ileben-landing')
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