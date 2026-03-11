(function(){
    const { registerBlockType } = wp.blocks;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, RangeControl, CheckboxControl, Spinner } = wp.components;
    const { __ } = wp.i18n;
    const { createElement, Fragment, useEffect, useState } = wp.element;
    const { apiFetch } = wp;

    registerBlockType('bootstrap-theme/bs-wc-products', {
        apiVersion: 3,
        title: __('WooCommerce Products (Bootstrap Loop)', 'ileben-landing'),
        icon: 'products',
        category: 'ileben-landing',
        attributes: {
            useThemeDefaults: { type: 'boolean', default: true },
            productsPerRow:   { type: 'number',  default: 4 },
            productsPerRowMobile: { type: 'number', default: 2 },
            productsPerPage:  { type: 'number',  default: 12 },
            defaultOrderby:   { type: 'string',  default: 'menu_order' },
            defaultOrder:     { type: 'string',  default: 'ASC' },
            showPagination:   { type: 'boolean', default: true },
            showOrdering:     { type: 'boolean', default: true },
            showSearch:       { type: 'boolean', default: true },
            onlyInStock:      { type: 'boolean', default: false },
            categories:       { type: 'array',   default: [] },
        },
        edit: function(props){
            const { attributes, setAttributes } = props;
            const [categoryOptions, setCategoryOptions] = useState([]);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                apiFetch({ path: '/wp/v2/product_cat?per_page=100&_fields=id,name' })
                    .then(categories => {
                        const opts = categories.map(cat => ({ label: cat.name, value: cat.id }));
                        setCategoryOptions(opts);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error fetching categories:', err);
                        setLoading(false);
                    });
            }, []);

            const handleCategoryToggle = (categoryId) => {
                const newCategories = attributes.categories.includes(categoryId)
                    ? attributes.categories.filter(id => id !== categoryId)
                    : [...attributes.categories, categoryId];
                setAttributes({ categories: newCategories });
            };

            const orderbyOptions = [
                { label: __('Default order', 'ileben-landing'), value: 'menu_order' },
                { label: __('Title', 'ileben-landing'), value: 'title' },
                { label: __('Date', 'ileben-landing'), value: 'date' },
                { label: __('Modified', 'ileben-landing'), value: 'modified' },
                { label: __('Price', 'ileben-landing'), value: 'price' },
                { label: __('Popularity', 'ileben-landing'), value: 'popularity' },
                { label: __('Rating', 'ileben-landing'), value: 'rating' },
                { label: __('SKU', 'ileben-landing'), value: 'sku' },
                { label: __('Random', 'ileben-landing'), value: 'rand' },
            ];
            const orderOptions = [
                { label: 'ASC', value: 'ASC' },
                { label: 'DESC', value: 'DESC' }
            ];
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Loop Settings', 'ileben-landing') },
                        createElement(ToggleControl, {
                            label: __('Use theme WooCommerce catalog defaults', 'ileben-landing'),
                            checked: attributes.useThemeDefaults,
                            onChange: (v)=> setAttributes({useThemeDefaults: v})
                        }),
                        createElement(RangeControl, {
                            label: __('Products per row', 'ileben-landing'),
                            min: 1, max: 12, value: attributes.productsPerRow,
                            onChange: (v)=> setAttributes({productsPerRow: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'ileben-landing') : '',
                            disabled: attributes.useThemeDefaults
                        }),
                        createElement(RangeControl, {
                            label: __('Products per row (mobile)', 'ileben-landing'),
                            min: 1, max: 6, value: attributes.productsPerRowMobile,
                            onChange: (v)=> setAttributes({productsPerRowMobile: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'ileben-landing') : __('For small screens. Recommended: 1 or 2', 'ileben-landing'),
                            disabled: attributes.useThemeDefaults
                        }),
                        createElement(RangeControl, {
                            label: __('Products per page', 'ileben-landing'),
                            min: 1, max: 100, value: attributes.productsPerPage,
                            onChange: (v)=> setAttributes({productsPerPage: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'ileben-landing') : '',
                            disabled: attributes.useThemeDefaults
                        }),
                        !attributes.useThemeDefaults && createElement(Fragment, {},
                            createElement(SelectControl, {
                                label: __('Default order by', 'ileben-landing'),
                                value: attributes.defaultOrderby,
                                options: orderbyOptions,
                                onChange: (v)=> setAttributes({defaultOrderby: v})
                            }),
                            createElement(SelectControl, {
                                label: __('Default order', 'ileben-landing'),
                                value: attributes.defaultOrder,
                                options: orderOptions,
                                onChange: (v)=> setAttributes({defaultOrder: v})
                            })
                        ),
                        createElement(ToggleControl, {
                            label: __('Show pagination', 'ileben-landing'),
                            checked: attributes.showPagination,
                            onChange: (v)=> setAttributes({showPagination: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Show ordering (filter)', 'ileben-landing'),
                            checked: attributes.showOrdering,
                            onChange: (v)=> setAttributes({showOrdering: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Show search', 'ileben-landing'),
                            checked: attributes.showSearch,
                            onChange: (v)=> setAttributes({showSearch: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Only products in stock', 'ileben-landing'),
                            checked: attributes.onlyInStock,
                            onChange: (v)=> setAttributes({onlyInStock: v})
                        })
                    ),
                    createElement(PanelBody, { title: __('Product Categories', 'ileben-landing') },
                        loading && createElement(Spinner, {}),
                        !loading && categoryOptions.length > 0 && categoryOptions.map(cat =>
                            createElement(CheckboxControl, {
                                key: cat.value,
                                label: cat.label,
                                checked: attributes.categories.includes(cat.value),
                                onChange: () => handleCategoryToggle(cat.value)
                            })
                        ),
                        !loading && categoryOptions.length === 0 && createElement('p', {}, __('No categories found', 'ileben-landing'))
                    )
                ),
                createElement('div', { className: 'bs-wc-products-editor-placeholder border p-3 rounded' },
                    createElement('strong', {}, __('WooCommerce Products', 'ileben-landing')),
                    createElement('div', { className: 'text-muted mt-2' }, __('The loop will render on the frontend.', 'ileben-landing'))
                )
            );
        },
        save: function(){ return null; }
    });
})();