/**
 * Bootstrap Parallax Container Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-parallax', {
        apiVersion: 3,
        title: __('Bootstrap Parallax Container', 'ileben-landing'),
        description: __('Container with parallax scroll effect - use this to wrap elements', 'ileben-landing'),
        icon: 'format-image',
        category: 'ileben-landing',
        keywords: [__('parallax'), __('container'), __('scroll'), __('effect')],
        
        attributes: {
            enableParallax: {
                type: 'boolean',
                default: true
            },
            parallaxContent: {
                type: 'boolean',
                default: false
            },
            parallaxSpeed: {
                type: 'number',
                default: 0.5
            },
            parallaxStart: {
                type: 'string',
                default: 'top bottom'
            },
            parallaxEnd: {
                type: 'string',
                default: 'bottom top'
            },
            preview: {
                type: 'boolean',
                default: false
            },
            bgImageId: {
                type: 'number',
                default: 0
            },
            bgImageUrl: {
                type: 'string',
                default: ''
            },
            bgVideoUrl: {
                type: 'string',
                default: ''
            },
            overlayColor: {
                type: 'string',
                default: '#000000'
            },
            overlayOpacity: {
                type: 'number',
                default: 50
            },
            height: {
                type: 'number',
                default: 25
            },            
            showMarkers: {
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
            const blockProps = useBlockProps({
                className: 'bs-parallax-container'
            });

            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-parallax/example.png',
                    alt: __('Parallax container preview', 'ileben-landing'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, 
                        { title: __('Parallax Settings', 'ileben-landing') },
                        
                        createElement(ToggleControl, {
                            label: __('Enable Parallax', 'ileben-landing'),
                            help: __('Add parallax scroll effect to this container', 'ileben-landing'),
                            checked: attributes.enableParallax,
                            onChange: (value) => setAttributes({ enableParallax: value })
                        }),

                        attributes.enableParallax && createElement(ToggleControl, {
                            label: __('Parallax Content', 'ileben-landing'),
                            help: __('El contenido también se mueve con el parallax (efecto real)', 'ileben-landing'),
                            checked: attributes.parallaxContent,
                            onChange: (value) => setAttributes({ parallaxContent: value })
                        }),

                        attributes.enableParallax && createElement(RangeControl, {
                            __next40pxDefaultSize: true, label: __('Parallax Speed', 'ileben-landing'),
                            value: attributes.parallaxSpeed,
                            min: 0.1,
                            max: 2,
                            step: 0.1,
                            onChange: (value) => setAttributes({ parallaxSpeed: value })
                        }),

                        attributes.enableParallax && createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Start (ScrollTrigger start)', 'ileben-landing'),
                            help: __('Formato "top center", "center center", etc.', 'ileben-landing'),
                            value: attributes.parallaxStart,
                            onChange: (value) => setAttributes({ parallaxStart: value || 'top center' })
                        }),

                        attributes.enableParallax && createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('End (ScrollTrigger end)', 'ileben-landing'),
                            help: __('Formato "bottom center", "center center", etc.', 'ileben-landing'),
                            value: attributes.parallaxEnd,
                            onChange: (value) => setAttributes({ parallaxEnd: value || 'bottom center' })
                        }),

                        createElement(RangeControl, {
                            __next40pxDefaultSize: true, label: __('Height (dvh)', 'ileben-landing'),
                            value: attributes.height,
                            min: 1,
                            max: 100,
                            step: 0.5,
                            onChange: (value) => setAttributes({ height: value })
                        }),                        

                        attributes.enableParallax && createElement(ToggleControl, {
                            label: __('Ver marcadores', 'ileben-landing'),
                            help: __('Muestra los marcadores de GSAP ScrollTrigger (start/end)', 'ileben-landing'),
                            checked: attributes.showMarkers,
                            onChange: (value) => setAttributes({ showMarkers: value })
                        })
                    ),

                    createElement(PanelBody,
                        { title: __('Background Media', 'ileben-landing'), initialOpen: false },
                        createElement(MediaUpload, {
                            label: __('Background Image', 'ileben-landing'),
                            onSelect: (media) => setAttributes({ bgImageId: media.id, bgImageUrl: media.url }),
                            allowedTypes: ['image'],
                            value: attributes.bgImageId,
                            render: ({ open }) => createElement('div', {},
                                attributes.bgImageUrl ? createElement('div', { style: { marginBottom: '10px' } },
                                    createElement('img', {
                                        src: attributes.bgImageUrl,
                                        style: { maxWidth: '100%', height: 'auto', borderRadius: '4px', display: 'block', marginBottom: '5px' }
                                    }),
                                    createElement('div', null,
                                        createElement('button', { type: 'button', className: 'components-button is-secondary is-small', onClick: open }, __('Replace Image', 'ileben-landing')),
                                        createElement('button', {
                                            type: 'button',
                                            className: 'components-button is-link is-destructive is-small',
                                            style: { marginLeft: '10px' },
                                            onClick: () => setAttributes({ bgImageId: 0, bgImageUrl: '' })
                                        }, __('Remove', 'ileben-landing'))
                                    )
                                ) : createElement('button', { type: 'button', className: 'components-button is-secondary', onClick: open }, __('Select Background Image', 'ileben-landing'))
                            )
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Background Video URL', 'ileben-landing'),
                            help: __('URL de video MP4. Sobrescribe la imagen si ambos existen.', 'ileben-landing'),
                            value: attributes.bgVideoUrl,
                            onChange: (value) => setAttributes({ bgVideoUrl: value })
                        })
                    ),

                    createElement(PanelBody,
                        { title: __('Overlay', 'ileben-landing'), initialOpen: false },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Overlay Color', 'ileben-landing'),
                            help: __('Hex color, ej: #000000 o rgba(0,0,0,0.5)', 'ileben-landing'),
                            value: attributes.overlayColor,
                            onChange: (value) => setAttributes({ overlayColor: value })
                        }),
                        createElement(RangeControl, {
                            __next40pxDefaultSize: true, label: __('Overlay Opacity (%)', 'ileben-landing'),
                            value: attributes.overlayOpacity,
                            min: 0,
                            max: 100,
                            step: 5,
                            onChange: (value) => setAttributes({ overlayOpacity: value })
                        })
                    )
                ),
                
                createElement('div',
                    Object.assign({}, blockProps, {
                        'data-parallax': attributes.enableParallax ? 'true' : 'false',
                        'data-parallax-markers': attributes.showMarkers ? 'true' : 'false',
                        className: ['bs-parallax-container', blockProps.className, attributes.className].filter(Boolean).join(' '),
                        style: {
                            ...blockProps.style,
                            position: 'relative',
                            overflow: 'hidden',
                            height: attributes.height + 'dvh'
                        }
                    }),
                    // Background layer — video or image
                    createElement('div', {
                        'data-parallax-bg': 'true',
                        className: 'bs-parallax-bg',
                        style: { position: 'absolute', top: '-10%', left: 0, right: 0, bottom: '-10%', width: '100%', height: '120%', zIndex: 0, pointerEvents: 'none' }
                    },
                        attributes.bgVideoUrl ?
                            createElement('video', {
                                className: 'bs-parallax-video',
                                autoPlay: true, muted: true, loop: true, playsInline: true,
                                style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
                            }, createElement('source', { src: attributes.bgVideoUrl }))
                        : attributes.bgImageUrl ?
                            createElement('div', {
                                className: 'bs-parallax-image',
                                style: { width: '100%', height: '100%', backgroundImage: 'url(' + attributes.bgImageUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
                            })
                        :
                            createElement('div', {
                                style: { width: '100%', height: '100%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '13px' }
                            }, __('No background media selected', 'ileben-landing'))
                    ),
                    // Overlay layer
                    attributes.overlayOpacity > 0 ?
                        createElement('div', {
                            className: 'bs-parallax-overlay',
                            style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: attributes.overlayColor, opacity: attributes.overlayOpacity / 100, zIndex: 1, pointerEvents: 'none' }
                        })
                    : null,
                    // Content layer
                    createElement('div', {
                        'data-parallax-content': 'true',
                        'data-parallax-content-move': attributes.parallaxContent ? 'true' : 'false',
                        className: 'bs-parallax-content',
                        style: { position: 'relative', zIndex: 2, padding: '20px', height: attributes.height + 'dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }
                    },
                        createElement('div', { style: { fontSize: '11px', color: '#0073aa', marginBottom: '8px', opacity: 0.7 } },
                            attributes.enableParallax ?
                                '∞ Parallax ' + attributes.parallaxSpeed.toFixed(1) + 'x'
                            : '○ Parallax off'
                        ),
                        createElement(InnerBlocks, {
                            allowedBlocks: [
                                'bootstrap-theme/bs-row',
                                'bootstrap-theme/bs-column',
                                'bootstrap-theme/bs-container',
                                'bootstrap-theme/bs-carousel',
                                'bootstrap-theme/bs-card',
                                'bootstrap-theme/bs-fa-icon',
                                'core/paragraph',
                                'core/heading',
                                'core/image',
                                'core/group'
                            ],
                            placeholder: __('Add content inside parallax container...', 'ileben-landing')
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