/**
 * FontAwesome Icon Block (Editor)
 */

(function(wp){
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, ColorPicker } = wp.components;
    const { createElement: el, Fragment } = wp.element;

    const ICON_STYLES = [
        { label: __('Solid', 'bootstrap-theme'), value: 'fa-solid' },
        { label: __('Regular', 'bootstrap-theme'), value: 'fa-regular' },
        { label: __('Brands', 'bootstrap-theme'), value: 'fa-brands' },
    ];

    const ICON_SIZES = [
        { label: __('Default', 'bootstrap-theme'), value: '' },
        { label: '1x', value: 'fa-lg' },
        { label: '2x', value: 'fa-2x' },
        { label: '3x', value: 'fa-3x' },
        { label: '4x', value: 'fa-4x' },
        { label: '5x', value: 'fa-5x' },
        { label: '6x', value: 'fa-6x' },
    ];

    const ALIGN_OPTIONS = [
        { label: __('Default', 'bootstrap-theme'), value: '' },
        { label: __('Left', 'bootstrap-theme'), value: 'start' },
        { label: __('Center', 'bootstrap-theme'), value: 'center' },
        { label: __('Right', 'bootstrap-theme'), value: 'end' },
    ];

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
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            const iconClass = [
                attributes.iconStyle || 'fa-solid',
                attributes.iconName || 'fa-star',
                attributes.size || '',
            ].filter(Boolean).join(' ');

            const iconStyle = attributes.color ? { color: attributes.color } : {};
            const wrapperClass = ['fa-icon-block-editor'];
            if (attributes.align) {
                wrapperClass.push('text-' + attributes.align);
            }

            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Icon Settings', 'bootstrap-theme'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Estilo', 'bootstrap-theme'),
                            value: attributes.iconStyle,
                            options: ICON_STYLES,
                            onChange: (value) => setAttributes({ iconStyle: value })
                        }),
                        el(TextControl, {
                            label: __('Nombre de ícono (ej: fa-house)', 'bootstrap-theme'),
                            help: __('Solo íconos free: https://fontawesome.com/search?ic=free-collection', 'bootstrap-theme'),
                            value: attributes.iconName,
                            onChange: (value) => setAttributes({ iconName: value })
                        }),
                        el(SelectControl, {
                            label: __('Tamaño', 'bootstrap-theme'),
                            value: attributes.size,
                            options: ICON_SIZES,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        el(SelectControl, {
                            label: __('Alineación', 'bootstrap-theme'),
                            value: attributes.align,
                            options: ALIGN_OPTIONS,
                            onChange: (value) => setAttributes({ align: value })
                        }),
                        el('div', { style: { marginTop: '12px' } },
                            el('label', { style: { display: 'block', marginBottom: '6px' } }, __('Color', 'bootstrap-theme')),
                            el(ColorPicker, {
                                color: attributes.color,
                                onChangeComplete: (value) => setAttributes({ color: value.hex }),
                                disableAlpha: true
                            })
                        )
                    )
                ),
                el('div', { ...blockProps, className: wrapperClass.join(' ') },
                    el('i', { className: iconClass, style: iconStyle, 'aria-hidden': true })
                )
            );
        },
        save: () => null, // dynamic render in PHP
    });
})(window.wp);
