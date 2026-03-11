/**
 * Bootstrap Parallax Container Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-parallax', {
        apiVersion: 3,
        title: __('Bootstrap Parallax Container', 'ileben-landing'),
        description: __('Container with parallax scroll effect - use this to wrap elements', 'ileben-landing'),
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
            parallaxStart: {
                type: 'string',
                default: 'top center'
            },
            parallaxEnd: {
                type: 'string',
                default: 'bottom center'
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
                    alt: __('Parallax container preview', 'ileben-landing'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, 
                        { title: __('Parallax Settings', 'ileben-landing') },
                        
                        createElement(ToggleControl, {
                            label: __('Enable Parallax', 'ileben-landing'),
                            help: __('Add parallax scroll effect to this container', 'ileben-landing'),
                            checked: attributes.enableParallax,
                            onChange: (value) => setAttributes({ enableParallax: value })
                        }),

                        attributes.enableParallax && createElement(RangeControl, {
                            label: __('Parallax Speed', 'ileben-landing'),
                            value: attributes.parallaxSpeed,
                            min: 0.1,
                            max: 2,
                            step: 0.1,
                            onChange: (value) => setAttributes({ parallaxSpeed: value })
                        }),

                        attributes.enableParallax && createElement(TextControl, {
                            label: __('Start (ScrollTrigger start)', 'ileben-landing'),
                            help: __('Formato "top center", "center center", etc.', 'ileben-landing'),
                            value: attributes.parallaxStart,
                            onChange: (value) => setAttributes({ parallaxStart: value || 'top center' })
                        }),

                        attributes.enableParallax && createElement(TextControl, {
                            label: __('End (ScrollTrigger end)', 'ileben-landing'),
                            help: __('Formato "bottom center", "center center", etc.', 'ileben-landing'),
                            value: attributes.parallaxEnd,
                            onChange: (value) => setAttributes({ parallaxEnd: value || 'bottom center' })
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
                            __('Parallax enabled (Speed: ' + attributes.parallaxSpeed.toFixed(1) + ', Start: ' + attributes.parallaxStart + ', End: ' + attributes.parallaxEnd + ')', 'ileben-landing') :
                            __('Parallax disabled', 'ileben-landing')
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
                        placeholder: __('Add content inside parallax container...', 'ileben-landing')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);