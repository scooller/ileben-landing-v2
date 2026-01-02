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
        title: __('Contact Form 7', 'bootstrap-theme'),
        description: __('Insert a Contact Form 7 form with Bootstrap styles and animations', 'bootstrap-theme'),
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
                { label: __('None', 'bootstrap-theme'), value: '' },
                { label: __('Fade In', 'bootstrap-theme'), value: 'fadeIn' },
                { label: __('Fade In Up', 'bootstrap-theme'), value: 'fadeInUp' },
                { label: __('Fade In Down', 'bootstrap-theme'), value: 'fadeInDown' },
                { label: __('Fade In Left', 'bootstrap-theme'), value: 'fadeInLeft' },
                { label: __('Fade In Right', 'bootstrap-theme'), value: 'fadeInRight' },
                { label: __('Slide Up', 'bootstrap-theme'), value: 'slideUp' },
                { label: __('Slide Down', 'bootstrap-theme'), value: 'slideDown' },
                { label: __('Slide Left', 'bootstrap-theme'), value: 'slideLeft' },
                { label: __('Slide Right', 'bootstrap-theme'), value: 'slideRight' },
                { label: __('Scale In', 'bootstrap-theme'), value: 'scaleIn' },
                { label: __('Rotate', 'bootstrap-theme'), value: 'rotate' },
                { label: __('Bounce', 'bootstrap-theme'), value: 'bounce' },
                { label: __('Pulse', 'bootstrap-theme'), value: 'pulse' },
            ];

            const animationTriggers = [
                { label: __('On Load', 'bootstrap-theme'), value: 'on-load' },
                { label: __('On Scroll', 'bootstrap-theme'), value: 'on-scroll' },
                { label: __('On Hover', 'bootstrap-theme'), value: 'on-hover' },
                { label: __('On Click', 'bootstrap-theme'), value: 'on-click' },
            ];

            const easeOptions = [
                { label: __('Power 2 In Out', 'bootstrap-theme'), value: 'power2.inOut' },
                { label: __('Power 3 In Out', 'bootstrap-theme'), value: 'power3.inOut' },
                { label: __('Power 4 In Out', 'bootstrap-theme'), value: 'power4.inOut' },
                { label: __('Back Out', 'bootstrap-theme'), value: 'back.out' },
                { label: __('Elastic Out', 'bootstrap-theme'), value: 'elastic.out' },
                { label: __('Bounce Out', 'bootstrap-theme'), value: 'bounce.out' },
            ];

            const formOptions = [
                { label: __('Select a form…', 'bootstrap-theme'), value: 0 },
                ...forms
            ];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Form Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Contact Form', 'bootstrap-theme'),
                            value: attributes.formId,
                            options: formOptions,
                            onChange: (value) => setAttributes({ formId: parseInt(value, 10) || 0 })
                        }),
                        createElement(TextControl, {
                            label: __('Form ID (manual fallback)', 'bootstrap-theme'),
                            value: attributes.formId || '',
                            onChange: (value) => setAttributes({ formId: parseInt(value, 10) || 0 }),
                            help: __('If the list is empty, type the form ID manually.', 'bootstrap-theme')
                        })
                    ),
                    createElement(PanelBody, { title: __('Animation', 'bootstrap-theme'), initialOpen: false },
                        createElement(SelectControl, {
                            label: __('Animation Type', 'bootstrap-theme'),
                            value: attributes.animationType || '',
                            options: animationTypes,
                            onChange: (value) => setAttributes({ animationType: value })
                        }),
                        attributes.animationType && createElement(Fragment, null,
                            createElement(SelectControl, {
                                label: __('Trigger', 'bootstrap-theme'),
                                value: attributes.animationTrigger || 'on-load',
                                options: animationTriggers,
                                onChange: (value) => setAttributes({ animationTrigger: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Duration (s)', 'bootstrap-theme'),
                                value: attributes.animationDuration || 0.6,
                                min: 0.1,
                                max: 3,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDuration: value })
                            }),
                            createElement(RangeControl, {
                                label: __('Delay (s)', 'bootstrap-theme'),
                                value: attributes.animationDelay || 0,
                                min: 0,
                                max: 5,
                                step: 0.1,
                                onChange: (value) => setAttributes({ animationDelay: value })
                            }),
                            createElement(SelectControl, {
                                label: __('Easing', 'bootstrap-theme'),
                                value: attributes.animationEase || 'power2.inOut',
                                options: easeOptions,
                                onChange: (value) => setAttributes({ animationEase: value })
                            }),
                            createElement(ToggleControl, {
                                label: __('Enable on Mobile', 'bootstrap-theme'),
                                checked: attributes.animationMobileEnabled !== false,
                                onChange: (value) => setAttributes({ animationMobileEnabled: value })
                            })
                        )
                    )
                ),
                createElement('div', Object.assign({}, blockProps, { className: `bs-cf7-preview ${blockProps.className || ''}` }),
                    attributes.formId
                        ? createElement('div', { style: { padding: '12px', border: '1px dashed #ccc' } },
                            createElement('strong', null, __('Contact Form', 'bootstrap-theme')), ' #', attributes.formId,
                            createElement('div', { style: { marginTop: '8px', opacity: 0.7 } }, __('The form will render on the frontend.', 'bootstrap-theme'))
                        )
                        : createElement('div', { style: { padding: '12px', border: '1px dashed #ccc', color: '#666' } },
                            __('Select a Contact Form 7 form to display.', 'bootstrap-theme')
                        )
                )
            );
        },
        save: function() {
            return null; // Server-rendered
        }
    });

})(window.wp);
