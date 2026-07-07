/**
 * Block: Plantas Showcase (editor registration)
 */

(function (wp) {
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var ToggleControl = wp.components.ToggleControl;
    var TextControl = wp.components.TextControl;
    var SelectControl = wp.components.SelectControl;
    var __ = wp.i18n.__;
    var categorias = window.BOOTSTRAP_THEME_PLANTAS_CATEGORIAS || [];

    wp.blocks.registerBlockType('bootstrap-theme/bs-plantas-showcase', {
        title: __('Plantas Showcase', 'ileben-landing'),
        description: __('Carrusel de plantas con panel de detalles y lightbox (estilo ficha).', 'ileben-landing'),
        icon: 'building',
        category: 'ileben-landing',
        apiVersion: 3,
        supports: {
            html: false,
            align: false,
            className: true
        },
        attributes: {
            postsPerPage: { type: 'number', default: -1 },
            buttonLabel: { type: 'string', default: 'Cotizar' },
            disabledButtonLabel: { type: 'string', default: 'No disponible' },
            showFilters: { type: 'boolean', default: true },
            filterCategoria: { type: 'string', default: '' },
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
            animationMobileEnabled: { type: 'boolean' },
            sliderImageType: { type: 'string', default: 'portada' }
        },
        edit: function (props) {
            var atts = props.attributes;
            var setAttributes = props.setAttributes;

            var categoriaOptions = [{ label: 'Todas las categorías', value: '' }];
            categorias.forEach(function (cat) {
                categoriaOptions.push({ label: cat.name, value: cat.slug });
            });

            var inspector = el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    { title: __('Ajustes del Showcase', 'ileben-landing'), initialOpen: true },
                    el(SelectControl, {
                        label: __('Categoría', 'ileben-landing'),
                        value: atts.filterCategoria || '',
                        options: categoriaOptions,
                        onChange: function (val) {
                            setAttributes({ filterCategoria: val });
                        }
                    }),
                    el(TextControl, {
                        label: __('Botón Cotizar', 'ileben-landing'),
                        value: atts.buttonLabel || '',
                        onChange: function (val) {
                            setAttributes({ buttonLabel: val });
                        }
                    }),
                    el(TextControl, {
                        label: __('Botón Deshabilitado', 'ileben-landing'),
                        value: atts.disabledButtonLabel || '',
                        onChange: function (val) {
                            setAttributes({ disabledButtonLabel: val });
                        }
                    }),
                    el(ToggleControl, {
                        label: __('Mostrar filtros', 'ileben-landing'),
                        checked: !!atts.showFilters,
                        onChange: function (val) {
                            setAttributes({ showFilters: val });
                        }
                    }),
                    el(SelectControl, {
                        label: __('Imagen a mostrar en el slider', 'ileben-landing'),
                        value: atts.sliderImageType || 'portada',
                        options: [
                            { label: __('Imagen de Portada (Front)', 'ileben-landing'), value: 'portada' },
                            { label: __('Imagen Interior (Back)', 'ileben-landing'), value: 'interior' }
                        ],
                        onChange: function (val) {
                            setAttributes({ sliderImageType: val });
                        }
                    })
                )
            );

            // Preview placeholder in editor
            var preview = el(
                'div',
                { className: 'bs-plantas-showcase-editor-preview' },
                el('h4', null, __('Plantas Showcase', 'ileben-landing')),
                el('p', { className: 'text-muted' }, __('Carrusel con panel de detalles y lightbox. Se renderiza dinámicamente en el front-end.', 'ileben-landing')),
                atts.filterCategoria
                    ? el('p', null, __('Categoría: ', 'ileben-landing') + atts.filterCategoria)
                    : null,
                atts.showFilters
                    ? el('span', { className: 'dashicon dashicons dashicons-filter' })
                    : null
            );

            return el(Fragment, null, inspector, preview);
        },
        save: function () {
            return null; // Dynamic block
        }
    });
})(window.wp);
