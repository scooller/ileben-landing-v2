/**
 * Bootstrap Popover Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-popover', {
        apiVersion: 3,
        title: __('Bootstrap Popover', 'ileben-landing'),
        description: __('Popover with title and content', 'ileben-landing'),
        icon: 'format-status',
        category: 'ileben-landing',
        keywords: [__('popover'), __('overlay'), __('bootstrap')],

        attributes: {
            title: { type: 'string', default: __('Popover title', 'ileben-landing') },
            content: { type: 'string', default: __('Popover content', 'ileben-landing') },
            placement: { type: 'string', default: 'right' },
            trigger: { type: 'string', default: 'click' },
            element: { type: 'string', default: 'button' },
            elementText: { type: 'string', default: __('Click me', 'ileben-landing') },
            variant: { type: 'string', default: 'btn-danger' },
            className: { type: 'string', default: '' }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            const placementOptions = [
                { label: __('Top', 'ileben-landing'), value: 'top' },
                { label: __('Right', 'ileben-landing'), value: 'right' },
                { label: __('Bottom', 'ileben-landing'), value: 'bottom' },
                { label: __('Left', 'ileben-landing'), value: 'left' }
            ];

            const triggerOptions = [
                { label: __('Click', 'ileben-landing'), value: 'click' },
                { label: __('Hover', 'ileben-landing'), value: 'hover' },
                { label: __('Focus', 'ileben-landing'), value: 'focus' }
            ];

            const elementOptions = [
                { label: __('Button', 'ileben-landing'), value: 'button' },
                { label: __('Link', 'ileben-landing'), value: 'link' },
                { label: __('Span', 'ileben-landing'), value: 'span' }
            ];

            const variantOptions = [
                { label: __('Primary', 'ileben-landing'), value: 'btn-primary' },
                { label: __('Secondary', 'ileben-landing'), value: 'btn-secondary' },
                { label: __('Success', 'ileben-landing'), value: 'btn-success' },
                { label: __('Danger', 'ileben-landing'), value: 'btn-danger' },
                { label: __('Warning', 'ileben-landing'), value: 'btn-warning' },
                { label: __('Info', 'ileben-landing'), value: 'btn-info' },
                { label: __('Light', 'ileben-landing'), value: 'btn-light' },
                { label: __('Dark', 'ileben-landing'), value: 'btn-dark' }
            ];

            return createElement(Fragment, null,
                createElement(InspectorControls, null,
                    createElement(PanelBody, { title: __('Popover Content', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Title', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (val) => setAttributes({ title: val })
                        }),
                        createElement(TextControl, {
                            label: __('Content', 'ileben-landing'),
                            value: attributes.content,
                            onChange: (val) => setAttributes({ content: val })
                        })
                    ),
                    createElement(PanelBody, { title: __('Placement & Trigger', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Placement', 'ileben-landing'),
                            value: attributes.placement,
                            options: placementOptions,
                            onChange: (val) => setAttributes({ placement: val })
                        }),
                        createElement(SelectControl, {
                            label: __('Trigger', 'ileben-landing'),
                            value: attributes.trigger,
                            options: triggerOptions,
                            onChange: (val) => setAttributes({ trigger: val })
                        })
                    ),
                    createElement(PanelBody, { title: __('Element', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Element Type', 'ileben-landing'),
                            value: attributes.element,
                            options: elementOptions,
                            onChange: (val) => setAttributes({ element: val })
                        }),
                        createElement(TextControl, {
                            label: __('Element Text', 'ileben-landing'),
                            value: attributes.elementText,
                            onChange: (val) => setAttributes({ elementText: val })
                        }),
                        attributes.element === 'button' && createElement(SelectControl, {
                            label: __('Variant', 'ileben-landing'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (val) => setAttributes({ variant: val })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement(attributes.element === 'link' ? 'a' : attributes.element, {
                        className: attributes.element === 'button' ? `btn ${attributes.variant}` : '',
                        href: attributes.element === 'link' ? '#' : undefined,
                        onClick: (e) => e.preventDefault()
                    }, attributes.elementText)
                )
            );
        },

        save: function() {
            return null;
        }
    });
})(window.wp);
