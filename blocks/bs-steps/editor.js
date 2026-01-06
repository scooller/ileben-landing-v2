/**
 * Bootstrap Steps Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, SelectControl, ToggleControl } = wp.components;
    const { createElement, Fragment, useEffect } = wp.element;
    const { useSelect } = wp.data;

    registerBlockType('bootstrap-theme/bs-steps', {
        title: __('Bootstrap Steps', 'bootstrap-theme'),
        description: __('Display a progress stepper with customizable steps', 'bootstrap-theme'),
        icon: 'list-view',
        category: 'ileben-landing',
        keywords: [__('steps'), __('stepper'), __('progress'), __('timeline'), __('bootstrap')],
        
        attributes: {
            currentStep: {
                type: 'number',
                default: 2
            },
            colorVariant: {
                type: 'string',
                default: 'primary'
            },
            showProgress: {
                type: 'boolean',
                default: true
            },
            animateProgress: {
                type: 'boolean',
                default: true
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
            const { attributes, setAttributes, clientId } = props;
            const blockProps = useBlockProps();
            
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-steps/example.png',
                    alt: 'Preview',
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }

            // Get inner blocks (step items)
            const innerBlocks = useSelect(
                (select) => select('core/block-editor').getBlock(clientId)?.innerBlocks || [],
                [clientId]
            );

            const totalSteps = innerBlocks.length;
            const progressPercentage = totalSteps > 1 ? ((attributes.currentStep - 1) / (totalSteps - 1)) * 100 : 0;

            // Auto-adjust currentStep if it exceeds total steps
            useEffect(() => {
                if (attributes.currentStep > totalSteps && totalSteps > 0) {
                    setAttributes({ currentStep: totalSteps });
                }
            }, [totalSteps]);

            const variantOptions = [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
                { label: 'Dark', value: 'dark' }
            ];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Steps Settings', 'bootstrap-theme') },
                        totalSteps > 0 && createElement(RangeControl, {
                            label: __('Current Step', 'bootstrap-theme'),
                            value: Math.min(attributes.currentStep, totalSteps),
                            onChange: (value) => setAttributes({ currentStep: value }),
                            min: 1,
                            max: Math.max(1, totalSteps),
                            help: __('Select which step is currently active', 'bootstrap-theme')
                        }),
                        createElement(SelectControl, {
                            label: __('Color Variant', 'bootstrap-theme'),
                            value: attributes.colorVariant,
                            options: variantOptions,
                            onChange: (value) => setAttributes({ colorVariant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Show Progress Bar', 'bootstrap-theme'),
                            checked: attributes.showProgress,
                            onChange: (value) => setAttributes({ showProgress: value })
                        }),
                        attributes.showProgress && createElement(ToggleControl, {
                            label: __('Animate Progress', 'bootstrap-theme'),
                            help: __('Animate progress bar on page load', 'bootstrap-theme'),
                            checked: attributes.animateProgress,
                            onChange: (value) => setAttributes({ animateProgress: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'bs-steps' },
                        createElement('div', { 
                            className: 'bs-steps-header d-flex justify-content-between align-items-start position-relative mb-3'
                        },
                            // Progress bar
                            attributes.showProgress && totalSteps > 0 && createElement('div', {
                                className: 'bs-steps-progress position-absolute w-100',
                                style: { top: '20px', left: 0, height: '4px', zIndex: 0 }
                            },
                                createElement('div', { className: 'bg-light w-100 h-100' }),
                                createElement('div', {
                                    className: `bg-${attributes.colorVariant} h-100`,
                                    style: { width: `${progressPercentage}%`, transition: 'width 0.3s ease' }
                                })
                            ),
                            // Steps (rendered from inner blocks)
                            innerBlocks.map((block, index) => {
                                const stepNumber = index + 1;
                                const isActive = stepNumber === attributes.currentStep;
                                const isCompleted = stepNumber < attributes.currentStep;
                                const stepTitle = block.attributes.title || 'Step ' + stepNumber;
                                
                                let circleClasses = 'bs-step-circle rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-2';
                                let titleClasses = 'bs-step-title small';
                                
                                if (isActive) {
                                    circleClasses += ` bg-${attributes.colorVariant} text-white`;
                                    titleClasses += ` fw-bold text-${attributes.colorVariant}`;
                                } else if (isCompleted) {
                                    circleClasses += ` bg-${attributes.colorVariant} text-white opacity-75`;
                                    titleClasses += ` text-${attributes.colorVariant}`;
                                } else {
                                    circleClasses += ' bg-light text-muted border';
                                    titleClasses += ' text-muted';
                                }
                                
                                return createElement('div', {
                                    key: block.clientId,
                                    className: 'bs-step text-center position-relative flex-grow-1',
                                    style: { zIndex: 1 }
                                },
                                    createElement('div', {
                                        className: circleClasses,
                                        style: { width: '40px', height: '40px' }
                                    }, stepNumber),
                                    createElement('div', { className: titleClasses }, stepTitle)
                                );
                            })
                        ),
                        createElement('div', { className: 'mt-3' },
                            createElement(InnerBlocks, {
                                allowedBlocks: ['bootstrap-theme/bs-step-item'],
                                template: [
                                    ['bootstrap-theme/bs-step-item', { title: 'Desarrollo' }],
                                    ['bootstrap-theme/bs-step-item', { title: 'Lanzamiento' }],
                                    ['bootstrap-theme/bs-step-item', { title: 'Inicio de obra' }],
                                    ['bootstrap-theme/bs-step-item', { title: 'Construcción' }]
                                ],
                                renderAppender: InnerBlocks.ButtonBlockAppender
                            })
                        )
                    )
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

})(window.wp);
