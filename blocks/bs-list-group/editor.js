/**
 * Bootstrap List Group Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-list-group', {
        title: __('Bootstrap List Group', 'bootstrap-theme'),
        description: __('Bootstrap list group component', 'bootstrap-theme'),
        icon: 'editor-ul',
        category: 'ileben-landing',
        keywords: [__('list'), __('group'), __('bootstrap')],
        
        attributes: {
            flush: {
                type: 'boolean',
                default: false
            },
            horizontal: {
                type: 'string',
                default: ''
            },
            numbered: {
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-list-group/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            const horizontalOptions = [
                { label: 'Vertical', value: '' },
                { label: 'Always Horizontal', value: 'horizontal' },
                { label: 'Horizontal SM+', value: 'horizontal-sm' },
                { label: 'Horizontal MD+', value: 'horizontal-md' },
                { label: 'Horizontal LG+', value: 'horizontal-lg' },
                { label: 'Horizontal XL+', value: 'horizontal-xl' },
                { label: 'Horizontal XXL+', value: 'horizontal-xxl' }
            ];

            const listClasses = [
                'list-group',
                attributes.flush ? 'list-group-flush' : '',
                attributes.horizontal ? `list-group-${attributes.horizontal}` : '',
                attributes.numbered ? 'list-group-numbered' : ''
            ].filter(Boolean).join(' ');

            const tagName = attributes.numbered ? 'ol' : 'ul';
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('List Group Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Flush', 'bootstrap-theme'),
                            help: __('Remove borders and rounded corners', 'bootstrap-theme'),
                            checked: attributes.flush,
                            onChange: (value) => setAttributes({ flush: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Layout', 'bootstrap-theme'),
                            value: attributes.horizontal,
                            options: horizontalOptions,
                            onChange: (value) => setAttributes({ horizontal: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Numbered', 'bootstrap-theme'),
                            help: __('Add automatic numbering to list items', 'bootstrap-theme'),
                            checked: attributes.numbered,
                            onChange: (value) => setAttributes({ numbered: value })
                        })
                    )
                ),
                createElement(tagName, 
                    Object.assign({}, blockProps, { 
                        className: `${listClasses} ${blockProps.className || ''}`.trim()
                    }),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['bootstrap-theme/bs-list-group-item'],
                        template: [
                            ['bootstrap-theme/bs-list-group-item', { text: 'First item' }],
                            ['bootstrap-theme/bs-list-group-item', { text: 'Second item' }],
                            ['bootstrap-theme/bs-list-group-item', { text: 'Third item' }]
                        ],
                        placeholder: __('Add list group items...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);