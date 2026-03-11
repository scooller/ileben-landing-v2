/**
 * Bootstrap Pagination Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-pagination', {
        apiVersion: 3,
        title: __('Bootstrap Pagination', 'ileben-landing'),
        description: __('Bootstrap pagination navigation component', 'ileben-landing'),
        icon: 'ellipsis',
        category: 'ileben-landing',
        keywords: [__('pagination'), __('navigation'), __('bootstrap')],
        
        attributes: {
            size: {
                type: 'string',
                default: ''
            },
            alignment: {
                type: 'string',
                default: ''
            },
            totalPages: {
                type: 'number',
                default: 5
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
            
            // Inserter preview image
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-pagination/example.png',
                    alt: __('Pagination preview', 'ileben-landing'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const sizeOptions = [
                { label: 'Default', value: '' },
                { label: 'Small', value: 'pagination-sm' },
                { label: 'Large', value: 'pagination-lg' }
            ];

            const alignmentOptions = [
                { label: 'Left', value: '' },
                { label: 'Center', value: 'justify-content-center' },
                { label: 'Right', value: 'justify-content-end' }
            ];

            const paginationClasses = [
                'pagination',
                attributes.size,
                attributes.alignment
            ].filter(Boolean).join(' ');

            // Generate sample pagination items for preview
            const generateSamplePages = () => {
                const pages = [];
                
                // Previous button
                pages.push(
                    createElement('li', { className: 'page-item', key: 'prev' },
                        createElement('a', { className: 'page-link', href: '#' }, __('Previous', 'ileben-landing'))
                    )
                );
                
                // Page numbers
                for (let i = 1; i <= Math.min(attributes.totalPages, 5); i++) {
                    pages.push(
                        createElement('li', { 
                            className: `page-item${i === 1 ? ' active' : ''}`, 
                            key: i 
                        },
                            createElement('a', { className: 'page-link', href: '#' }, i.toString())
                        )
                    );
                }
                
                // Next button
                pages.push(
                    createElement('li', { className: 'page-item', key: 'next' },
                        createElement('a', { className: 'page-link', href: '#' }, __('Next', 'ileben-landing'))
                    )
                );
                
                return pages;
            };
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Pagination Settings', 'ileben-landing') },
                        createElement(SelectControl, {
                            label: __('Size', 'ileben-landing'),
                            value: attributes.size,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ size: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Alignment', 'ileben-landing'),
                            value: attributes.alignment,
                            options: alignmentOptions,
                            onChange: (value) => setAttributes({ alignment: value })
                        }),
                        createElement(RangeControl, {
                            label: __('Preview Pages', 'ileben-landing'),
                            help: __('Number of pages to show in preview', 'ileben-landing'),
                            value: attributes.totalPages,
                            onChange: (value) => setAttributes({ totalPages: value }),
                            min: 1,
                            max: 10
                        })
                    )
                ),
                createElement('nav', 
                    Object.assign({}, blockProps, { 
                        'aria-label': 'Page navigation'
                    }),
                    createElement('div', { className: 'mb-3' },
                        createElement('small', { className: 'text-muted' },
                            __('Preview - Configure pagination via block settings', 'ileben-landing')
                        )
                    ),
                    createElement('ul', { className: paginationClasses },
                        ...generateSamplePages()
                    ),
                    createElement('div', { className: 'mt-3' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-pagination-item'],
                            placeholder: __('Add custom pagination items...', 'ileben-landing'),
                            template: []
                        })
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);