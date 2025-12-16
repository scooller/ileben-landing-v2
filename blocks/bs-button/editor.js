/**
 * Bootstrap Button Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-button', {
        title: __('Bootstrap Button', 'bootstrap-theme'),
        description: __('A customizable Bootstrap button component', 'bootstrap-theme'),
        icon: 'button',
        category: 'ileben-landing',
        keywords: [ __('button'), __('bootstrap'), __('link') ],
        attributes: {
            text: { type: 'string', default: 'Button' },
            variant: { type: 'string', default: 'btn-primary' },
            outline: { type: 'boolean', default: false },
            link: { type: 'string', default: '' },
            target: { type: 'string', default: '_self' },
            size: { type: 'string', default: '' },
            disabled: { type: 'boolean', default: false },
            icon: { type: 'string', default: '' },
            iconPosition: { type: 'string', default: 'left' },
            preview: { type: 'boolean', default: false },
            className: { type: 'string', default: '' }
        },
        example: { attributes: { preview: true } },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-button/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            const buttonVariants = [
                { label: 'Primary', value: 'btn-primary' },
                { label: 'Secondary', value: 'btn-secondary' },
                { label: 'Success', value: 'btn-success' },
                { label: 'Danger', value: 'btn-danger' },
                { label: 'Warning', value: 'btn-warning' },
                { label: 'Info', value: 'btn-info' },
                { label: 'Light', value: 'btn-light' },
                { label: 'Dark', value: 'btn-dark' },
                { label: 'Link', value: 'btn-link' }
            ];

            const buttonSizes = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'btn-sm' },
                { label: 'Large', value: 'btn-lg' }
            ];

            const settingsPanel = createElement(PanelBody, { title: __('Button Settings', 'bootstrap-theme') },
                createElement(TextControl, {
                    label: __('Button Text', 'bootstrap-theme'),
                    value: attributes.text,
                    onChange: (value) => setAttributes({ text: value })
                }),
                createElement(SelectControl, {
                    label: __('Button Style', 'bootstrap-theme'),
                    value: attributes.variant,
                    options: buttonVariants,
                    onChange: (value) => setAttributes({ variant: value })
                }),
                createElement(SelectControl, {
                    label: __('Button Size', 'bootstrap-theme'),
                    value: attributes.size,
                    options: buttonSizes,
                    onChange: (value) => setAttributes({ size: value })
                }),
                createElement(ToggleControl, {
                    label: __('Outline Style', 'bootstrap-theme'),
                    checked: attributes.outline,
                    onChange: (value) => setAttributes({ outline: value })
                }),
                createElement(TextControl, {
                    label: __('Link URL', 'bootstrap-theme'),
                    value: attributes.link,
                    onChange: (value) => setAttributes({ link: value })
                }),
                createElement(ToggleControl, {
                    label: __('Open in new tab', 'bootstrap-theme'),
                    checked: attributes.target === '_blank',
                    onChange: (value) => setAttributes({ target: value ? '_blank' : '_self' })
                }),
                createElement(ToggleControl, {
                    label: __('Disabled', 'bootstrap-theme'),
                    checked: attributes.disabled,
                    onChange: (value) => setAttributes({ disabled: value })
                })
            );

            const iconPanel = createElement(PanelBody, { title: __('Icon', 'bootstrap-theme'), initialOpen: false },
                createElement(TextControl, {
                    label: __('Font Awesome classes', 'bootstrap-theme'),
                    help: __('Ejemplo: fa-solid fa-car (solo clases del icono)', 'bootstrap-theme'),
                    value: attributes.icon,
                    onChange: (value) => setAttributes({ icon: value })
                }),
                createElement(SelectControl, {
                    label: __('Icon position', 'bootstrap-theme'),
                    value: attributes.iconPosition,
                    options: [
                        { label: __('Before text', 'bootstrap-theme'), value: 'left' },
                        { label: __('After text', 'bootstrap-theme'), value: 'right' }
                    ],
                    onChange: (value) => setAttributes({ iconPosition: value })
                })
            );

            const icon = (attributes.icon || '').trim();
            const hasIcon = icon.length > 0;
            const iconEl = hasIcon ? createElement('i', { className: icon + (attributes.text ? (attributes.iconPosition === 'left' ? ' me-2' : ' ms-2') : '') }) : null;
            const inner = attributes.iconPosition === 'left' ? [iconEl, attributes.text] : [attributes.text, iconEl];

            return createElement(Fragment, {},
                createElement(InspectorControls, {}, settingsPanel, iconPanel),
                createElement('button',
                    Object.assign({}, blockProps, {
                        className: `btn ${attributes.outline ? attributes.variant.replace('btn-', 'btn-outline-') : attributes.variant} ${attributes.size} ${blockProps.className || ''}`,
                        disabled: attributes.disabled
                    }),
                    inner
                )
            );
        },
        save: function() { return null; }
    });

})(window.wp);