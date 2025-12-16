/**
 * Bootstrap Dropdown Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-dropdown-item', {
        title: __('Bootstrap Dropdown Item', 'bootstrap-theme'),
        description: __('Individual item within a dropdown menu', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('dropdown'), __('item'), __('menu')],
        parent: ['bootstrap-theme/bs-dropdown'],
        
        attributes: {
            text: {
                type: 'string',
                default: 'Dropdown item'
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
                default: 'link'
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-dropdown-item/example.png',
                    alt: __('Dropdown item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const typeOptions = [
                { label: 'Link', value: 'link' },
                { label: 'Button', value: 'button' },
                { label: 'Header', value: 'header' },
                { label: 'Text', value: 'text' }
            ];

            const getItemClasses = () => {
                switch (attributes.type) {
                    case 'header':
                        return 'dropdown-header';
                    case 'text':
                        return 'dropdown-item-text';
                    default:
                        return [
                            'dropdown-item',
                            attributes.active ? 'active' : '',
                            attributes.disabled ? 'disabled' : ''
                        ].filter(Boolean).join(' ');
                }
            };

            const itemClasses = getItemClasses();
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Dropdown Item Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Type', 'bootstrap-theme'),
                            value: attributes.type,
                            options: typeOptions,
                            onChange: (value) => setAttributes({ type: value })
                        }),
                        (attributes.type === 'link' || attributes.type === 'button') && createElement(ToggleControl, {
                            label: __('Active', 'bootstrap-theme'),
                            help: __('Mark as active/current item', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        (attributes.type === 'link' || attributes.type === 'button') && createElement(ToggleControl, {
                            label: __('Disabled', 'bootstrap-theme'),
                            help: __('Make item appear disabled', 'bootstrap-theme'),
                            checked: attributes.disabled,
                            onChange: (value) => setAttributes({ disabled: value })
                        }),
                        attributes.type === 'link' && !attributes.disabled && createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'bootstrap-theme')
                        }),
                        attributes.type === 'link' && !attributes.disabled && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'bootstrap-theme'),
                            checked: attributes.openInNewTab,
                            onChange: (value) => setAttributes({ openInNewTab: value })
                        })
                    )
                ),
                attributes.type === 'link' ?
                    createElement('li', blockProps,
                        createElement('a', {
                            className: itemClasses,
                            href: attributes.href,
                            target: attributes.openInNewTab ? '_blank' : undefined,
                            rel: attributes.openInNewTab ? 'noopener noreferrer' : undefined,
                            onClick: (e) => e.preventDefault()
                        },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.text,
                                onChange: (value) => setAttributes({ text: value }),
                                placeholder: __('Dropdown item text...', 'bootstrap-theme'),
                                allowedFormats: [],
                                style: { display: 'inline' }
                            })
                        )
                    ) :
                attributes.type === 'button' ?
                    createElement('li', blockProps,
                        createElement('button', {
                            className: itemClasses,
                            type: 'button',
                            disabled: attributes.disabled
                        },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.text,
                                onChange: (value) => setAttributes({ text: value }),
                                placeholder: __('Dropdown button text...', 'bootstrap-theme'),
                                allowedFormats: [],
                                style: { display: 'inline' }
                            })
                        )
                    ) :
                    createElement('li', 
                        Object.assign({}, blockProps, { 
                            className: itemClasses
                        }),
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: attributes.type === 'header' ? 
                                __('Dropdown header...', 'bootstrap-theme') :
                                __('Dropdown text...', 'bootstrap-theme'),
                            allowedFormats: attributes.type === 'header' ? ['core/bold'] : []
                        })
                    )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const getItemClasses = () => {
                switch (attributes.type) {
                    case 'header':
                        return 'dropdown-header';
                    case 'text':
                        return 'dropdown-item-text';
                    default:
                        return [
                            'dropdown-item',
                            attributes.active ? 'active' : '',
                            attributes.disabled ? 'disabled' : ''
                        ].filter(Boolean).join(' ');
                }
            };

            const itemClasses = getItemClasses();

            if (attributes.type === 'link') {
                return createElement('li', blockProps,
                    createElement('a', {
                        className: itemClasses,
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
            } else if (attributes.type === 'button') {
                return createElement('li', blockProps,
                    createElement('button', {
                        className: itemClasses,
                        type: 'button',
                        disabled: attributes.disabled
                    },
                        createElement(RichText.Content, {
                            tagName: 'span',
                            value: attributes.text
                        })
                    )
                );
            } else {
                return createElement('li', 
                    Object.assign({}, blockProps, { 
                        className: itemClasses
                    }),
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: attributes.text
                    })
                );
            }
        }
    });

})(window.wp);