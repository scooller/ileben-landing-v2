/**
 * Gallery Block - Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, MediaPlaceholder, BlockControls } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, RangeControl, ColorPicker, ToolbarGroup, ToolbarButton } = wp.components;
    const { createElement: el, Fragment, useState } = wp.element;

    registerBlockType('bootstrap-theme/bs-gallery', {
        title: __('Galería', 'bootstrap-theme'),
        description: __('Galería de imágenes con Masonry, lightbox y efectos hover', 'bootstrap-theme'),
        icon: 'format-gallery',
        category: 'ileben-landing',
        keywords: [__('gallery'), __('galería'), __('masonry'), __('lightbox')],
        
        attributes: {
            images: { type: 'array', default: [] },
            columns: { type: 'number', default: 3 },
            columnsMobile: { type: 'number', default: 2 },
            lightbox: { type: 'boolean', default: true },
            gap: { type: 'string', default: 'default' },
            gapMobile: { type: 'string', default: 'default' },
            hoverEffect: { type: 'string', default: 'overlay' },
            thumbnailSize: { type: 'string', default: 'medium' },
            crop: { type: 'boolean', default: true },
            aspectRatio: { type: 'string', default: '1/1' },
            alternateAspectRatio: { type: 'boolean', default: false },
            aspectRatioPattern: { type: 'number', default: 3 },
            secondaryAspectRatio: { type: 'string', default: '2/3' },
            enableMasonry: { type: 'boolean', default: true },
            filterCategories: { type: 'boolean', default: false },
            imageOrder: { type: 'string', default: 'asc' },
            showCaptions: { type: 'boolean', default: true },
            overlayColor: { type: 'string', default: '#000000' },
            overlayOpacity: { type: 'number', default: 0.5 },
            imageLimit: { type: 'number', default: 0 },
        },

        edit: (props) => {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const [sortOpen, setSortOpen] = useState(false);

            const onSelectImages = (media) => {
                const newImages = media.map(img => ({
                    id: img.id,
                    url: img.url,
                }));
                setAttributes({ images: newImages });
            };

            const onMoveImage = (fromIndex, toIndex) => {
                const newImages = [...attributes.images];
                const [moved] = newImages.splice(fromIndex, 1);
                newImages.splice(toIndex, 0, moved);
                setAttributes({ images: newImages });
            };

            const onRemoveImage = (index) => {
                const newImages = attributes.images.filter((_, i) => i !== index);
                setAttributes({ images: newImages });
            };

            const gapOptions = [
                { label: __('Ninguno', 'bootstrap-theme'), value: 'none' },
                { label: __('XS', 'bootstrap-theme'), value: 'xs' },
                { label: __('Pequeño', 'bootstrap-theme'), value: 'small' },
                { label: __('Normal', 'bootstrap-theme'), value: 'default' },
                { label: __('Medio', 'bootstrap-theme'), value: 'medium' },
                { label: __('Grande', 'bootstrap-theme'), value: 'large' },
            ];

            const hoverEffects = [
                { label: __('Overlay', 'bootstrap-theme'), value: 'overlay' },
                { label: __('Zoom', 'bootstrap-theme'), value: 'zoom' },
                { label: __('Slide', 'bootstrap-theme'), value: 'slide' },
                { label: __('Fade', 'bootstrap-theme'), value: 'fade' },
                { label: __('Ninguno', 'bootstrap-theme'), value: 'none' },
            ];

            const sizeOptions = [
                { label: __('Thumb (150x150)', 'bootstrap-theme'), value: 'thumb' },
                { label: __('Medio (300x300)', 'bootstrap-theme'), value: 'medio' },
                { label: __('Largo (600x600)', 'bootstrap-theme'), value: 'largo' },
                { label: __('Completo', 'bootstrap-theme'), value: 'completo' },
            ];

            const aspectRatios = [
                { label: 'Auto (Imagen original)', value: 'auto' },
                { label: '1:1 (Cuadrado)', value: '1/1' },
                { label: '4:3 (Estándar)', value: '4/3' },
                { label: '3:4 (Vertical)', value: '3/4' },
                { label: '16:9 (Panorámico)', value: '16/9' },
                { label: '9:16 (Vertical Móvil)', value: '9/16' },
                { label: '21:9 (Ultra Panorámico)', value: '21/9' },
                { label: '2:3 (Vertical)', value: '2/3' },
                { label: '3:2 (Horizontal)', value: '3/2' },
            ];

            const orderings = [
                { label: __('Ascendente', 'bootstrap-theme'), value: 'asc' },
                { label: __('Descendente', 'bootstrap-theme'), value: 'desc' },
                { label: __('Aleatorio', 'bootstrap-theme'), value: 'random' },
            ];

            const orderingHelp = () => {
                const helps = {
                    asc: __('Orden alfabético (A-Z)', 'bootstrap-theme'),
                    desc: __('Orden inverso (Z-A)', 'bootstrap-theme'),
                    random: __('Orden aleatorio cada vez que se carga la página', 'bootstrap-theme'),
                };
                return helps[attributes.imageOrder] || helps.asc;
            };

            return el(Fragment, {},
                el(BlockControls, {},
                    el(ToolbarGroup, {},
                        el(ToolbarButton, {
                            label: __('Añadir imágenes', 'bootstrap-theme'),
                            icon: 'plus',
                            onClick: () => {
                                const mediaFrame = wp.media({
                                    multiple: true,
                                    library: { type: 'image' },
                                });
                                mediaFrame.on('select', function() {
                                    const selected = mediaFrame.state().get('selection').toJSON();
                                    onSelectImages(selected);
                                });
                                mediaFrame.open();
                            }
                        })
                    )
                ),

                el(InspectorControls, {},
                    el(PanelBody, { title: __('Imágenes', 'bootstrap-theme'), initialOpen: true },
                        el('div', { style: { marginBottom: '12px' } },
                            el('button', {
                                className: 'button button-primary',
                                onClick: () => {
                                    const mediaFrame = wp.media({
                                        multiple: true,
                                        library: { type: 'image' },
                                    });
                                    mediaFrame.on('select', function() {
                                        const selected = mediaFrame.state().get('selection').toJSON();
                                        onSelectImages(selected);
                                    });
                                    mediaFrame.open();
                                }
                            }, __('Seleccionar imágenes', 'bootstrap-theme'))
                        ),
                        attributes.images.length > 0 && el('div', { style: { fontSize: '12px', color: '#666' } },
                            __(`${attributes.images.length} imagen(s) seleccionada(s)`, 'bootstrap-theme')
                        )
                    ),

                    el(PanelBody, { title: __('Layout', 'bootstrap-theme') },
                        el(ToggleControl, {
                            label: __('Habilitar Masonry Layout', 'bootstrap-theme'),
                            checked: attributes.enableMasonry,
                            onChange: (value) => setAttributes({ enableMasonry: value }),
                            help: __('Layout dinámico que acomoda las imágenes sin espacios verticales', 'bootstrap-theme')
                        }),
                        el(RangeControl, {
                            label: __('Columnas', 'bootstrap-theme'),
                            value: attributes.columns,
                            onChange: (value) => setAttributes({ columns: value }),
                            min: 1,
                            max: 6,
                            help: __('Número de columnas en desktop (5=auto)', 'bootstrap-theme')
                        }),
                        el(RangeControl, {
                            label: __('Columnas móvil', 'bootstrap-theme'),
                            value: attributes.columnsMobile,
                            onChange: (value) => setAttributes({ columnsMobile: value }),
                            min: 1,
                            max: 4,
                            help: __('Número de columnas en móviles', 'bootstrap-theme')
                        }),
                        el(SelectControl, {
                            label: __('Gap (espaciado)', 'bootstrap-theme'),
                            value: attributes.gap,
                            options: gapOptions,
                            onChange: (value) => setAttributes({ gap: value })
                        }),
                        el(SelectControl, {
                            label: __('Gap Móvil', 'bootstrap-theme'),
                            value: attributes.gapMobile,
                            options: gapOptions,
                            onChange: (value) => setAttributes({ gapMobile: value })
                        })
                    ),

                    el(PanelBody, { title: __('Imágenes', 'bootstrap-theme') },
                        el(SelectControl, {
                            label: __('Relación aspecto', 'bootstrap-theme'),
                            value: attributes.aspectRatio,
                            options: aspectRatios,
                            onChange: (value) => setAttributes({ aspectRatio: value }),
                            help: __('Relación de aspecto principal', 'bootstrap-theme')
                        }),
                        el(ToggleControl, {
                            label: __('Alternar relación de aspecto (Masonry)', 'bootstrap-theme'),
                            checked: attributes.alternateAspectRatio,
                            onChange: (value) => setAttributes({ alternateAspectRatio: value }),
                            help: __('Alterna entre dos relaciones de aspecto para diseño masonry', 'bootstrap-theme')
                        }),
                        attributes.alternateAspectRatio && el(Fragment, {},
                            el(SelectControl, {
                                label: __('Relación aspecto secundaria', 'bootstrap-theme'),
                                value: attributes.secondaryAspectRatio,
                                options: aspectRatios,
                                onChange: (value) => setAttributes({ secondaryAspectRatio: value }),
                                help: __('Segunda relación de aspecto para alternar', 'bootstrap-theme')
                            }),
                            el(RangeControl, {
                                label: __('Patrón de alternancia', 'bootstrap-theme'),
                                value: attributes.aspectRatioPattern,
                                onChange: (value) => setAttributes({ aspectRatioPattern: value }),
                                min: 2,
                                max: 10,
                                help: __('Cada cuántas imágenes alternar (ej: 3 = cada 3 imágenes cambia)', 'bootstrap-theme')
                            })
                        ),
                        el(SelectControl, {
                            label: __('Tamaño de thumbnail', 'bootstrap-theme'),
                            value: attributes.thumbnailSize,
                            options: sizeOptions,
                            onChange: (value) => setAttributes({ thumbnailSize: value })
                        }),
                        el(ToggleControl, {
                            label: __('Recortar imágenes', 'bootstrap-theme'),
                            checked: attributes.crop,
                            onChange: (value) => setAttributes({ crop: value }),
                            help: __('Recorta la imagen al tamaño especificado', 'bootstrap-theme')
                        })
                    ),

                    el(PanelBody, { title: __('Efecto Hover', 'bootstrap-theme') },
                        el(SelectControl, {
                            label: __('Efecto hover', 'bootstrap-theme'),
                            value: attributes.hoverEffect,
                            options: hoverEffects,
                            onChange: (value) => setAttributes({ hoverEffect: value })
                        }),
                        'overlay' === attributes.hoverEffect && el(Fragment, {},
                            el('div', { style: { marginTop: '12px' } },
                                el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } }, __('Color overlay', 'bootstrap-theme')),
                                el(ColorPicker, {
                                    color: attributes.overlayColor,
                                    onChangeComplete: (value) => setAttributes({ overlayColor: value.hex }),
                                    disableAlpha: true
                                })
                            ),
                            el(RangeControl, {
                                label: __('Opacidad overlay', 'bootstrap-theme'),
                                value: attributes.overlayOpacity,
                                onChange: (value) => setAttributes({ overlayOpacity: value }),
                                min: 0,
                                max: 1,
                                step: 0.1
                            })
                        )
                    ),

                    el(PanelBody, { title: __('Contenido', 'bootstrap-theme') },
                        el(ToggleControl, {
                            label: __('Mostrar captions', 'bootstrap-theme'),
                            checked: attributes.showCaptions,
                            onChange: (value) => setAttributes({ showCaptions: value })
                        }),
                        el(ToggleControl, {
                            label: __('Lightbox (FancyBox)', 'bootstrap-theme'),
                            checked: attributes.lightbox,
                            onChange: (value) => setAttributes({ lightbox: value })
                        })
                    ),

                    el(PanelBody, { title: __('Opciones avanzadas', 'bootstrap-theme') },
                        el(SelectControl, {
                            label: __('Orden de imágenes', 'bootstrap-theme'),
                            value: attributes.imageOrder,
                            options: orderings,
                            onChange: (value) => setAttributes({ imageOrder: value }),
                            help: orderingHelp()
                        }),
                        el(RangeControl, {
                            label: __('Límite de imágenes a mostrar', 'bootstrap-theme'),
                            value: attributes.imageLimit,
                            onChange: (value) => setAttributes({ imageLimit: value }),
                            min: 0,
                            max: 100,
                            help: __('0 = sin límite (mostrar todas)', 'bootstrap-theme')
                        }),
                        el(ToggleControl, {
                            label: __('Activar filtrado por categorías', 'bootstrap-theme'),
                            checked: attributes.filterCategories,
                            onChange: (value) => setAttributes({ filterCategories: value }),
                            help: __('Muestra botones de filtro si las imágenes tienen categorías asignadas', 'bootstrap-theme')
                        })
                    )
                ),

                el('div', blockProps,
                    attributes.images.length === 0 ?
                        el('div', { style: { padding: '40px', textAlign: 'center', background: '#f5f5f5', borderRadius: '4px' } },
                            el('p', {}, __('Ninguna imagen seleccionada. Haz clic en el botón + para añadir imágenes.', 'bootstrap-theme'))
                        )
                        :
                        el('div', { className: 'bs-gallery-editor-preview', style: {
                            display: 'grid',
                            gridTemplateColumns: `repeat(${attributes.columns}, 1fr)`,
                            gap: '12px'
                        }},
                            attributes.images.map((image, index) =>
                                el('div', {
                                    key: image.id,
                                    style: {
                                        position: 'relative',
                                        paddingBottom: '100%',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                    }
                                },
                                    el('img', {
                                        src: image.url,
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }
                                    }),
                                    el('button', {
                                        onClick: () => onRemoveImage(index),
                                        style: {
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }
                                    }, __('Quitar', 'bootstrap-theme'))
                                )
                            )
                        )
                )
            );
        },

        save: () => null, // dynamic render in PHP
    });
})(window.wp);
