/**
 * Bootstrap Collapse Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
    const { createElement, Fragment, useEffect } = wp.element;

    registerBlockType('bootstrap-theme/bs-collapse', {
        apiVersion: 3,
        title: __('Bootstrap Collapse', 'ileben-landing'),
        description: __('Collapsible content toggle', 'ileben-landing'),
        icon: 'arrow-down-alt2',
        category: 'ileben-landing',
        keywords: [__('collapse'), __('accordion'), __('bootstrap')],

        attributes: {
            collapseId: { type: 'string', default: '' },
            buttonText: { type: 'string', default: __('Toggle Collapse', 'ileben-landing') },
            buttonVariant: { type: 'string', default: 'btn-primary' },
            horizontal: { type: 'boolean', default: false },
            show: { type: 'boolean', default: false },
            className: { type: 'string', default: '' }
        },

        edit: function(props) {
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();

            // Generate stable ID once
            const collapseId = attributes.collapseId || `collapse-${clientId}`;

            useEffect(() => {
                if (!attributes.collapseId) {
                    setAttributes({ collapseId: `collapse-${clientId}` });
                }
            }, [clientId]);

            const variantOptions = [
                { label: __('Primary', 'ileben-landing'), value: 'btn-primary' },
                { label: __('Secondary', 'ileben-landing'), value: 'btn-secondary' },
                { label: __('Success', 'ileben-landing'), value: 'btn-success' },
                { label: __('Danger', 'ileben-landing'), value: 'btn-danger' },
                { label: __('Warning', 'ileben-landing'), value: 'btn-warning' },
                { label: __('Info', 'ileben-landing'), value: 'btn-info' },
                { label: __('Light', 'ileben-landing'), value: 'btn-light' },
                { label: __('Dark', 'ileben-landing'), value: 'btn-dark' },
                { label: __('Outline Primary', 'ileben-landing'), value: 'btn-outline-primary' },
                { label: __('Outline Secondary', 'ileben-landing'), value: 'btn-outline-secondary' }
            ];

            return createElement(Fragment, null,
                createElement(InspectorControls, null,
                    createElement(PanelBody, { title: __('Button', 'ileben-landing') },
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Button Text', 'ileben-landing'),
                            value: attributes.buttonText,
                            onChange: (val) => setAttributes({ buttonText: val })
                        }),
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Button Variant', 'ileben-landing'),
                            value: attributes.buttonVariant,
                            options: variantOptions,
                            onChange: (val) => setAttributes({ buttonVariant: val })
                        })
                    ),
                    createElement(PanelBody, { title: __('Behavior', 'ileben-landing'), initialOpen: false },
                        createElement(ToggleControl, {
                            label: __('Show by default', 'ileben-landing'),
                            checked: attributes.show,
                            onChange: (val) => setAttributes({ show: val })
                        }),
                        createElement(ToggleControl, {
                            label: __('Horizontal', 'ileben-landing'),
                            checked: attributes.horizontal,
                            onChange: (val) => setAttributes({ horizontal: val })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('button', {
                        className: `btn ${attributes.buttonVariant}`,
                        type: 'button',
                        onClick: (e) => e.preventDefault()
                    }, attributes.buttonText || __('Toggle Collapse', 'ileben-landing')),
                    createElement('div', {
                        className: `collapse${attributes.show ? ' show' : ''}${attributes.horizontal ? ' collapse-horizontal' : ''}`,
                        id: collapseId
                    },
                        createElement('div', { className: 'card card-body' },
                            createElement(InnerBlocks, { placeholder: __('Add content here...', 'ileben-landing') })
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
