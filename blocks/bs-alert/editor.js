/**
 * Bootstrap Alert Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-alert', {
        title: __('Bootstrap Alert', 'bootstrap-theme'),
        description: __('A dismissible Bootstrap alert component', 'bootstrap-theme'),
        icon: 'warning',
        category: 'ileben-landing',
        keywords: [__('alert'), __('bootstrap'), __('message')],
        
        attributes: {
            variant: {
                type: 'string',
                default: 'primary'
            },
            dismissible: {
                type: 'boolean',
                default: false
            },
            heading: {
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

            // Show preview image if this is an example
            if (attributes.preview) {
                return createElement('div', {
                    className: 'bootstrap-alert-preview',
                    style: { textAlign: 'center', padding: '20px' }
                },
                    createElement('img', {
                        src: '/wp-content/themes/bootstrap-theme/blocks/bs-alert/example.png',
                        alt: __('Bootstrap Alert Preview', 'bootstrap-theme'),
                        style: { width: '100%', height: 'auto', maxWidth: '600px' }
                    })
                );
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Alert Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Alert Style', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Success', value: 'success' },
                                { label: 'Danger', value: 'danger' },
                                { label: 'Warning', value: 'warning' },
                                { label: 'Info', value: 'info' },
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' }
                            ],
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Dismissible', 'bootstrap-theme'),
                            checked: attributes.dismissible,
                            onChange: (value) => setAttributes({ dismissible: value })
                        }),
                        createElement(TextControl, {
                            label: __('Alert Heading', 'bootstrap-theme'),
                            value: attributes.heading,
                            onChange: (value) => setAttributes({ heading: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `alert alert-${attributes.variant} ${blockProps.className || ''} ${attributes.dismissible ? 'alert-dismissible' : ''}`,
                        role: 'alert'
                    }),
                    attributes.heading && createElement('h4', { className: 'alert-heading' }, attributes.heading),
                    createElement(InnerBlocks, {
                        placeholder: __('Add alert content...', 'bootstrap-theme')
                    }),
                    attributes.dismissible && createElement('button', {
                        type: 'button',
                        className: 'btn-close',
                        'data-bs-dismiss': 'alert'
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);