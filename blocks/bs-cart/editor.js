/**
 * Bootstrap Cart Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-cart', {
        title: __('Bootstrap Shopping Cart', 'bootstrap-theme'),
        description: __('Display WooCommerce shopping cart with automatic checkout updates', 'bootstrap-theme'),
        icon: 'cart',
        category: 'ileben-landing',
        keywords: [__('cart'), __('woocommerce'), __('shopping')],
        
        attributes: {
            showEmptyMessage: {
                type: 'boolean',
                default: true
            },
            showTotals: {
                type: 'boolean',
                default: true
            },
            showButtons: {
                type: 'boolean',
                default: true
            }
        },
        
        supports: {
            align: true,
            className: true,
            anchor: true
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Cart Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Show Empty Cart Message', 'bootstrap-theme'),
                            checked: attributes.showEmptyMessage,
                            onChange: (value) => setAttributes({ showEmptyMessage: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Totals', 'bootstrap-theme'),
                            checked: attributes.showTotals,
                            onChange: (value) => setAttributes({ showTotals: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Cart & Checkout Buttons', 'bootstrap-theme'),
                            checked: attributes.showButtons,
                            onChange: (value) => setAttributes({ showButtons: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `bs-cart-editor ${blockProps.className || ''}`
                    }),
                    createElement('div', { className: 'p-3 bg-light border rounded' },
                        createElement('div', { className: 'mb-2' },
                            createElement('strong', null, '🛒 ' + __('Shopping Cart Block', 'bootstrap-theme'))
                        ),
                        createElement('p', { style: { margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' } },
                            __('This block displays the WooCommerce shopping cart on the frontend.', 'bootstrap-theme')
                        ),
                        createElement('p', { style: { margin: '0.5rem 0', fontSize: '0.85rem', color: '#999' } },
                            __('The cart will appear here when visitors add products.', 'bootstrap-theme')
                        ),
                        createElement('div', { className: 'mt-3 pt-3 border-top' },
                            createElement('div', { style: { fontSize: '0.85rem' } },
                                createElement('div', { style: { margin: '0.25rem 0' } },
                                    (attributes.showEmptyMessage ? '✓' : '✗') + ' ' + __('Empty message', 'bootstrap-theme')
                                ),
                                createElement('div', { style: { margin: '0.25rem 0' } },
                                    (attributes.showTotals ? '✓' : '✗') + ' ' + __('Show totals', 'bootstrap-theme')
                                ),
                                createElement('div', { style: { margin: '0.25rem 0' } },
                                    (attributes.showButtons ? '✓' : '✗') + ' ' + __('Show buttons', 'bootstrap-theme')
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
