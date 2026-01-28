/**
 * Bootstrap Row Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-row', {
        title: __('Bootstrap Row', 'bootstrap-theme'),
        description: __('Bootstrap row for grid layout', 'bootstrap-theme'),
        icon: 'editor-table',
        category: 'ileben-landing',
        keywords: [__('row'), __('bootstrap'), __('grid')],
        
        attributes: {
            gutters: {
                type: 'string',
                default: ''
            },
            noGutters: {
                type: 'boolean',
                default: false
            },
            justifyContent: {
                type: 'string',
                default: ''
            },
            alignItems: {
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
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-row/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const gutterOptions = [
                { label: 'Default', value: '' },
                { label: 'No Gutters', value: 'g-0' },
                { label: 'Small Gutters', value: 'g-md-1' },
                { label: 'Medium Gutters', value: 'g-md-3' },
                { label: 'Large Gutters', value: 'g-md-5' }
            ];

            const justifyOptions = [
                { label: 'Default', value: '' },
                { label: 'Start', value: 'justify-content-start' },
                { label: 'Center', value: 'justify-content-center' },
                { label: 'End', value: 'justify-content-end' },
                { label: 'Around', value: 'justify-content-around' },
                { label: 'Between', value: 'justify-content-between' },
                { label: 'Evenly', value: 'justify-content-evenly' }
            ];

            const alignOptions = [
                { label: 'Default', value: '' },
                { label: 'Start', value: 'align-items-start' },
                { label: 'Center', value: 'align-items-center' },
                { label: 'End', value: 'align-items-end' },
                { label: 'Baseline', value: 'align-items-baseline' },
                { label: 'Stretch', value: 'align-items-stretch' }
            ];
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Row Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Gutters', 'bootstrap-theme'),
                            value: attributes.gutters,
                            options: gutterOptions,
                            onChange: (value) => setAttributes({ gutters: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Justify Content', 'bootstrap-theme'),
                            value: attributes.justifyContent,
                            options: justifyOptions,
                            onChange: (value) => setAttributes({ justifyContent: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Align Items', 'bootstrap-theme'),
                            value: attributes.alignItems,
                            options: alignOptions,
                            onChange: (value) => setAttributes({ alignItems: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `row ${attributes.gutters} ${attributes.justifyContent} ${attributes.alignItems} ${blockProps.className || ''}`.trim()
                    }),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['bootstrap-theme/bs-column'],
                        template: [
                            ['bootstrap-theme/bs-column'],
                            ['bootstrap-theme/bs-column']
                        ],
                        placeholder: __('Add columns to row...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);