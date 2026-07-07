/**
 * Block Editor: Amenity Item
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, TextControl, Icon } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-amenity-item', {
        apiVersion: 3,
        title: __('Amenity Item', 'ileben-landing'),
        description: __('Un elemento individual de amenity.', 'ileben-landing'),
        icon: 'star-empty',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-amenities'],
        supports: { html: false },
        attributes: {
            title: { type: 'string', default: __('Amenity', 'ileben-landing') },
            description: { type: 'string', default: '' },
            icon: { type: 'string', default: 'fa-solid fa-check' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-amenity-item-preview col border rounded p-3 text-center mb-2 bg-white' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Ícono (FontAwesome)', 'ileben-landing'),
                            value: attributes.icon,
                            onChange: (val) => setAttributes({ icon: val }),
                            help: 'Ej: fa-solid fa-swimming-pool'
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'bs-amenity-icon text-primary mb-3', style: { fontSize: '2.5rem' } },
                        createElement('i', { className: attributes.icon || 'fa-solid fa-check' })
                    ),
                    createElement(RichText, {
                        tagName: 'h5',
                        className: 'card-title h6 fw-bold mb-2',
                        value: attributes.title,
                        onChange: (val) => setAttributes({ title: val }),
                        placeholder: __('Nombre del Amenity', 'ileben-landing')
                    }),
                    createElement(RichText, {
                        tagName: 'p',
                        className: 'card-text small text-muted',
                        value: attributes.description,
                        onChange: (val) => setAttributes({ description: val }),
                        placeholder: __('Descripción corta', 'ileben-landing')
                    })
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);
