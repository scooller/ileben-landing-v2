(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, Button, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-split-carousel-item', {
        apiVersion: 3,
        title: __('Split Carousel Item', 'ileben-landing'),
        description: __('A single slide for the split carousel', 'ileben-landing'),
        icon: 'format-image',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-split-carousel'],
        
        attributes: {
            active: {
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
            mainImageId: {
                type: 'number',
                default: 0
            },
            mainImageUrl: {
                type: 'string',
                default: ''
            },
            mainImageAlt: {
                type: 'string',
                default: ''
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: `carousel-item bs-split-carousel-item ${attributes.active ? 'active' : ''}` });
            
            const onSelectBgImage = (media) => {
                setAttributes({ bgImageId: media.id, bgImageUrl: media.url });
            };
            
            const onSelectMainImage = (media) => {
                setAttributes({ mainImageId: media.id, mainImageUrl: media.url, mainImageAlt: media.alt || '' });
            };

            const bgStyle = attributes.bgImageUrl ? { backgroundImage: `url(${attributes.bgImageUrl})` } : {};

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Item Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Active (First Slide)', 'ileben-landing'),
                            help: __('Set this to true ONLY for the first slide.', 'ileben-landing'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement('div', { className: 'components-base-control' },
                            createElement('p', { className: 'components-base-control__label' }, __('Left Column Background Image', 'ileben-landing')),
                            createElement(MediaUploadCheck, {},
                                createElement(MediaUpload, {
                                    onSelect: onSelectBgImage,
                                    allowedTypes: ['image'],
                                    value: attributes.bgImageId,
                                    render: ({ open }) => createElement(Button, {
                                        onClick: open,
                                        isPrimary: !attributes.bgImageId,
                                        isSecondary: !!attributes.bgImageId
                                    }, attributes.bgImageId ? __('Change Background Image', 'ileben-landing') : __('Select Background Image', 'ileben-landing'))
                                })
                            ),
                            attributes.bgImageUrl && createElement(Button, {
                                isLink: true,
                                isDestructive: true,
                                onClick: () => setAttributes({ bgImageId: 0, bgImageUrl: '' }),
                                style: { marginTop: '10px' }
                            }, __('Remove Background Image', 'ileben-landing'))
                        ),
                        createElement('hr'),
                        createElement('div', { className: 'components-base-control' },
                            createElement('p', { className: 'components-base-control__label' }, __('Right Column Main Image', 'ileben-landing')),
                            createElement(MediaUploadCheck, {},
                                createElement(MediaUpload, {
                                    onSelect: onSelectMainImage,
                                    allowedTypes: ['image'],
                                    value: attributes.mainImageId,
                                    render: ({ open }) => createElement(Button, {
                                        onClick: open,
                                        isPrimary: !attributes.mainImageId,
                                        isSecondary: !!attributes.mainImageId
                                    }, attributes.mainImageId ? __('Change Main Image', 'ileben-landing') : __('Select Main Image', 'ileben-landing'))
                                })
                            ),
                            attributes.mainImageUrl && createElement(Button, {
                                isLink: true,
                                isDestructive: true,
                                onClick: () => setAttributes({ mainImageId: 0, mainImageUrl: '' }),
                                style: { marginTop: '10px' }
                            }, __('Remove Main Image', 'ileben-landing'))
                        )
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        style: { border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }
                    }),
                    createElement('div', { className: 'row g-0 align-items-center position-relative', style: { minHeight: '300px' } },
                        createElement('div', { className: 'col-5 split-text-col position-relative z-2' },
                            createElement('div', { className: 'split-text-card', style: { ...bgStyle, padding: '20px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } },
                                createElement('div', { className: 'split-text-content' },
                                    createElement(InnerBlocks, {
                                        template: [
                                            ['core/heading', { level: 2, content: 'PUERTO VARAS', style: { color: { text: '#2B4A5F' } } }],
                                            ['core/paragraph', { content: 'Lorem ipsum dolor', className: 'lead text-muted' }],
                                            ['core/paragraph', { content: 'Lorem ipsum dolor sit amet...' }]
                                        ]
                                    })
                                )
                            )
                        ),
                        createElement('div', { className: 'col-7 split-image-col position-absolute end-0 top-0 h-100 z-1 d-none d-md-block' },
                            attributes.mainImageUrl ? 
                            createElement('img', { src: attributes.mainImageUrl, className: 'w-100 h-100 object-fit-cover', style: { objectFit: 'cover', height: '100%' } }) :
                            createElement('div', { className: 'placeholder-img w-100 h-100 bg-light d-flex align-items-center justify-content-center', style: { height: '100%', minHeight: '300px', backgroundColor: '#f8f9fa' } },
                                createElement('span', { className: 'text-muted' }, __('Main Image Placeholder', 'ileben-landing'))
                            )
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
