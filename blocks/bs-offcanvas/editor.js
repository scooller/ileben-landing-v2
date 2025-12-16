/**
 * Bootstrap Offcanvas Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-offcanvas', {
        title: __('Bootstrap Offcanvas', 'bootstrap-theme'),
        description: __('Bootstrap offcanvas sidebar component', 'bootstrap-theme'),
        icon: 'menu',
        category: 'ileben-landing',
        keywords: [__('offcanvas'), __('sidebar'), __('drawer')],
        
        attributes: {
            offcanvasId: {
                type: 'string',
                default: ''
            },
            title: {
                type: 'string',
                default: 'Offcanvas'
            },
            placement: {
                type: 'string',
                default: 'start'
            },
            backdrop: {
                type: 'string',
                default: 'true'
            },
            scroll: {
                type: 'boolean',
                default: false
            },
            keyboard: {
                type: 'boolean',
                default: true
            },
            buttonText: {
                type: 'string',
                default: 'Toggle offcanvas'
            },
            buttonVariant: {
                type: 'string',
                default: 'primary'
            },
            showHeader: {
                type: 'boolean',
                default: true
            },
            showCloseButton: {
                type: 'boolean',
                default: true
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-offcanvas/example.png',
                    alt: __('Offcanvas preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            // Generate unique ID if not set
            if (!attributes.offcanvasId) {
                setAttributes({ offcanvasId: `offcanvas-${clientId}` });
            }
            
            const placementOptions = [
                { label: 'Left (Start)', value: 'start' },
                { label: 'Right (End)', value: 'end' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' }
            ];

            const backdropOptions = [
                { label: 'Show Backdrop', value: 'true' },
                { label: 'Static Backdrop', value: 'static' },
                { label: 'No Backdrop', value: 'false' }
            ];

            const variantOptions = [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
            ];

            const offcanvasClasses = [
                'offcanvas',
                `offcanvas-${attributes.placement}`
            ].join(' ');
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Offcanvas Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Offcanvas ID', 'bootstrap-theme'),
                            value: attributes.offcanvasId,
                            onChange: (value) => setAttributes({ offcanvasId: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Placement', 'bootstrap-theme'),
                            value: attributes.placement,
                            options: placementOptions,
                            onChange: (value) => setAttributes({ placement: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Backdrop', 'bootstrap-theme'),
                            value: attributes.backdrop,
                            options: backdropOptions,
                            onChange: (value) => setAttributes({ backdrop: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Body Scrolling', 'bootstrap-theme'),
                            help: __('Allow body to scroll when offcanvas is open', 'bootstrap-theme'),
                            checked: attributes.scroll,
                            onChange: (value) => setAttributes({ scroll: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Keyboard', 'bootstrap-theme'),
                            help: __('Close with Escape key', 'bootstrap-theme'),
                            checked: attributes.keyboard,
                            onChange: (value) => setAttributes({ keyboard: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Header', 'bootstrap-theme'),
                            checked: attributes.showHeader,
                            onChange: (value) => setAttributes({ showHeader: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Close Button', 'bootstrap-theme'),
                            checked: attributes.showCloseButton,
                            onChange: (value) => setAttributes({ showCloseButton: value })
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
                        className: `btn btn-${attributes.buttonVariant}`,
                        type: 'button',
                        'data-bs-toggle': 'offcanvas',
                        'data-bs-target': `#${attributes.offcanvasId}`,
                        'aria-controls': attributes.offcanvasId
                    }, attributes.buttonText),
                    
                    // Offcanvas Preview
                    createElement('div', { className: 'offcanvas-preview mt-3 p-3 border' },
                        createElement('h6', {}, __('Offcanvas Preview:', 'bootstrap-theme')),
                        createElement('div', {
                            className: offcanvasClasses,
                            style: { position: 'relative', transform: 'none', display: 'block' }
                        },
                            attributes.showHeader && createElement('div', { className: 'offcanvas-header' },
                                createElement(RichText, {
                                    tagName: 'h5',
                                    className: 'offcanvas-title',
                                    value: attributes.title,
                                    onChange: (value) => setAttributes({ title: value }),
                                    placeholder: __('Offcanvas title...', 'bootstrap-theme')
                                }),
                                attributes.showCloseButton && createElement('button', {
                                    type: 'button',
                                    className: 'btn-close',
                                    'data-bs-dismiss': 'offcanvas',
                                    'aria-label': 'Close'
                                })
                            ),
                            createElement('div', { className: 'offcanvas-body' },
                                createElement(InnerBlocks, {
                                    placeholder: __('Add offcanvas content...', 'bootstrap-theme'),
                                    template: [
                                        ['core/paragraph', { 
                                            content: __('Some text as placeholder. In real usage this can be any content you want.', 'bootstrap-theme')
                                        }]
                                    ]
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