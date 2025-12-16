/**
 * Bootstrap Spinner Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-spinner', {
        title: __('Bootstrap Spinner', 'bootstrap-theme'),
        description: __('Bootstrap loading spinner component', 'bootstrap-theme'),
        icon: 'update',
        category: 'ileben-landing',
        keywords: [__('spinner'), __('loading'), __('bootstrap')],
        
        attributes: {
            type: {
                type: 'string',
                default: 'border'
            },
            variant: {
                type: 'string',
                default: 'primary'
            },
            size: {
                type: 'string',
                default: ''
            },
            centered: {
                type: 'boolean',
                default: false
            },
            label: {
                type: 'string',
                default: ''
            },
            showLabel: {
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
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-spinner/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const typeOptions = [
                { label: 'Border Spinner', value: 'border' },
                { label: 'Growing Spinner', value: 'grow' }
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

            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'sm' }
            ];

            const spinnerClasses = [
                `spinner-${attributes.type}`,
                `text-${attributes.variant}`,
                attributes.size ? `spinner-${attributes.type}-${attributes.size}` : ''
            ].filter(Boolean).join(' ');

            const containerClasses = attributes.centered ? 'd-flex justify-content-center' : '';
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Spinner Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Type', 'bootstrap-theme'),
                            value: attributes.type,
                            options: typeOptions,
                            onChange: (value) => setAttributes({ type: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Color', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Size', 'bootstrap-theme'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Centered', 'bootstrap-theme'),
                            help: __('Center the spinner horizontally', 'bootstrap-theme'),
                            checked: attributes.centered,
                            onChange: (value) => setAttributes({ centered: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Label', 'bootstrap-theme'),
                            help: __('Display text next to spinner', 'bootstrap-theme'),
                            checked: attributes.showLabel,
                            onChange: (value) => setAttributes({ showLabel: value })
                        }),
                        attributes.showLabel && createElement(TextControl, {
                            label: __('Label Text', 'bootstrap-theme'),
                            value: attributes.label,
                            onChange: (value) => setAttributes({ label: value }),
                            placeholder: __('Loading...', 'bootstrap-theme')
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${containerClasses} ${blockProps.className || ''}`.trim()
                    }),
                    createElement('div', {
                        className: spinnerClasses,
                        role: 'status',
                        'aria-hidden': 'true'
                    },
                        createElement('span', { className: 'visually-hidden' }, 'Loading...')
                    ),
                    attributes.showLabel && attributes.label && 
                        createElement('span', { className: 'ms-2' }, attributes.label)
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const spinnerClasses = [
                `spinner-${attributes.type}`,
                `text-${attributes.variant}`,
                attributes.size ? `spinner-${attributes.type}-${attributes.size}` : ''
            ].filter(Boolean).join(' ');

            const containerClasses = attributes.centered ? 'd-flex justify-content-center' : '';

            return createElement('div', 
                Object.assign({}, blockProps, { 
                    className: `${containerClasses} ${blockProps.className || ''}`.trim()
                }),
                createElement('div', {
                    className: spinnerClasses,
                    role: 'status',
                    'aria-hidden': 'true'
                },
                    createElement('span', { className: 'visually-hidden' }, 'Loading...')
                ),
                attributes.showLabel && attributes.label && 
                    createElement('span', { className: 'ms-2' }, attributes.label)
            );
        }
    });

})(window.wp);