/**
 * Card Group Block Editor
 *
 * Container for cards: card-group or row-cols-* layout.
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    const layoutOptions = [
        { label: __('Grid (row-cols-*)', 'ileben-landing'), value: 'row' },
        { label: __('Card Group (adjuntas)', 'ileben-landing'), value: 'group' },
    ];

    const rowColsOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
    ];

    const gutterOptions = [
        { label: 'None (g-0)', value: 'g-0' },
        { label: 'Small (g-2)', value: 'g-2' },
        { label: 'Default (g-3)', value: 'g-3' },
        { label: 'Large (g-4)', value: 'g-4' },
        { label: 'X-Large (g-5)', value: 'g-5' },
    ];

    function buildClasses(attrs) {
        const classes = ['bs-card-group'];
        if (attrs.layout === 'group') {
            classes.push('card-group');
        } else {
            classes.push('row');
            classes.push('row-cols-' + (attrs.rowCols || '3'));
            if (attrs.gutters) classes.push(attrs.gutters);
        }
        return classes.join(' ');
    }

    registerBlockType('bootstrap-theme/bs-card-group', {
        apiVersion: 3,
        title: __('Card Group', 'ileben-landing'),
        description: __('Contenedor para tarjetas: card-group o grid row-cols-*', 'ileben-landing'),
        icon: 'grid-view',
        category: 'ileben-landing',
        keywords: [__('card'), __('group'), __('grid'), __('cards')],

        attributes: {
            layout: { type: 'string', default: 'row' },
            rowCols: { type: 'string', default: '3' },
            gutters: { type: 'string', default: 'g-3' },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const containerClasses = buildClasses(attributes);

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Layout', 'ileben-landing'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Tipo de layout', 'ileben-landing'),
                            value: attributes.layout,
                            options: layoutOptions,
                            onChange: (v) => setAttributes({ layout: v }),
                        }),
                        attributes.layout === 'row' && createElement(Fragment, {},
                            createElement(SelectControl, {
                                label: __('Columnas por fila', 'ileben-landing'),
                                value: attributes.rowCols,
                                options: rowColsOptions,
                                onChange: (v) => setAttributes({ rowCols: v }),
                            }),
                            createElement(SelectControl, {
                                label: __('Espaciado (gutters)', 'ileben-landing'),
                                value: attributes.gutters,
                                options: gutterOptions,
                                onChange: (v) => setAttributes({ gutters: v }),
                            }),
                        ),
                    ),
                ),
                createElement('div',
                    Object.assign({}, blockProps, {
                        className: containerClasses,
                    }),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['bootstrap-theme/bs-card', 'bootstrap-theme/bs-counter-card'],
                        template: [
                            ['bootstrap-theme/bs-card'],
                            ['bootstrap-theme/bs-card'],
                            ['bootstrap-theme/bs-card'],
                        ],
                        placeholder: __('Agrega cards aquí…', 'ileben-landing'),
                    }),
                ),
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        },
    });
})(window.wp);
