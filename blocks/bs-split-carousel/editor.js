(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-split-carousel', {
        apiVersion: 3,
        title: __('Split Carousel', 'ileben-landing'),
        description: __('Carousel layout with split text/image columns', 'ileben-landing'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slider'), __('split')],
        
        attributes: {
            carouselId: {
                type: 'string',
                default: ''
            },
            interval: {
                type: 'string',
                default: '5000'
            }
        },
        
        edit: function(props) {
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps({ className: 'bs-split-carousel carousel-fade' });
            
            if (!attributes.carouselId) {
                setAttributes({ carouselId: `split-carousel-${clientId}` });
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Carousel Settings', 'ileben-landing') },
                        createElement(TextControl, {
                            label: __('Carousel ID', 'ileben-landing'),
                            value: attributes.carouselId,
                            onChange: (value) => setAttributes({ carouselId: value })
                        }),
                        createElement(TextControl, {
                            label: __('Interval (ms)', 'ileben-landing'),
                            help: __('Time between slides in milliseconds', 'ileben-landing'),
                            value: attributes.interval,
                            type: 'number',
                            onChange: (value) => setAttributes({ interval: value })
                        })
                    )
                ),
                createElement('div', 
                    Object.assign({}, blockProps, { 
                        id: attributes.carouselId,
                        style: { border: '1px dashed #ccc', padding: '20px' }
                    }),
                    createElement('div', { className: 'carousel-inner' },
                        createElement(InnerBlocks, {
                            allowedBlocks: ['bootstrap-theme/bs-split-carousel-item'],
                            template: [
                                ['bootstrap-theme/bs-split-carousel-item', { active: true }],
                                ['bootstrap-theme/bs-split-carousel-item']
                            ],
                            placeholder: __('Add split carousel items...', 'ileben-landing')
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
