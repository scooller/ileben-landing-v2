/**
 * Bootstrap Column Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-column', {
        title: __('Bootstrap Column', 'bootstrap-theme'),
        description: __('Bootstrap column for grid layout', 'bootstrap-theme'),
        icon: 'columns',
        category: 'ileben-landing',
        keywords: [__('column'), __('bootstrap'), __('grid')],
        parent: ['bootstrap-theme/bs-row'],
        
        attributes: {
            colXs: {
                type: 'string',
                default: ''
            },
            colSm: {
                type: 'string',
                default: ''
            },
            colMd: {
                type: 'string',
                default: ''
            },
            colLg: {
                type: 'string',
                default: ''
            },
            colXl: {
                type: 'string',
                default: ''
            },
            colXxl: {
                type: 'string',
                default: ''
            },
            offset: {
                type: 'string',
                default: ''
            },
            order: {
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-column/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const columnOptions = [
                { label: 'Auto', value: '' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' }
            ];

            const offsetOptions = [
                { label: 'None', value: '' },
                { label: '1', value: 'offset-1' },
                { label: '2', value: 'offset-2' },
                { label: '3', value: 'offset-3' },
                { label: '4', value: 'offset-4' },
                { label: '5', value: 'offset-5' },
                { label: '6', value: 'offset-6' },
                { label: '7', value: 'offset-7' },
                { label: '8', value: 'offset-8' },
                { label: '9', value: 'offset-9' },
                { label: '10', value: 'offset-10' },
                { label: '11', value: 'offset-11' }
            ];

            const orderOptions = [
                { label: 'None', value: '' },
                { label: 'First', value: 'order-first' },
                { label: '1', value: 'order-1' },
                { label: '2', value: 'order-2' },
                { label: '3', value: 'order-3' },
                { label: '4', value: 'order-4' },
                { label: '5', value: 'order-5' },
                { label: 'Last', value: 'order-last' }
            ];

            const buildColumnClass = () => {
                let classes = ['col'];
                if (attributes.colXs) classes.push(`col-${attributes.colXs}`);
                if (attributes.colSm) classes.push(`col-sm-${attributes.colSm}`);
                if (attributes.colMd) classes.push(`col-md-${attributes.colMd}`);
                if (attributes.colLg) classes.push(`col-lg-${attributes.colLg}`);
                if (attributes.colXl) classes.push(`col-xl-${attributes.colXl}`);
                if (attributes.colXxl) classes.push(`col-xxl-${attributes.colXxl}`);
                if (attributes.offset) classes.push(attributes.offset);
                if (attributes.order) classes.push(attributes.order);
                return classes.join(' ');
            };
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Column Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('XS (Mobile/All)', 'bootstrap-theme'),
                            value: attributes.colXs,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXs: value })
                        }),
                        createElement(SelectControl, {
                            label: __('SM (Tablet)', 'bootstrap-theme'),
                            value: attributes.colSm,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colSm: value })
                        }),
                        createElement(SelectControl, {
                            label: __('MD (Desktop)', 'bootstrap-theme'),
                            value: attributes.colMd,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colMd: value })
                        }),
                        createElement(SelectControl, {
                            label: __('LG (Large)', 'bootstrap-theme'),
                            value: attributes.colLg,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colLg: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XL (Extra Large)', 'bootstrap-theme'),
                            value: attributes.colXl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('XXL (Extra Extra Large)', 'bootstrap-theme'),
                            value: attributes.colXxl,
                            options: columnOptions,
                            onChange: (value) => setAttributes({ colXxl: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Offset', 'bootstrap-theme'),
                            value: attributes.offset,
                            options: offsetOptions,
                            onChange: (value) => setAttributes({ offset: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Order', 'bootstrap-theme'),
                            value: attributes.order,
                            options: orderOptions,
                            onChange: (value) => setAttributes({ order: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        className: `${buildColumnClass()} ${blockProps.className || ''}`.trim()
                    }),
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to column...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);