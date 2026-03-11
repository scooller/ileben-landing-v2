/**
 * Bootstrap Tabs Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-tabs', {
        title: __('Bootstrap Tabs', 'ileben-landing'),
        description: __('Bootstrap tabs navigation component', 'ileben-landing'),
        icon: 'index-card',
        category: 'ileben-landing',
        keywords: [__('tabs'), __('navigation'), __('bootstrap')],
        
        attributes: {
            tabsId: {
                type: 'string',
                default: ''
            },
            variant: {
                type: 'string',
                default: 'tabs'
            },
            justified: {
                type: 'boolean',
                default: false
            },
            vertical: {
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-tabs/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            // Generate unique ID if not set
            if (!attributes.tabsId) {
                setAttributes({ tabsId: `tabs-${clientId}` });
            }
            const variantOptions = [
                { label: 'Tabs', value: 'tabs' },
                { label: 'Pills', value: 'pills' },
                { label: 'Underline', value: 'underline' }
            ];

            const navClasses = [
                'nav',
                `nav-${attributes.variant}`,
                attributes.justified ? 'nav-justified' : '',
                attributes.vertical ? 'flex-column' : ''
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Tabs Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Tabs ID', 'ileben-landing'),
                            value: attributes.tabsId,
                            onChange: (value) => setAttributes({ tabsId: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Variant', 'ileben-landing'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Justified', 'ileben-landing'),
                            help: __('Make tabs fill available width', 'ileben-landing'),
                            checked: attributes.justified,
                            onChange: (value) => setAttributes({ justified: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Vertical', 'ileben-landing'),
                            help: __('Stack tabs vertically', 'ileben-landing'),
                            checked: attributes.vertical,
                            onChange: (value) => setAttributes({ vertical: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', {
                        className: attributes.vertical ? 'd-flex' : ''
                    },
                        // Tab Navigation (Preview)
                        createElement('ul', {
                            className: navClasses,
                            id: attributes.tabsId,
                            role: 'tablist'
                        },
                            createElement('li', { className: 'nav-item', role: 'presentation' },
                                createElement('button', {
                                    className: 'nav-link active',
                                    type: 'button',
                                    role: 'tab'
                                }, __('Tab 1', 'ileben-landing'))
                            ),
                            createElement('li', { className: 'nav-item', role: 'presentation' },
                                createElement('button', {
                                    className: 'nav-link',
                                    type: 'button',
                                    role: 'tab'
                                }, __('Tab 2', 'ileben-landing'))
                            )
                        ),
                        
                        // Tab Content
                        createElement('div', {
                            className: `tab-content${attributes.vertical ? ' flex-grow-1' : ''}`,
                            id: `${attributes.tabsId}-content`
                        },
                            createElement(InnerBlocks, {
                                allowedBlocks: ['bootstrap-theme/bs-tab-pane'],
                                template: [
                                    ['bootstrap-theme/bs-tab-pane', { title: 'Tab 1', active: true }],
                                    ['bootstrap-theme/bs-tab-pane', { title: 'Tab 2' }]
                                ],
                                placeholder: __('Add tab panes...', 'ileben-landing')
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