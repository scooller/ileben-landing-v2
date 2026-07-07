/**
 * Block Editor: Interactive Masterplan Container
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, Button, Icon } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-interactive-masterplan', {
        apiVersion: 3,
        title: __('Masterplan Interactivo', 'ileben-landing'),
        description: __('Contenedor de masterplan con hotspots.', 'ileben-landing'),
        icon: 'location-alt',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            masterplanImage: { type: 'object', default: null },
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
            const blockProps = useBlockProps({ className: 'bs-interactive-masterplan-preview border rounded bg-light mb-3 position-relative overflow-hidden' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Imagen Base', 'ileben-landing'), initialOpen: true },
                        createElement(MediaUploadCheck, {},
                            createElement(MediaUpload, {
                                onSelect: (media) => setAttributes({ masterplanImage: { id: media.id, url: media.url, alt: media.alt } }),
                                allowedTypes: ['image'],
                                value: attributes.masterplanImage ? attributes.masterplanImage.id : undefined,
                                render: ({ open }) => createElement(Button, {
                                    isPrimary: true,
                                    onClick: open,
                                    style: { width: '100%', justifyContent: 'center', marginBottom: '1rem' }
                                }, attributes.masterplanImage ? __('Cambiar Imagen', 'ileben-landing') : __('Seleccionar Imagen Masterplan', 'ileben-landing'))
                            })
                        ),
                        attributes.masterplanImage && createElement('div', { style: { marginBottom: '1rem' } },
                            createElement(Button, {
                                isDestructive: true,
                                isLink: true,
                                onClick: () => setAttributes({ masterplanImage: null })
                            }, __('Eliminar Imagen', 'ileben-landing'))
                        )
                    ),
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { attributes, setAttributes }
                    )
                ),
                createElement('div', blockProps,
                    attributes.masterplanImage ? createElement('div', { className: 'bs-masterplan-editor-canvas', style: { position: 'relative', display: 'inline-block', width: '100%' } },
                        createElement('img', { src: attributes.masterplanImage.url, style: { width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' } }),
                        createElement('div', { className: 'bs-masterplan-innerblocks-wrapper', style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } },
                            createElement(InnerBlocks, {
                                allowedBlocks: ['bootstrap-theme/bs-masterplan-hotspot'],
                                template: [
                                    ['bootstrap-theme/bs-masterplan-hotspot', { top: 50, left: 50, status: 'disponible' }]
                                ],
                                renderAppender: () => createElement(InnerBlocks.ButtonBlockAppender)
                            })
                        )
                    ) : createElement('div', { className: 'text-center p-5' },
                        createElement(Icon, { icon: 'location-alt', size: 48, style: { opacity: 0.5, marginBottom: '10px' } }),
                        createElement('h3', {}, __('Masterplan Interactivo', 'ileben-landing')),
                        createElement('p', {}, __('Selecciona una imagen base para comenzar a agregar hotspots.', 'ileben-landing'))
                    )
                )
            );
        },
        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });
})(window.wp);
