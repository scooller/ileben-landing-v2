/**
 * Bootstrap Carousel Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, ToggleControl, Button, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-carousel-item', {
        apiVersion: 3,
        title: __('Bootstrap Carousel Item', 'ileben-landing'),
        description: __('Individual slide within a Bootstrap carousel', 'ileben-landing'),
        icon: 'format-image',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slide'), __('item')],
        parent: ['bootstrap-theme/bs-carousel'],
        
        attributes: {
            active: {
                type: 'boolean',
                default: false
            },
            backgroundImage: {
                type: 'object',
                default: null
            },
            backgroundImageMobile: {
                type: 'object',
                default: null
            },
            interval: {
                type: 'string',
                default: ''
            },
            link: {
                type: 'string',
                default: ''
            },
            target: {
                type: 'string',
                default: '_self'
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
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            // Inserter preview image
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-carousel-item/example.png',
                    alt: __('Carousel item preview', 'ileben-landing'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const itemClasses = [
                'carousel-item',
                attributes.active ? 'active' : ''
            ].filter(Boolean).join(' ');

            const editorBackgroundImage = attributes.backgroundImage || attributes.backgroundImageMobile;

            const itemStyle = editorBackgroundImage ? {
                backgroundImage: `url(${editorBackgroundImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
            } : {
                backgroundColor: '#f8f9fa',
                minHeight: '400px'
            };
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Item Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Active Slide', 'ileben-landing'),
                            help: __('Set as the default active slide', 'ileben-landing'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement('div', { className: 'components-base-control' },
                            createElement('label', { className: 'components-base-control__label' }, 
                                __('Background Image', 'ileben-landing')
                            ),
                            createElement(MediaUploadCheck, {},
                                createElement(MediaUpload, {
                                    onSelect: (media) => setAttributes({ backgroundImage: media }),
                                    allowedTypes: ['image'],
                                    value: attributes.backgroundImage ? attributes.backgroundImage.id : null,
                                    render: ({ open }) => createElement(Fragment, {},
                                        attributes.backgroundImage ? 
                                            createElement('div', {},
                                                createElement('img', {
                                                    src: attributes.backgroundImage.url,
                                                    alt: attributes.backgroundImage.alt,
                                                    style: { maxWidth: '100%', height: 'auto' }
                                                }),
                                                createElement(Button, {
                                                    onClick: open,
                                                    variant: 'secondary',
                                                    style: { marginTop: '10px', marginRight: '10px' }
                                                }, __('Replace Image', 'ileben-landing')),
                                                createElement(Button, {
                                                    onClick: () => setAttributes({ backgroundImage: null }),
                                                    variant: 'link',
                                                    isDestructive: true,
                                                    style: { marginTop: '10px' }
                                                }, __('Remove Image', 'ileben-landing'))
                                            ) :
                                            createElement(Button, {
                                                onClick: open,
                                                variant: 'secondary'
                                            }, __('Select Image', 'ileben-landing'))
                                    )
                                })
                            )
                        ),
                        createElement('div', { className: 'components-base-control' },
                            createElement('label', { className: 'components-base-control__label' },
                                __('Background Image Mobile', 'ileben-landing')
                            ),
                            createElement(MediaUploadCheck, {},
                                createElement(MediaUpload, {
                                    onSelect: (media) => setAttributes({ backgroundImageMobile: media }),
                                    allowedTypes: ['image'],
                                    value: attributes.backgroundImageMobile ? attributes.backgroundImageMobile.id : null,
                                    render: ({ open }) => createElement(Fragment, {},
                                        attributes.backgroundImageMobile ?
                                            createElement('div', {},
                                                createElement('img', {
                                                    src: attributes.backgroundImageMobile.url,
                                                    alt: attributes.backgroundImageMobile.alt,
                                                    style: { maxWidth: '100%', height: 'auto' }
                                                }),
                                                createElement(Button, {
                                                    onClick: open,
                                                    variant: 'secondary',
                                                    style: { marginTop: '10px', marginRight: '10px' }
                                                }, __('Replace Image', 'ileben-landing')),
                                                createElement(Button, {
                                                    onClick: () => setAttributes({ backgroundImageMobile: null }),
                                                    variant: 'link',
                                                    isDestructive: true,
                                                    style: { marginTop: '10px' }
                                                }, __('Remove Image', 'ileben-landing'))
                                            ) :
                                            createElement(Button, {
                                                onClick: open,
                                                variant: 'secondary'
                                            }, __('Select Image', 'ileben-landing'))
                                    )
                                })
                            )
                        ),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Link URL', 'ileben-landing'),
                            help: __('Optional URL to make the entire slide clickable', 'ileben-landing'),
                            value: attributes.link || '',
                            onChange: (value) => setAttributes({ link: value })
                        }),
                        attributes.link && createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Link Target', 'ileben-landing'),
                            value: attributes.target || '_self',
                            options: [
                                { label: __('Same Window', 'ileben-landing'), value: '_self' },
                                { label: __('New Window', 'ileben-landing'), value: '_blank' }
                            ],
                            onChange: (value) => setAttributes({ target: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${itemClasses} ${blockProps.className || ''}`.trim(),
                        style: itemStyle,
                        'data-bs-interval': attributes.interval || undefined
                    }),
                    createElement('div', {
                        className: 'd-flex align-items-center justify-content-center h-100',
                        style: { 
                            backgroundColor: editorBackgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
                            color: editorBackgroundImage ? 'inherit' : 'inherit'
                        }
                    },
                        createElement('div', { className: 'text-center' },
                            createElement(InnerBlocks, {
                                placeholder: __('Add slide content (text, image, etc)...', 'ileben-landing')
                            })
                        )
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);