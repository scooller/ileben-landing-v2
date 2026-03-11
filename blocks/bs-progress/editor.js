/**
 * Bootstrap Progress Bar Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, SelectControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-progress', {
        title: __('Bootstrap Progress Bar', 'ileben-landing'),
        description: __('Bootstrap progress bar component', 'ileben-landing'),
        icon: 'chart-bar',
        category: 'ileben-landing',
        keywords: [__('progress'), __('bar'), __('bootstrap')],
        
        attributes: {
            value: {
                type: 'number',
                default: 50
            },
            min: {
                type: 'number',
                default: 0
            },
            max: {
                type: 'number',
                default: 100
            },
            label: {
                type: 'string',
                default: ''
            },
            variant: {
                type: 'string',
                default: 'primary'
            },
            striped: {
                type: 'boolean',
                default: false
            },
            animated: {
                type: 'boolean',
                default: false
            },
            height: {
                type: 'string',
                default: ''
            },
            showLabel: {
                type: 'boolean',
                default: false
            },
            preview: {
                type: 'boolean',
                default: false
            }
        },
        example: {
            attributes: {
                preview: true
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-progress/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const variantOptions = [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
            ];

            const percentage = Math.round(((attributes.value - attributes.min) / (attributes.max - attributes.min)) * 100);

            const progressBarClasses = [
                'progress-bar',
                `bg-${attributes.variant}`,
                attributes.striped ? 'progress-bar-striped' : '',
                attributes.animated ? 'progress-bar-animated' : ''
            ].filter(Boolean).join(' ');

            const progressStyle = attributes.height ? { height: attributes.height } : {};
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Progress Settings', 'ileben-landing') },
                        createElement(RangeControl, {
                            label: __('Current Value', 'ileben-landing'),
                            value: attributes.value,
                            onChange: (value) => setAttributes({ value: value }),
                            min: attributes.min,
                            max: attributes.max
                        }),
                        createElement(RangeControl, {
                            label: __('Minimum Value', 'ileben-landing'),
                            value: attributes.min,
                            onChange: (value) => setAttributes({ min: value }),
                            min: 0,
                            max: attributes.max - 1
                        }),
                        createElement(RangeControl, {
                            label: __('Maximum Value', 'ileben-landing'),
                            value: attributes.max,
                            onChange: (value) => setAttributes({ max: value }),
                            min: attributes.min + 1,
                            max: 1000
                        }),
                        createElement(SelectControl, {
                            label: __('Color Variant', 'ileben-landing'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Striped', 'ileben-landing'),
                            help: __('Add diagonal stripes to progress bar', 'ileben-landing'),
                            checked: attributes.striped,
                            onChange: (value) => setAttributes({ striped: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Animated', 'ileben-landing'),
                            help: __('Animate the stripes (requires striped)', 'ileben-landing'),
                            checked: attributes.animated,
                            onChange: (value) => setAttributes({ animated: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Label', 'ileben-landing'),
                            help: __('Display percentage inside progress bar', 'ileben-landing'),
                            checked: attributes.showLabel,
                            onChange: (value) => setAttributes({ showLabel: value })
                        }),
                        createElement(TextControl, {
                            label: __('Custom Label', 'ileben-landing'),
                            help: __('Leave empty to show percentage', 'ileben-landing'),
                            value: attributes.label,
                            onChange: (value) => setAttributes({ label: value })
                        }),
                        createElement(TextControl, {
                            label: __('Height', 'ileben-landing'),
                            help: __('CSS height value (e.g., 20px, 1.5rem)', 'ileben-landing'),
                            value: attributes.height,
                            onChange: (value) => setAttributes({ height: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'mb-2' },
                        createElement('small', { className: 'text-muted' },
                            __('Progress: ', 'ileben-landing') + `${attributes.value}/${attributes.max} (${percentage}%)`
                        )
                    ),
                    createElement('div', {
                        className: 'progress',
                        style: progressStyle
                    },
                        createElement('div', {
                            className: progressBarClasses,
                            role: 'progressbar',
                            style: { width: `${percentage}%` },
                            'aria-valuenow': attributes.value,
                            'aria-valuemin': attributes.min,
                            'aria-valuemax': attributes.max
                        },
                            attributes.showLabel && (attributes.label || `${percentage}%`)
                        )
                    )
                )
            );
        },

        save: function(props) {
            // Return null to make this a dynamic block that uses PHP render_callback
            return null;
        }
    });

})(window.wp);