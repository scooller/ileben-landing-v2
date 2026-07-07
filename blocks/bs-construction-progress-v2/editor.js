/**
 * Block Editor: Avance de Obra v2 Container
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, Icon } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-construction-progress-v2', {
        apiVersion: 3,
        title: __('Avance de Obra v2', 'ileben-landing'),
        description: __('Contenedor para la línea de tiempo de avance de obra.', 'ileben-landing'),
        icon: 'chart-bar',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            cols: { type: 'string', default: '4' },
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
            const blockProps = useBlockProps({ className: 'bs-construction-preview border rounded bg-light p-3 mb-3' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'ileben-landing'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Máximo de columnas', 'ileben-landing'),
                            value: attributes.cols,
                            options: [
                                { label: '2', value: '2' },
                                { label: '3', value: '3' },
                                { label: '4', value: '4' },
                                { label: '5', value: '5' }
                            ],
                            onChange: (val) => setAttributes({ cols: val })
                        })
                    ),
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { attributes, setAttributes }
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'text-center mb-4' },
                        createElement(Icon, { icon: 'chart-bar', size: 32, style: { opacity: 0.5 } }),
                        createElement('h4', {}, __('Contenedor de Avance de Obra', 'ileben-landing')),
                    ),
                    createElement('div', { className: `row row-cols-1 row-cols-md-${attributes.cols} g-4 bs-construction-stages` },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-construction-stage'],
                            template: [
                                ['bootstrap-theme/bs-construction-stage', { title: 'Excavación', percentage: 100, status: 'completed' }],
                                ['bootstrap-theme/bs-construction-stage', { title: 'Obra Gruesa', percentage: 60, status: 'active' }],
                                ['bootstrap-theme/bs-construction-stage', { title: 'Terminaciones', percentage: 0, status: 'pending' }]
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
