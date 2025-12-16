(function(){
    const { registerBlockType } = wp.blocks;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, RangeControl, CheckboxControl, Spinner } = wp.components;
    const { __ } = wp.i18n;
    const { createElement, Fragment, useEffect, useState } = wp.element;
    const { apiFetch } = wp;

    registerBlockType('bootstrap-theme/bs-wc-products', {
        title: __('WooCommerce Products (Bootstrap Loop)', 'bootstrap-theme'),
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
                { label: __('Default order', 'bootstrap-theme'), value: 'menu_order' },
                { label: __('Title', 'bootstrap-theme'), value: 'title' },
                { label: __('Date', 'bootstrap-theme'), value: 'date' },
                { label: __('Modified', 'bootstrap-theme'), value: 'modified' },
                { label: __('Price', 'bootstrap-theme'), value: 'price' },
                { label: __('Popularity', 'bootstrap-theme'), value: 'popularity' },
                { label: __('Rating', 'bootstrap-theme'), value: 'rating' },
                { label: __('SKU', 'bootstrap-theme'), value: 'sku' },
                { label: __('Random', 'bootstrap-theme'), value: 'rand' },
            ];
            const orderOptions = [
                { label: 'ASC', value: 'ASC' },
                { label: 'DESC', value: 'DESC' }
            ];
            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Loop Settings', 'bootstrap-theme') },
                        createElement(ToggleControl, {
                            label: __('Use theme WooCommerce catalog defaults', 'bootstrap-theme'),
                            checked: attributes.useThemeDefaults,
                            onChange: (v)=> setAttributes({useThemeDefaults: v})
                        }),
                        createElement(RangeControl, {
                            label: __('Products per row', 'bootstrap-theme'),
                            min: 1, max: 12, value: attributes.productsPerRow,
                            onChange: (v)=> setAttributes({productsPerRow: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'bootstrap-theme') : '',
                            disabled: attributes.useThemeDefaults
                        }),
                        createElement(RangeControl, {
                            label: __('Products per row (mobile)', 'bootstrap-theme'),
                            min: 1, max: 6, value: attributes.productsPerRowMobile,
                            onChange: (v)=> setAttributes({productsPerRowMobile: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'bootstrap-theme') : __('For small screens. Recommended: 1 or 2', 'bootstrap-theme'),
                            disabled: attributes.useThemeDefaults
                        }),
                        createElement(RangeControl, {
                            label: __('Products per page', 'bootstrap-theme'),
                            min: 1, max: 100, value: attributes.productsPerPage,
                            onChange: (v)=> setAttributes({productsPerPage: v}),
                            help: attributes.useThemeDefaults ? __('Theme default will be used (this value is ignored)', 'bootstrap-theme') : '',
                            disabled: attributes.useThemeDefaults
                        }),
                        !attributes.useThemeDefaults && createElement(Fragment, {},
                            createElement(SelectControl, {
                                label: __('Default order by', 'bootstrap-theme'),
                                value: attributes.defaultOrderby,
                                options: orderbyOptions,
                                onChange: (v)=> setAttributes({defaultOrderby: v})
                            }),
                            createElement(SelectControl, {
                                label: __('Default order', 'bootstrap-theme'),
                                value: attributes.defaultOrder,
                                options: orderOptions,
                                onChange: (v)=> setAttributes({defaultOrder: v})
                            })
                        ),
                        createElement(ToggleControl, {
                            label: __('Show pagination', 'bootstrap-theme'),
                            checked: attributes.showPagination,
                            onChange: (v)=> setAttributes({showPagination: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Show ordering (filter)', 'bootstrap-theme'),
                            checked: attributes.showOrdering,
                            onChange: (v)=> setAttributes({showOrdering: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Show search', 'bootstrap-theme'),
                            checked: attributes.showSearch,
                            onChange: (v)=> setAttributes({showSearch: v})
                        }),
                        createElement(ToggleControl, {
                            label: __('Only products in stock', 'bootstrap-theme'),
                            checked: attributes.onlyInStock,
                            onChange: (v)=> setAttributes({onlyInStock: v})
                        })
                    ),
                    createElement(PanelBody, { title: __('Product Categories', 'bootstrap-theme') },
                        loading && createElement(Spinner, {}),
                        !loading && categoryOptions.length > 0 && categoryOptions.map(cat =>
                            createElement(CheckboxControl, {
                                key: cat.value,
                                label: cat.label,
                                checked: attributes.categories.includes(cat.value),
                                onChange: () => handleCategoryToggle(cat.value)
                            })
                        ),
                        !loading && categoryOptions.length === 0 && createElement('p', {}, __('No categories found', 'bootstrap-theme'))
                    )
                ),
                createElement('div', { className: 'bs-wc-products-editor-placeholder border p-3 rounded' },
                    createElement('strong', {}, __('WooCommerce Products', 'bootstrap-theme')),
                    createElement('div', { className: 'text-muted mt-2' }, __('The loop will render on the frontend.', 'bootstrap-theme'))
                )
            );
        },
        save: function(){ return null; }
    });
})();