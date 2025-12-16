/**
 * Bootstrap Pagination Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-pagination-item', {
        title: __('Bootstrap Pagination Item', 'bootstrap-theme'),
        description: __('Individual item within pagination navigation', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('pagination'), __('item'), __('page')],
        parent: ['bootstrap-theme/bs-pagination'],
        
        attributes: {
            text: {
                type: 'string',
                default: '1'
            },
            href: {
                type: 'string',
                default: '#'
            },
            active: {
                type: 'boolean',
                default: false
            },
            disabled: {
                type: 'boolean',
                default: false
            },
            type: {
                type: 'string',
                default: 'page'
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-pagination-item/example.png',
                    alt: __('Pagination item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const typeOptions = [
                { label: 'Page Number', value: 'page' },
                { label: 'Previous', value: 'previous' },
                { label: 'Next', value: 'next' },
                { label: 'First', value: 'first' },
                { label: 'Last', value: 'last' },
                { label: 'Ellipsis (...)', value: 'ellipsis' }
            ];

            const itemClasses = [
                'page-item',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : ''
            ].filter(Boolean).join(' ');

            const getDefaultText = (type) => {
                switch (type) {
                    case 'previous': return __('Previous', 'bootstrap-theme');
                    case 'next': return __('Next', 'bootstrap-theme');
                    case 'first': return __('First', 'bootstrap-theme');
                    case 'last': return __('Last', 'bootstrap-theme');
                    case 'ellipsis': return '...';
                    default: return '1';
                }
            };

            // Update text when type changes
            if (attributes.type !== 'page' && attributes.text === '1') {
                setAttributes({ text: getDefaultText(attributes.type) });
            }
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Pagination Item Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Type', 'bootstrap-theme'),
                            value: attributes.type,
                            options: typeOptions,
                            onChange: (value) => {
                                setAttributes({ 
                                    type: value,
                                    text: getDefaultText(value)
                                });
                            }
                        }),
                        createElement(ToggleControl, {
                            label: __('Active', 'bootstrap-theme'),
                            help: __('Mark as current page', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Disabled', 'bootstrap-theme'),
                            help: __('Make item appear disabled', 'bootstrap-theme'),
                            checked: attributes.disabled,
                            onChange: (value) => setAttributes({ disabled: value })
                        }),
                        !attributes.disabled && createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'bootstrap-theme')
                        }),
                        !attributes.disabled && createElement(ToggleControl, {
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
                    attributes.disabled || attributes.type === 'ellipsis' ?
                        createElement('span', { className: 'page-link' },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.text,
                                onChange: (value) => setAttributes({ text: value }),
                                placeholder: __('Page text...', 'bootstrap-theme'),
                                allowedFormats: [],
                                style: { display: 'inline' }
                            })
                        ) :
                        createElement('a', {
                            className: 'page-link',
                            href: attributes.href,
                            target: attributes.openInNewTab ? '_blank' : undefined,
                            rel: attributes.openInNewTab ? 'noopener noreferrer' : undefined,
                            onClick: (e) => e.preventDefault()
                        },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.text,
                                onChange: (value) => setAttributes({ text: value }),
                                placeholder: __('Page text...', 'bootstrap-theme'),
                                allowedFormats: [],
                                style: { display: 'inline' }
                            })
                        )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const itemClasses = [
                'page-item',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : ''
            ].filter(Boolean).join(' ');

            return createElement('li', 
                Object.assign({}, blockProps, { 
                    className: itemClasses,
                    'aria-current': attributes.active ? 'page' : undefined
                }),
                attributes.disabled || attributes.type === 'ellipsis' ?
                    createElement('span', { className: 'page-link' },
                        createElement(RichText.Content, {
                            tagName: 'span',
                            value: attributes.text
                        })
                    ) :
                    createElement('a', {
                        className: 'page-link',
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