/**
 * Bootstrap Breadcrumb Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-breadcrumb-item', {
        apiVersion: 3,
        title: __('Bootstrap Breadcrumb Item', 'ileben-landing'),
        description: __('Individual item within breadcrumb navigation', 'ileben-landing'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('breadcrumb'), __('item'), __('navigation')],
        parent: ['bootstrap-theme/bs-breadcrumb'],
        
        attributes: {
            text: {
                type: 'string',
                default: 'Breadcrumb Item'
            },
            href: {
                type: 'string',
                default: '#'
            },
            active: {
                type: 'boolean',
                default: false
            },
            openInNewTab: {
                type: 'boolean',
                default: false
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-breadcrumb-item/example.png',
                    alt: __('Breadcrumb item preview', 'ileben-landing'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const itemClasses = [
                'breadcrumb-item',
                attributes.active ? 'active' : ''
            ].filter(Boolean).join(' ');
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Breadcrumb Item Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Active Item', 'ileben-landing'),
                            help: __('Mark as current page (no link)', 'ileben-landing'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        !attributes.active && createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Link URL', 'ileben-landing'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'ileben-landing')
                        }),
                        !attributes.active && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'ileben-landing'),
                            checked: attributes.openInNewTab,
                            onChange: (value) => setAttributes({ openInNewTab: value })
                        })
                    )
                ),
                createElement('li', 
                    Object.assign({}, blockProps, { 
                        className: `${itemClasses} ${blockProps.className || ''}`.trim(),
                        'aria-current': attributes.active ? 'page' : undefined
                    }),
                    attributes.active ? 
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: __('Breadcrumb text...', 'ileben-landing'),
                            allowedFormats: []
                        }) :
                        createElement('a', {
                            href: attributes.href,
                            target: attributes.openInNewTab ? '_blank' : undefined,
                            rel: attributes.openInNewTab ? 'noopener noreferrer' : undefined,
                            onClick: (e) => e.preventDefault()
                        },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.text,
                                onChange: (value) => setAttributes({ text: value }),
                                placeholder: __('Breadcrumb text...', 'ileben-landing'),
                                allowedFormats: [],
                                style: { color: 'inherit', textDecoration: 'inherit' }
                            })
                        )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const itemClasses = [
                'breadcrumb-item',
                attributes.active ? 'active' : ''
            ].filter(Boolean).join(' ');

            return createElement('li', 
                Object.assign({}, blockProps, { 
                    className: [blockProps.className, itemClasses].filter(Boolean).join(' '),
                    'aria-current': attributes.active ? 'page' : undefined
                }),
                attributes.active ? 
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: attributes.text
                    }) :
                    createElement('a', {
                        href: attributes.href,
                        target: attributes.openInNewTab ? '_blank' : undefined,
                        rel: attributes.openInNewTab ? 'noopener noreferrer' : undefined
                    },
                        createElement(RichText.Content, {
                            tagName: 'span',
                            value: attributes.text
                        })
                    )
            );
        }
    });

})(window.wp);