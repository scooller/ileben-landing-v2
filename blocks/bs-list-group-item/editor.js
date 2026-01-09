/**
 * Bootstrap List Group Item Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText, InnerBlocks } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, TextControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-list-group-item', {
        title: __('Bootstrap List Group Item', 'bootstrap-theme'),
        description: __('Individual item within a list group', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('list'), __('item'), __('bootstrap')],
        parent: ['bootstrap-theme/bs-list-group'],
        
        attributes: {
            text: {
                type: 'string',
                default: 'List item'
            },
            variant: {
                type: 'string',
                default: ''
            },
            active: {
                type: 'boolean',
                default: false
            },
            disabled: {
                type: 'boolean',
                default: false
            },
            actionable: {
                type: 'boolean',
                default: false
            },
            href: {
                type: 'string',
                default: '#'
            },
            openInNewTab: {
                type: 'boolean',
                default: false
            },
            hasContent: {
                type: 'boolean',
                default: false
            },
            // Animation attributes
            animationType: {
                type: 'string'
            },
            animationTrigger: {
                type: 'string',
                default: 'on-scroll'
            },
            animationDuration: {
                type: 'number',
                default: 0.8
            },
            animationDelay: {
                type: 'number',
                default: 0
            },
            animationEase: {
                type: 'string'
            },
            animationRepeat: {
                type: 'number'
            },
            animationRepeatDelay: {
                type: 'number',
                default: 0
            },
            animationYoyo: {
                type: 'boolean'
            },
            animationDistance: {
                type: 'string'
            },
            animationRotation: {
                type: 'number'
            },
            animationScale: {
                type: 'string'
            },
            animationParallaxSpeed: {
                type: 'number'
            },
            animationHoverEffect: {
                type: 'string'
            },
            animationMobileEnabled: {
                type: 'boolean'
            },
            // Preview for inserter
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
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-list-group-item/example.png',
                    alt: __('List group item preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            const variantOptions = [
                { label: 'Default', value: '' },
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
            ];

            const animationTypes = [
                { label: __('None', 'bootstrap-theme'), value: '' },
                { label: __('--- Fade ---', 'bootstrap-theme'), value: '' },
                { label: __('Fade In', 'bootstrap-theme'), value: 'fadeIn' },
                { label: __('Fade In Up', 'bootstrap-theme'), value: 'fadeInUp' },
                { label: __('Fade In Down', 'bootstrap-theme'), value: 'fadeInDown' },
                { label: __('Fade In Left', 'bootstrap-theme'), value: 'fadeInLeft' },
                { label: __('Fade In Right', 'bootstrap-theme'), value: 'fadeInRight' },
                { label: __('--- Slide ---', 'bootstrap-theme'), value: '' },
                { label: __('Slide Up', 'bootstrap-theme'), value: 'slideUp' },
                { label: __('Slide Down', 'bootstrap-theme'), value: 'slideDown' },
                { label: __('Slide Left', 'bootstrap-theme'), value: 'slideLeft' },
                { label: __('Slide Right', 'bootstrap-theme'), value: 'slideRight' },
                { label: __('--- Scale ---', 'bootstrap-theme'), value: '' },
                { label: __('Scale In', 'bootstrap-theme'), value: 'scaleIn' },
                { label: __('Scale Up', 'bootstrap-theme'), value: 'scaleUp' },
                { label: __('Scale Down', 'bootstrap-theme'), value: 'scaleDown' },
                { label: __('--- Rotate ---', 'bootstrap-theme'), value: '' },
                { label: __('Rotate', 'bootstrap-theme'), value: 'rotate' },
                { label: __('Rotate Fast', 'bootstrap-theme'), value: 'rotateFast' },
                { label: __('--- Effects ---', 'bootstrap-theme'), value: '' },
                { label: __('Bounce', 'bootstrap-theme'), value: 'bounce' },
                { label: __('Elastic', 'bootstrap-theme'), value: 'elastic' },
                { label: __('Flip', 'bootstrap-theme'), value: 'flip' },
                { label: __('Flip X', 'bootstrap-theme'), value: 'flipX' },
                { label: __('Pulse', 'bootstrap-theme'), value: 'pulse' },
            ];

            const animationTriggers = [
                { label: __('On Load', 'bootstrap-theme'), value: 'on-load' },
                { label: __('On Scroll', 'bootstrap-theme'), value: 'on-scroll' },
                { label: __('On Hover', 'bootstrap-theme'), value: 'on-hover' },
                { label: __('On Click', 'bootstrap-theme'), value: 'on-click' },
            ];

            const easeOptions = [
                { label: __('Linear', 'bootstrap-theme'), value: 'linear' },
                { label: __('Power 1 In Out', 'bootstrap-theme'), value: 'power1.inOut' },
                { label: __('Power 2 In Out', 'bootstrap-theme'), value: 'power2.inOut' },
                { label: __('Power 3 In Out', 'bootstrap-theme'), value: 'power3.inOut' },
                { label: __('Power 4 In Out', 'bootstrap-theme'), value: 'power4.inOut' },
                { label: __('Back Out', 'bootstrap-theme'), value: 'back.out' },
                { label: __('Elastic Out', 'bootstrap-theme'), value: 'elastic.out' },
                { label: __('Bounce Out', 'bootstrap-theme'), value: 'bounce.out' },
                { label: __('Circ In Out', 'bootstrap-theme'), value: 'circ.inOut' },
                { label: __('Sine In Out', 'bootstrap-theme'), value: 'sine.inOut' },
            ];

            const animationType = attributes.animationType || '';

            const itemClasses = [
                'list-group-item',
                attributes.variant ? `list-group-item-${attributes.variant}` : '',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : '',
                attributes.actionable ? 'list-group-item-action' : ''
            ].filter(Boolean).join(' ');

            const TagName = attributes.actionable ? 'a' : 'li';

            // Build data attributes for animation
            const dataAttrs = {};
            if (attributes.animationType) {
                dataAttrs['data-animate-type'] = attributes.animationType;
                dataAttrs['data-animate-trigger'] = attributes.animationTrigger || 'on-scroll';
                dataAttrs['data-animate-duration'] = attributes.animationDuration || 0.6;
                dataAttrs['data-animate-delay'] = attributes.animationDelay || 0;
                dataAttrs['data-animate-ease'] = attributes.animationEase || 'power2.inOut';
                if (attributes.animationRepeat != null) dataAttrs['data-animate-repeat'] = attributes.animationRepeat;
                if (attributes.animationRepeatDelay != null) dataAttrs['data-animate-repeat-delay'] = attributes.animationRepeatDelay;
                if (attributes.animationYoyo) dataAttrs['data-animate-yoyo'] = 'true';
                if (attributes.animationDistance) dataAttrs['data-animate-distance'] = attributes.animationDistance;
                if (attributes.animationRotation != null) dataAttrs['data-animate-rotation'] = attributes.animationRotation;
                if (attributes.animationScale) dataAttrs['data-animate-scale'] = attributes.animationScale;
                if (attributes.animationParallaxSpeed != null) dataAttrs['data-animate-parallax-speed'] = attributes.animationParallaxSpeed;
                if (attributes.animationHoverEffect) dataAttrs['data-animate-hover-effect'] = attributes.animationHoverEffect;
                if (attributes.animationMobileEnabled != null) dataAttrs['data-animate-mobile'] = attributes.animationMobileEnabled ? '1' : '0';
            }
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('List Item Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Color Variant', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Active', 'bootstrap-theme'),
                            help: __('Mark as active/current item', 'bootstrap-theme'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Disabled', 'bootstrap-theme'),
                            help: __('Make item appear disabled', 'bootstrap-theme'),
                            checked: attributes.disabled,
                            onChange: (value) => setAttributes({ disabled: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Actionable', 'bootstrap-theme'),
                            help: __('Make item clickable/hoverable', 'bootstrap-theme'),
                            checked: attributes.actionable,
                            onChange: (value) => setAttributes({ actionable: value })
                        }),
                        attributes.actionable && createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'bootstrap-theme')
                        }),
                        attributes.actionable && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'bootstrap-theme'),
                            checked: attributes.openInNewTab,
                            onChange: (value) => setAttributes({ openInNewTab: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Complex Content', 'bootstrap-theme'),
                            help: __('Enable rich content instead of simple text', 'bootstrap-theme'),
                            checked: attributes.hasContent,
                            onChange: (value) => setAttributes({ hasContent: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
                            value: animationType,
                            options: animationTypes,
                            onChange: (value) => {
                                const updates = { animationType: value };
                                if (value && value !== '') {
                                    if (!attributes.animationDuration || attributes.animationDuration === '') {
                                        updates.animationDuration = 0.6;
                                    }
                                    if (!attributes.animationDelay || attributes.animationDelay === '') {
                                        updates.animationDelay = 0;
                                    }
                                    if (!attributes.animationTrigger || attributes.animationTrigger === '') {
                                        updates.animationTrigger = 'on-scroll';
                                    }
                                    if (!attributes.animationEase || attributes.animationEase === '') {
                                        updates.animationEase = 'power2.inOut';
                                    }
                                }
                                setAttributes(updates);
                            }
                        }),
                        animationType && createElement(Fragment, null,
                            createElement(SelectControl, {
                                label: __('Trigger', 'bootstrap-theme'),
                                value: attributes.animationTrigger,
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'bootstrap-theme'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase,
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            })
                        )
                    )
                ),
                createElement(TagName, 
                    Object.assign({}, blockProps, { 
                        className: `${itemClasses} ${blockProps.className || ''}`.trim(),
                        href: attributes.actionable ? attributes.href : undefined,
                        target: (attributes.actionable && attributes.openInNewTab) ? '_blank' : undefined,
                        rel: (attributes.actionable && attributes.openInNewTab) ? 'noopener noreferrer' : undefined,
                        onClick: attributes.actionable ? (e) => e.preventDefault() : undefined
                    }, dataAttrs),
                    attributes.hasContent ?
                        createElement(InnerBlocks, {
                            placeholder: __('Add list item content...', 'bootstrap-theme'),
                            template: [
                                ['core/heading', { 
                                    content: __('List item heading', 'bootstrap-theme'),
                                    level: 5
                                }],
                                ['core/paragraph', { 
                                    content: __('Some additional content for this list item.', 'bootstrap-theme')
                                }]
                            ]
                        }) :
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: __('List item text...', 'bootstrap-theme'),
                            allowedFormats: ['core/bold', 'core/italic']
                        })
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps.save();
            
            const itemClasses = [
                'list-group-item',
                attributes.variant ? `list-group-item-${attributes.variant}` : '',
                attributes.active ? 'active' : '',
                attributes.disabled ? 'disabled' : '',
                attributes.actionable ? 'list-group-item-action' : ''
            ].filter(Boolean).join(' ');

            const TagName = attributes.actionable ? 'a' : 'li';

            // Build data attrs for save
            const dataAttrs = {};
            if (attributes.animationType) {
                dataAttrs['data-animate-type'] = attributes.animationType;
                dataAttrs['data-animate-trigger'] = attributes.animationTrigger || 'on-scroll';
                dataAttrs['data-animate-duration'] = attributes.animationDuration || 0.6;
                dataAttrs['data-animate-delay'] = attributes.animationDelay || 0;
                dataAttrs['data-animate-ease'] = attributes.animationEase || 'power2.inOut';
                if (attributes.animationRepeat != null) dataAttrs['data-animate-repeat'] = attributes.animationRepeat;
                if (attributes.animationRepeatDelay != null) dataAttrs['data-animate-repeat-delay'] = attributes.animationRepeatDelay;
                if (attributes.animationYoyo) dataAttrs['data-animate-yoyo'] = 'true';
                if (attributes.animationDistance) dataAttrs['data-animate-distance'] = attributes.animationDistance;
                if (attributes.animationRotation != null) dataAttrs['data-animate-rotation'] = attributes.animationRotation;
                if (attributes.animationScale) dataAttrs['data-animate-scale'] = attributes.animationScale;
                if (attributes.animationParallaxSpeed != null) dataAttrs['data-animate-parallax-speed'] = attributes.animationParallaxSpeed;
                if (attributes.animationHoverEffect) dataAttrs['data-animate-hover-effect'] = attributes.animationHoverEffect;
                if (attributes.animationMobileEnabled != null) dataAttrs['data-animate-mobile'] = attributes.animationMobileEnabled ? '1' : '0';
            }

            return createElement(TagName, 
                Object.assign({}, blockProps, { 
                    className: itemClasses,
                    href: attributes.actionable ? attributes.href : undefined,
                    target: (attributes.actionable && attributes.openInNewTab) ? '_blank' : undefined,
                    rel: (attributes.actionable && attributes.openInNewTab) ? 'noopener noreferrer' : undefined
                }, dataAttrs),
                attributes.hasContent ?
                    createElement(InnerBlocks.Content) :
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: attributes.text
                    })
            );
        }
    });

})(window.wp);