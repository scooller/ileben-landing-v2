/**
 * Block Editor: Amenities
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, Icon } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-amenities', {
        apiVersion: 3,
        title: __('Amenities / Equipamiento', 'ileben-landing'),
        description: __('Contenedor de una grilla de amenities.', 'ileben-landing'),
        icon: 'star-filled',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            title: { type: 'string', default: '' },
            colsMobile: { type: 'string', default: '2' },
            colsTablet: { type: 'string', default: '3' },
            colsDesktop: { type: 'string', default: '4' },
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
            const blockProps = useBlockProps({ className: 'bs-amenities-preview border p-3 rounded bg-light mb-3' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración de Columnas', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Título del Bloque (Opcional)', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (val) => setAttributes({ title: val })
                        }),
                        createElement('h4', { style: { marginTop: '1rem' } }, __('Columnas por fila', 'ileben-landing')),
                        createElement(SelectControl, {
                            label: __('Móvil', 'ileben-landing'),
                            value: attributes.colsMobile,
                            options: [ { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' } ],
                            onChange: (val) => setAttributes({ colsMobile: val })
                        }),
                        createElement(SelectControl, {
                            label: __('Tablet', 'ileben-landing'),
                            value: attributes.colsTablet,
                            options: [ { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' } ],
                            onChange: (val) => setAttributes({ colsTablet: val })
                        }),
                        createElement(SelectControl, {
                            label: __('Escritorio', 'ileben-landing'),
                            value: attributes.colsDesktop,
                            options: [ { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' } ],
                            onChange: (val) => setAttributes({ colsDesktop: val })
                        })
                    ),
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { attributes, setAttributes }
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'text-center mb-3' },
                        createElement(Icon, { icon: 'star-filled', size: 32, style: { opacity: 0.5 } }),
                        createElement('h4', {}, attributes.title || __('Contenedor de Amenities', 'ileben-landing')),
                    ),
                    createElement('div', { className: `row row-cols-${attributes.colsMobile} row-cols-md-${attributes.colsTablet} row-cols-lg-${attributes.colsDesktop} g-4` },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-amenity-item'],
                            template: [
                                ['bootstrap-theme/bs-amenity-item', { title: 'Amenity 1', icon: 'fa-solid fa-check', description: 'Descripción breve.' }]
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
