/**
 * Bootstrap Badge Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-badge', {
        title: __('Bootstrap Badge', 'bootstrap-theme'),
        description: __('Bootstrap badge component for labels and counters', 'bootstrap-theme'),
        icon: 'tag',
        category: 'ileben-landing',
        keywords: [__('badge'), __('label'), __('bootstrap')],
        
        attributes: {
            text: {
                type: 'string',
                default: 'Badge'
            },
            variant: {
                type: 'string',
                default: 'primary'
            },
            pill: {
                type: 'boolean',
                default: false
            },
            size: {
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
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-badge/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
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
                { label: 'Large', value: 'fs-6' },
                { label: 'Small', value: 'fs-7' }
            ];

            const badgeClasses = [
                'badge',
                `bg-${attributes.variant}`,
                attributes.pill ? 'rounded-pill' : '',
                attributes.size
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Badge Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Variant', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Pill Style', 'bootstrap-theme'),
                            help: __('Make badge more rounded', 'bootstrap-theme'),
                            checked: attributes.pill,
                            onChange: (value) => setAttributes({ pill: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Size', 'bootstrap-theme'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement(RichText, {
                        tagName: 'span',
                        className: badgeClasses,
                        value: attributes.text,
                        onChange: (value) => setAttributes({ text: value }),
                        placeholder: __('Badge text...', 'bootstrap-theme'),
                        allowedFormats: []
                    })
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const badgeClasses = [
                'badge',
                `bg-${attributes.variant}`,
                attributes.pill ? 'rounded-pill' : '',
                attributes.size
            ].filter(Boolean).join(' ');

            return createElement('div', blockProps,
                createElement(RichText.Content, {
                    tagName: 'span',
                    className: badgeClasses,
                    value: attributes.text
                })
            );
        }
    });

})(window.wp);