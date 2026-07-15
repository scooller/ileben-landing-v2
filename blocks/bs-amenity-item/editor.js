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
            iconType: { type: 'string', default: 'icon' },
            icon: { type: 'string', default: 'fa-solid fa-check' },
            imageUrl: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-amenity-item-preview col border rounded p-3 text-center mb-2 bg-white' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'ileben-landing'), initialOpen: true },
                        createElement(wp.components.SelectControl, {
                            label: __('Tipo de Ícono', 'ileben-landing'),
                            value: attributes.iconType,
                            options: [
                                { label: __('FontAwesome', 'ileben-landing'), value: 'icon' },
                                { label: __('Imagen / SVG', 'ileben-landing'), value: 'image' }
                            ],
                            onChange: (val) => setAttributes({ iconType: val })
                        }),
                        attributes.iconType === 'icon' && createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Ícono (FontAwesome)', 'ileben-landing'),
                            value: attributes.icon,
                            onChange: (val) => setAttributes({ icon: val }),
                            help: 'Ej: fa-solid fa-swimming-pool'
                        }),
                        attributes.iconType === 'image' && createElement('div', { className: 'mb-3' },
                            createElement('p', { className: 'components-base-control__label' }, __('Imagen / SVG', 'ileben-landing')),
                            createElement(wp.blockEditor.MediaUploadCheck, {},
                                createElement(wp.blockEditor.MediaUpload, {
                                    onSelect: (media) => setAttributes({ imageUrl: media.url }),
                                    allowedTypes: ['image'],
                                    value: attributes.imageUrl,
                                    render: ({ open }) => createElement(wp.components.Button, {
                                        className: attributes.imageUrl ? 'image-button' : 'button button-large',
                                        onClick: open,
                                        style: attributes.imageUrl ? { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' } : {}
                                    },
                                        attributes.imageUrl 
                                            ? createElement('img', { src: attributes.imageUrl, style: { maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' } }) 
                                            : __('Seleccionar imagen', 'ileben-landing')
                                    )
                                })
                            ),
                            attributes.imageUrl && createElement(wp.components.Button, {
                                className: 'button button-link-delete mt-2 text-danger',
                                onClick: () => setAttributes({ imageUrl: '' })
                            }, __('Quitar imagen', 'ileben-landing'))
                        )
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'bs-amenity-icon text-primary mb-3 d-flex justify-content-center align-items-center', style: { height: '2.5rem' } },
                        attributes.iconType === 'image' && attributes.imageUrl 
                            ? createElement('img', { src: attributes.imageUrl, style: { maxHeight: '2.5rem', maxWidth: '100%', objectFit: 'contain' } })
                            : createElement('i', { className: attributes.icon || 'fa-solid fa-check', style: { fontSize: '2.5rem' } })
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
