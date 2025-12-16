/**
 * Bootstrap Tab Pane Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-tab-pane', {
        title: __('Bootstrap Tab Pane', 'bootstrap-theme'),
        description: __('Individual tab pane content', 'bootstrap-theme'),
        icon: 'media-document',
        category: 'ileben-landing',
        keywords: [__('tab'), __('pane'), __('bootstrap')],
        parent: ['bootstrap-theme/bs-tabs'],
        
        attributes: {
            title: {
                type: 'string',
                default: 'Tab'
            },
            active: {
                type: 'boolean',
                default: false
            },
            paneId: {
                type: 'string',
                default: ''
            },
            fade: {
                type: 'boolean',
                default: true
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-tab-pane/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            // Generate unique ID if not set
            if (!attributes.paneId) {
                setAttributes({ paneId: `pane-${clientId}` });
            }
            const paneClasses = [
                'tab-pane',
                attributes.fade ? 'fade' : '',
                attributes.active ? 'show active' : ''
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Tab Pane Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Tab Title', 'bootstrap-theme'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Active Tab', 'bootstrap-theme'),
                            help: __('Set as the default active tab', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Fade Effect', 'bootstrap-theme'),
                            help: __('Enable fade transition effect', 'bootstrap-theme'),
                            checked: attributes.fade,
                            onChange: (value) => setAttributes({ fade: value })
                        }),
                        createElement(TextControl, {
                            label: __('Pane ID', 'bootstrap-theme'),
                            value: attributes.paneId,
                            onChange: (value) => setAttributes({ paneId: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${paneClasses} ${blockProps.className || ''}`.trim(),
                        id: attributes.paneId,
                        role: 'tabpanel'
                    }),
                    createElement('div', { className: 'tab-title-editor mb-3 p-2 bg-light border' },
                        createElement('strong', {}, __('Tab Title: ', 'bootstrap-theme')),
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value }),
                            placeholder: __('Tab title...', 'bootstrap-theme'),
                            style: { display: 'inline' }
                        })
                    ),
                    createElement(InnerBlocks, {
                        placeholder: __('Add tab content...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);