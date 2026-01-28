/**
 * Bootstrap Divider Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-divider', {
        title: __('Bootstrap Divider', 'bootstrap-theme'),
        description: __('A divider line with optional text or icon.', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [ __('divider'), __('separator'), __('line'), __('hr') ],
        attributes: {
            text: { type: 'string', default: '' },
            icon: { type: 'string', default: '' },
            align: { type: 'string', default: 'center' },
            variant: { type: 'string', default: 'solid' },
            color: { type: 'string', default: 'secondary' },
            textColor: { type: 'string', default: 'secondary' },
            marginY: { type: 'string', default: '3' },
            className: { type: 'string', default: '' },
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
            const blockProps = useBlockProps();

            const colors = [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'White', value: 'white' }
            ];

            const alignments = [
                { label: 'Left', value: 'start' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'end' }
            ];

            const variants = [
                { label: 'Solid', value: 'solid' },
                { label: 'Dashed', value: 'dashed' },
                { label: 'Dotted', value: 'dotted' }
            ];

            // Render Preview
            const renderDivider = () => {
                const lineStyle = {
                    borderTopStyle: attributes.variant,
                    flexGrow: 1
                };
                
                // We use Bootstrap classes in editor too if loaded, otherwise minimal styles
                const lineClass = `border-top border-${attributes.color}`;
                
                const lineEl = createElement('div', { 
                    className: lineClass,
                    style: lineStyle
                });

                const contentEls = [];

                if (attributes.icon) {
                     contentEls.push(createElement('i', { 
                        className: `${attributes.icon} ${attributes.text ? 'me-2' : ''}`,
                        key: 'icon'
                    }));
                }

                if (attributes.text) {
                    contentEls.push(attributes.text);
                }

                const contentWrapper = (contentEls.length > 0) 
                    ? createElement('span', { 
                        className: `mx-3 text-${attributes.textColor} fw-medium`,
                        style: { padding: '0 1rem' } // Fallback spacing
                      }, contentEls) 
                    : null;

                const children = [];
                if (attributes.align === 'center') {
                    children.push(lineEl);
                    if (contentWrapper) children.push(contentWrapper);
                    children.push(createElement('div', { className: lineClass, style: lineStyle, key: 'line2' })); // Clone doesn't work well with keys
                } else if (attributes.align === 'start') {
                    if (contentWrapper) children.push(contentWrapper);
                    children.push(lineEl);
                } else if (attributes.align === 'end') {
                    children.push(lineEl);
                    if (contentWrapper) children.push(contentWrapper);
                } else {
                    children.push(lineEl); // Default or no content
                }

                return createElement('div', { 
                    className: `d-flex align-items-center my-${attributes.marginY}`,
                    style: { width: '100%' }
                }, children);
            };

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Divider Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Text', 'bootstrap-theme'),
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            help: __('Optional text to display.', 'bootstrap-theme')
                        }),
                        createElement(TextControl, {
                            label: __('Icon Class (FontAwesome)', 'bootstrap-theme'),
                            value: attributes.icon,
                            onChange: (value) => setAttributes({ icon: value }),
                            help: __('e.g., fa-solid fa-star', 'bootstrap-theme')
                        }),
                        createElement(SelectControl, {
                            label: __('Alignment', 'bootstrap-theme'),
                            value: attributes.align,
                            options: alignments,
                            onChange: (value) => setAttributes({ align: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Line Style', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variants,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Line Color', 'bootstrap-theme'),
                            value: attributes.color,
                            options: colors,
                            onChange: (value) => setAttributes({ color: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Text/Icon Color', 'bootstrap-theme'),
                            value: attributes.textColor,
                            options: colors,
                            onChange: (value) => setAttributes({ textColor: value })
                        }),
                        createElement(RangeControl, {
                            label: __('Vertical Margin (my-*)', 'bootstrap-theme'),
                            value: parseInt(attributes.marginY),
                            onChange: (value) => setAttributes({ marginY: value.toString() }),
                            min: 0,
                            max: 5
                        })
                    ),
                    // Animation Controls Panel
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { 
                            attributes: attributes, 
                            setAttributes: setAttributes,
                            allowHover: true,
                            allowScroll: false
                        }
                    )
                ),
                createElement('div', blockProps, renderDivider())
            );
        },
        save: function() {
            return null; // Dynamic block
        }
    });

})(window.wp);
