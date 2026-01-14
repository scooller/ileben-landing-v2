/**
 * FontAwesome Icon Block (Editor)
 */

(function(wp){
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, ColorPicker, RangeControl, ToggleControl } = wp.components;
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

    const ANIMATION_TYPES = [
        { label: __('None', 'bootstrap-theme'), value: '' },
        { label: __('--- Fade ---', 'bootstrap-theme'), value: '' },
        { label: __('Fade In', 'bootstrap-theme'), value: 'fadeIn' },
        { label: __('Fade In Up', 'bootstrap-theme'), value: 'fadeInUp' },
        { label: __('Fade In Down', 'bootstrap-theme'), value: 'fadeInDown' },
        { label: __('Fade In Left', 'bootstrap-theme'), value: 'fadeInLeft' },
        { label: __('Fade In Right', 'bootstrap-theme'), value: 'fadeInRight' },
        { label: __('--- Slide ---', 'bootstrap-theme'), value: '' },
        { label: __('Slide Up', 'bootstrap-theme'), value: 'slideUp' },
        { label: __('Slide Down', 'bootstrap-theme'), value: 'slideDown' },
        { label: __('Slide Left', 'bootstrap-theme'), value: 'slideLeft' },
        { label: __('Slide Right', 'bootstrap-theme'), value: 'slideRight' },
        { label: __('--- Scale ---', 'bootstrap-theme'), value: '' },
        { label: __('Scale In', 'bootstrap-theme'), value: 'scaleIn' },
        { label: __('Scale Up', 'bootstrap-theme'), value: 'scaleUp' },
        { label: __('Scale Down', 'bootstrap-theme'), value: 'scaleDown' },
        { label: __('--- Rotate ---', 'bootstrap-theme'), value: '' },
        { label: __('Rotate', 'bootstrap-theme'), value: 'rotate' },
        { label: __('Rotate Fast', 'bootstrap-theme'), value: 'rotateFast' },
        { label: __('--- Effects ---', 'bootstrap-theme'), value: '' },
        { label: __('Bounce', 'bootstrap-theme'), value: 'bounce' },
        { label: __('Elastic', 'bootstrap-theme'), value: 'elastic' },
        { label: __('Flip', 'bootstrap-theme'), value: 'flip' },
        { label: __('Flip X', 'bootstrap-theme'), value: 'flipX' },
        { label: __('Pulse', 'bootstrap-theme'), value: 'pulse' },
    ];

    const ANIMATION_TRIGGERS = [
        { label: __('On Load', 'bootstrap-theme'), value: 'on-load' },
        { label: __('On Scroll', 'bootstrap-theme'), value: 'on-scroll' },
        { label: __('On Hover', 'bootstrap-theme'), value: 'on-hover' },
        { label: __('On Click', 'bootstrap-theme'), value: 'on-click' },
    ];

    const EASE_OPTIONS = [
        { label: __('Linear', 'bootstrap-theme'), value: 'linear' },
        { label: __('Power 1 In Out', 'bootstrap-theme'), value: 'power1.inOut' },
        { label: __('Power 2 In Out', 'bootstrap-theme'), value: 'power2.inOut' },
        { label: __('Power 3 In Out', 'bootstrap-theme'), value: 'power3.inOut' },
        { label: __('Power 4 In Out', 'bootstrap-theme'), value: 'power4.inOut' },
        { label: __('Back Out', 'bootstrap-theme'), value: 'back.out' },
        { label: __('Elastic Out', 'bootstrap-theme'), value: 'elastic.out' },
        { label: __('Bounce Out', 'bootstrap-theme'), value: 'bounce.out' },
        { label: __('Circ In Out', 'bootstrap-theme'), value: 'circ.inOut' },
        { label: __('Sine In Out', 'bootstrap-theme'), value: 'sine.inOut' },
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
            className: { type: 'string', default: '' },
            // Animation attributes
            animationType: {
                type: 'string'
            },
            animationTrigger: {
                type: 'string',
                default: 'on-scroll'
            },
            animationDuration: {
                type: 'number',
                default: 0.8
            },
            animationDelay: {
                type: 'number',
                default: 0
            },
            animationEase: {
                type: 'string'
            },
            animationRepeat: {
                type: 'number'
            },
            animationRepeatDelay: {
                type: 'number',
                default: 0
            },
            animationYoyo: {
                type: 'boolean'
            },
            animationDistance: {
                type: 'string'
            },
            animationRotation: {
                type: 'number'
            },
            animationScale: {
                type: 'string'
            },
            animationParallaxSpeed: {
                type: 'number'
            },
            animationHoverEffect: {
                type: 'string'
            },
            animationMobileEnabled: {
                type: 'boolean'
            },
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

            const animationType = attributes.animationType || '';

            // Build data attributes for animation preview
            const dataAttrs = {};
            if (attributes.animationType) {
                dataAttrs['data-animate-type'] = attributes.animationType;
                dataAttrs['data-animate-trigger'] = attributes.animationTrigger || 'on-scroll';
                dataAttrs['data-animate-duration'] = attributes.animationDuration || 0.8;
                dataAttrs['data-animate-delay'] = attributes.animationDelay || 0;
                dataAttrs['data-animate-ease'] = attributes.animationEase || 'power2.inOut';
                if (attributes.animationRepeat != null) dataAttrs['data-animate-repeat'] = attributes.animationRepeat;
                if (attributes.animationRepeatDelay != null) dataAttrs['data-animate-repeat-delay'] = attributes.animationRepeatDelay;
                if (attributes.animationYoyo) dataAttrs['data-animate-yoyo'] = 'true';
                if (attributes.animationDistance) dataAttrs['data-animate-distance'] = attributes.animationDistance;
                if (attributes.animationRotation != null) dataAttrs['data-animate-rotation'] = attributes.animationRotation;
                if (attributes.animationScale) dataAttrs['data-animate-scale'] = attributes.animationScale;
                if (attributes.animationParallaxSpeed != null) dataAttrs['data-animate-parallax-speed'] = attributes.animationParallaxSpeed;
                if (attributes.animationHoverEffect) dataAttrs['data-animate-hover-effect'] = attributes.animationHoverEffect;
                if (attributes.animationMobileEnabled != null) dataAttrs['data-animate-mobile'] = attributes.animationMobileEnabled ? '1' : '0';
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
                    ),
                    el(PanelBody, { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        el(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
                            value: animationType,
                            options: ANIMATION_TYPES,
                            onChange: (value) => {
                                const updates = { animationType: value };
                                if (value && value !== '') {
                                    if (!attributes.animationDuration || attributes.animationDuration === '') {
                                        updates.animationDuration = 0.8;
                                    }
                                    if (!attributes.animationDelay || attributes.animationDelay === '') {
                                        updates.animationDelay = 0;
                                    }
                                    if (!attributes.animationTrigger || attributes.animationTrigger === '') {
                                        updates.animationTrigger = 'on-scroll';
                                    }
                                    if (!attributes.animationEase || attributes.animationEase === '') {
                                        updates.animationEase = 'power2.inOut';
                                    }
                                }
                                setAttributes(updates);
                            }
                        }),
                        animationType && el(Fragment, null,
                            el(SelectControl, {
                                label: __('Trigger', 'bootstrap-theme'),
                                value: attributes.animationTrigger,
                                options: ANIMATION_TRIGGERS,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            el(RangeControl, {
                                label: __('Duration (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            el(RangeControl, {
                                label: __('Delay (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            el(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase,
                                options: EASE_OPTIONS,
                                onChange: (value) => setAttributes({ animationEase: value })
                            })
                        )
                    )
                ),
                el('div', Object.assign({}, blockProps, { className: wrapperClass.join(' ') }, dataAttrs),
                    el('i', { className: iconClass, style: iconStyle, 'aria-hidden': true })
                )
            );
        },
        save: () => null, // dynamic render in PHP
    });
})(window.wp);
