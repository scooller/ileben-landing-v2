/**
 * Bootstrap Accordion Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-accordion-item', {
        title: __('Bootstrap Accordion Item', 'bootstrap-theme'),
        description: __('Individual item within a Bootstrap accordion', 'bootstrap-theme'),
        icon: 'format-aside',
        category: 'ileben-landing',
        keywords: [__('accordion'), __('item'), __('bootstrap')],
        parent: ['bootstrap-theme/bs-accordion'],
        
        attributes: {
            title: {
                type: 'string',
                default: 'Accordion Item'
            },
            isOpen: {
                type: 'boolean',
                default: false
            },
            itemId: {
                type: 'string',
                default: ''
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            
            // Inserter preview image
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-accordion-item/example.png',
                    alt: __('Accordion item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            // Generate unique ID if not set
            if (!attributes.itemId) {
                setAttributes({ itemId: `item-${clientId}` });
            }
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Accordion Item Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Open by Default', 'bootstrap-theme'),
                            checked: attributes.isOpen,
                            onChange: (value) => setAttributes({ isOpen: value })
                        }),
                        createElement(TextControl, {
                            label: __('Item ID', 'bootstrap-theme'),
                            value: attributes.itemId,
                            onChange: (value) => setAttributes({ itemId: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `accordion-item ${blockProps.className || ''}`.trim()
                    }),
                    createElement('h2', { className: 'accordion-header', id: `heading-${attributes.itemId}` },
                        createElement('button', {
                            className: `accordion-button${attributes.isOpen ? '' : ' collapsed'}`,
                            type: 'button',
                            'data-bs-toggle': 'collapse',
                            'data-bs-target': `#collapse-${attributes.itemId}`,
                            'aria-expanded': attributes.isOpen ? 'true' : 'false',
                            'aria-controls': `collapse-${attributes.itemId}`
                        },
                            createElement(RichText, {
                                tagName: 'span',
                                value: attributes.title,
                                onChange: (value) => setAttributes({ title: value }),
                                placeholder: __('Accordion title...', 'bootstrap-theme')
                            })
                        )
                    ),
                    createElement('div', {
                        id: `collapse-${attributes.itemId}`,
                        className: `accordion-collapse collapse${attributes.isOpen ? ' show' : ''}`,
                        'aria-labelledby': `heading-${attributes.itemId}`
                    },
                        createElement('div', { className: 'accordion-body' },
                            createElement(InnerBlocks, {
                                placeholder: __('Add accordion content...', 'bootstrap-theme')
                            })
                        )
                    )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            return createElement('div', 
                Object.assign({}, blockProps, { 
                    className: `accordion-item ${blockProps.className || ''}`.trim()
                }),
                createElement('h2', { className: 'accordion-header', id: `heading-${attributes.itemId}` },
                    createElement('button', {
                        className: `accordion-button${attributes.isOpen ? '' : ' collapsed'}`,
                        type: 'button',
                        'data-bs-toggle': 'collapse',
                        'data-bs-target': `#collapse-${attributes.itemId}`,
                        'aria-expanded': attributes.isOpen ? 'true' : 'false',
                        'aria-controls': `collapse-${attributes.itemId}`
                    },
                        createElement(RichText.Content, {
                            tagName: 'span',
                            value: attributes.title
                        })
                    )
                ),
                createElement('div', {
                    id: `collapse-${attributes.itemId}`,
                    className: `accordion-collapse collapse${attributes.isOpen ? ' show' : ''}`,
                    'aria-labelledby': `heading-${attributes.itemId}`
                },
                    createElement('div', { className: 'accordion-body' },
                        createElement(InnerBlocks.Content)
                    )
                )
            );
        }
    });

})(window.wp);