(function() {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl, SelectControl } = wp.components;
    const { __ } = wp.i18n;
    const { Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-asesores', {
        apiVersion: 3,
        title: __('Asesores (ACF)', 'ileben-landing'),
        icon: 'groups',
        category: 'ileben-landing',
        description: __('Muestra la lista de asesores desde las opciones del tema (ACF).', 'ileben-landing'),
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
                        wp.element.createElement(PanelBody, { title: __('Diseño', 'ileben-landing'), initialOpen: true },
                            wp.element.createElement(RangeControl, {
                                label: __('Columnas en MD', 'ileben-landing'),
                                min: 1,
                                max: 4,
                                value: columnsMd,
                                onChange: (value) => setAttributes({ columnsMd: value || 1 })
                            }),
                            wp.element.createElement(RangeControl, {
                                label: __('Columnas en LG', 'ileben-landing'),
                                min: 1,
                                max: 4,
                                value: columnsLg,
                                onChange: (value) => setAttributes({ columnsLg: value || 1 })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Distribución', 'ileben-landing'),
                                value: layout,
                                options: [
                                    { label: __('Horizontal (foto + datos)', 'ileben-landing'), value: 'horizontal' },
                                    { label: __('Vertical (foto arriba)', 'ileben-landing'), value: 'vertical' },
                                ],
                                onChange: (value) => setAttributes({ layout: value })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Avatar', 'ileben-landing'),
                                value: avatarShape,
                                options: [
                                    { label: __('Completa (card)', 'ileben-landing'), value: 'card' },
                                    { label: __('Redonda', 'ileben-landing'), value: 'round' },
                                ],
                                onChange: (value) => setAttributes({ avatarShape: value })
                            })
                        ),
                        wp.element.createElement(PanelBody, { title: __('Contenido', 'ileben-landing'), initialOpen: false },
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar imagen', 'ileben-landing'),
                                checked: showImage,
                                onChange: (value) => setAttributes({ showImage: value })
                            }),
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar teléfono', 'ileben-landing'),
                                checked: showPhone,
                                onChange: (value) => setAttributes({ showPhone: value })
                            }),
                            wp.element.createElement(ToggleControl, {
                                label: __('Mostrar email', 'ileben-landing'),
                                checked: showEmail,
                                onChange: (value) => setAttributes({ showEmail: value })
                            }),
                            wp.element.createElement(SelectControl, {
                                label: __('Contenido a mostrar', 'ileben-landing'),
                                value: contentMode,
                                options: [
                                    { label: __('Texto y botones', 'ileben-landing'), value: 'both' },
                                    { label: __('Solo texto', 'ileben-landing'), value: 'text' },
                                    { label: __('Solo botones', 'ileben-landing'), value: 'buttons' },
                                ],
                                onChange: (value) => setAttributes({ contentMode: value })
                            })
                        ),
                        wp.element.createElement(PanelBody, { title: __('Animación', 'ileben-landing'), initialOpen: false },
                            wp.element.createElement(SelectControl, {
                                label: __('Tipo de animación', 'ileben-landing'),
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
                                    label: __('Disparador', 'ileben-landing'),
                                    value: attributes.animationTrigger,
                                    options: animationTriggers,
                                    onChange: (value) => setAttributes({ animationTrigger: value })
                                }),
                                wp.element.createElement(RangeControl, {
                                    label: __('Duración (s)', 'ileben-landing'),
                                    value: attributes.animationDuration,
                                    min: 0.1,
                                    max: 3,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ animationDuration: value })
                                }),
                                wp.element.createElement(RangeControl, {
                                    label: __('Delay (s)', 'ileben-landing'),
                                    value: attributes.animationDelay,
                                    min: 0,
                                    max: 5,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ animationDelay: value })
                                }),
                                wp.element.createElement(SelectControl, {
                                    label: __('Easing', 'ileben-landing'),
                                    value: attributes.animationEase,
                                    options: easeOptions,
                                    onChange: (value) => setAttributes({ animationEase: value })
                                }),
                                wp.element.createElement(ToggleControl, {
                                    label: __('Habilitar en móvil', 'ileben-landing'),
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
                                                        showPhone && wp.element.createElement('span', { className: 'btn btn-success btn-sm disabled' }, __('WhatsApp', 'ileben-landing')),
                                                        showEmail && wp.element.createElement('span', { className: 'btn btn-danger btn-sm disabled' }, __('Escríbeme', 'ileben-landing'))
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
                                                        showPhone && wp.element.createElement('span', { className: 'btn btn-success btn-sm disabled' }, __('WhatsApp', 'ileben-landing')),
                                                        showEmail && wp.element.createElement('span', { className: 'btn btn-danger btn-sm disabled' }, __('Escríbeme', 'ileben-landing'))
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