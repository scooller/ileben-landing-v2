/**
 * Bootstrap Breadcrumb Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-breadcrumb', {
        title: __('Bootstrap Breadcrumb', 'ileben-landing'),
        description: __('Bootstrap breadcrumb navigation component', 'ileben-landing'),
        icon: 'arrow-right-alt2',
        category: 'ileben-landing',
        keywords: [__('breadcrumb'), __('navigation'), __('bootstrap')],
        
        attributes: {
            separator: {
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
                    className: 'bootstrap-breadcrumb-preview',
                    style: { textAlign: 'center', padding: '20px' }
                },
                    createElement('img', {
                        src: '/wp-content/themes/bootstrap-theme/blocks/bs-breadcrumb/example.png',
                        alt: __('Bootstrap Breadcrumb Preview', 'ileben-landing'),
                        style: { width: '100%', height: 'auto', maxWidth: '600px' }
                    })
                );
            }

            const breadcrumbStyle = attributes.separator ? {
                '--bs-breadcrumb-divider': `'${attributes.separator}'`
            } : {};

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Breadcrumb Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Custom Separator', 'ileben-landing'),
                            help: __('Leave empty for default separator', 'ileben-landing'),
                            value: attributes.separator,
                            onChange: (value) => setAttributes({ separator: value }),
                            placeholder: __('>', 'ileben-landing')
                        })
                    )
                ),
                createElement('nav', 
                    Object.assign({}, blockProps, { 
                        'aria-label': 'breadcrumb',
                        style: breadcrumbStyle
                    }),
                    createElement('ol', { className: 'breadcrumb' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-breadcrumb-item'],
                            template: [
                                ['bootstrap-theme/bs-breadcrumb-item', { text: 'Home', href: '#' }],
                                ['bootstrap-theme/bs-breadcrumb-item', { text: 'Category', href: '#' }],
                                ['bootstrap-theme/bs-breadcrumb-item', { text: 'Current Page', active: true }]
                            ],
                            placeholder: __('Add breadcrumb items...', 'ileben-landing')
                        })
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);