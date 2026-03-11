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
        { label: __('Solid', 'ileben-landing'), value: 'fa-solid' },
        { label: __('Regular', 'ileben-landing'), value: 'fa-regular' },
        { label: __('Brands', 'ileben-landing'), value: 'fa-brands' },
    ];

    const ICON_SIZES = [
        { label: __('Default', 'ileben-landing'), value: '' },
        { label: '1x', value: 'fa-lg' },
        { label: '2x', value: 'fa-2x' },
        { label: '3x', value: 'fa-3x' },
        { label: '4x', value: 'fa-4x' },
        { label: '5x', value: 'fa-5x' },
        { label: '6x', value: 'fa-6x' },
    ];

    const ALIGN_OPTIONS = [
        { label: __('Default', 'ileben-landing'), value: '' },
        { label: __('Left', 'ileben-landing'), value: 'start' },
        { label: __('Center', 'ileben-landing'), value: 'center' },
        { label: __('Right', 'ileben-landing'), value: 'end' },
    ];

    const ANIMATION_TYPES = [
        { label: __('None', 'ileben-landing'), value: '' },
        { label: __('--- Fade ---', 'ileben-landing'), value: '' },
        { label: __('Fade In', 'ileben-landing'), value: 'fadeIn' },
        { label: __('Fade In Up', 'ileben-landing'), value: 'fadeInUp' },
        { label: __('Fade In Down', 'ileben-landing'), value: 'fadeInDown' },
        { label: __('Fade In Left', 'ileben-landing'), value: 'fadeInLeft' },
        { label: __('Fade In Right', 'ileben-landing'), value: 'fadeInRight' },
        { label: __('--- Slide ---', 'ileben-landing'), value: '' },
        { label: __('Slide Up', 'ileben-landing'), value: 'slideUp' },
        { label: __('Slide Down', 'ileben-landing'), value: 'slideDown' },
        { label: __('Slide Left', 'ileben-landing'), value: 'slideLeft' },
        { label: __('Slide Right', 'ileben-landing'), value: 'slideRight' },
        { label: __('--- Scale ---', 'ileben-landing'), value: '' },
        { label: __('Scale In', 'ileben-landing'), value: 'scaleIn' },
        { label: __('Scale Up', 'ileben-landing'), value: 'scaleUp' },
        { label: __('Scale Down', 'ileben-landing'), value: 'scaleDown' },
        { label: __('--- Rotate ---', 'ileben-landing'), value: '' },
        { label: __('Rotate', 'ileben-landing'), value: 'rotate' },
        { label: __('Rotate Fast', 'ileben-landing'), value: 'rotateFast' },
        { label: __('--- Effects ---', 'ileben-landing'), value: '' },
        { label: __('Bounce', 'ileben-landing'), value: 'bounce' },
        { label: __('Elastic', 'ileben-landing'), value: 'elastic' },
        { label: __('Flip', 'ileben-landing'), value: 'flip' },
        { label: __('Flip X', 'ileben-landing'), value: 'flipX' },
        { label: __('Pulse', 'ileben-landing'), value: 'pulse' },
    ];

    const ANIMATION_TRIGGERS = [
        { label: __('On Load', 'ileben-landing'), value: 'on-load' },
        { label: __('On Scroll', 'ileben-landing'), value: 'on-scroll' },
        { label: __('On Hover', 'ileben-landing'), value: 'on-hover' },
        { label: __('On Click', 'ileben-landing'), value: 'on-click' },
    ];

    const EASE_OPTIONS = [
        { label: __('Linear', 'ileben-landing'), value: 'linear' },
        { label: __('Power 1 In Out', 'ileben-landing'), value: 'power1.inOut' },
        { label: __('Power 2 In Out', 'ileben-landing'), value: 'power2.inOut' },
        { label: __('Power 3 In Out', 'ileben-landing'), value: 'power3.inOut' },
        { label: __('Power 4 In Out', 'ileben-landing'), value: 'power4.inOut' },
        { label: __('Back Out', 'ileben-landing'), value: 'back.out' },
        { label: __('Elastic Out', 'ileben-landing'), value: 'elastic.out' },
        { label: __('Bounce Out', 'ileben-landing'), value: 'bounce.out' },
        { label: __('Circ In Out', 'ileben-landing'), value: 'circ.inOut' },
        { label: __('Sine In Out', 'ileben-landing'), value: 'sine.inOut' },
    ];

    registerBlockType('bootstrap-theme/bs-fa-icon', {
        title: __('FontAwesome Icon', 'ileben-landing'),
        description: __('Inserta un ícono de FontAwesome (colección free).', 'ileben-landing'),
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
            },            animationScrollStart: {
                type: 'string',
                default: 'top 70%'
            },
            animationScrollEnd: {
                type: 'string',
                default: 'top 10%'
            },
            animationScrollMarkers: {
                type: 'boolean',
                default: false
            },            animationDelay: {
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
                    el(PanelBody, { title: __('Icon Settings', 'ileben-landing'), initialOpen: true },
                        el(SelectControl, {
                            label: __('Estilo', 'ileben-landing'),
                            value: attributes.iconStyle,
                            options: ICON_STYLES,
                            onChange: (value) => setAttributes({ iconStyle: value })
                        }),
                        el(TextControl, {
                            label: __('Nombre de ícono (ej: fa-house)', 'ileben-landing'),
                            help: __('Solo íconos free: https://fontawesome.com/search?ic=free-collection', 'ileben-landing'),
                            value: attributes.iconName,
                            onChange: (value) => setAttributes({ iconName: value })
                        }),
                        el(SelectControl, {
                            label: __('Tamaño', 'ileben-landing'),
                            value: attributes.size,
                            options: ICON_SIZES,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        el(SelectControl, {
                            label: __('Alineación', 'ileben-landing'),
                            value: attributes.align,
                            options: ALIGN_OPTIONS,
                            onChange: (value) => setAttributes({ align: value })
                        }),
                        el('div', { style: { marginTop: '12px' } },
                            el('label', { style: { display: 'block', marginBottom: '6px' } }, __('Color', 'ileben-landing')),
                            el(ColorPicker, {
                                color: attributes.color,
                                onChangeComplete: (value) => setAttributes({ color: value.hex }),
                                disableAlpha: true
                            })
                        )
                    ),
                    el(PanelBody, { title: __('Animation', 'ileben-landing'), initialOpen: false },
                        el(SelectControl, {
                            label: __('Animation Type', 'ileben-landing'),
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
                                label: __('Trigger', 'ileben-landing'),
                                value: attributes.animationTrigger,
                                options: ANIMATION_TRIGGERS,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            el(RangeControl, {
                                label: __('Duration (seconds)', 'ileben-landing'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            el(RangeControl, {
                                label: __('Delay (seconds)', 'ileben-landing'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            el(SelectControl, {
                                label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase,
                                options: EASE_OPTIONS,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            attributes.animationTrigger === 'on-scroll' && el(TextControl, {
                                label: __('Scroll Start', 'ileben-landing'),
                                value: attributes.animationScrollStart || 'top 70%',
                                onChange: (value) => setAttributes({ animationScrollStart: value }),
                                help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && el(TextControl, {
                                label: __('Scroll End', 'ileben-landing'),
                                value: attributes.animationScrollEnd || 'top 10%',
                                onChange: (value) => setAttributes({ animationScrollEnd: value }),
                                help: __('Ej: "top 10%", "bottom center"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && el(ToggleControl, {
                                label: __('Show ScrollTrigger Markers', 'ileben-landing'),
                                checked: attributes.animationScrollMarkers || false,
                                onChange: (value) => setAttributes({ animationScrollMarkers: value }),
                                help: __('Muestra lineas de debug en la pagina', 'ileben-landing')
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