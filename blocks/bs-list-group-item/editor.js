/**
 * Bootstrap List Group Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText, InnerBlocks } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-list-group-item', {
        title: __('Bootstrap List Group Item', 'bootstrap-theme'),
        description: __('Individual item within a list group', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('list'), __('item'), __('bootstrap')],
        parent: ['bootstrap-theme/bs-list-group'],
        
        attributes: {
            text: {
                type: 'string',
                default: 'List item'
            },
            variant: {
                type: 'string',
                default: ''
            },
            active: {
                type: 'boolean',
                default: false
            },
            disabled: {
                type: 'boolean',
                default: false
            },
            actionable: {
                type: 'boolean',
                default: false
            },
            href: {
                type: 'string',
                default: '#'
            },
            openInNewTab: {
                type: 'boolean',
                default: false
            },
            hasContent: {
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-list-group-item/example.png',
                    alt: __('List group item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const variantOptions = [
                { label: 'Default', value: '' },
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
            ];

            const itemClasses = [
                'list-group-item',
                attributes.variant ? `list-group-item-${attributes.variant}` : '',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : '',
                attributes.actionable ? 'list-group-item-action' : ''
            ].filter(Boolean).join(' ');

            const TagName = attributes.actionable ? 'a' : 'li';
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('List Item Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Color Variant', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Active', 'bootstrap-theme'),
                            help: __('Mark as active/current item', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Disabled', 'bootstrap-theme'),
                            help: __('Make item appear disabled', 'bootstrap-theme'),
                            checked: attributes.disabled,
                            onChange: (value) => setAttributes({ disabled: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Actionable', 'bootstrap-theme'),
                            help: __('Make item clickable/hoverable', 'bootstrap-theme'),
                            checked: attributes.actionable,
                            onChange: (value) => setAttributes({ actionable: value })
                        }),
                        attributes.actionable && createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'bootstrap-theme')
                        }),
                        attributes.actionable && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'bootstrap-theme'),
                            checked: attributes.openInNewTab,
                            onChange: (value) => setAttributes({ openInNewTab: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Complex Content', 'bootstrap-theme'),
                            help: __('Enable rich content instead of simple text', 'bootstrap-theme'),
                            checked: attributes.hasContent,
                            onChange: (value) => setAttributes({ hasContent: value })
                        })
                    )
                ),
                createElement(TagName, 
                    Object.assign({}, blockProps, { 
                        className: `${itemClasses} ${blockProps.className || ''}`.trim(),
                        href: attributes.actionable ? attributes.href : undefined,
                        target: (attributes.actionable && attributes.openInNewTab) ? '_blank' : undefined,
                        rel: (attributes.actionable && attributes.openInNewTab) ? 'noopener noreferrer' : undefined,
                        onClick: attributes.actionable ? (e) => e.preventDefault() : undefined
                    }),
                    attributes.hasContent ?
                        createElement(InnerBlocks, {
                            placeholder: __('Add list item content...', 'bootstrap-theme'),
                            template: [
                                ['core/heading', { 
                                    content: __('List item heading', 'bootstrap-theme'),
                                    level: 5
                                }],
                                ['core/paragraph', { 
                                    content: __('Some additional content for this list item.', 'bootstrap-theme')
                                }]
                            ]
                        }) :
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: __('List item text...', 'bootstrap-theme'),
                            allowedFormats: ['core/bold', 'core/italic']
                        })
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const itemClasses = [
                'list-group-item',
                attributes.variant ? `list-group-item-${attributes.variant}` : '',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : '',
                attributes.actionable ? 'list-group-item-action' : ''
            ].filter(Boolean).join(' ');

            const TagName = attributes.actionable ? 'a' : 'li';

            return createElement(TagName, 
                Object.assign({}, blockProps, { 
                    className: itemClasses,
                    href: attributes.actionable ? attributes.href : undefined,
                    target: (attributes.actionable && attributes.openInNewTab) ? '_blank' : undefined,
                    rel: (attributes.actionable && attributes.openInNewTab) ? 'noopener noreferrer' : undefined
                }),
                attributes.hasContent ?
                    createElement(InnerBlocks.Content) :
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: attributes.text
                    })
            );
        }
    });

})(window.wp);