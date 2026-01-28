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
        title: __('Bootstrap Card', 'bootstrap-theme'),
        description: __('A flexible Bootstrap card component with GSAP animations', 'bootstrap-theme'),
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
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const animationType = attributes.animationType || '';

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

            const hoverEffects = [
                { label: __('Scale', 'bootstrap-theme'), value: 'scale' },
                { label: __('Brightness', 'bootstrap-theme'), value: 'brightness' },
                { label: __('Shadow', 'bootstrap-theme'), value: 'shadow' },
                { label: __('Lift', 'bootstrap-theme'), value: 'lift' },
                { label: __('Glow', 'bootstrap-theme'), value: 'glow' },
            ];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Card Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Card Title', 'bootstrap-theme'),
                            value: attributes.title || '',
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        createElement(TextControl, {
                            label: __('Card Subtitle', 'bootstrap-theme'),
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
                            }, attributes.image ? __('Change Image', 'bootstrap-theme') : __('Select Image', 'bootstrap-theme'))
                        }),
                        attributes.image && createElement(ToggleControl, {
                            label: __('Imagen Full', 'bootstrap-theme'),
                            help: __('Hacer que la imagen ocupe el ancho completo del card', 'bootstrap-theme'),
                            checked: attributes.imageFull || false,
                            onChange: (value) => setAttributes({ imageFull: value })
                        }),
                        createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            help: __('URL a la que enlaza la tarjeta completa', 'bootstrap-theme'),
                            value: attributes.link || '',
                            onChange: (value) => setAttributes({ link: value })
                        }),
                        attributes.link && createElement(SelectControl, {
                            label: __('Link Target', 'bootstrap-theme'),
                            value: attributes.target || '_self',
                            options: [
                                { label: __('Same Window', 'bootstrap-theme'), value: '_self' },
                                { label: __('New Window', 'bootstrap-theme'), value: '_blank' }
                            ],
                            onChange: (value) => setAttributes({ target: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Variant', 'bootstrap-theme'),
                            help: __('Estilo de la tarjeta', 'bootstrap-theme'),
                            value: attributes.variant || '',
                            options: [
                                { label: __('Default', 'bootstrap-theme'), value: '' },
                                { label: __('Primary', 'bootstrap-theme'), value: 'bg-primary text-white' },
                                { label: __('Secondary', 'bootstrap-theme'), value: 'bg-secondary text-white' },
                                { label: __('Success', 'bootstrap-theme'), value: 'bg-success text-white' },
                                { label: __('Danger', 'bootstrap-theme'), value: 'bg-danger text-white' },
                                { label: __('Warning', 'bootstrap-theme'), value: 'bg-warning' },
                                { label: __('Info', 'bootstrap-theme'), value: 'bg-info text-white' },
                                { label: __('Light', 'bootstrap-theme'), value: 'bg-light' },
                                { label: __('Dark', 'bootstrap-theme'), value: 'bg-dark text-white' },
                                { label: __('Border Primary', 'bootstrap-theme'), value: 'border-primary' },
                                { label: __('Border Secondary', 'bootstrap-theme'), value: 'border-secondary' },
                                { label: __('Border Success', 'bootstrap-theme'), value: 'border-success' },
                                { label: __('Border Danger', 'bootstrap-theme'), value: 'border-danger' },
                                { label: __('Border Warning', 'bootstrap-theme'), value: 'border-warning' },
                                { label: __('Border Info', 'bootstrap-theme'), value: 'border-info' }
                            ],
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Text Alignment', 'bootstrap-theme'),
                            value: attributes.textAlign || '',
                            options: [
                                { label: __('Default', 'bootstrap-theme'), value: '' },
                                { label: __('Left', 'bootstrap-theme'), value: 'start' },
                                { label: __('Center', 'bootstrap-theme'), value: 'center' },
                                { label: __('Right', 'bootstrap-theme'), value: 'end' }
                            ],
                            onChange: (value) => setAttributes({ textAlign: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('CSS Classes', 'bootstrap-theme'), initialOpen: false },
                        createElement(TextControl, {
                            label: __('Card Body Extra Classes', 'bootstrap-theme'),
                            help: __('Agregar clases al card-body', 'bootstrap-theme'),
                            value: attributes.bodyClasses || '',
                            onChange: (value) => setAttributes({ bodyClasses: value })
                        }),
                        createElement(TextControl, {
                            label: __('Title Extra Classes', 'bootstrap-theme'),
                            help: __('Agregar clases al card-title', 'bootstrap-theme'),
                            value: attributes.titleClasses || '',
                            onChange: (value) => setAttributes({ titleClasses: value })
                        }),
                        createElement(TextControl, {
                            label: __('Text Extra Classes', 'bootstrap-theme'),
                            help: __('Agregar clases al card-text', 'bootstrap-theme'),
                            value: attributes.textClasses || '',
                            onChange: (value) => setAttributes({ textClasses: value })
                        })
                    ),
                    // Animation Controls Panel - Same as Background Panel
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
                                value: attributes.animationTrigger || 'on-load',
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDuration || 0.6,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),

                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDelay || 0,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),

                            createElement(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase || 'power2.inOut',
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),

                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'bootstrap-theme'),
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
                            placeholder: __('Add card content...', 'bootstrap-theme')
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
