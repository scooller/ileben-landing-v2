/**
 * Bootstrap Toast Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, SelectControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-toast', {
        title: __('Bootstrap Toast', 'bootstrap-theme'),
        description: __('Bootstrap toast notification component', 'bootstrap-theme'),
        icon: 'info',
        category: 'ileben-landing',
        keywords: [__('toast'), __('notification'), __('bootstrap')],
        
        attributes: {
            toastId: {
                type: 'string',
                default: ''
            },
            headerText: {
                type: 'string',
                default: 'Toast Notification'
            },
            showHeader: {
                type: 'boolean',
                default: true
            },
            showCloseButton: {
                type: 'boolean',
                default: true
            },
            autohide: {
                type: 'boolean',
                default: true
            },
            delay: {
                type: 'number',
                default: 5000
            },
            position: {
                type: 'string',
                default: 'top-end'
            },
            variant: {
                type: 'string',
                default: ''
            },
            animation: {
                type: 'boolean',
                default: true
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-toast/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            // Generate unique ID if not set
            if (!attributes.toastId) {
                setAttributes({ toastId: `toast-${clientId}` });
            }
            const positionOptions = [
                { label: 'Top Left', value: 'top-start' },
                { label: 'Top Center', value: 'top-center' },
                { label: 'Top Right', value: 'top-end' },
                { label: 'Middle Left', value: 'middle-start' },
                { label: 'Middle Center', value: 'middle-center' },
                { label: 'Middle Right', value: 'middle-end' },
                { label: 'Bottom Left', value: 'bottom-start' },
                { label: 'Bottom Center', value: 'bottom-center' },
                { label: 'Bottom Right', value: 'bottom-end' }
            ];

            const variantOptions = [
                { label: 'Default', value: '' },
                { label: 'Primary', value: 'text-bg-primary' },
                { label: 'Secondary', value: 'text-bg-secondary' },
                { label: 'Success', value: 'text-bg-success' },
                { label: 'Danger', value: 'text-bg-danger' },
                { label: 'Warning', value: 'text-bg-warning' },
                { label: 'Info', value: 'text-bg-info' },
                { label: 'Light', value: 'text-bg-light' },
                { label: 'Dark', value: 'text-bg-dark' }
            ];

            const toastClasses = [
                'toast',
                attributes.variant
            ].filter(Boolean).join(' ');
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Toast Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Toast ID', 'bootstrap-theme'),
                            value: attributes.toastId,
                            onChange: (value) => setAttributes({ toastId: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Header', 'bootstrap-theme'),
                            checked: attributes.showHeader,
                            onChange: (value) => setAttributes({ showHeader: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Close Button', 'bootstrap-theme'),
                            checked: attributes.showCloseButton,
                            onChange: (value) => setAttributes({ showCloseButton: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Color Variant', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Position', 'bootstrap-theme'),
                            value: attributes.position,
                            options: positionOptions,
                            onChange: (value) => setAttributes({ position: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Auto Hide', 'bootstrap-theme'),
                            help: __('Automatically hide after delay', 'bootstrap-theme'),
                            checked: attributes.autohide,
                            onChange: (value) => setAttributes({ autohide: value })
                        }),
                        attributes.autohide && createElement(RangeControl, {
                            label: __('Delay (ms)', 'bootstrap-theme'),
                            value: attributes.delay,
                            onChange: (value) => setAttributes({ delay: value }),
                            min: 1000,
                            max: 10000,
                            step: 500
                        }),
                        createElement(ToggleControl, {
                            label: __('Animation', 'bootstrap-theme'),
                            help: __('Enable fade animation', 'bootstrap-theme'),
                            checked: attributes.animation,
                            onChange: (value) => setAttributes({ animation: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'mb-2' },
                        createElement('small', { className: 'text-muted' },
                            __('Toast Preview (Position: ', 'bootstrap-theme') + attributes.position + ')'
                        )
                    ),
                    createElement('div', {
                        className: `${toastClasses} show`,
                        id: attributes.toastId,
                        role: 'alert',
                        'aria-live': 'assertive',
                        'aria-atomic': 'true',
                        'data-bs-autohide': attributes.autohide.toString(),
                        'data-bs-delay': attributes.delay,
                        'data-bs-animation': attributes.animation.toString()
                    },
                        attributes.showHeader && createElement('div', { className: 'toast-header' },
                            createElement('svg', {
                                className: 'bd-placeholder-img rounded me-2',
                                width: '20',
                                height: '20',
                                xmlns: 'http://www.w3.org/2000/svg',
                                'aria-hidden': 'true',
                                preserveAspectRatio: 'xMidYMid slice',
                                focusable: 'false'
                            },
                                createElement('rect', { width: '100%', height: '100%', fill: '#007aff' })
                            ),
                            createElement(RichText, {
                                tagName: 'strong',
                                className: 'me-auto',
                                value: attributes.headerText,
                                onChange: (value) => setAttributes({ headerText: value }),
                                placeholder: __('Toast title...', 'bootstrap-theme')
                            }),
                            createElement('small', {}, '11 mins ago'),
                            attributes.showCloseButton && createElement('button', {
                                type: 'button',
                                className: 'btn-close',
                                'data-bs-dismiss': 'toast',
                                'aria-label': 'Close'
                            })
                        ),
                        createElement('div', { className: 'toast-body' },
                            createElement(InnerBlocks, {
                                placeholder: __('Add toast message...', 'bootstrap-theme'),
                                template: [
                                    ['core/paragraph', { 
                                        content: __('Hello, world! This is a toast message.', 'bootstrap-theme')
                                    }]
                                ]
                            })
                        )
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);