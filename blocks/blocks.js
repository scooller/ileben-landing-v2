/**
 * Bootstrap Theme Blocks
 * JavaScript para todos los bloques de Bootstrap
 * 
 * @package Bootstrap_Theme
 */

(function() {
    'use strict';

    const { registerBlockType } = wp.blocks;
    const { createElement, Fragment } = wp.element;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl } = wp.components;
    const { __ } = wp.i18n;

    console.log('✅ blocks.js cargado - FALLBACK blocks');

    // FontAwesome Icon Block (fallback registration to ensure it appears in inserter)
    if (!wp.blocks.getBlockType('bootstrap-theme/bs-fa-icon')) {
        registerBlockType('bootstrap-theme/bs-fa-icon', {
            title: __('FontAwesome Icon', 'bootstrap-theme'),
            description: __('Inserta un ícono de FontAwesome (colección free).', 'bootstrap-theme'),
            icon: 'star-filled',
            category: 'ileben-landing',
            keywords: [__('icon'), __('fontawesome'), __('fa')],
            attributes: {
                iconStyle: { type: 'string', default: 'fa-solid' },
                iconName: { type: 'string', default: 'fa-star' },
                size: { type: 'string', default: 'fa-2x' },
                color: { type: 'string', default: '' },
                align: { type: 'string', default: '' },
            },
            edit: function(props) {
                const { attributes, setAttributes } = props;
                const blockProps = useBlockProps();

                const iconClass = [
                    attributes.iconStyle || 'fa-solid',
                    attributes.iconName || 'fa-star',
                    attributes.size || '',
                ].filter(Boolean).join(' ');

                const style = attributes.color ? { color: attributes.color } : {};
                const wrapperClass = ['fa-icon-block-editor'];
                if (attributes.align) {
                    wrapperClass.push('text-' + attributes.align);
                }

                const iconStyles = [
                    { label: __('Solid', 'bootstrap-theme'), value: 'fa-solid' },
                    { label: __('Regular', 'bootstrap-theme'), value: 'fa-regular' },
                    { label: __('Brands', 'bootstrap-theme'), value: 'fa-brands' },
                ];

                const iconSizes = [
                    { label: 'Default', value: '' },
                    { label: '1x', value: 'fa-lg' },
                    { label: '2x', value: 'fa-2x' },
                    { label: '3x', value: 'fa-3x' },
                    { label: '4x', value: 'fa-4x' },
                    { label: '5x', value: 'fa-5x' },
                    { label: '6x', value: 'fa-6x' },
                ];

                const alignOptions = [
                    { label: __('Default', 'bootstrap-theme'), value: '' },
                    { label: __('Left', 'bootstrap-theme'), value: 'start' },
                    { label: __('Center', 'bootstrap-theme'), value: 'center' },
                    { label: __('Right', 'bootstrap-theme'), value: 'end' },
                ];

                return createElement(Fragment, {},
                    createElement(InspectorControls, {},
                        createElement(PanelBody, { title: __('Icon Settings', 'bootstrap-theme'), initialOpen: true },
                            createElement(SelectControl, {
                                label: __('Estilo', 'bootstrap-theme'),
                                value: attributes.iconStyle,
                                options: iconStyles,
                                onChange: (value) => setAttributes({ iconStyle: value })
                            }),
                            createElement(TextControl, {
                                label: __('Nombre de ícono (ej: fa-house)', 'bootstrap-theme'),
                                help: __('Solo íconos free: https://fontawesome.com/search?ic=free-collection', 'bootstrap-theme'),
                                value: attributes.iconName,
                                onChange: (value) => setAttributes({ iconName: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Tamaño', 'bootstrap-theme'),
                                value: attributes.size,
                                options: iconSizes,
                                onChange: (value) => setAttributes({ size: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Alineación', 'bootstrap-theme'),
                                value: attributes.align,
                                options: alignOptions,
                                onChange: (value) => setAttributes({ align: value })
                            }),
                            createElement(TextControl, {
                                label: __('Color (ej: #000000)', 'bootstrap-theme'),
                                value: attributes.color,
                                onChange: (value) => setAttributes({ color: value })
                            })
                        )
                    ),
                    createElement('div', { ...blockProps, className: wrapperClass.join(' ') },
                        createElement('i', { className: iconClass, style, 'aria-hidden': true })
                    )
                );
            },
            save: function() {
                return null; // render dinámico en PHP
            }
        });
    }

    console.log('✅ blocks.js inicialización completada - bloques registrados en PHP');

})();
