/**
 * Block Editor: Entorno POI (Point of Interest)
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-entorno-poi', {
        apiVersion: 3,
        title: __('Punto de Interés (POI)', 'ileben-landing'),
        description: __('Un punto de interés dentro de una categoría del entorno.', 'ileben-landing'),
        icon: 'location',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-entorno-category'],
        supports: { html: false },
        attributes: {
            name: { type: 'string', default: 'Nuevo Punto' },
            details: { type: 'string', default: '' },
            icon: { type: 'string', default: 'fa-solid fa-map-pin' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-entorno-poi-preview p-2 border-bottom d-flex align-items-center mb-1 bg-light' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración del Punto', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Ícono (FontAwesome)', 'ileben-landing'),
                            value: attributes.icon,
                            onChange: (val) => setAttributes({ icon: val }),
                            help: 'Ej: fa-solid fa-tree'
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'text-primary me-3', style: { width: '24px', textAlign: 'center' } },
                        createElement('i', { className: attributes.icon || 'fa-solid fa-map-pin' })
                    ),
                    createElement('div', { className: 'flex-grow-1' },
                        createElement(RichText, {
                            tagName: 'strong',
                            className: 'd-block mb-1',
                            value: attributes.name,
                            onChange: (val) => setAttributes({ name: val }),
                            placeholder: __('Nombre del lugar', 'ileben-landing')
                        }),
                        createElement(RichText, {
                            tagName: 'span',
                            className: 'text-muted small',
                            value: attributes.details,
                            onChange: (val) => setAttributes({ details: val }),
                            placeholder: __('Detalles (ej: 5 min caminando)', 'ileben-landing')
                        })
                    )
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);
