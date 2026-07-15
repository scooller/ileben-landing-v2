/**
 * Bootstrap CF7 Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, RangeControl, ToggleControl } = wp.components;
    const { createElement, Fragment, useEffect, useState } = wp.element;

    registerBlockType('bootstrap-theme/bs-cf7', {
        apiVersion: 3,
        title: __('Contact Form 7', 'ileben-landing'),
        description: __('Insert a Contact Form 7 form with Bootstrap styles and animations', 'ileben-landing'),
        icon: 'feedback',
        category: 'ileben-landing',
        supports: {
            anchor: true
        },
        attributes: {
            formId: {
                type: 'number',
                default: 0
            },
            anchor: {
                type: 'string',
                default: ''
            },
            className: {
                type: 'string',
                default: ''
            },
            // Animation attributes
            animationType: {
                type: 'string'
            },
            animationTrigger: {
                type: 'string'
            },
            animationDuration: {
                type: 'number'
            },
            animationDelay: {
                type: 'number'
            },
            animationEase: {
                type: 'string'
            },
            animationRepeat: {
                type: 'number'
            },
            animationRepeatDelay: {
                type: 'number'
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
            animationScrollStart: {
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
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const [forms, setForms] = useState([]);

            // Fetch CF7 forms list (best-effort)
            useEffect(() => {
                if (!wp.apiFetch) return;
                wp.apiFetch({ path: '/contact-form-7/v1/contact-forms?per_page=100' }).then((response) => {
                    if (Array.isArray(response)) {
                        const options = response.map((form) => ({ label: form.title || `ID ${form.id}` , value: form.id }));
                        setForms(options);
                    }
                }).catch(() => {
                    // Silent fail; user can still input the ID manually
                });
            }, []);

            const animationTypes = [
                { label: __('None', 'ileben-landing'), value: '' },
                { label: __('Fade In', 'ileben-landing'), value: 'fadeIn' },
                { label: __('Fade In Up', 'ileben-landing'), value: 'fadeInUp' },
                { label: __('Fade In Down', 'ileben-landing'), value: 'fadeInDown' },
                { label: __('Fade In Left', 'ileben-landing'), value: 'fadeInLeft' },
                { label: __('Fade In Right', 'ileben-landing'), value: 'fadeInRight' },
                { label: __('Slide Up', 'ileben-landing'), value: 'slideUp' },
                { label: __('Slide Down', 'ileben-landing'), value: 'slideDown' },
                { label: __('Slide Left', 'ileben-landing'), value: 'slideLeft' },
                { label: __('Slide Right', 'ileben-landing'), value: 'slideRight' },
                { label: __('Scale In', 'ileben-landing'), value: 'scaleIn' },
                { label: __('Rotate', 'ileben-landing'), value: 'rotate' },
                { label: __('Bounce', 'ileben-landing'), value: 'bounce' },
                { label: __('Pulse', 'ileben-landing'), value: 'pulse' },
            ];

            const animationTriggers = [
                { label: __('On Load', 'ileben-landing'), value: 'on-load' },
                { label: __('On Scroll', 'ileben-landing'), value: 'on-scroll' },
                { label: __('On Hover', 'ileben-landing'), value: 'on-hover' },
                { label: __('On Click', 'ileben-landing'), value: 'on-click' },
            ];

            const easeOptions = [
                { label: __('Power 2 In Out', 'ileben-landing'), value: 'power2.inOut' },
                { label: __('Power 3 In Out', 'ileben-landing'), value: 'power3.inOut' },
                { label: __('Power 4 In Out', 'ileben-landing'), value: 'power4.inOut' },
                { label: __('Back Out', 'ileben-landing'), value: 'back.out' },
                { label: __('Elastic Out', 'ileben-landing'), value: 'elastic.out' },
                { label: __('Bounce Out', 'ileben-landing'), value: 'bounce.out' },
            ];

            const formOptions = [
                { label: __('Select a form...', 'ileben-landing'), value: 0 },
                ...forms
            ];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Form Settings', 'ileben-landing') },
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Contact Form', 'ileben-landing'),
                            value: attributes.formId,
                            options: formOptions,
                            onChange: (value) => setAttributes({ formId: parseInt(value, 10) || 0 })
                        }),
                        createElement(TextControl, {
                            __next40pxDefaultSize: true, label: __('Form ID (manual fallback)', 'ileben-landing'),
                            value: attributes.formId || '',
                            onChange: (value) => setAttributes({ formId: parseInt(value, 10) || 0 }),
                            help: __('If the list is empty, type the form ID manually.', 'ileben-landing')
                        })
                    ),
                    createElement(PanelBody, { title: __('Animation', 'ileben-landing'), initialOpen: false },
                        createElement(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Animation Type', 'ileben-landing'),
                            value: attributes.animationType || '',
                            options: animationTypes,
                            onChange: (value) => setAttributes({ animationType: value })
                        }),
                        attributes.animationType && createElement(Fragment, null,
                            createElement(SelectControl, {
                                __next40pxDefaultSize: true, label: __('Trigger', 'ileben-landing'),
                                value: attributes.animationTrigger || 'on-load',
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                __next40pxDefaultSize: true, label: __('Duration (s)', 'ileben-landing'),
                                value: attributes.animationDuration || 0.6,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                __next40pxDefaultSize: true, label: __('Delay (s)', 'ileben-landing'),
                                value: attributes.animationDelay || 0,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                __next40pxDefaultSize: true, label: __('Easing', 'ileben-landing'),
                                value: attributes.animationEase || 'power2.inOut',
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                __next40pxDefaultSize: true, label: __('Scroll Start', 'ileben-landing'),
                                value: attributes.animationScrollStart || 'top 70%',
                                onChange: (value) => setAttributes({ animationScrollStart: value }),
                                help: __('Ej: "top 70%", "top center", "top bottom"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(TextControl, {
                                __next40pxDefaultSize: true, label: __('Scroll End', 'ileben-landing'),
                                value: attributes.animationScrollEnd || 'top 10%',
                                onChange: (value) => setAttributes({ animationScrollEnd: value }),
                                help: __('Ej: "top 10%", "bottom center"', 'ileben-landing')
                            }),
                            attributes.animationTrigger === 'on-scroll' && createElement(ToggleControl, {
                                label: __('Show ScrollTrigger Markers', 'ileben-landing'),
                                checked: attributes.animationScrollMarkers || false,
                                onChange: (value) => setAttributes({ animationScrollMarkers: value }),
                                help: __('Muestra lineas de debug en la pagina', 'ileben-landing')
                            }),
                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'ileben-landing'),
                                checked: attributes.animationMobileEnabled !== false,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    )
                ),
                createElement('div', Object.assign({}, blockProps, { className: `bs-cf7-preview ${blockProps.className || ''}` }),
                    attributes.formId
                        ? createElement('div', { style: { padding: '12px', border: '1px dashed #ccc' } },
                            createElement('strong', null, __('Contact Form', 'ileben-landing')), ' #', attributes.formId,
                            createElement('div', { style: { marginTop: '8px', opacity: 0.7 } }, __('The form will render on the frontend.', 'ileben-landing'))
                        )
                        : createElement('div', { style: { padding: '12px', border: '1px dashed #ccc', color: '#666' } },
                            __('Select a Contact Form 7 form to display.', 'ileben-landing')
                        )
                )
            );
        },
        save: function() {
            return null; // Server-rendered
        }
    });

})(window.wp);