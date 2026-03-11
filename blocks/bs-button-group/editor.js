/**
 * Bootstrap Button Group Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-button-group', {
        apiVersion: 3,
        title: __('Bootstrap Button Group', 'ileben-landing'),
        description: __('Group multiple buttons together', 'ileben-landing'),
        icon: 'editor-justify',
        category: 'ileben-landing',
        keywords: [__('button'), __('group'), __('toolbar')],
        
        attributes: {
            size: {
                type: 'string',
                default: ''
            },
            vertical: {
                type: 'boolean',
                default: false
            },
            toolbar: {
                type: 'boolean',
                default: false
            },
            ariaLabel: {
                type: 'string',
                default: 'Button group'
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
                    className: 'bootstrap-button-group-preview',
                    style: { textAlign: 'center', padding: '20px' }
                },
                    createElement('img', {
                        src: '/wp-content/themes/bootstrap-theme/blocks/bs-button-group/example.png',
                        alt: __('Bootstrap Button Group Preview', 'ileben-landing'),
                        style: { width: '100%', height: 'auto', maxWidth: '600px' }
                    })
                );
            }

            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'btn-group-sm' },
                { label: 'Large', value: 'btn-group-lg' }
            ];

            const groupClasses = [
                attributes.toolbar ? 'btn-toolbar' : (attributes.vertical ? 'btn-group-vertical' : 'btn-group'),
                attributes.size && !attributes.toolbar ? attributes.size : ''
            ].filter(Boolean).join(' ');

            const roleAttribute = attributes.toolbar ? 'toolbar' : 'group';

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Button Group Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Toolbar', 'ileben-landing'),
                            help: __('Combine multiple button groups into a toolbar', 'ileben-landing'),
                            checked: attributes.toolbar,
                            onChange: (value) => setAttributes({ toolbar: value })
                        }),
                        !attributes.toolbar && createElement(ToggleControl, {
                            label: __('Vertical', 'ileben-landing'),
                            help: __('Stack buttons vertically', 'ileben-landing'),
                            checked: attributes.vertical,
                            onChange: (value) => setAttributes({ vertical: value })
                        }),
                        !attributes.toolbar && createElement(SelectControl, {
                            label: __('Size', 'ileben-landing'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        createElement(TextControl, {
                            label: __('ARIA Label', 'ileben-landing'),
                            help: __('Accessibility label for the button group', 'ileben-landing'),
                            value: attributes.ariaLabel,
                            onChange: (value) => setAttributes({ ariaLabel: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${groupClasses} ${blockProps.className || ''}`.trim(),
                        role: roleAttribute,
                        'aria-label': attributes.ariaLabel
                    }),
                    createElement(InnerBlocks, {
                        allowedBlocks: attributes.toolbar ? 
                            ['bootstrap-theme/bs-button-group', 'bootstrap-theme/bs-button'] : 
                            ['bootstrap-theme/bs-button'],
                        template: attributes.toolbar ? [
                            ['bootstrap-theme/bs-button-group'],
                            ['bootstrap-theme/bs-button-group']
                        ] : [
                            ['bootstrap-theme/bs-button', { text: 'Left', variant: 'outline-primary' }],
                            ['bootstrap-theme/bs-button', { text: 'Middle', variant: 'outline-primary' }],
                            ['bootstrap-theme/bs-button', { text: 'Right', variant: 'outline-primary' }]
                        ],
                        placeholder: attributes.toolbar ? 
                            __('Add button groups...', 'ileben-landing') :
                            __('Add buttons to group...', 'ileben-landing')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);