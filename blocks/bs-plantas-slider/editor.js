/**
 * Block Editor: Plantas Slider
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, TextControl, RangeControl, SelectControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-plantas-slider', {
        title: __('Plantas Slider', 'bootstrap-theme'),
        description: __('Muestra las plantas publicadas como slider (Swiper).', 'bootstrap-theme'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            postsPerPage: { type: 'number', default: -1 },
            showThumbnail: { type: 'boolean', default: true },
            buttonLabel: { type: 'string', default: __('Cotizar', 'bootstrap-theme') },
            disabledButtonLabel: { type: 'string', default: __('No disponible', 'bootstrap-theme') },
            slidesPerView: { type: 'string', default: '' },
            slidesPerViewMobile: { type: 'string', default: '1' },
            slidesPerViewTablet: { type: 'string', default: '1.5' },
            slidesPerViewDesktop: { type: 'string', default: '3' },
            navigationArrows: { type: 'boolean', default: true },
            paginationType: { type: 'string', default: 'bullets' },
            centered: { type: 'boolean', default: false },
            effect: { type: 'string', default: 'slide' },
            loop: { type: 'boolean', default: true },
            showFilters: { type: 'boolean', default: true },
            filterDormitorio: { type: 'string', default: '' },
            filterBano: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-plantas-slider-preview' });
            const options = (window.BOOTSTRAP_THEME_PLANTAS_OPTIONS || {});
            const dorms = Array.isArray(options.dorms) ? options.dorms : [];
            const banos = Array.isArray(options.banos) ? options.banos : [];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'bootstrap-theme'), initialOpen: true },
                        createElement(RangeControl, {
                            label: __('Máximo de posts (-1 = todos)', 'bootstrap-theme'),
                            value: attributes.postsPerPage,
                            onChange: (value) => setAttributes({ postsPerPage: value }),
                            min: -1,
                            max: 24
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Slides por Viewport', 'bootstrap-theme')),
                        createElement(TextControl, {
                            label: __('Mobile (< 768px)', 'bootstrap-theme'),
                            value: attributes.slidesPerViewMobile,
                            onChange: (value) => setAttributes({ slidesPerViewMobile: value }),
                            placeholder: '1'
                        }),
                        createElement(TextControl, {
                            label: __('Tablet (768px - 1023px)', 'bootstrap-theme'),
                            value: attributes.slidesPerViewTablet,
                            onChange: (value) => setAttributes({ slidesPerViewTablet: value }),
                            placeholder: '1.5'
                        }),
                        createElement(TextControl, {
                            label: __('Desktop (≥ 1024px)', 'bootstrap-theme'),
                            value: attributes.slidesPerViewDesktop,
                            onChange: (value) => setAttributes({ slidesPerViewDesktop: value }),
                            placeholder: '3'
                        }),
                        createElement(ToggleControl, {
                            label: __('Mostrar imagen destacada', 'bootstrap-theme'),
                            checked: !!attributes.showThumbnail,
                            onChange: (value) => setAttributes({ showThumbnail: value })
                        }),
                        createElement(TextControl, {
                            label: __('Texto botón cotizador', 'bootstrap-theme'),
                            value: attributes.buttonLabel,
                            onChange: (value) => setAttributes({ buttonLabel: value })
                        }),
                        createElement(TextControl, {
                            label: __('Texto botón desactivado', 'bootstrap-theme'),
                            value: attributes.disabledButtonLabel,
                            onChange: (value) => setAttributes({ disabledButtonLabel: value })
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Navegación', 'bootstrap-theme')),
                        createElement(ToggleControl, {
                            label: __('Mostrar flechas prev/next', 'bootstrap-theme'),
                            checked: !!attributes.navigationArrows,
                            onChange: (value) => setAttributes({ navigationArrows: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Tipo de paginación', 'bootstrap-theme'),
                            value: attributes.paginationType,
                            options: [
                                { label: __('Sin paginación', 'bootstrap-theme'), value: 'none' },
                                { label: __('Bullets (puntos)', 'bootstrap-theme'), value: 'bullets' },
                                { label: __('Fracciones (2/10)', 'bootstrap-theme'), value: 'fraction' },
                                { label: __('Barra de progreso', 'bootstrap-theme'), value: 'progressbar' },
                                { label: __('Scroll bar', 'bootstrap-theme'), value: 'scrollbar' }
                            ],
                            onChange: (value) => setAttributes({ paginationType: value })
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Efecto', 'bootstrap-theme')),
                        createElement(SelectControl, {
                            label: __('Tipo de efecto', 'bootstrap-theme'),
                            value: attributes.effect,
                            options: [
                                { label: __('Slide (defecto)', 'bootstrap-theme'), value: 'slide' },
                                { label: __('Fade (desvanecimiento)', 'bootstrap-theme'), value: 'fade' },
                                { label: __('Cube (cubo 3D)', 'bootstrap-theme'), value: 'cube' },
                                { label: __('Coverflow (portadas)', 'bootstrap-theme'), value: 'coverflow' },
                                { label: __('Flip (volteo)', 'bootstrap-theme'), value: 'flip' },
                                { label: __('Cards (tarjetas)', 'bootstrap-theme'), value: 'cards' },
                                { label: __('Creative (personalizado)', 'bootstrap-theme'), value: 'creative' }
                            ],
                            onChange: (value) => setAttributes({ effect: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Centrar slide activo', 'bootstrap-theme'),
                            checked: !!attributes.centered,
                            onChange: (value) => setAttributes({ centered: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Repetir infinitamente (loop)', 'bootstrap-theme'),
                            checked: !!attributes.loop,
                            onChange: (value) => setAttributes({ loop: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('Filtros', 'bootstrap-theme'), initialOpen: false },
                        createElement(ToggleControl, {
                            label: __('Mostrar filtros de búsqueda', 'bootstrap-theme'),
                            help: __('Mostrar u ocultar la barra de filtros (Dormitorios y Baños)', 'bootstrap-theme'),
                            checked: !!attributes.showFilters,
                            onChange: (value) => setAttributes({ showFilters: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Dormitorios', 'bootstrap-theme'),
                            value: attributes.filterDormitorio,
                            options: [{ label: __('— Sin filtro —', 'bootstrap-theme'), value: '' }].concat(
                                dorms.map((item) => ({ label: item, value: item }))
                            ),
                            onChange: (value) => setAttributes({ filterDormitorio: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Baños', 'bootstrap-theme'),
                            value: attributes.filterBano,
                            options: [{ label: __('— Sin filtro —', 'bootstrap-theme'), value: '' }].concat(
                                banos.map((item) => ({ label: item, value: item }))
                            ),
                            onChange: (value) => setAttributes({ filterBano: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'ratio ratio-16x9 bg-body-secondary d-flex align-items-center justify-content-center rounded' },
                        createElement('div', { className: 'text-center px-3' },
                            createElement('p', {}, __('El slider se renderizará con las Plantas publicadas en el frontend.', 'bootstrap-theme')),
                            createElement('small', { className: 'text-muted' }, __('Usa las configuraciones globales de Swiper en Opciones de Tema → Otros.', 'bootstrap-theme'))
                        )
                    )
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);