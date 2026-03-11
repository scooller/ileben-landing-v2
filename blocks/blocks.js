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

    console.log('Ô£à blocks.js cargado - FALLBACK blocks');

    // FontAwesome Icon Block (fallback registration to ensure it appears in inserter)
    if (!wp.blocks.getBlockType('bootstrap-theme/bs-fa-icon')) {
        registerBlockType('bootstrap-theme/bs-fa-icon', {
            title: __('FontAwesome Icon', 'ileben-landing'),
            description: __('Inserta un ├¡cono de FontAwesome (colecci├│n free).', 'ileben-landing'),
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
                    { label: __('Solid', 'ileben-landing'), value: 'fa-solid' },
                    { label: __('Regular', 'ileben-landing'), value: 'fa-regular' },
                    { label: __('Brands', 'ileben-landing'), value: 'fa-brands' },
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
                    { label: __('Default', 'ileben-landing'), value: '' },
                    { label: __('Left', 'ileben-landing'), value: 'start' },
                    { label: __('Center', 'ileben-landing'), value: 'center' },
                    { label: __('Right', 'ileben-landing'), value: 'end' },
                ];

                return createElement(Fragment, {},
                    createElement(InspectorControls, {},
                        createElement(PanelBody, { title: __('Icon Settings', 'ileben-landing'), initialOpen: true },
                            createElement(SelectControl, {
                                label: __('Estilo', 'ileben-landing'),
                                value: attributes.iconStyle,
                                options: iconStyles,
                                onChange: (value) => setAttributes({ iconStyle: value })
                            }),
                            createElement(TextControl, {
                                label: __('Nombre de ├¡cono (ej: fa-house)', 'ileben-landing'),
                                help: __('Solo ├¡conos free: https://fontawesome.com/search?ic=free-collection', 'ileben-landing'),
                                value: attributes.iconName,
                                onChange: (value) => setAttributes({ iconName: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Tama├▒o', 'ileben-landing'),
                                value: attributes.size,
                                options: iconSizes,
                                onChange: (value) => setAttributes({ size: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Alineaci├│n', 'ileben-landing'),
                                value: attributes.align,
                                options: alignOptions,
                                onChange: (value) => setAttributes({ align: value })
                            }),
                            createElement(TextControl, {
                                label: __('Color (ej: #000000)', 'ileben-landing'),
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
                return null; // render din├ímico en PHP
            }
        });
    }

    console.log('Ô£à blocks.js inicializaci├│n completada - bloques registrados en PHP');

})();