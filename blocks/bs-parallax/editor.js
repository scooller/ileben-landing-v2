/**
 * Bootstrap Parallax Container Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-parallax', {
        title: __('Bootstrap Parallax Container', 'bootstrap-theme'),
        description: __('Container with parallax scroll effect - use this to wrap elements', 'bootstrap-theme'),
        icon: 'format-image',
        category: 'ileben-landing',
        keywords: [__('parallax'), __('container'), __('scroll'), __('effect')],
        
        attributes: {
            enableParallax: {
                type: 'boolean',
                default: true
            },
            parallaxSpeed: {
                type: 'number',
                default: 0.5
            },
            parallaxMultiplier: {
                type: 'number',
                default: 120
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
            const blockProps = useBlockProps({
                className: 'bs-parallax-container'
            });

            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-parallax/example.png',
                    alt: __('Parallax container preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, 
                        { title: __('Parallax Settings', 'bootstrap-theme') },
                        
                        createElement(ToggleControl, {
                            label: __('Enable Parallax', 'bootstrap-theme'),
                            help: __('Add parallax scroll effect to this container', 'bootstrap-theme'),
                            checked: attributes.enableParallax,
                            onChange: (value) => setAttributes({ enableParallax: value })
                        }),

                        attributes.enableParallax && createElement(RangeControl, {
                            label: __('Parallax Speed', 'bootstrap-theme'),
                            value: attributes.parallaxSpeed,
                            min: 0.1,
                            max: 2,
                            step: 0.1,
                            onChange: (value) => setAttributes({ parallaxSpeed: value })
                        }),

                        attributes.enableParallax && createElement(RangeControl, {
                            label: __('Parallax Intensity', 'bootstrap-theme'),
                            help: __('Adjust the strength of the parallax effect (px)', 'bootstrap-theme'),
                            value: attributes.parallaxMultiplier,
                            min: 50,
                            max: 300,
                            step: 10,
                            onChange: (value) => setAttributes({ parallaxMultiplier: value })
                        })
                    )
                ),
                
                createElement('div', 
                    Object.assign({}, blockProps, {
                        style: {
                            ...blockProps.style,
                            border: '2px dashed #999',
                            padding: '20px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(200, 200, 200, 0.1)'
                        }
                    }),
                    createElement('div', { style: { fontSize: '12px', color: '#666', marginBottom: '10px' } },
                        attributes.enableParallax ? 
                            __('✓ Parallax enabled (Speed: ' + attributes.parallaxSpeed.toFixed(1) + ', Intensity: ' + attributes.parallaxMultiplier + 'px)', 'bootstrap-theme') :
                            __('Parallax disabled', 'bootstrap-theme')
                    ),
                    createElement(InnerBlocks, {
                        allowedBlocks: [
                            'bootstrap-theme/bs-row',
                            'bootstrap-theme/bs-column',
                            'bootstrap-theme/bs-container',
                            'bootstrap-theme/bs-carousel',
                            'bootstrap-theme/bs-card',
                            'bootstrap-theme/bs-fa-icon',
                            'core/paragraph',
                            'core/heading',
                            'core/image',
                            'core/group'
                        ],
                        placeholder: __('Add content inside parallax container...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);
