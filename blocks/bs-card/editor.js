/**
 * Bootstrap Card Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-card', {
        title: __('Bootstrap Card', 'bootstrap-theme'),
        description: __('A flexible Bootstrap card component', 'bootstrap-theme'),
        icon: 'admin-page',
        category: 'ileben-landing',
        keywords: [__('card'), __('bootstrap'), __('container')],
        
        attributes: {
            hasHeader: {
                type: 'boolean',
                default: false
            },
            hasFooter: {
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-card/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Card Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Show Header', 'bootstrap-theme'),
                            checked: attributes.hasHeader,
                            onChange: (value) => setAttributes({ hasHeader: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Footer', 'bootstrap-theme'),
                            checked: attributes.hasFooter,
                            onChange: (value) => setAttributes({ hasFooter: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `card ${blockProps.className || ''}`
                    }),
                    createElement(InnerBlocks, {
                        template: [
                            ['core/image'],
                            ['core/heading', { level: 5, placeholder: 'Card title' }],
                            ['core/paragraph', { placeholder: 'Card content...' }]
                        ],
                        templateLock: false
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);