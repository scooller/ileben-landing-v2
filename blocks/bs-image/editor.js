/**
 * Bootstrap Image Block Editor
 * Responsive image block with separate desktop and mobile images
 *
 * @package Bootstrap_Theme
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl, Button, BaseControl } = wp.components;
    const { createElement: el, Fragment, useState } = wp.element;

    registerBlockType('bootstrap-theme/bs-image', {
        apiVersion: 3,
        title: __('Bootstrap Image (Responsive)', 'ileben-landing'),
        description: __('Responsive image with independent desktop and mobile versions, Bootstrap styles, and GSAP animations.', 'ileben-landing'),
        icon: 'format-image',
        category: 'ileben-landing',
        keywords: [__('image'), __('picture'), __('responsive'), __('mobile'), __('desktop'), __('bootstrap')],
        supports: {
            customClassName: true
        },

        attributes: {
            imageDesktop: {
                type: 'object',
                default: null
            },
            imageMobile: {
                type: 'object',
                default: null
            },
            breakpoint: {
                type: 'string',
                default: '767.98px'
            },
            alt: {
                type: 'string',
                default: ''
            },
            caption: {
                type: 'string',
                default: ''
            },
            align: {
                type: 'string',
                default: 'center'
            },
            fluid: {
                type: 'boolean',
                default: true
            },
            rounded: {
                type: 'string',
                default: ''
            },
            shadow: {
                type: 'string',
                default: ''
            },
            imageClass: {
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
            loading: {
                type: 'string',
                default: 'lazy'
            },
            className: {
                type: 'string',
                default: ''
            },
            // Animation attributes
            animationType: { type: 'string' },
            animationTrigger: { type: 'string' },
            animationDuration: { type: 'number' },
            animationDelay: { type: 'number' },
            animationEase: { type: 'string' },
            animationRepeat: { type: 'number' },
            animationRepeatDelay: { type: 'number' },
            animationYoyo: { type: 'boolean' },
            animationDistance: { type: 'string' },
            animationRotation: { type: 'number' },
            animationScale: { type: 'string' },
            animationParallaxSpeed: { type: 'number' },
            animationHoverEffect: { type: 'string' },
            animationScrollStart: { type: 'string', default: 'top 70%' },
            animationScrollEnd: { type: 'string', default: 'top 10%' },
            animationScrollMarkers: { type: 'boolean', default: false },
            animationMobileEnabled: { type: 'boolean' }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'

            const desktopImg = attributes.imageDesktop;
            const mobileImg = attributes.imageMobile;

            const desktopUrl = desktopImg ? (desktopImg.url || '') : '';
            const mobileUrl = mobileImg ? (mobileImg.url || '') : '';

            // Selected preview image
            const currentImgUrl = previewMode === 'mobile' 
                ? (mobileUrl || desktopUrl) 
                : (desktopUrl || mobileUrl);

            // Compute image classes
            const imgClasses = [
                attributes.fluid ? 'img-fluid' : '',
                attributes.rounded,
                attributes.shadow,
                attributes.imageClass
            ].filter(Boolean).join(' ');

            // Compute wrapper style
            const alignClass = attributes.align === 'start' 
                ? 'text-start' 
                : (attributes.align === 'end' ? 'text-end' : 'text-center');

            const renderMediaField = (label, imgData, onSelect, onRemove, helpText) => {
                const url = imgData ? imgData.url : '';
                return el(BaseControl, {
                    label: label,
                    help: helpText,
                    className: 'mb-3'
                },
                    el(MediaUploadCheck, {},
                        el(MediaUpload, {
                            onSelect: onSelect,
                            allowedTypes: ['image'],
                            value: imgData ? imgData.id : null,
                            render: ({ open }) => el('div', {
                                style: {
                                    border: '1px dashed #ccc',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                    textAlign: 'center'
                                }
                            },
                                url ? el(Fragment, {},
                                    el('div', { style: { marginBottom: '8px' } },
                                        el('img', {
                                            src: url,
                                            alt: label,
                                            style: { maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto 8px' }
                                        })
                                    ),
                                    el(Button, {
                                        onClick: open,
                                        variant: 'secondary',
                                        size: 'small',
                                        style: { marginRight: '8px' }
                                    }, __('Replace', 'ileben-landing')),
                                    el(Button, {
                                        onClick: onRemove,
                                        variant: 'link',
                                        isDestructive: true,
                                        size: 'small'
                                    }, __('Remove', 'ileben-landing'))
                                ) : el(Button, {
                                    onClick: open,
                                    variant: 'secondary',
                                    size: 'small'
                                }, __('Select Image', 'ileben-landing'))
                            )
                        })
                    )
                );
            };

            return el(Fragment, {},
                el(InspectorControls, {},
                    // 1. Image Settings
                    el(PanelBody, { title: __('Images (Desktop & Mobile)', 'ileben-landing'), initialOpen: true },
                        renderMediaField(
                            __('Desktop Image', 'ileben-landing'),
                            desktopImg,
                            (media) => setAttributes({
                                imageDesktop: {
                                    id: media.id,
                                    url: media.url,
                                    alt: media.alt || ''
                                }
                            }),
                            () => setAttributes({ imageDesktop: null }),
                            __('Default image shown on screens wider than the mobile breakpoint.', 'ileben-landing')
                        ),
                        renderMediaField(
                            __('Mobile Image', 'ileben-landing'),
                            mobileImg,
                            (media) => setAttributes({
                                imageMobile: {
                                    id: media.id,
                                    url: media.url,
                                    alt: media.alt || ''
                                }
                            }),
                            () => setAttributes({ imageMobile: null }),
                            __('Optional. Shown on screens up to the selected mobile breakpoint.', 'ileben-landing')
                        ),
                        mobileUrl && el(SelectControl, {
                            label: __('Mobile Breakpoint', 'ileben-landing'),
                            value: attributes.breakpoint || '767.98px',
                            options: [
                                { label: __('Mobile (< 768px - Bootstrap md)', 'ileben-landing'), value: '767.98px' },
                                { label: __('Tablet / Mobile (< 992px - Bootstrap lg)', 'ileben-landing'), value: '991.98px' },
                                { label: __('Small Mobile (< 576px - Bootstrap sm)', 'ileben-landing'), value: '575.98px' }
                            ],
                            onChange: (value) => setAttributes({ breakpoint: value }),
                            help: __('Defines when the mobile image replaces the desktop image.', 'ileben-landing')
                        }),
                        el(TextControl, {
                            label: __('Alt Text (Alternative Description)', 'ileben-landing'),
                            value: attributes.alt || '',
                            onChange: (value) => setAttributes({ alt: value }),
                            help: __('Leave empty to use the media file\'s default alt text.', 'ileben-landing')
                        }),
                        el(TextControl, {
                            label: __('Caption', 'ileben-landing'),
                            value: attributes.caption || '',
                            onChange: (value) => setAttributes({ caption: value })
                        })
                    ),

                    // 2. Styles and Layout
                    el(PanelBody, { title: __('Image Style & Layout', 'ileben-landing'), initialOpen: false },
                        el(SelectControl, {
                            label: __('Alignment', 'ileben-landing'),
                            value: attributes.align || 'center',
                            options: [
                                { label: __('Center', 'ileben-landing'), value: 'center' },
                                { label: __('Left', 'ileben-landing'), value: 'start' },
                                { label: __('Right', 'ileben-landing'), value: 'end' }
                            ],
                            onChange: (value) => setAttributes({ align: value })
                        }),
                        el(ToggleControl, {
                            label: __('Responsive Fluid (img-fluid)', 'ileben-landing'),
                            help: __('Scales nicely with parent width (max-width: 100%, height: auto)', 'ileben-landing'),
                            checked: attributes.fluid !== false,
                            onChange: (value) => setAttributes({ fluid: value })
                        }),
                        el(SelectControl, {
                            label: __('Rounded Corners', 'ileben-landing'),
                            value: attributes.rounded || '',
                            options: [
                                { label: __('None', 'ileben-landing'), value: '' },
                                { label: __('Rounded (rounded)', 'ileben-landing'), value: 'rounded' },
                                { label: __('Circle (rounded-circle)', 'ileben-landing'), value: 'rounded-circle' },
                                { label: __('Pill (rounded-pill)', 'ileben-landing'), value: 'rounded-pill' },
                                { label: __('Thumbnail Border (img-thumbnail)', 'ileben-landing'), value: 'img-thumbnail' }
                            ],
                            onChange: (value) => setAttributes({ rounded: value })
                        }),
                        el(SelectControl, {
                            label: __('Shadow', 'ileben-landing'),
                            value: attributes.shadow || '',
                            options: [
                                { label: __('None', 'ileben-landing'), value: '' },
                                { label: __('Small (shadow-sm)', 'ileben-landing'), value: 'shadow-sm' },
                                { label: __('Regular (shadow)', 'ileben-landing'), value: 'shadow' },
                                { label: __('Large (shadow-lg)', 'ileben-landing'), value: 'shadow-lg' }
                            ],
                            onChange: (value) => setAttributes({ shadow: value })
                        }),
                        el(TextControl, {
                            label: __('Additional Image Classes', 'ileben-landing'),
                            value: attributes.imageClass || '',
                            onChange: (value) => setAttributes({ imageClass: value }),
                            help: __('Applied directly to the <img> element (e.g. w-100, border, opacity-75).', 'ileben-landing')
                        }),
                        el(SelectControl, {
                            label: __('Loading Strategy', 'ileben-landing'),
                            value: attributes.loading || 'lazy',
                            options: [
                                { label: __('Lazy (Best performance)', 'ileben-landing'), value: 'lazy' },
                                { label: __('Eager (Immediate)', 'ileben-landing'), value: 'eager' }
                            ],
                            onChange: (value) => setAttributes({ loading: value })
                        })
                    ),

                    // 3. Link Settings
                    el(PanelBody, { title: __('Link Settings', 'ileben-landing'), initialOpen: false },
                        el(TextControl, {
                            label: __('Link URL', 'ileben-landing'),
                            value: attributes.link || '',
                            onChange: (value) => setAttributes({ link: value }),
                            placeholder: 'https://...'
                        }),
                        attributes.link && el(ToggleControl, {
                            label: __('Open in new window', 'ileben-landing'),
                            checked: attributes.target === '_blank',
                            onChange: (value) => setAttributes({ target: value ? '_blank' : '_self' })
                        })
                    ),

                    // 4. Animation Controls
                    window.ilebenAnimationControls && el(
                        window.ilebenAnimationControls.AnimationControls,
                        {
                            attributes: attributes,
                            setAttributes: setAttributes,
                            allowHover: true,
                            allowScroll: true
                        }
                    )
                ),

                // Canvas Editor Preview
                el('div', Object.assign({}, blockProps, {
                    className: `wp-block-bootstrap-theme-bs-image ${alignClass} ${attributes.className || ''}`.trim()
                }),
                    // Mode selector toolbar in editor
                    (desktopUrl || mobileUrl) ? el('div', {
                        style: {
                            display: 'inline-flex',
                            gap: '4px',
                            background: '#f0f0f1',
                            padding: '3px',
                            borderRadius: '4px',
                            marginBottom: '8px',
                            fontSize: '12px'
                        }
                    },
                        el('button', {
                            type: 'button',
                            onClick: () => setPreviewMode('desktop'),
                            style: {
                                border: 'none',
                                background: previewMode === 'desktop' ? '#0d6efd' : 'transparent',
                                color: previewMode === 'desktop' ? '#fff' : '#333',
                                borderRadius: '3px',
                                padding: '3px 8px',
                                cursor: 'pointer',
                                fontWeight: previewMode === 'desktop' ? 'bold' : 'normal'
                            }
                        }, desktopUrl ? '🖥️ Desktop' : '🖥️ Desktop (No img)'),
                        el('button', {
                            type: 'button',
                            onClick: () => setPreviewMode('mobile'),
                            style: {
                                border: 'none',
                                background: previewMode === 'mobile' ? '#0d6efd' : 'transparent',
                                color: previewMode === 'mobile' ? '#fff' : '#333',
                                borderRadius: '3px',
                                padding: '3px 8px',
                                cursor: 'pointer',
                                fontWeight: previewMode === 'mobile' ? 'bold' : 'normal'
                            }
                        }, mobileUrl ? '📱 Mobile' : '📱 Mobile (Fallback)')
                    ) : null,

                    // Image Display
                    currentImgUrl ? el('figure', {
                        style: {
                            margin: 0,
                            display: 'inline-block',
                            maxWidth: previewMode === 'mobile' ? '360px' : '100%',
                            transition: 'max-width 0.3s ease',
                            border: previewMode === 'mobile' ? '2px dashed #0d6efd' : 'none',
                            padding: previewMode === 'mobile' ? '4px' : '0',
                            borderRadius: '6px'
                        }
                    },
                        el('img', {
                            src: currentImgUrl,
                            alt: attributes.alt || (previewMode === 'mobile' ? (mobileImg && mobileImg.alt) : (desktopImg && desktopImg.alt)) || '',
                            className: imgClasses,
                            style: { maxWidth: '100%', height: 'auto', display: 'block' }
                        }),
                        attributes.caption && el('figcaption', {
                            className: 'figure-caption mt-2 text-muted'
                        }, attributes.caption)
                    ) : el('div', {
                        style: {
                            border: '2px dashed #bbb',
                            borderRadius: '8px',
                            padding: '30px',
                            textAlign: 'center',
                            background: '#f8f9fa'
                        }
                    },
                        el('div', { style: { fontSize: '32px', marginBottom: '10px' } }, '🖼️'),
                        el('p', { style: { margin: '0 0 12px', fontWeight: '500', color: '#555' } },
                            __('Bootstrap Image: Select desktop and mobile images in the sidebar.', 'ileben-landing')
                        ),
                        el(MediaUploadCheck, {},
                            el(MediaUpload, {
                                onSelect: (media) => setAttributes({
                                    imageDesktop: { id: media.id, url: media.url, alt: media.alt || '' }
                                }),
                                allowedTypes: ['image'],
                                render: ({ open }) => el(Button, {
                                    onClick: open,
                                    variant: 'primary',
                                    size: 'small'
                                }, __('Select Desktop Image', 'ileben-landing'))
                            })
                        )
                    )
                )
            );
        },

        save: function() {
            return null; // Dynamic rendering via block.php
        }
    });

})(window.wp);
