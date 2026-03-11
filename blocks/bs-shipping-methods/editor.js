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
        title: __('Bootstrap Shipping Methods', 'ileben-landing'),
        description: __('Display WooCommerce shipping methods with radio or select options', 'ileben-landing'),
        icon: 'cart',
        category: 'ileben-landing',
        keywords: [__('shipping'), __('env├¡o'), __('m├®todos'), __('woocommerce')],
        
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
                default: 'M├®todos de env├¡o'
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
                    createElement(PanelBody, { title: __('Configuraci├│n', 'ileben-landing'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Tipo de visualizaci├│n', 'ileben-landing'),
                            value: displayType,
                            options: [
                                { label: __('Radio Buttons', 'ileben-landing'), value: 'radio' },
                                { label: __('Select Dropdown', 'ileben-landing'), value: 'select' }
                            ],
                            onChange: (value) => setAttributes({ displayType: value }),
                            help: __('C├│mo mostrar las opciones de env├¡o', 'ileben-landing')
                        }),
                        createElement(TextControl, {
                            label: __('T├¡tulo', 'ileben-landing'),
                            value: title,
                            onChange: (value) => setAttributes({ title: value }),
                            help: __('T├¡tulo que aparece sobre los m├®todos de env├¡o', 'ileben-landing')
                        }),
                        displayType === 'radio' && createElement(Fragment, {},
                            createElement(ToggleControl, {
                                label: __('Mostrar icono', 'ileben-landing'),
                                checked: showIcon,
                                onChange: (value) => setAttributes({ showIcon: value }),
                                help: __('Mostrar icono de cami├│n junto al nombre', 'ileben-landing')
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
                            __('Vista previa: M├®todos de Env├¡o', 'ileben-landing')
                        ),
                        createElement('p', { className: 'mb-2' },
                            __('Este bloque mostrar├í los m├®todos de env├¡o disponibles de WooCommerce cuando el carrito tenga productos.', 'ileben-landing')
                        ),
                        createElement('hr'),
                        createElement('div', { className: 'mb-0' },
                            createElement('strong', {}, __('Configuraci├│n actual:', 'ileben-landing')),
                            createElement('ul', { className: 'mb-0 mt-2' },
                                createElement('li', {},
                                    createElement('strong', {}, __('Visualizaci├│n:', 'ileben-landing')),
                                    ' ',
                                    displayType === 'radio' ? __('Radio Buttons', 'ileben-landing') : __('Select Dropdown', 'ileben-landing')
                                ),
                                title && createElement('li', {},
                                    createElement('strong', {}, __('T├¡tulo:', 'ileben-landing')),
                                    ' ',
                                    title
                                ),
                                displayType === 'radio' && createElement(Fragment, {},
                                    createElement('li', {},
                                        createElement('strong', {}, __('Icono:', 'ileben-landing')),
                                        ' ',
                                        showIcon ? __('S├¡', 'ileben-landing') : __('No', 'ileben-landing')
                                    )
                                )
                            )
                        )
                    ),
                    title && createElement('h5', { className: 'shipping-title mb-3' }, title),
                    displayType === 'select' ? 
                        createElement('select', { className: 'form-select', disabled: true },
                            createElement('option', {}, __('Blue Express (Standard): $4.201', 'ileben-landing')),
                            createElement('option', {}, __('Starken (Normal a agencia): $5.560', 'ileben-landing'))
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
                                            __('Blue Express (Standard)', 'ileben-landing')
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
                                            __('Starken (Normal a agencia)', 'ileben-landing')
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