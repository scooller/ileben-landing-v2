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
        title: __('Bootstrap List Group Item', 'ileben-landing'),
        description: __('Individual item within a list group', 'ileben-landing'),
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
            },            animationScrollStart: {
                type: 'string',
                default: 'top 70%'
            },
            animationScrollEnd: {
                type: 'string',
                default: 'top 10%'
            },
            animationScrollMarkers: {
                type: 'boolean',
                default: false
            },            animationDelay: {
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
                    alt: __('List group item preview', 'ileben-landing'),
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
                { label: __('None', 'ileben-landing'), value: '' },
                { label: __('--- Fade ---', 'ileben-landing'), value: '' },
                { label: __('Fade In', 'ileben-landing'), value: 'fadeIn' },
                { label: __('Fade In Up', 'ileben-landing'), value: 'fadeInUp' },
                { label: __('Fade In Down', 'ileben-landing'), value: 'fadeInDown' },
                { label: __('Fade In Left', 'ileben-landing'), value: 'fadeInLeft' },
                { label: __('Fade In Right', 'ileben-landing'), value: 'fadeInRight' },
                { label: __('--- Slide ---', 'ileben-landing'), value: '' },
                { label: __('Slide Up', 'ileben-landing'), value: 'slideUp' },
                { label: __('Slide Down', 'ileben-landing'), value: 'slideDown' },
                { label: __('Slide Left', 'ileben-landing'), value: 'slideLeft' },
                { label: __('Slide Right', 'ileben-landing'), value: 'slideRight' },
                { label: __('--- Scale ---', 'ileben-landing'), value: '' },
                { label: __('Scale In', 'ileben-landing'), value: 'scaleIn' },
                { label: __('Scale Up', 'ileben-landing'), value: 'scaleUp' },
                { label: __('Scale Down', 'ileben-landing'), value: 'scaleDown' },
                { label: __('--- Rotate ---', 'ileben-landing'), value: '' },
                { label: __('Rotate', 'ileben-landing'), value: 'rotate' },
                { label: __('Rotate Fast', 'ileben-landing'), value: 'rotateFast' },
                { label: __('--- Effects ---', 'ileben-landing'), value: '' },
                { label: __('Bounce', 'ileben-landing'), value: 'bounce' },
                { label: __('Elastic', 'ileben-landing'), value: 'elastic' },
                { label: __('Flip', 'ileben-landing'), value: 'flip' },
                { label: __('Flip X', 'ileben-landing'), value: 'flipX' },
                { label: __('Pulse', 'ileben-landing'), value: 'pulse' },
            ];

            const animationTriggers = [
                { label: __('On Load', 'ileben-landing'), value: 'on-load' },
                { label: __('On Scroll', 'ileben-landing'), value: 'on-scroll' },
                { label: __('On Hover', 'ileben-landing'), value: 'on-hover' },
                { label: __('On Click', 'ileben-landing'), value: 'on-click' },
            ];

            const easeOptions = [
                { label: __('Linear', 'ileben-landing'), value: 'linear' },
                { label: __('Power 1 In Out', 'ileben-landing'), value: 'power1.inOut' },
                { label: __('Power 2 In Out', 'ileben-landing'), value: 'power2.inOut' },
                { label: __('Power 3 In Out', 'ileben-landing'), value: 'power3.inOut' },
                { label: __('Power 4 In Out', 'ileben-landing'), value: 'power4.inOut' },
                { label: __('Back Out', 'ileben-landing'), value: 'back.out' },
                { label: __('Elastic Out', 'ileben-landing'), value: 'elastic.out' },
                { label: __('Bounce Out', 'ileben-landing'), value: 'bounce.out' },
                { label: __('Circ In Out', 'ileben-landing'), value: 'circ.inOut' },
                { label: __('Sine In Out', 'ileben-landing'), value: 'sine.inOut' },
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
                    createElement(PanelBody, { title: __('List Item Settings', 'ileben-landing') },
                        createElement(SelectControl, {
                            label: __('Color Variant', 'ileben-landing'),
                            value: attributes.variant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Active', 'ileben-landing'),
                            help: __('Mark as active/current item', 'ileben-landing'),
                            checked: attributes.active,
                            onChange: (value) => setAttributes({ active: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Disabled', 'ileben-landing'),
                            help: __('Make item appear disabled', 'ileben-landing'),
                            checked: attributes.disabled,
                            onChange: (value) => setAttributes({ disabled: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Actionable', 'ileben-landing'),
                            help: __('Make item clickable/hoverable', 'ileben-landing'),
                            checked: attributes.actionable,
                            onChange: (value) => setAttributes({ actionable: value })
                        }),
                        attributes.actionable && createElement(TextControl, {
                            label: __('Link URL', 'ileben-landing'),
                            value: attributes.href,
                            onChange: (value) => setAttributes({ href: value }),
                            placeholder: __('https://example.com', 'ileben-landing')
                        }),
                        attributes.actionable && createElement(ToggleControl, {
                            label: __('Open in New Tab', 'ileben-landing'),
                            checked: attributes.openInNewTab,
                            onChange: (value) => setAttributes({ openInNewTab: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Complex Content', 'ileben-landing'),
                            help: __('Enable rich content instead of simple text', 'ileben-landing'),
                            checked: attributes.hasContent,
                            onChange: (value) => setAttributes({ hasContent: value })
                        })
                    ),
                    // Animation Panel
                    createElement(PanelBody, { title: __('Animation', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Animation Type', 'ileben-landing'),
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
                                label: __('Trigger', 'ileben-landing'),
                                value: attributes.animationTrigger,
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Duration (seconds)', 'ileben-landing'),
                                value: attributes.animationDuration,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Delay (seconds)', 'ileben-landing'),
                                value: attributes.animationDelay,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase,
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                label: __('Scroll Start', 'ileben-landing'),
                                value: attributes.animationScrollStart || 'top 70%',
                                onChange: (value) => setAttributes({ animationScrollStart: value }),
                                help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                label: __('Scroll End', 'ileben-landing'),
                                value: attributes.animationScrollEnd || 'top 10%',
                                onChange: (value) => setAttributes({ animationScrollEnd: value }),
                                help: __('Ej: "top 10%", "bottom center"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(ToggleControl, {
                                label: __('Show ScrollTrigger Markers', 'ileben-landing'),
                                checked: attributes.animationScrollMarkers || false,
                                onChange: (value) => setAttributes({ animationScrollMarkers: value }),
                                help: __('Muestra lineas de debug en la pagina', 'ileben-landing')
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
                            placeholder: __('Add list item content...', 'ileben-landing'),
                            template: [
                                ['core/heading', { 
                                    content: __('List item heading', 'ileben-landing'),
                                    level: 5
                                }],
                                ['core/paragraph', { 
                                    content: __('Some additional content for this list item.', 'ileben-landing')
                                }]
                            ]
                        }) :
                        createElement(RichText, {
                            tagName: 'span',
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: __('List item text...', 'ileben-landing'),
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