/**
 * Block Editor: Entorno Category (Tab)
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-entorno-category', {
        apiVersion: 3,
        title: __('Categoría Entorno', 'ileben-landing'),
        description: __('Una pestaña de categoría para el entorno (Ej: Educación).', 'ileben-landing'),
        icon: 'category',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-entorno'],
        supports: { html: false },
        attributes: {
            title: { type: 'string', default: 'Categoría' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-entorno-category-preview border p-3 rounded mb-2 bg-white' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración de Categoría', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Nombre de la Categoría', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (val) => setAttributes({ title: val })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('h5', { className: 'border-bottom pb-2 mb-3' }, 
                        __('Categoría: ', 'ileben-landing') + attributes.title
                    ),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['bootstrap-theme/bs-entorno-poi'],
                        template: [
                            ['bootstrap-theme/bs-entorno-poi', { name: 'Punto de Interés', icon: 'fa-solid fa-map-pin' }]
                        ],
                        renderAppender: () => createElement(InnerBlocks.ButtonBlockAppender)
                    })
                )
            );
        },
        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });
})(window.wp);
