/**
 * Bootstrap Accordion Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-accordion', {
        apiVersion: 3,
        title: __('Bootstrap Accordion', 'ileben-landing'),
        description: __('Bootstrap accordion component', 'ileben-landing'),
        icon: 'list-view',
        category: 'ileben-landing',
        keywords: [__('accordion'), __('bootstrap'), __('collapse')],
        
        attributes: {
            alwaysOpen: {
                type: 'boolean',
                default: false
            },
            flush: {
                type: 'boolean',
                default: false
            },
            accordionId: {
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            
            // Show preview image if this is an example
            if (attributes.preview) {
                return createElement('div', {
                    className: 'bootstrap-accordion-preview',
                    style: { textAlign: 'center', padding: '20px' }
                },
                    createElement('img', {
                        src: '/wp-content/themes/bootstrap-theme/blocks/bs-accordion/example.png',
                        alt: __('Bootstrap Accordion Preview', 'ileben-landing'),
                        style: { width: '100%', height: 'auto', maxWidth: '600px' }
                    })
                );
            }
            
            // Generate unique ID if not set
            if (!attributes.accordionId) {
                setAttributes({ accordionId: `accordion-${clientId}` });
            }
            
            const accordionClass = `accordion${attributes.flush ? ' accordion-flush' : ''}`;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Accordion Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Always Open', 'ileben-landing'),
                            help: __('Allow multiple items to be open simultaneously', 'ileben-landing'),
                            checked: attributes.alwaysOpen,
                            onChange: (value) => setAttributes({ alwaysOpen: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Flush', 'ileben-landing'),
                            help: __('Remove borders and rounded corners', 'ileben-landing'),
                            checked: attributes.flush,
                            onChange: (value) => setAttributes({ flush: value })
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Accordion ID', 'ileben-landing'),
                            value: attributes.accordionId,
                            onChange: (value) => setAttributes({ accordionId: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${accordionClass} ${blockProps.className || ''}`.trim(),
                        id: attributes.accordionId
                    }),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['bootstrap-theme/bs-accordion-item'],
                        template: [
                            ['bootstrap-theme/bs-accordion-item', { title: 'Accordion Item 1' }],
                            ['bootstrap-theme/bs-accordion-item', { title: 'Accordion Item 2' }]
                        ],
                        placeholder: __('Add accordion items...', 'ileben-landing')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);