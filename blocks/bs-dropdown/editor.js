/**
 * Bootstrap Dropdown Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-dropdown', {
        title: __('Bootstrap Dropdown', 'bootstrap-theme'),
        description: __('Bootstrap dropdown menu component', 'bootstrap-theme'),
        icon: 'arrow-down-alt2',
        category: 'ileben-landing',
        keywords: [__('dropdown'), __('menu'), __('bootstrap')],
        
        attributes: {
            buttonText: {
                type: 'string',
                default: 'Dropdown button'
            },
            buttonVariant: {
                type: 'string',
                default: 'secondary'
            },
            size: {
                type: 'string',
                default: ''
            },
            split: {
                type: 'boolean',
                default: false
            },
            direction: {
                type: 'string',
                default: 'down'
            },
            alignment: {
                type: 'string',
                default: ''
            },
            menuEnd: {
                type: 'boolean',
                default: false
            },
            autoClose: {
                type: 'string',
                default: 'true'
            },
            dark: {
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-dropdown/example.png',
                    alt: __('Dropdown preview', 'bootstrap-theme'),
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
                { label: 'Dark', value: 'dark' },
                { label: 'Outline Primary', value: 'outline-primary' },
                { label: 'Outline Secondary', value: 'outline-secondary' }
            ];

            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'btn-sm' },
                { label: 'Large', value: 'btn-lg' }
            ];

            const directionOptions = [
                { label: 'Down', value: 'down' },
                { label: 'Up', value: 'up' },
                { label: 'Start', value: 'start' },
                { label: 'End', value: 'end' }
            ];

            const alignmentOptions = [
                { label: 'Default', value: '' },
                { label: 'End', value: 'dropdown-menu-end' }
            ];

            const autoCloseOptions = [
                { label: 'True (Default)', value: 'true' },
                { label: 'Outside', value: 'outside' },
                { label: 'Inside', value: 'inside' },
                { label: 'False', value: 'false' }
            ];

            const dropdownClasses = [
                attributes.direction === 'down' ? 'dropdown' : `drop${attributes.direction}`,
                attributes.direction === 'down' && 'btn-group'
            ].filter(Boolean).join(' ');

            const buttonClasses = [
                'btn',
                `btn-${attributes.buttonVariant}`,
                attributes.size,
                attributes.split ? '' : 'dropdown-toggle'
            ].filter(Boolean).join(' ');

            const menuClasses = [
                'dropdown-menu',
                attributes.alignment,
                attributes.dark ? 'dropdown-menu-dark' : ''
            ].filter(Boolean).join(' ');
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Dropdown Settings', 'bootstrap-theme') },
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
                        }),
                        createElement(SelectControl, {
                            label: __('Size', 'bootstrap-theme'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Direction', 'bootstrap-theme'),
                            value: attributes.direction,
                            options: directionOptions,
                            onChange: (value) => setAttributes({ direction: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Menu Alignment', 'bootstrap-theme'),
                            value: attributes.alignment,
                            options: alignmentOptions,
                            onChange: (value) => setAttributes({ alignment: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Split Button', 'bootstrap-theme'),
                            help: __('Separate button and dropdown toggle', 'bootstrap-theme'),
                            checked: attributes.split,
                            onChange: (value) => setAttributes({ split: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Dark Menu', 'bootstrap-theme'),
                            help: __('Use dark theme for dropdown menu', 'bootstrap-theme'),
                            checked: attributes.dark,
                            onChange: (value) => setAttributes({ dark: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Auto Close', 'bootstrap-theme'),
                            help: __('Configure when dropdown closes', 'bootstrap-theme'),
                            value: attributes.autoClose,
                            options: autoCloseOptions,
                            onChange: (value) => setAttributes({ autoClose: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${dropdownClasses} ${blockProps.className || ''}`.trim()
                    }),
                    // Button(s)
                    attributes.split ? 
                        createElement(Fragment, {},
                            createElement('button', {
                                type: 'button',
                                className: buttonClasses
                            }, attributes.buttonText),
                            createElement('button', {
                                type: 'button',
                                className: `btn btn-${attributes.buttonVariant} ${attributes.size} dropdown-toggle dropdown-toggle-split`.trim(),
                                'data-bs-toggle': 'dropdown',
                                'aria-expanded': 'false'
                            },
                                createElement('span', { className: 'visually-hidden' }, __('Toggle Dropdown', 'bootstrap-theme'))
                            )
                        ) :
                        createElement('button', {
                            className: buttonClasses,
                            type: 'button',
                            'data-bs-toggle': 'dropdown',
                            'aria-expanded': 'false'
                        }, attributes.buttonText),
                    
                    // Dropdown Menu
                    createElement('div', { className: 'mt-2' },
                        createElement('div', { className: 'mb-2' },
                            createElement('small', { className: 'text-muted' },
                                __('Dropdown Menu Preview:', 'bootstrap-theme')
                            )
                        ),
                        createElement('ul', {
                            className: `${menuClasses} show position-static`,
                            style: { display: 'block' }
                        },
                            createElement(InnerBlocks, {
                                allowedBlocks: ['bootstrap-theme/bs-dropdown-item', 'bootstrap-theme/bs-dropdown-divider'],
                                template: [
                                    ['bootstrap-theme/bs-dropdown-item', { text: 'Action' }],
                                    ['bootstrap-theme/bs-dropdown-item', { text: 'Another action' }],
                                    ['bootstrap-theme/bs-dropdown-divider'],
                                    ['bootstrap-theme/bs-dropdown-item', { text: 'Something else here' }]
                                ],
                                placeholder: __('Add dropdown items...', 'bootstrap-theme')
                            })
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