(function() {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl, SelectControl } = wp.components;
    const { __ } = wp.i18n;
    const { Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-asesores', {
        title: __('Asesores (ACF)', 'bootstrap-theme'),
        icon: 'groups',
        category: 'ileben-landing',
        description: __('Muestra la lista de asesores desde las opciones del tema (ACF).', 'bootstrap-theme'),
        attributes: {
            columnsMd: { type: 'number', default: 2 },
            columnsLg: { type: 'number', default: 3 },
            showImage: { type: 'boolean', default: true },
            showPhone: { type: 'boolean', default: true },
            showEmail: { type: 'boolean', default: true },
            avatarShape: { type: 'string', default: 'card' }, // 'card' | 'round'
            layout: { type: 'string', default: 'horizontal' }, // 'horizontal' | 'vertical'
            contentMode: { type: 'string', default: 'both' }, // 'both' | 'text' | 'buttons'
        },
        supports: {
            html: true,
            align: false,
        },
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { columnsMd, columnsLg, showImage, showPhone, showEmail, avatarShape, layout, contentMode } = attributes;
            const blockProps = useBlockProps({ className: 'bs-asesores-editor' });

            const sample = [
                { name: 'Ejemplo 1', email: 'correo@ejemplo.com', phone: '+56 9 1234 5678' },
                { name: 'Ejemplo 2', email: 'ejemplo@dominio.cl', phone: '+56 9 8765 4321' },
            ];

            const columnClasses = [
                'row row-cols-1 g-3',
                columnsMd ? `row-cols-md-${columnsMd}` : '',
                columnsLg ? `row-cols-lg-${columnsLg}` : '',
            ].filter(Boolean).join(' ');

            return (
                wp.element.createElement(Fragment, {},
                    wp.element.createElement(InspectorControls, {},
                        wp.element.createElement(PanelBody, { title: __('Diseño', 'bootstrap-theme'), initialOpen: true },
                            wp.element.createElement(RangeControl, {
                                label: __('Columnas en MD', 'bootstrap-theme'),
                                min: 1,
                                max: 4,
                                value: columnsMd,
                                onChange: (value) => setAttributes({ columnsMd: value || 1 })
                            }),
                            wp.element.createElement(RangeControl, {
                                label: __('Columnas en LG', 'bootstrap-theme'),
                                min: 1,
                                max: 4,
                                value: columnsLg,
                                onChange: (value) => setAttributes({ columnsLg: value || 1 })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Distribución', 'bootstrap-theme'),
                                value: layout,
                                options: [
                                    { label: __('Horizontal (foto + datos)', 'bootstrap-theme'), value: 'horizontal' },
                                    { label: __('Vertical (foto arriba)', 'bootstrap-theme'), value: 'vertical' },
                                ],
                                onChange: (value) => setAttributes({ layout: value })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Avatar', 'bootstrap-theme'),
                                value: avatarShape,
                                options: [
                                    { label: __('Completa (card)', 'bootstrap-theme'), value: 'card' },
                                    { label: __('Redonda', 'bootstrap-theme'), value: 'round' },
                                ],
                                onChange: (value) => setAttributes({ avatarShape: value })
                            })
                        ),
                        wp.element.createElement(PanelBody, { title: __('Contenido', 'bootstrap-theme'), initialOpen: false },
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar imagen', 'bootstrap-theme'),
                                checked: showImage,
                                onChange: (value) => setAttributes({ showImage: value })
                            }),
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar teléfono', 'bootstrap-theme'),
                                checked: showPhone,
                                onChange: (value) => setAttributes({ showPhone: value })
                            }),
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar email', 'bootstrap-theme'),
                                checked: showEmail,
                                onChange: (value) => setAttributes({ showEmail: value })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Contenido a mostrar', 'bootstrap-theme'),
                                value: contentMode,
                                options: [
                                    { label: __('Texto y botones', 'bootstrap-theme'), value: 'both' },
                                    { label: __('Solo texto', 'bootstrap-theme'), value: 'text' },
                                    { label: __('Solo botones', 'bootstrap-theme'), value: 'buttons' },
                                ],
                                onChange: (value) => setAttributes({ contentMode: value })
                            })
                        )
                    ),
                    wp.element.createElement('div', { ...blockProps },
                        wp.element.createElement('div', { className: columnClasses },
                            sample.map((item, index) => (
                                wp.element.createElement('div', { className: 'col', key: index },
                                    wp.element.createElement('div', { className: 'card h-100 bs-asesor-card' },
                                        layout === 'vertical'
                                            ? wp.element.createElement('div', {},
                                                showImage && (avatarShape === 'card'
                                                    ? wp.element.createElement('div', { className: 'card-img-top', style: { background: '#eef2f6', height: '120px' } })
                                                    : wp.element.createElement('div', { className: 'bs-asesor-avatar text-center pt-3' },
                                                        wp.element.createElement('div', { className: 'rounded-circle bg-light border', style: { width: '96px', height: '96px', margin: '0 auto' } })
                                                    )
                                                ),
                                                wp.element.createElement('div', { className: 'card-body' },
                                                    wp.element.createElement('div', { className: 'fw-bold h6 mb-1' }, item.name),
                                                    (contentMode === 'both' || contentMode === 'text') && showPhone && wp.element.createElement('div', { className: 'text-muted small mb-1' }, item.phone),
                                                    (contentMode === 'both' || contentMode === 'text') && showEmail && wp.element.createElement('div', { className: 'text-muted small mb-2' }, item.email),
                                                    (contentMode === 'both' || contentMode === 'buttons') && wp.element.createElement('div', { className: 'd-flex flex-wrap gap-2 mt-2' },
                                                        showPhone && wp.element.createElement('span', { className: 'btn btn-success btn-sm disabled' }, __('WhatsApp', 'bootstrap-theme')),
                                                        showEmail && wp.element.createElement('span', { className: 'btn btn-danger btn-sm disabled' }, __('Escríbeme', 'bootstrap-theme'))
                                                    )
                                                )
                                            )
                                            : wp.element.createElement('div', { className: 'card-body d-flex align-items-center gap-3' },
                                                showImage && wp.element.createElement('div', { className: 'bs-asesor-avatar flex-shrink-0' },
                                                    wp.element.createElement('div', { className: avatarShape === 'round' ? 'rounded-circle bg-light border' : 'rounded bg-light border', style: { width: '96px', height: '96px' } })
                                                ),
                                                wp.element.createElement('div', { className: 'flex-grow-1' },
                                                    wp.element.createElement('div', { className: 'fw-bold h6 mb-1' }, item.name),
                                                    (contentMode === 'both' || contentMode === 'text') && showPhone && wp.element.createElement('div', { className: 'text-muted small mb-1' }, item.phone),
                                                    (contentMode === 'both' || contentMode === 'text') && showEmail && wp.element.createElement('div', { className: 'text-muted small mb-2' }, item.email),
                                                    (contentMode === 'both' || contentMode === 'buttons') && wp.element.createElement('div', { className: 'd-flex flex-wrap gap-2 mt-2' },
                                                        showPhone && wp.element.createElement('span', { className: 'btn btn-success btn-sm disabled' }, __('WhatsApp', 'bootstrap-theme')),
                                                        showEmail && wp.element.createElement('span', { className: 'btn btn-danger btn-sm disabled' }, __('Escríbeme', 'bootstrap-theme'))
                                                    )
                                                )
                                            )
                                    )
                                )
                            ))
                        )
                    )
                )
            );
        },
        save: () => null,
    });
})();
