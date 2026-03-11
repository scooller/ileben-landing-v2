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
        apiVersion: 3,
        title: __('Plantas Slider', 'ileben-landing'),
        description: __('Muestra las plantas publicadas como slider (Swiper).', 'ileben-landing'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        supports: { html: false },
        attributes: {
            postsPerPage: { type: 'number', default: -1 },
            showThumbnail: { type: 'boolean', default: true },
            buttonLabel: { type: 'string', default: __('Cotizar', 'ileben-landing') },
            disabledButtonLabel: { type: 'string', default: __('No disponible', 'ileben-landing') },
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
            filterBano: { type: 'string', default: '' },
            filterCategoria: { type: 'string', default: '' },
            // Animation attributes
            animationType: { type: 'string' },
            animationTrigger: { type: 'string' },
            animationDuration: { type: 'number' },
            animationDelay: { type: 'number' },
            animationEase: { type: 'string' },
            animationRepeat: { type: 'number' },
            animationRepeatDelay: { type: 'number' },
            animationYoyo: { type: 'boolean' },
            animationDistance: { type: 'string' },
            animationRotation: { type: 'number' },
            animationScale: { type: 'string' },
            animationParallaxSpeed: { type: 'number' },
            animationHoverEffect: { type: 'string' },
            animationScrollStart: { type: 'string', default: 'top 70%' },
            animationScrollEnd: { type: 'string', default: 'top 10%' },
            animationScrollMarkers: { type: 'boolean', default: false },
            animationMobileEnabled: { type: 'boolean' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-plantas-slider-preview' });
            const options = (window.BOOTSTRAP_THEME_PLANTAS_OPTIONS || {});
            const dorms = Array.isArray(options.dorms) ? options.dorms : [];
            const banos = Array.isArray(options.banos) ? options.banos : [];

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración', 'ileben-landing'), initialOpen: true },
                        createElement(RangeControl, {
                            label: __('Máximo de posts (-1 = todos)', 'ileben-landing'),
                            value: attributes.postsPerPage,
                            onChange: (value) => setAttributes({ postsPerPage: value }),
                            min: -1,
                            max: 24
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Slides por Viewport', 'ileben-landing')),
                        createElement(TextControl, {
                            label: __('Mobile (< 768px)', 'ileben-landing'),
                            value: attributes.slidesPerViewMobile,
                            onChange: (value) => setAttributes({ slidesPerViewMobile: value }),
                            placeholder: '1'
                        }),
                        createElement(TextControl, {
                            label: __('Tablet (768px - 1023px)', 'ileben-landing'),
                            value: attributes.slidesPerViewTablet,
                            onChange: (value) => setAttributes({ slidesPerViewTablet: value }),
                            placeholder: '1.5'
                        }),
                        createElement(TextControl, {
                            label: __('Desktop (>= 1024px)', 'ileben-landing'),
                            value: attributes.slidesPerViewDesktop,
                            onChange: (value) => setAttributes({ slidesPerViewDesktop: value }),
                            placeholder: '3'
                        }),
                        createElement(ToggleControl, {
                            label: __('Mostrar imagen destacada', 'ileben-landing'),
                            checked: !!attributes.showThumbnail,
                            onChange: (value) => setAttributes({ showThumbnail: value })
                        }),
                        createElement(TextControl, {
                            label: __('Texto botón cotizador', 'ileben-landing'),
                            value: attributes.buttonLabel,
                            onChange: (value) => setAttributes({ buttonLabel: value })
                        }),
                        createElement(TextControl, {
                            label: __('Texto botón desactivado', 'ileben-landing'),
                            value: attributes.disabledButtonLabel,
                            onChange: (value) => setAttributes({ disabledButtonLabel: value })
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Navegación', 'ileben-landing')),
                        createElement(ToggleControl, {
                            label: __('Mostrar flechas prev/next', 'ileben-landing'),
                            checked: !!attributes.navigationArrows,
                            onChange: (value) => setAttributes({ navigationArrows: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Tipo de paginación', 'ileben-landing'),
                            value: attributes.paginationType,
                            options: [
                                { label: __('Sin paginación', 'ileben-landing'), value: 'none' },
                                { label: __('Bullets (puntos)', 'ileben-landing'), value: 'bullets' },
                                { label: __('Fracciones (2/10)', 'ileben-landing'), value: 'fraction' },
                                { label: __('Barra de progreso', 'ileben-landing'), value: 'progressbar' },
                                { label: __('Scroll bar', 'ileben-landing'), value: 'scrollbar' }
                            ],
                            onChange: (value) => setAttributes({ paginationType: value })
                        }),
                        createElement('h4', { style: { marginTop: '1rem', marginBottom: '0.5rem' } }, __('Efecto', 'ileben-landing')),
                        createElement(SelectControl, {
                            label: __('Tipo de efecto', 'ileben-landing'),
                            value: attributes.effect,
                            options: [
                                { label: __('Slide (defecto)', 'ileben-landing'), value: 'slide' },
                                { label: __('Fade (desvanecimiento)', 'ileben-landing'), value: 'fade' },
                                { label: __('Cube (cubo 3D)', 'ileben-landing'), value: 'cube' },
                                { label: __('Coverflow (portadas)', 'ileben-landing'), value: 'coverflow' },
                                { label: __('Flip (volteo)', 'ileben-landing'), value: 'flip' },
                                { label: __('Cards (tarjetas)', 'ileben-landing'), value: 'cards' },
                                { label: __('Creative (personalizado)', 'ileben-landing'), value: 'creative' }
                            ],
                            onChange: (value) => setAttributes({ effect: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Centrar slide activo', 'ileben-landing'),
                            checked: !!attributes.centered,
                            onChange: (value) => setAttributes({ centered: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Repetir infinitamente (loop)', 'ileben-landing'),
                            checked: !!attributes.loop,
                            onChange: (value) => setAttributes({ loop: value })
                        })
                    ),
                    createElement(PanelBody, { title: __('Filtros', 'ileben-landing'), initialOpen: false },
                        createElement(ToggleControl, {
                            label: __('Mostrar filtros de búsqueda', 'ileben-landing'),
                            help: __('Mostrar u ocultar la barra de filtros (Dormitorios y Baños)', 'ileben-landing'),
                            checked: !!attributes.showFilters,
                            onChange: (value) => setAttributes({ showFilters: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Dormitorios', 'ileben-landing'),
                            value: attributes.filterDormitorio,
                            options: [{ label: __('-- Sin filtro --', 'ileben-landing'), value: '' }].concat(
                                dorms.map((item) => ({ label: item, value: item }))
                            ),
                            onChange: (value) => setAttributes({ filterDormitorio: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Baños', 'ileben-landing'),
                            value: attributes.filterBano,
                            options: [{ label: __('-- Sin filtro --', 'ileben-landing'), value: '' }].concat(
                                banos.map((item) => ({ label: item, value: item }))
                            ),
                            onChange: (value) => setAttributes({ filterBano: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Categoría', 'ileben-landing'),
                            value: attributes.filterCategoria,
                            options: [{ label: __('-- Sin filtro --', 'ileben-landing'), value: '' }].concat(
                                (window.BOOTSTRAP_THEME_PLANTAS_CATEGORIAS || []).map((cat) => ({ label: cat.name, value: cat.slug }))
                            ),
                            onChange: (value) => setAttributes({ filterCategoria: value })
                        })
                    ),
                    // Animation Controls Panel
                    window.ilebenAnimationControls && createElement(
                        window.ilebenAnimationControls.AnimationControls, 
                        { 
                            attributes: attributes, 
                            setAttributes: setAttributes,
                            allowHover: true,
                            allowScroll: false
                        }
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: 'ratio ratio-16x9 bg-body-secondary d-flex align-items-center justify-content-center rounded' },
                        createElement('div', { className: 'text-center px-3' },
                            createElement('p', {}, __('El slider se renderizará con las Plantas publicadas en el frontend.', 'ileben-landing')),
                            createElement('small', { className: 'text-muted' }, __('Usa las configuraciones globales de Swiper en Opciones de Tema -> Otros.', 'ileben-landing'))
                        )
                    )
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);