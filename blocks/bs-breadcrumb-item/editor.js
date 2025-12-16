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
        title: __('Bootstrap Breadcrumb Item', 'bootstrap-theme'),
        description: __('Individual item within breadcrumb navigation', 'bootstrap-theme'),
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
                    alt: __('Breadcrumb item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const itemClasses = [
                'breadcrumb-item',
                attributes.active ? 'active' : ''
            ].filter(Boolean).join(' ');
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Breadcrumb Item Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Active Item', 'bootstrap-theme'),
                            help: __('Mark as current page (no link)', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        !attributes.active && createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'bootstrap-theme')
                        }),
                        !attributes.active && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'bootstrap-theme'),
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
                            placeholder: __('Breadcrumb text...', 'bootstrap-theme'),
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
                                placeholder: __('Breadcrumb text...', 'bootstrap-theme'),
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
                    className: itemClasses,
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