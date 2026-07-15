/**
 * Counter Card Block Editor
 *
 * Card with an animated number that counts from 0 to target on scroll.
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    const variantOptions = [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Success', value: 'success' },
        { label: 'Danger', value: 'danger' },
        { label: 'Warning', value: 'warning' },
        { label: 'Info', value: 'info' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'None (transparent)', value: 'none' },
    ];

    const sizeOptions = [
        { label: 'Display 1', value: 'display-1' },
        { label: 'Display 2', value: 'display-2' },
        { label: 'Display 3', value: 'display-3' },
        { label: 'Display 4', value: 'display-4' },
        { label: 'Display 5', value: 'display-5' },
        { label: 'Display 6', value: 'display-6' },
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
    ];

    const easeOptions = [
        { label: 'Power 2 Out', value: 'power2.out' },
        { label: 'Power 3 Out', value: 'power3.out' },
        { label: 'Power 4 Out', value: 'power4.out' },
        { label: 'Back Out', value: 'back.out(1.7)' },
        { label: 'Elastic Out', value: 'elastic.out(1, 0.3)' },
        { label: 'Bounce Out', value: 'bounce.out' },
        { label: 'Expo Out', value: 'expo.out' },
        { label: 'Circ Out', value: 'circ.out' },
        { label: 'Sine Out', value: 'sine.out' },
        { label: 'Linear', value: 'none' },
    ];

    const colorModeOptions = [
        { label: 'Relleno (text-bg-*)', value: 'text-bg' },
        { label: 'Borde (border-*)', value: 'border' },
        { label: 'Borde + Texto (border-* + text-*)', value: 'border-text' },
    ];

    function buildCardClasses(attrs) {
        const classes = ['bs-counter-card', 'card', 'h-100', 'text-center'];
        if (attrs.colorMode === 'text-bg') {
            classes.push('border-0');
        }
        if (attrs.variant && attrs.variant !== 'none') {
            if (attrs.colorMode === 'text-bg') {
                classes.push('text-bg-' + attrs.variant);
            } else if (attrs.colorMode === 'border') {
                classes.push('border-' + attrs.variant);
            } else if (attrs.colorMode === 'border-text') {
                classes.push('border-' + attrs.variant);
                classes.push('text-' + attrs.variant);
            }
        }
        if (attrs.className) classes.push(attrs.className);
        return classes.join(' ');
    }

    registerBlockType('bootstrap-theme/bs-counter-card', {
        apiVersion: 3,
        title: __('Counter Card', 'ileben-landing'),
        description: __('Card con número animado que cuenta desde 0 al hacer scroll', 'ileben-landing'),
        icon: 'clock',
        category: 'ileben-landing',
        keywords: [__('counter'), __('number'), __('countup'), __('card'), __('stats')],

        attributes: {
            target: { type: 'number', default: 100 },
            prefix: { type: 'string', default: '' },
            suffix: { type: 'string', default: '' },
            title: { type: 'string', default: '' },
            subtitle: { type: 'string', default: '' },
            variant: { type: 'string', default: 'primary' },
            colorMode: { type: 'string', default: 'text-bg' },
            numberSize: { type: 'string', default: 'display-4' },
            duration: { type: 'number', default: 2 },
            ease: { type: 'string', default: 'power2.out' },
            className: { type: 'string', default: '' },
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const cardClasses = buildCardClasses(attributes);

            function NumberDisplay() {
                const children = [];
                if (attributes.prefix) {
                    children.push(createElement('span', { className: 'bs-counter-prefix me-1' }, attributes.prefix));
                }
                children.push(createElement('span', { className: 'bs-counter-value', style: { opacity: 0.5 } }, attributes.target));
                if (attributes.suffix) {
                    children.push(createElement('span', { className: 'bs-counter-suffix ms-1' }, attributes.suffix));
                }
                return createElement('div', { className: attributes.numberSize + ' fw-bold mb-0 d-flex align-items-baseline justify-content-center' }, ...children);
            }

            return createElement(Fragment, {},
                // Sidebar controls
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Número', 'ileben-landing'), initialOpen: true },
                        createElement(RangeControl, {
                            __next40pxDefaultSize: true, label: __('Valor final', 'ileben-landing'),
                            value: attributes.target,
                            onChange: (v) => setAttributes({ target: v }),
                            min: 0,
                            max: 100000,
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Prefijo (antes del número)', 'ileben-landing'),
                            value: attributes.prefix,
                            onChange: (v) => setAttributes({ prefix: v }),
                            placeholder: '$',
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Sufijo (después del número)', 'ileben-landing'),
                            value: attributes.suffix,
                            onChange: (v) => setAttributes({ suffix: v }),
                            placeholder: '+, %, K…',
                        }),
                    ),
                    createElement(PanelBody, { title: __('Texto', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Título', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (v) => setAttributes({ title: v }),
                            placeholder: 'Clientes felices',
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Subtítulo / descripción', 'ileben-landing'),
                            value: attributes.subtitle,
                            onChange: (v) => setAttributes({ subtitle: v }),
                            placeholder: 'Breve descripción',
                        }),
                    ),
                    createElement(PanelBody, { title: __('Animación', 'ileben-landing'), initialOpen: false },
                        createElement(RangeControl, {
                            __next40pxDefaultSize: true, label: __('Duración (segundos)', 'ileben-landing'),
                            value: attributes.duration,
                            onChange: (v) => setAttributes({ duration: v }),
                            min: 0.5,
                            max: 10,
                            step: 0.1,
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Easing', 'ileben-landing'),
                            value: attributes.ease,
                            options: easeOptions,
                            onChange: (v) => setAttributes({ ease: v }),
                        }),
                    ),
                    createElement(PanelBody, { title: __('Apariencia', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Color', 'ileben-landing'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (v) => setAttributes({ variant: v }),
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Modo de color', 'ileben-landing'),
                            value: attributes.colorMode,
                            options: colorModeOptions,
                            onChange: (v) => setAttributes({ colorMode: v }),
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Tamaño del número', 'ileben-landing'),
                            value: attributes.numberSize,
                            options: sizeOptions,
                            onChange: (v) => setAttributes({ numberSize: v }),
                        }),
                    ),
                ),

                // Preview
                createElement('div', blockProps,
                    createElement('div', { className: cardClasses },
                        createElement('div', { className: 'card-body p-4 d-flex flex-column justify-content-center align-items-center' },
                            createElement(NumberDisplay),
                            attributes.title ? createElement('h3', { className: 'bs-counter-card-title h5 mt-3 mb-1' }, attributes.title) : null,
                            attributes.subtitle ? createElement('p', { className: 'bs-counter-card-subtitle opacity-75 mb-0' }, attributes.subtitle) : null,
                        ),
                    ),
                ),
            );
        },

        save: function() {
            return null; // Dynamic block
        },
    });
})(window.wp);
