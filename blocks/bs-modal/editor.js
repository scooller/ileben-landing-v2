/**
 * Bootstrap Modal Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-modal', {
        title: __('Bootstrap Modal', 'bootstrap-theme'),
        description: __('Bootstrap modal dialog component', 'bootstrap-theme'),
        icon: 'admin-page',
        category: 'ileben-landing',
        keywords: [__('modal'), __('dialog'), __('bootstrap')],
        
        attributes: {
            modalId: {
                type: 'string',
                default: ''
            },
            title: {
                type: 'string',
                default: 'Modal title'
            },
            size: {
                type: 'string',
                default: ''
            },
            centered: {
                type: 'boolean',
                default: false
            },
            scrollable: {
                type: 'boolean',
                default: false
            },
            staticBackdrop: {
                type: 'boolean',
                default: false
            },
            buttonText: {
                type: 'string',
                default: 'Open Modal'
            },
            buttonVariant: {
                type: 'string',
                default: 'btn-primary'
            },
            backdrop: {
                type: 'string',
                default: 'true'
            },
            keyboard: {
                type: 'string',
                default: 'true'
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
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-modal/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            // Generate unique ID if not set
            if (!attributes.modalId) {
                setAttributes({ modalId: `modal-${clientId}` });
            }
            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'modal-sm' },
                { label: 'Large', value: 'modal-lg' },
                { label: 'Extra Large', value: 'modal-xl' },
                { label: 'Full Screen', value: 'modal-fullscreen' }
            ];

            const variantOptions = [
                { label: 'Primary', value: 'btn-primary' },
                { label: 'Secondary', value: 'btn-secondary' },
                { label: 'Success', value: 'btn-success' },
                { label: 'Danger', value: 'btn-danger' },
                { label: 'Warning', value: 'btn-warning' },
                { label: 'Info', value: 'btn-info' },
                { label: 'Light', value: 'btn-light' },
                { label: 'Dark', value: 'btn-dark' }
            ];

            const modalClasses = [
                'modal-dialog',
                attributes.size,
                attributes.centered ? 'modal-dialog-centered' : '',
                attributes.scrollable ? 'modal-dialog-scrollable' : ''
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Modal Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Modal ID', 'bootstrap-theme'),
                            value: attributes.modalId,
                            onChange: (value) => setAttributes({ modalId: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Size', 'bootstrap-theme'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Centered', 'bootstrap-theme'),
                            checked: attributes.centered,
                            onChange: (value) => setAttributes({ centered: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Scrollable', 'bootstrap-theme'),
                            checked: attributes.scrollable,
                            onChange: (value) => setAttributes({ scrollable: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Static Backdrop', 'bootstrap-theme'),
                            help: __('Modal will not close when clicking outside', 'bootstrap-theme'),
                            checked: attributes.staticBackdrop,
                            onChange: (value) => setAttributes({ staticBackdrop: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Backdrop', 'bootstrap-theme'),
                            help: __('Backdrop behavior', 'bootstrap-theme'),
                            value: attributes.backdrop || 'true',
                            options: [
                                { label: __('Default', 'bootstrap-theme'), value: 'true' },
                                { label: __('Static', 'bootstrap-theme'), value: 'static' },
                                { label: __('None', 'bootstrap-theme'), value: 'false' }
                            ],
                            onChange: (value) => setAttributes({ backdrop: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Keyboard', 'bootstrap-theme'),
                            help: __('Close modal with Escape key', 'bootstrap-theme'),
                            value: attributes.keyboard || 'true',
                            options: [
                                { label: __('Enabled', 'bootstrap-theme'), value: 'true' },
                                { label: __('Disabled', 'bootstrap-theme'), value: 'false' }
                            ],
                            onChange: (value) => setAttributes({ keyboard: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('Trigger Button', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Button Text', 'bootstrap-theme'),
                            value: attributes.buttonText,
                            onChange: (value) => setAttributes({ buttonText: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Button Variant', 'bootstrap-theme'),
                            value: attributes.buttonVariant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ buttonVariant: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    // Trigger Button
                    createElement('button', {
                        type: 'button',
                        className: `btn ${attributes.buttonVariant}`,
                        'data-bs-toggle': 'modal',
                        'data-bs-target': `#${attributes.modalId}`
                    }, attributes.buttonText),
                    
                    // Modal Preview (Editor Only)
                    createElement('div', {
                        className: 'modal-preview mt-3 p-3 border',
                        style: { backgroundColor: '#f8f9fa' }
                    },
                        createElement('h6', {}, __('Modal Preview:', 'bootstrap-theme')),
                        createElement('div', { className: 'modal-content' },
                            createElement('div', { className: 'modal-header' },
                                createElement(RichText, {
                                    tagName: 'h5',
                                    className: 'modal-title',
                                    value: attributes.title,
                                    onChange: (value) => setAttributes({ title: value }),
                                    placeholder: __('Modal title...', 'bootstrap-theme')
                                })
                            ),
                            createElement('div', { className: 'modal-body' },
                                createElement(InnerBlocks, {
                                    placeholder: __('Add modal content...', 'bootstrap-theme')
                                })
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