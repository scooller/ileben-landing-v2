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
        title: __('Bootstrap Carousel Item', 'bootstrap-theme'),
        description: __('Individual slide within a Bootstrap carousel', 'bootstrap-theme'),
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
                    alt: __('Carousel item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const itemClasses = [
                'carousel-item',
                attributes.active ? 'active' : ''
            ].filter(Boolean).join(' ');

            const itemStyle = attributes.backgroundImage ? {
                backgroundImage: `url(${attributes.backgroundImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
            } : {
                backgroundColor: '#f8f9fa',
                minHeight: '400px'
            };
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Item Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Active Slide', 'bootstrap-theme'),
                            help: __('Set as the default active slide', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement('div', { className: 'components-base-control' },
                            createElement('label', { className: 'components-base-control__label' }, 
                                __('Background Image', 'bootstrap-theme')
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
                                                }, __('Replace Image', 'bootstrap-theme')),
                                                createElement(Button, {
                                                    onClick: () => setAttributes({ backgroundImage: null }),
                                                    variant: 'link',
                                                    isDestructive: true,
                                                    style: { marginTop: '10px' }
                                                }, __('Remove Image', 'bootstrap-theme'))
                                            ) :
                                            createElement(Button, {
                                                onClick: open,
                                                variant: 'secondary'
                                            }, __('Select Image', 'bootstrap-theme'))
                                    )
                                })
                            )
                        ),
                        createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            help: __('Optional URL to make the entire slide clickable', 'bootstrap-theme'),
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
                            backgroundColor: attributes.backgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
                            color: attributes.backgroundImage ? 'white' : 'inherit'
                        }
                    },
                        createElement('div', { className: 'text-center' },
                            createElement(InnerBlocks, {
                                placeholder: __('Add slide content (text, image, etc)...', 'bootstrap-theme')
                            })
                        )
                    )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const itemClasses = `carousel-item${attributes.active ? ' active' : ''}`;
            
            const itemStyle = attributes.backgroundImage ? {
                backgroundImage: `url(${attributes.backgroundImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
            } : {
                minHeight: '400px'
            };

            const innerContent = createElement('div', {
                className: 'd-flex align-items-center justify-content-center h-100',
                style: { 
                    backgroundColor: attributes.backgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
                    color: attributes.backgroundImage ? 'white' : 'inherit'
                }
            },
                createElement('div', { className: 'carousel-caption' },
                    createElement(InnerBlocks.Content)
                )
            );

            // Render as link if link attribute is set, otherwise as div
            if (attributes.link) {
                return createElement('a',
                    Object.assign({}, blockProps, {
                        href: attributes.link,
                        target: attributes.target || '_self',
                        className: itemClasses,
                        style: itemStyle,
                        'data-bs-interval': attributes.interval || undefined
                    }),
                    innerContent
                );
            } else {
                return createElement('div',
                    Object.assign({}, blockProps, {
                        className: itemClasses,
                        style: itemStyle,
                        'data-bs-interval': attributes.interval || undefined
                    }),
                    innerContent
                );
            }
        }
    });

})(window.wp);