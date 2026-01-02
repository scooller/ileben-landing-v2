/**
 * Bootstrap Theme Blocks
 * JavaScript para todos los bloques de Bootstrap
 * 
 * @package Bootstrap_Theme
 */

(function() {
    'use strict';

    const { registerBlockType } = wp.blocks;
    const { createElement, Fragment } = wp.element;
    const { InnerBlocks, InspectorControls, MediaUpload, RichText, useBlockProps } = wp.blockEditor;
    const { 
        PanelBody, 
        SelectControl, 
        ToggleControl, 
        TextControl, 
        Button,
        RangeControl,
        ColorPalette,
        ButtonGroup
    } = wp.components;
    const { __ } = wp.i18n;

    // Colores de Bootstrap
    const bootstrapColors = [
        { name: 'Primary', color: '#0d6efd' },
        { name: 'Secondary', color: '#6c757d' },
        { name: 'Success', color: '#198754' },
        { name: 'Danger', color: '#dc3545' },
        { name: 'Warning', color: '#ffc107' },
        { name: 'Info', color: '#0dcaf0' },
        { name: 'Light', color: '#f8f9fa' },
        { name: 'Dark', color: '#212529' }
    ];

    // Opciones comunes para selectores
    const buttonVariants = [
        { label: 'Primary', value: 'btn-primary' },
        { label: 'Secondary', value: 'btn-secondary' },
        { label: 'Success', value: 'btn-success' },
        { label: 'Danger', value: 'btn-danger' },
        { label: 'Warning', value: 'btn-warning' },
        { label: 'Info', value: 'btn-info' },
        { label: 'Light', value: 'btn-light' },
        { label: 'Dark', value: 'btn-dark' },
        { label: 'Link', value: 'btn-link' }
    ];

    const alertVariants = [
        { label: 'Primary', value: 'alert-primary' },
        { label: 'Secondary', value: 'alert-secondary' },
        { label: 'Success', value: 'alert-success' },
        { label: 'Danger', value: 'alert-danger' },
        { label: 'Warning', value: 'alert-warning' },
        { label: 'Info', value: 'alert-info' },
        { label: 'Light', value: 'alert-light' },
        { label: 'Dark', value: 'alert-dark' }
    ];

    const textAlignment = [
        { label: 'Left', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'end' }
    ];

    const columnSizes = [
        { label: 'Auto', value: 'auto' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' }
    ];

    // Bootstrap Button Block
    registerBlockType('bootstrap-theme/bs-button', {
        title: __('Bootstrap Button', 'bootstrap-theme'),
        description: __('A customizable Bootstrap button component', 'bootstrap-theme'),
        icon: 'button',
        category: 'ileben-landing',
        keywords: [__('button'), __('bootstrap'), __('link')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Button Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Button Text', 'bootstrap-theme'),
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Button Style', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: buttonVariants,
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Outline Style', 'bootstrap-theme'),
                            checked: attributes.outline,
                            onChange: (value) => setAttributes({ outline: value })
                        }),
                        createElement(TextControl, {
                            label: __('Link URL', 'bootstrap-theme'),
                            value: attributes.link,
                            onChange: (value) => setAttributes({ link: value })
                        })
                    )
                ),
                createElement('div', { className: 'wp-block-bootstrap-theme-bs-button' },
                    createElement('button', {
                        className: `btn ${attributes.outline ? attributes.variant.replace('btn-', 'btn-outline-') : attributes.variant}`,
                        type: 'button'
                    }, attributes.text || __('Button', 'bootstrap-theme'))
                )
            );
        },

        save: function() {
            return null; // Renderizado dinámico
        }
    });



    // Bootstrap Row Block
    registerBlockType('bootstrap-theme/bs-row', {
        title: __('Bootstrap Row', 'bootstrap-theme'),
        description: __('A Bootstrap grid row', 'bootstrap-theme'),
        icon: 'grid-view',
        category: 'ileben-landing',
        keywords: [__('row'), __('bootstrap'), __('grid')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Row Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('No Gutters', 'bootstrap-theme'),
                            checked: attributes.noGutters,
                            onChange: (value) => setAttributes({ noGutters: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Align Items', 'bootstrap-theme'),
                            value: attributes.alignItems,
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Start', value: 'start' },
                                { label: 'Center', value: 'center' },
                                { label: 'End', value: 'end' }
                            ],
                            onChange: (value) => setAttributes({ alignItems: value })
                        })
                    )
                ),
                createElement('div', {
                    className: `row wp-block-bootstrap-theme-bs-row ${attributes.noGutters ? 'g-0' : ''}`,
                    style: { border: '1px dashed #ccc', minHeight: '60px' }
                },
                    createElement(InnerBlocks, {
                        placeholder: __('Add columns to your row...', 'bootstrap-theme'),
                        allowedBlocks: ['bootstrap-theme/bs-column']
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

    // Bootstrap Column Block
    registerBlockType('bootstrap-theme/bs-column', {
        title: __('Bootstrap Column', 'bootstrap-theme'),
        description: __('A Bootstrap grid column', 'bootstrap-theme'),
        icon: 'columns',
        category: 'ileben-landing',
        keywords: [__('column'), __('bootstrap'), __('grid')],
        parent: ['bootstrap-theme/bs-row'],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Column Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Small (SM)', 'bootstrap-theme'),
                            value: attributes.sm,
                            options: [{ label: 'Auto', value: '' }, ...columnSizes.slice(1)],
                            onChange: (value) => setAttributes({ sm: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Medium (MD)', 'bootstrap-theme'),
                            value: attributes.md,
                            options: [{ label: 'Auto', value: '' }, ...columnSizes.slice(1)],
                            onChange: (value) => setAttributes({ md: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Large (LG)', 'bootstrap-theme'),
                            value: attributes.lg,
                            options: [{ label: 'Auto', value: '' }, ...columnSizes.slice(1)],
                            onChange: (value) => setAttributes({ lg: value })
                        })
                    )
                ),
                createElement('div', {
                    className: `col wp-block-bootstrap-theme-bs-column`,
                    style: { border: '1px solid #ddd', padding: '15px', minHeight: '50px' }
                },
                    createElement(InnerBlocks, {
                        placeholder: __('Add content to your column...', 'bootstrap-theme')
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

    // Bootstrap Alert Block
    registerBlockType('bootstrap-theme/bs-alert', {
        title: __('Bootstrap Alert', 'bootstrap-theme'),
        description: __('A dismissible Bootstrap alert component', 'bootstrap-theme'),
        icon: 'warning',
        category: 'ileben-landing',
        keywords: [__('alert'), __('bootstrap'), __('message')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Alert Settings', 'bootstrap-theme') },
                        createElement(SelectControl, {
                            label: __('Alert Style', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Success', value: 'success' },
                                { label: 'Danger', value: 'danger' },
                                { label: 'Warning', value: 'warning' },
                                { label: 'Info', value: 'info' },
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' }
                            ],
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Dismissible', 'bootstrap-theme'),
                            checked: attributes.dismissible,
                            onChange: (value) => setAttributes({ dismissible: value })
                        }),
                        createElement(TextControl, {
                            label: __('Alert Heading', 'bootstrap-theme'),
                            value: attributes.heading,
                            onChange: (value) => setAttributes({ heading: value })
                        })
                    )
                ),
                createElement('div', { 
                    className: `alert alert-${attributes.variant} wp-block-bootstrap-theme-bs-alert ${attributes.dismissible ? 'alert-dismissible' : ''}`,
                    role: 'alert'
                },
                    attributes.heading && createElement('h4', { className: 'alert-heading' }, attributes.heading),
                    createElement(InnerBlocks, {
                        placeholder: __('Add alert content...', 'bootstrap-theme')
                    }),
                    attributes.dismissible && createElement('button', {
                        type: 'button',
                        className: 'btn-close',
                        'data-bs-dismiss': 'alert'
                    })
                )
            );
        },

        save: function() {
            return createElement(InnerBlocks.Content);
        }
    });

    // Bootstrap Badge Block
    registerBlockType('bootstrap-theme/bs-badge', {
        title: __('Bootstrap Badge', 'bootstrap-theme'),
        description: __('A small Bootstrap badge component', 'bootstrap-theme'),
        icon: 'tag',
        category: 'ileben-landing',
        keywords: [__('badge'), __('bootstrap'), __('label')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Badge Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Badge Text', 'bootstrap-theme'),
                            value: attributes.text,
                            onChange: (value) => setAttributes({ text: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Badge Style', 'bootstrap-theme'),
                            value: attributes.variant,
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Success', value: 'success' },
                                { label: 'Danger', value: 'danger' },
                                { label: 'Warning', value: 'warning' },
                                { label: 'Info', value: 'info' },
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' }
                            ],
                            onChange: (value) => setAttributes({ variant: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Pill Shape', 'bootstrap-theme'),
                            checked: attributes.pill,
                            onChange: (value) => setAttributes({ pill: value })
                        })
                    )
                ),
                createElement('div', { className: 'wp-block-bootstrap-theme-bs-badge' },
                    createElement('span', {
                        className: `badge bg-${attributes.variant} ${attributes.pill ? 'rounded-pill' : ''}`
                    }, attributes.text || __('Badge', 'bootstrap-theme'))
                )
            );
        },

        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Accordion Block
    registerBlockType('bootstrap-theme/bs-accordion', {
        title: __('Bootstrap Accordion', 'bootstrap-theme'),
        description: __('A collapsible Bootstrap accordion component', 'bootstrap-theme'),
        icon: 'list-view',
        category: 'ileben-landing',
        keywords: [__('accordion'), __('bootstrap'), __('collapse')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            const updateItem = (index, field, value) => {
                const newItems = [...(attributes.items || [])];
                if (!newItems[index]) {
                    newItems[index] = {};
                }
                newItems[index][field] = value;
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                const newItems = [...(attributes.items || [])];
                newItems.push({
                    title: __('New Accordion Item', 'bootstrap-theme'),
                    content: __('Add your content here...', 'bootstrap-theme'),
                    isOpen: false
                });
                setAttributes({ items: newItems });
            };

            const removeItem = (index) => {
                const newItems = [...(attributes.items || [])];
                newItems.splice(index, 1);
                setAttributes({ items: newItems });
            };
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Accordion Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Flush Style', 'bootstrap-theme'),
                            checked: attributes.flush,
                            onChange: (value) => setAttributes({ flush: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Always Open', 'bootstrap-theme'),
                            checked: attributes.alwaysOpen,
                            onChange: (value) => setAttributes({ alwaysOpen: value })
                        }),
                        createElement(Button, {
                            isPrimary: true,
                            onClick: addItem
                        }, __('Add Accordion Item', 'bootstrap-theme'))
                    )
                ),
                createElement('div', { 
                    className: `accordion wp-block-bootstrap-theme-bs-accordion ${attributes.flush ? 'accordion-flush' : ''}`
                },
                    (attributes.items || []).map((item, index) =>
                        createElement('div', { key: index, className: 'accordion-item' },
                            createElement('h2', { className: 'accordion-header' },
                                createElement(TextControl, {
                                    value: item.title || '',
                                    onChange: (value) => updateItem(index, 'title', value),
                                    placeholder: __('Accordion Title', 'bootstrap-theme')
                                })
                            ),
                            createElement('div', { className: 'accordion-collapse' },
                                createElement('div', { className: 'accordion-body' },
                                    createElement(TextControl, {
                                        value: item.content || '',
                                        onChange: (value) => updateItem(index, 'content', value),
                                        placeholder: __('Accordion Content', 'bootstrap-theme')
                                    }),
                                    createElement(Button, {
                                        isDestructive: true,
                                        onClick: () => removeItem(index)
                                    }, __('Remove Item', 'bootstrap-theme'))
                                )
                            )
                        )
                    ),
                    (!attributes.items || attributes.items.length === 0) && 
                        createElement('p', {}, __('Click "Add Accordion Item" to get started.', 'bootstrap-theme'))
                )
            );
        },

        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Breadcrumb Block
    registerBlockType('bootstrap-theme/bs-breadcrumb', {
        title: __('Bootstrap Breadcrumb', 'bootstrap-theme'),
        description: __('A Bootstrap breadcrumb navigation component', 'bootstrap-theme'),
        icon: 'admin-home',
        category: 'ileben-landing',
        keywords: [__('breadcrumb'), __('bootstrap'), __('navigation')],
        
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            const updateItem = (index, field, value) => {
                const newItems = [...(attributes.items || [])];
                if (!newItems[index]) {
                    newItems[index] = {};
                }
                newItems[index][field] = value;
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                const newItems = [...(attributes.items || [])];
                newItems.push({
                    label: __('New Page', 'bootstrap-theme'),
                    url: '',
                    active: false
                });
                setAttributes({ items: newItems });
            };

            const removeItem = (index) => {
                const newItems = [...(attributes.items || [])];
                newItems.splice(index, 1);
                setAttributes({ items: newItems });
            };
            
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Breadcrumb Settings', 'bootstrap-theme') },
                        createElement(TextControl, {
                            label: __('Custom Divider', 'bootstrap-theme'),
                            value: attributes.divider,
                            onChange: (value) => setAttributes({ divider: value }),
                            help: __('Leave empty for default ">" divider', 'bootstrap-theme')
                        }),
                        createElement(Button, {
                            isPrimary: true,
                            onClick: addItem
                        }, __('Add Breadcrumb Item', 'bootstrap-theme'))
                    )
                ),
                createElement('nav', { 'aria-label': 'breadcrumb' },
                    createElement('ol', { 
                        className: 'breadcrumb wp-block-bootstrap-theme-bs-breadcrumb'
                    },
                        (attributes.items || []).map((item, index) =>
                            createElement('li', { 
                                key: index, 
                                className: `breadcrumb-item ${item.active ? 'active' : ''}` 
                            },
                                createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                                    createElement(TextControl, {
                                        value: item.label || '',
                                        onChange: (value) => updateItem(index, 'label', value),
                                        placeholder: __('Page Name', 'bootstrap-theme')
                                    }),
                                    !item.active && createElement(TextControl, {
                                        value: item.url || '',
                                        onChange: (value) => updateItem(index, 'url', value),
                                        placeholder: __('URL', 'bootstrap-theme')
                                    }),
                                    createElement(ToggleControl, {
                                        label: __('Active', 'bootstrap-theme'),
                                        checked: item.active || false,
                                        onChange: (value) => updateItem(index, 'active', value)
                                    }),
                                    createElement(Button, {
                                        isDestructive: true,
                                        onClick: () => removeItem(index)
                                    }, __('Remove', 'bootstrap-theme'))
                                )
                            )
                        ),
                        (!attributes.items || attributes.items.length === 0) && 
                            createElement('li', { className: 'breadcrumb-item' }, 
                                __('Click "Add Breadcrumb Item" to get started.', 'bootstrap-theme')
                            )
                    )
                )
            );
        },

        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Button Group Block
    registerBlockType('bootstrap-theme/bs-button-group', {
        title: __('Bootstrap Button Group', 'bootstrap-theme'),
        description: __('A group of Bootstrap buttons', 'bootstrap-theme'),
        icon: 'button',
        category: 'ileben-landing',
        keywords: [__('button'), __('group'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement(InnerBlocks, {
                    allowedBlocks: ['bootstrap-theme/bs-button'],
                    template: [
                        ['bootstrap-theme/bs-button', { text: 'Button 1' }],
                        ['bootstrap-theme/bs-button', { text: 'Button 2' }]
                    ]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Carousel Block
    registerBlockType('bootstrap-theme/bs-carousel', {
        title: __('Bootstrap Carousel', 'bootstrap-theme'),
        description: __('A Bootstrap carousel slideshow component', 'bootstrap-theme'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('carousel'), __('slider'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('p', {}, __('Bootstrap Carousel - Configure in sidebar', 'bootstrap-theme')),
                createElement(InnerBlocks, {
                    template: [
                        ['core/image'],
                        ['core/image']
                    ]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Close Button Block
    registerBlockType('bootstrap-theme/bs-close-button', {
        title: __('Bootstrap Close Button', 'bootstrap-theme'),
        description: __('A Bootstrap close button', 'bootstrap-theme'),
        icon: 'no',
        category: 'ileben-landing',
        keywords: [__('close'), __('button'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('button', 
                Object.assign({}, blockProps, { 
                    className: blockProps.className + ' btn-close',
                    'aria-label': 'Close'
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Collapse Block
    registerBlockType('bootstrap-theme/bs-collapse', {
        title: __('Bootstrap Collapse', 'bootstrap-theme'),
        description: __('A Bootstrap collapse component', 'bootstrap-theme'),
        icon: 'arrow-down',
        category: 'ileben-landing',
        keywords: [__('collapse'), __('toggle'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('p', {}, __('Collapse Trigger', 'bootstrap-theme')),
                createElement(InnerBlocks, {
                    template: [['core/paragraph', { placeholder: 'Collapsible content...' }]]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Dropdown Block
    registerBlockType('bootstrap-theme/bs-dropdown', {
        title: __('Bootstrap Dropdown', 'bootstrap-theme'),
        description: __('A Bootstrap dropdown component', 'bootstrap-theme'),
        icon: 'arrow-down-alt2',
        category: 'ileben-landing',
        keywords: [__('dropdown'), __('menu'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('button', { className: 'btn btn-primary dropdown-toggle' }, 
                    __('Dropdown Button', 'bootstrap-theme')
                ),
                createElement(InnerBlocks, {
                    template: [
                        ['core/paragraph', { content: 'Dropdown item 1' }],
                        ['core/paragraph', { content: 'Dropdown item 2' }]
                    ]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap List Group Block
    registerBlockType('bootstrap-theme/bs-list-group', {
        title: __('Bootstrap List Group', 'bootstrap-theme'),
        description: __('A Bootstrap list group component', 'bootstrap-theme'),
        icon: 'list-view',
        category: 'ileben-landing',
        keywords: [__('list'), __('group'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement(InnerBlocks, {
                    template: [
                        ['core/paragraph', { content: 'List item 1' }],
                        ['core/paragraph', { content: 'List item 2' }],
                        ['core/paragraph', { content: 'List item 3' }]
                    ]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Modal Block
    registerBlockType('bootstrap-theme/bs-modal', {
        title: __('Bootstrap Modal', 'bootstrap-theme'),
        description: __('A Bootstrap modal dialog component', 'bootstrap-theme'),
        icon: 'admin-page',
        category: 'ileben-landing',
        keywords: [__('modal'), __('dialog'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('p', {}, __('Modal Trigger Button', 'bootstrap-theme')),
                createElement('div', { className: 'modal-preview' },
                    createElement('h5', {}, __('Modal Title', 'bootstrap-theme')),
                    createElement(InnerBlocks, {
                        template: [['core/paragraph', { placeholder: 'Modal content...' }]]
                    })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Navbar Block
    registerBlockType('bootstrap-theme/bs-navbar', {
        title: __('Bootstrap Navbar', 'bootstrap-theme'),
        description: __('A Bootstrap navigation bar component', 'bootstrap-theme'),
        icon: 'menu',
        category: 'ileben-landing',
        keywords: [__('navbar'), __('navigation'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('nav', blockProps,
                createElement('div', { className: 'navbar-preview' },
                    createElement('span', {}, __('Brand', 'bootstrap-theme')),
                    createElement(InnerBlocks, {
                        template: [
                            ['core/navigation-link', { label: 'Home' }],
                            ['core/navigation-link', { label: 'About' }],
                            ['core/navigation-link', { label: 'Contact' }]
                        ]
                    })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Navs & Tabs Block
    registerBlockType('bootstrap-theme/bs-navs-tabs', {
        title: __('Bootstrap Navs & Tabs', 'bootstrap-theme'),
        description: __('Bootstrap navigation and tabs component', 'bootstrap-theme'),
        icon: 'table-row-before',
        category: 'ileben-landing',
        keywords: [__('tabs'), __('navigation'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('div', { className: 'nav-tabs-preview' },
                    createElement('span', {}, __('Tab 1', 'bootstrap-theme')),
                    createElement('span', {}, __('Tab 2', 'bootstrap-theme')),
                    createElement('span', {}, __('Tab 3', 'bootstrap-theme'))
                ),
                createElement(InnerBlocks, {
                    template: [['core/paragraph', { placeholder: 'Tab content...' }]]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Offcanvas Block
    registerBlockType('bootstrap-theme/bs-offcanvas', {
        title: __('Bootstrap Offcanvas', 'bootstrap-theme'),
        description: __('A Bootstrap offcanvas sidebar component', 'bootstrap-theme'),
        icon: 'admin-page',
        category: 'ileben-landing',
        keywords: [__('offcanvas'), __('sidebar'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('p', {}, __('Offcanvas Trigger', 'bootstrap-theme')),
                createElement('div', { className: 'offcanvas-preview' },
                    createElement('h5', {}, __('Offcanvas Title', 'bootstrap-theme')),
                    createElement(InnerBlocks, {
                        template: [['core/paragraph', { placeholder: 'Offcanvas content...' }]]
                    })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Pagination Block
    registerBlockType('bootstrap-theme/bs-pagination', {
        title: __('Bootstrap Pagination', 'bootstrap-theme'),
        description: __('A Bootstrap pagination component', 'bootstrap-theme'),
        icon: 'ellipsis',
        category: 'ileben-landing',
        keywords: [__('pagination'), __('pages'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('nav', blockProps,
                createElement('div', { className: 'pagination-preview' },
                    createElement('span', {}, __('‹ Previous', 'bootstrap-theme')),
                    createElement('span', {}, '1'),
                    createElement('span', {}, '2'),
                    createElement('span', {}, '3'),
                    createElement('span', {}, __('Next ›', 'bootstrap-theme'))
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Placeholders Block
    registerBlockType('bootstrap-theme/bs-placeholders', {
        title: __('Bootstrap Placeholders', 'bootstrap-theme'),
        description: __('Bootstrap placeholder loading components', 'bootstrap-theme'),
        icon: 'image-filter',
        category: 'ileben-landing',
        keywords: [__('placeholder'), __('loading'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('div', { className: 'placeholder-preview' },
                    createElement('div', { className: 'placeholder-line' }),
                    createElement('div', { className: 'placeholder-line' }),
                    createElement('div', { className: 'placeholder-line short' })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Popover Block
    registerBlockType('bootstrap-theme/bs-popover', {
        title: __('Bootstrap Popover', 'bootstrap-theme'),
        description: __('A Bootstrap popover component', 'bootstrap-theme'),
        icon: 'format-chat',
        category: 'ileben-landing',
        keywords: [__('popover'), __('tooltip'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('button', { className: 'btn btn-primary' }, 
                    __('Popover Trigger', 'bootstrap-theme')
                ),
                createElement(InnerBlocks, {
                    template: [['core/paragraph', { placeholder: 'Popover content...' }]]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Progress Block
    registerBlockType('bootstrap-theme/bs-progress', {
        title: __('Bootstrap Progress', 'bootstrap-theme'),
        description: __('A Bootstrap progress bar component', 'bootstrap-theme'),
        icon: 'chart-bar',
        category: 'ileben-landing',
        keywords: [__('progress'), __('bar'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('div', { className: 'progress-preview' },
                    createElement('div', { 
                        className: 'progress-bar-preview',
                        style: { width: '50%' }
                    }, '50%')
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Scrollspy Block
    registerBlockType('bootstrap-theme/bs-scrollspy', {
        title: __('Bootstrap Scrollspy', 'bootstrap-theme'),
        description: __('A Bootstrap scrollspy navigation component', 'bootstrap-theme'),
        icon: 'visibility',
        category: 'ileben-landing',
        keywords: [__('scrollspy'), __('navigation'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('p', {}, __('Scrollspy Navigation', 'bootstrap-theme')),
                createElement(InnerBlocks, {
                    template: [
                        ['core/heading', { content: 'Section 1' }],
                        ['core/paragraph', { content: 'Content for section 1...' }],
                        ['core/heading', { content: 'Section 2' }],
                        ['core/paragraph', { content: 'Content for section 2...' }]
                    ]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Spinner Block
    registerBlockType('bootstrap-theme/bs-spinner', {
        title: __('Bootstrap Spinner', 'bootstrap-theme'),
        description: __('A Bootstrap loading spinner component', 'bootstrap-theme'),
        icon: 'update',
        category: 'ileben-landing',
        keywords: [__('spinner'), __('loading'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('div', { className: 'spinner-preview' },
                    createElement('div', { className: 'spinner-border' })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Toast Block
    registerBlockType('bootstrap-theme/bs-toast', {
        title: __('Bootstrap Toast', 'bootstrap-theme'),
        description: __('A Bootstrap toast notification component', 'bootstrap-theme'),
        icon: 'format-status',
        category: 'ileben-landing',
        keywords: [__('toast'), __('notification'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('div', { className: 'toast-preview' },
                    createElement('div', { className: 'toast-header' },
                        createElement('strong', {}, __('Toast Title', 'bootstrap-theme'))
                    ),
                    createElement(InnerBlocks, {
                        template: [['core/paragraph', { placeholder: 'Toast message...' }]]
                    })
                )
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

    // Bootstrap Tooltip Block
    registerBlockType('bootstrap-theme/bs-tooltip', {
        title: __('Bootstrap Tooltip', 'bootstrap-theme'),
        description: __('A Bootstrap tooltip component', 'bootstrap-theme'),
        icon: 'info',
        category: 'ileben-landing',
        keywords: [__('tooltip'), __('help'), __('bootstrap')],
        
        edit: function(props) {
            const blockProps = useBlockProps();
            return createElement('div', blockProps,
                createElement('span', { className: 'tooltip-trigger' },
                    __('Hover me for tooltip', 'bootstrap-theme')
                ),
                createElement(InnerBlocks, {
                    template: [['core/paragraph', { placeholder: 'Tooltip text...' }]]
                })
            );
        },
        
        save: function() {
            return null; // Renderizado dinámico
        }
    });

})();
