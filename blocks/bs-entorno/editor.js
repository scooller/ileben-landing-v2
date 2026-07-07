/**
 * Block Editor: Entorno / POIs Container
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, Button, Icon } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-entorno', {
        apiVersion: 3,
        title: __('Entorno (Mapa y POIs)', 'ileben-landing'),
        description: __('Contenedor para mapa y categorías de entorno.', 'ileben-landing'),
        icon: 'location',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            mapType: { type: 'string', default: 'iframe' },
            mapIframeUrl: { type: 'string', default: '' },
            mapImage: { type: 'object', default: null },
            // Animation attributes
            animationType: { type: 'string' },
            animationTrigger: { type: 'string' },
            animationDuration: { type: 'number' },
            animationDelay: { type: 'number' },
            animationEase: { type: 'string' },
            animationRepeat: { type: 'number' },
            animationRepeatDelay: { type: 'number' },
            animationYoyo: { type: 'boolean' },
            animationDistance: { type: 'string' },
            animationRotation: { type: 'number' },
            animationScale: { type: 'string' },
            animationParallaxSpeed: { type: 'number' },
            animationHoverEffect: { type: 'string' },
            animationMobileEnabled: { type: 'boolean' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-entorno-preview border p-3 rounded bg-light mb-3' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración del Mapa', 'ileben-landing'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Tipo de Mapa', 'ileben-landing'),
                            value: attributes.mapType,
                            options: [
                                { label: __('Iframe (Google Maps, etc)', 'ileben-landing'), value: 'iframe' },
                                { label: __('Imagen Estática', 'ileben-landing'), value: 'image' }
                            ],
                            onChange: (val) => setAttributes({ mapType: val })
                        }),
                        attributes.mapType === 'iframe' && createElement(TextControl, {
                            label: __('URL del Iframe (src)', 'ileben-landing'),
                            value: attributes.mapIframeUrl,
                            onChange: (val) => setAttributes({ mapIframeUrl: val }),
                            help: __('Pega la URL de Google Maps (la que va dentro de src="...").', 'ileben-landing')
                        }),
                        attributes.mapType === 'image' && createElement(MediaUploadCheck, {},
                            createElement(MediaUpload, {
                                onSelect: (media) => setAttributes({ mapImage: { id: media.id, url: media.url, alt: media.alt } }),
                                allowedTypes: ['image'],
                                value: attributes.mapImage ? attributes.mapImage.id : undefined,
                                render: ({ open }) => createElement(Button, {
                                    isPrimary: true,
                                    onClick: open,
                                    style: { width: '100%', justifyContent: 'center', marginBottom: '1rem' }
                                }, attributes.mapImage ? __('Cambiar Imagen', 'ileben-landing') : __('Seleccionar Imagen', 'ileben-landing'))
                            })
                        ),
                        attributes.mapType === 'image' && attributes.mapImage && createElement('div', { style: { marginBottom: '1rem' } },
                            createElement(Button, {
                                isDestructive: true,
                                isLink: true,
                                onClick: () => setAttributes({ mapImage: null })
                            }, __('Eliminar Imagen', 'ileben-landing'))
                        )
                    ),
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { attributes, setAttributes }
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'text-center mb-3' },
                        createElement(Icon, { icon: 'location', size: 32, style: { opacity: 0.5 } }),
                        createElement('h4', {}, __('Bloque Entorno', 'ileben-landing')),
                        createElement('p', {}, __('Agrega categorías de puntos de interés aquí:', 'ileben-landing'))
                    ),
                    createElement('div', { className: 'bg-white p-3 border rounded' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-entorno-category', 'bootstrap-theme/bs-entorno-poi'],
                            template: [
                                ['bootstrap-theme/bs-entorno-category', { title: 'Educación' }]
                            ],
                            renderAppender: () => createElement(InnerBlocks.ButtonBlockAppender)
                        })
                    )
                )
            );
        },
        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });
})(window.wp);
