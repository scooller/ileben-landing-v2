/**
 * Bootstrap Menu Block Editor
 */

(function(blocks, element, components, blockEditor, data) {
    const { registerBlockType } = blocks;
    const { createElement: el, Fragment, useState, useEffect } = element;
    const { 
        PanelBody, 
        SelectControl, 
        ToggleControl, 
        RadioControl,
        TextControl,
        Notice 
    } = components;
    const { InspectorControls, useBlockProps } = blockEditor;
    const { useSelect } = data;

    registerBlockType('bootstrap-theme/bs-menu', {
        title: 'Bootstrap Menu',
        description: 'Display WordPress menus with Bootstrap styling (Nav, List Group, Button Group)',
        icon: 'menu',
        category: 'ileben-landing',
        keywords: ['menu', 'navigation', 'bootstrap', 'nav', 'list', 'button'],
        
        attributes: {
            menuId: {
                type: 'string',
                default: ''
            },
            style: {
                type: 'string',
                default: 'nav'
            },
            orientation: {
                type: 'string',
                default: 'horizontal'
            },
            variant: {
                type: 'string',
                default: 'primary'
            },
            size: {
                type: 'string',
                default: ''
            },
            justified: {
                type: 'boolean',
                default: false
            },
            fill: {
                type: 'boolean',
                default: false
            },
            dividers: {
                type: 'boolean',
                default: false
            },
            activeClass: {
                type: 'string',
                default: 'active'
            },
            alignment: {
                type: 'string',
                default: ''
            },
            textAlign: {
                type: 'string',
                default: ''
            },
            className: {
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
            const { 
                menuId, 
                style, 
                orientation, 
                variant, 
                size, 
                justified, 
                fill, 
                dividers, 
                activeClass, 
                alignment,
                textAlign 
            } = attributes;

            if (attributes.preview) {
                return el('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-menu/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            // Get available menus
            const menus = useSelect((select) => {
                return select('core').getEntityRecords('taxonomy', 'nav_menu');
            }, []);

            const blockProps = useBlockProps({
                className: `bootstrap-menu-block style-${style} orientation-${orientation}`
            });

            // Build menu options
            const menuOptions = [
                { label: 'Select a menu...', value: '' }
            ];

            if (menus) {
                menus.forEach(menu => {
                    menuOptions.push({
                        label: menu.name,
                        value: menu.id.toString()
                    });
                });
            }

            // Style options
            const styleOptions = [
                { label: 'Nav (ul/li)', value: 'nav' },
                { label: 'List Group', value: 'list-group' },
                { label: 'Button Group', value: 'button-group' }
            ];

            // Variant options for button group
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

            // Size options for button group
            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'sm' },
                { label: 'Large', value: 'lg' }
            ];

            // Alignment options
            const alignmentOptions = [
                { label: 'Start (Default)', value: '' },
                { label: 'Center', value: 'center' },
                { label: 'End', value: 'end' }
            ];

            // Text alignment options
            const textAlignOptions = [
                { label: 'Default', value: '' },
                { label: 'Izquierda', value: 'left' },
                { label: 'Centrado', value: 'center' },
                { label: 'Derecha', value: 'right' },
                { label: 'Justificado', value: 'justify' }
            ];

            return el(
                Fragment,
                {},
                // Inspector Controls
                el(InspectorControls, {},
                    // Menu Selection
                    el(PanelBody, { title: 'Menu Settings', initialOpen: true },
                        el(SelectControl, {
                            label: 'Select Menu',
                            value: menuId,
                            options: menuOptions,
                            onChange: (value) => setAttributes({ menuId: value }),
                            help: 'Choose a WordPress menu to display'
                        }),
                        
                        el(SelectControl, {
                            label: 'Style',
                            value: style,
                            options: styleOptions,
                            onChange: (value) => setAttributes({ style: value }),
                            help: 'Choose how to style the menu'
                        }),

                        el(RadioControl, {
                            label: 'Orientation',
                            selected: orientation,
                            options: [
                                { label: 'Horizontal', value: 'horizontal' },
                                { label: 'Vertical', value: 'vertical' }
                            ],
                            onChange: (value) => setAttributes({ orientation: value })
                        })
                    ),

                    // Style-specific options
                    style === 'button-group' && el(PanelBody, { title: 'Button Group Options', initialOpen: true },
                        el(SelectControl, {
                            label: 'Button Variant',
                            value: variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),

                        el(SelectControl, {
                            label: 'Button Size',
                            value: size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        })
                    ),

                    style === 'nav' && el(PanelBody, { title: 'Nav Options', initialOpen: true },
                        el(ToggleControl, {
                            label: 'Justified',
                            checked: justified,
                            onChange: (value) => setAttributes({ justified: value }),
                            help: 'Make nav links take up all available width'
                        }),

                        el(ToggleControl, {
                            label: 'Fill',
                            checked: fill,
                            onChange: (value) => setAttributes({ fill: value }),
                            help: 'Force nav content to extend the full available width'
                        })
                    ),

                    style === 'list-group' && el(PanelBody, { title: 'List Group Options', initialOpen: true },
                        el(ToggleControl, {
                            label: 'Dividers',
                            checked: dividers,
                            onChange: (value) => setAttributes({ dividers: value }),
                            help: 'Add dividers between list items'
                        })
                    ),

                    // Appearance Options
                    el(PanelBody, { title: 'Appearance', initialOpen: false },
                        orientation === 'horizontal' && el(SelectControl, {
                            label: 'Alignment',
                            value: alignment,
                            options: alignmentOptions,
                            onChange: (value) => setAttributes({ alignment: value })
                        }),

                        el(SelectControl, {
                            label: 'Alineación del Texto',
                            value: textAlign,
                            options: textAlignOptions,
                            onChange: (value) => setAttributes({ textAlign: value }),
                            help: 'Alineación del texto dentro de los elementos del menú'
                        }),

                        el(TextControl, {
                            label: 'Active Class',
                            value: activeClass,
                            onChange: (value) => setAttributes({ activeClass: value }),
                            help: 'CSS class for active/current menu items'
                        })
                    )
                ),

                // Block Preview
                el('div', blockProps,
                    !menuId && el(Notice, {
                        status: 'warning',
                        isDismissible: false
                    }, 'Please select a menu to display in the sidebar settings.'),

                    menuId && el('div', {
                        className: `bootstrap-menu-preview ${style} ${orientation}`
                    },
                        el('div', { className: 'menu-preview-header' },
                            el('strong', {}, 'Bootstrap Menu Preview'),
                            el('br'),
                            el('small', {}, `Style: ${style} | Orientation: ${orientation}`)
                        ),
                        
                        el('div', { 
                            className: `menu-preview-content mt-3`,
                            style: {
                                padding: '1rem',
                                border: '2px dashed #ccc',
                                borderRadius: '4px',
                                background: '#f8f9fa'
                            }
                        },
                            style === 'nav' && el('ul', { className: `nav ${orientation === 'vertical' ? 'flex-column' : ''} ${justified ? 'nav-justified' : ''} ${fill ? 'nav-fill' : ''}` },
                                el('li', { className: 'nav-item' },
                                    el('a', { className: `nav-link ${activeClass}`, href: '#' }, 'Home')
                                ),
                                el('li', { className: 'nav-item' },
                                    el('a', { className: 'nav-link', href: '#' }, 'About')
                                ),
                                el('li', { className: 'nav-item' },
                                    el('a', { className: 'nav-link', href: '#' }, 'Services')
                                ),
                                el('li', { className: 'nav-item' },
                                    el('a', { className: 'nav-link', href: '#' }, 'Contact')
                                )
                            ),

                            style === 'list-group' && el('div', { className: `list-group ${orientation === 'horizontal' ? 'list-group-horizontal' : ''}` },
                                el('a', { className: `list-group-item list-group-item-action ${activeClass}`, href: '#' }, 'Home'),
                                dividers && el('div', { className: 'list-group-item list-group-item-divider p-0 border-0' }),
                                el('a', { className: 'list-group-item list-group-item-action', href: '#' }, 'About'),
                                dividers && el('div', { className: 'list-group-item list-group-item-divider p-0 border-0' }),
                                el('a', { className: 'list-group-item list-group-item-action', href: '#' }, 'Services'),
                                dividers && el('div', { className: 'list-group-item list-group-item-divider p-0 border-0' }),
                                el('a', { className: 'list-group-item list-group-item-action', href: '#' }, 'Contact')
                            ),

                            style === 'button-group' && el('div', { 
                                className: `btn-group ${orientation === 'vertical' ? 'btn-group-vertical' : ''}`,
                                role: 'group'
                            },
                                el('a', { className: `btn btn-${variant} ${size ? `btn-${size}` : ''}`, href: '#' }, 'Home'),
                                el('a', { className: `btn btn-${variant} ${size ? `btn-${size}` : ''}`, href: '#' }, 'About'),
                                el('a', { className: `btn btn-${variant} ${size ? `btn-${size}` : ''}`, href: '#' }, 'Services'),
                                el('a', { className: `btn btn-${variant} ${size ? `btn-${size}` : ''}`, href: '#' }, 'Contact')
                            )
                        )
                    )
                )
            );
        },

        save: function() {
            // This is a dynamic block, so save returns null
            return null;
        }
    });

})(
    window.wp.blocks,
    window.wp.element,
    window.wp.components,
    window.wp.blockEditor,
    window.wp.data
);