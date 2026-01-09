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
        },
        supports: {
            html: true,
            align: false,
        },
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { columnsMd, columnsLg, showImage, showPhone, showEmail, avatarShape, layout, contentMode } = attributes;
            const blockProps = useBlockProps({ className: 'bs-asesores-editor' });

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
                        ),
                        wp.element.createElement(PanelBody, { title: __('Animación', 'bootstrap-theme'), initialOpen: false },
                            wp.element.createElement(SelectControl, {
                                label: __('Tipo de animación', 'bootstrap-theme'),
                                value: animationType,
                                options: animationTypes,
                                onChange: (value) => {
                                    const updates = { animationType: value };
                                    if (value && value !== '') {
                                        if (!attributes.animationDuration || attributes.animationDuration === '') updates.animationDuration = 0.6;
                                        if (!attributes.animationDelay || attributes.animationDelay === '') updates.animationDelay = 0;
                                        if (!attributes.animationTrigger || attributes.animationTrigger === '') updates.animationTrigger = 'on-scroll';
                                        if (!attributes.animationEase || attributes.animationEase === '') updates.animationEase = 'power2.inOut';
                                    }
                                    setAttributes(updates);
                                }
                            }),
                            animationType && wp.element.createElement(Fragment, null,
                                wp.element.createElement(SelectControl, {
                                    label: __('Disparador', 'bootstrap-theme'),
                                    value: attributes.animationTrigger,
                                    options: animationTriggers,
                                    onChange: (value) => setAttributes({ animationTrigger: value })
                                }),
                                wp.element.createElement(RangeControl, {
                                    label: __('Duración (s)', 'bootstrap-theme'),
                                    value: attributes.animationDuration,
                                    min: 0.1,
                                    max: 3,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ animationDuration: value })
                                }),
                                wp.element.createElement(RangeControl, {
                                    label: __('Delay (s)', 'bootstrap-theme'),
                                    value: attributes.animationDelay,
                                    min: 0,
                                    max: 5,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ animationDelay: value })
                                }),
                                wp.element.createElement(SelectControl, {
                                    label: __('Easing', 'bootstrap-theme'),
                                    value: attributes.animationEase,
                                    options: easeOptions,
                                    onChange: (value) => setAttributes({ animationEase: value })
                                }),
                                wp.element.createElement(ToggleControl, {
                                    label: __('Habilitar en móvil', 'bootstrap-theme'),
                                    checked: attributes.animationMobileEnabled !== false,
                                    onChange: (value) => setAttributes({ animationMobileEnabled: value })
                                })
                            )
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
