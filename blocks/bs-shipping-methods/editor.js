/**
 * Bootstrap Shipping Methods Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, BlockControls, BlockAlignmentToolbar } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-shipping-methods', {
        title: __('Bootstrap Shipping Methods', 'bootstrap-theme'),
        description: __('Display WooCommerce shipping methods with radio or select options', 'bootstrap-theme'),
        icon: 'cart',
        category: 'ileben-landing',
        keywords: [__('shipping'), __('envío'), __('métodos'), __('woocommerce')],
        
        attributes: {
            displayType: {
                type: 'string',
                default: 'radio'
            },
            showIcon: {
                type: 'boolean',
                default: true
            },
            title: {
                type: 'string',
                default: 'Métodos de envío'
            },
            alignment: {
                type: 'string',
                default: ''
            },
            className: {
                type: 'string',
                default: ''
            }
        },
        
        supports: {
            align: ['wide', 'full'],
            className: true,
            anchor: true,
            spacing: {
                margin: true,
                padding: true
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { displayType, showIcon, title, alignment } = attributes;
            const blockProps = useBlockProps({
                className: `bs-shipping-methods ${alignment ? `text-${alignment}` : ''}`
            });
            
            return createElement(Fragment, {},
                createElement(BlockControls, {},
                    createElement(BlockAlignmentToolbar, {
                        value: alignment,
                        onChange: (newAlignment) => setAttributes({ alignment: newAlignment }),
                        controls: ['left', 'center', 'right']
                    })
                ),
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'bootstrap-theme'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Tipo de visualización', 'bootstrap-theme'),
                            value: displayType,
                            options: [
                                { label: __('Radio Buttons', 'bootstrap-theme'), value: 'radio' },
                                { label: __('Select Dropdown', 'bootstrap-theme'), value: 'select' }
                            ],
                            onChange: (value) => setAttributes({ displayType: value }),
                            help: __('Cómo mostrar las opciones de envío', 'bootstrap-theme')
                        }),
                        createElement(TextControl, {
                            label: __('Título', 'bootstrap-theme'),
                            value: title,
                            onChange: (value) => setAttributes({ title: value }),
                            help: __('Título que aparece sobre los métodos de envío', 'bootstrap-theme')
                        }),
                        displayType === 'radio' && createElement(Fragment, {},
                            createElement(ToggleControl, {
                                label: __('Mostrar icono', 'bootstrap-theme'),
                                checked: showIcon,
                                onChange: (value) => setAttributes({ showIcon: value }),
                                help: __('Mostrar icono de camión junto al nombre', 'bootstrap-theme')
                            })
                        )
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'alert alert-info', role: 'alert' },
                        createElement('h5', { className: 'alert-heading mb-2' },
                            createElement('svg', { 
                                className: 'icon me-2', 
                                style: { width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' },
                                dangerouslySetInnerHTML: { __html: '<use xlink:href="#fa-truck"></use>' }
                            }),
                            __('Vista previa: Métodos de Envío', 'bootstrap-theme')
                        ),
                        createElement('p', { className: 'mb-2' },
                            __('Este bloque mostrará los métodos de envío disponibles de WooCommerce cuando el carrito tenga productos.', 'bootstrap-theme')
                        ),
                        createElement('hr'),
                        createElement('div', { className: 'mb-0' },
                            createElement('strong', {}, __('Configuración actual:', 'bootstrap-theme')),
                            createElement('ul', { className: 'mb-0 mt-2' },
                                createElement('li', {},
                                    createElement('strong', {}, __('Visualización:', 'bootstrap-theme')),
                                    ' ',
                                    displayType === 'radio' ? __('Radio Buttons', 'bootstrap-theme') : __('Select Dropdown', 'bootstrap-theme')
                                ),
                                title && createElement('li', {},
                                    createElement('strong', {}, __('Título:', 'bootstrap-theme')),
                                    ' ',
                                    title
                                ),
                                displayType === 'radio' && createElement(Fragment, {},
                                    createElement('li', {},
                                        createElement('strong', {}, __('Icono:', 'bootstrap-theme')),
                                        ' ',
                                        showIcon ? __('Sí', 'bootstrap-theme') : __('No', 'bootstrap-theme')
                                    )
                                )
                            )
                        )
                    ),
                    title && createElement('h5', { className: 'shipping-title mb-3' }, title),
                    displayType === 'select' ? 
                        createElement('select', { className: 'form-select', disabled: true },
                            createElement('option', {}, __('Blue Express (Standard): $4.201', 'bootstrap-theme')),
                            createElement('option', {}, __('Starken (Normal a agencia): $5.560', 'bootstrap-theme'))
                        )
                    :
                        createElement('div', { className: 'shipping-radio-wrapper' },
                            createElement('div', { className: 'form-check shipping-method-option mb-2' },
                                createElement('input', { 
                                    className: 'form-check-input', 
                                    type: 'radio', 
                                    name: 'preview_shipping', 
                                    id: 'preview_shipping_1', 
                                    checked: true, 
                                    disabled: true 
                                }),
                                createElement('label', { className: 'form-check-label w-100', htmlFor: 'preview_shipping_1' },
                                    createElement('div', { className: 'd-flex justify-content-between align-items-center' },
                                        createElement('span', { className: 'shipping-method-name' },
                                            showIcon && createElement('svg', { 
                                                className: 'icon me-2', 
                                                style: { width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' },
                                                dangerouslySetInnerHTML: { __html: '<use xlink:href="#fa-truck"></use>' }
                                            }),
                                            __('Blue Express (Standard)', 'bootstrap-theme')
                                        ),
                                        createElement('span', { className: 'shipping-method-cost fw-bold' }, '$4.201')
                                    )
                                )
                            ),
                            createElement('div', { className: 'form-check shipping-method-option mb-2' },
                                createElement('input', { 
                                    className: 'form-check-input', 
                                    type: 'radio', 
                                    name: 'preview_shipping', 
                                    id: 'preview_shipping_2', 
                                    disabled: true 
                                }),
                                createElement('label', { className: 'form-check-label w-100', htmlFor: 'preview_shipping_2' },
                                    createElement('div', { className: 'd-flex justify-content-between align-items-center' },
                                        createElement('span', { className: 'shipping-method-name' },
                                            showIcon && createElement('svg', { 
                                                className: 'icon me-2', 
                                                style: { width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' },
                                                dangerouslySetInnerHTML: { __html: '<use xlink:href="#fa-truck"></use>' }
                                            }),
                                            __('Starken (Normal a agencia)', 'bootstrap-theme')
                                        ),
                                        createElement('span', { className: 'shipping-method-cost fw-bold' }, '$5.560')
                                    )
                                )
                            )
                        )
                )
            );
        },

        save: function() {
            return null;
        }
    });

})(window.wp);
