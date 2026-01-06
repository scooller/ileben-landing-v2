/**
 * Bootstrap Step Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-step-item', {
        title: __('Step Item', 'bootstrap-theme'),
        description: __('Individual step for the steps component', 'bootstrap-theme'),
        icon: 'marker',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-steps'],
        
        attributes: {
            title: {
                type: 'string',
                default: 'Step'
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Step Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Step Title', 'bootstrap-theme'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'bs-step-item-editor border rounded p-3 text-center' },
                        createElement(RichText, {
                            tagName: 'div',
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value }),
                            placeholder: __('Step title...', 'bootstrap-theme'),
                            className: 'fw-bold'
                        })
                    )
                )
            );
        },

        save: function() {
            return null;
        }
    });

})(window.wp);
