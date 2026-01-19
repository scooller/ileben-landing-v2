/**
 * Gallery Block - Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, MediaPlaceholder, BlockControls } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, RangeControl, ColorPicker, ToolbarGroup, ToolbarButton, TextControl } = wp.components;
    const { createElement: el, Fragment, useState } = wp.element;

    registerBlockType('bootstrap-theme/bs-gallery', {
        title: __('Galería', 'bootstrap-theme'),
        description: __('Galería de imágenes con CSS Grid, lightbox y efectos hover', 'bootstrap-theme'),
        icon: 'format-gallery',
        category: 'ileben-landing',
        keywords: [__('gallery'), __('galería'), __('grid'), __('lightbox')],
        
        attributes: {
            images: { 
                type: 'array', 
                default: [],
            },
            columns: { type: 'number', default: 3 },
            columnsMobile: { type: 'number', default: 2 },
            lightbox: { type: 'boolean', default: true },
            gap: { type: 'string', default: 'default' },
            hoverEffect: { type: 'string', default: 'overlay' },
            filterCategories: { type: 'boolean', default: false },
            showCaptions: { type: 'boolean', default: true },
            overlayColor: { type: 'string', default: '#000000' },
            overlayOpacity: { type: 'number', default: 0.5 },
            imageLimit: { type: 'number', default: 0 },
        },

        edit: (props) => {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const [selectedImageIndex, setSelectedImageIndex] = useState(null);
            const [draggedIndex, setDraggedIndex] = useState(null);

            const onSelectImages = (media) => {
                const newImages = media.map(img => ({
                    id: img.id,
                    url: img.url,
                    thumbnailSize: 'medium', // Valor por defecto
                    columnSpan: 1, // Cuántas columnas ocupa
                    rowSpan: 1, // Cuántas filas ocupa
                    customCaption: '', // Caption personalizado opcional
                }));
                setAttributes({ images: [...attributes.images, ...newImages] });
            };

            const updateImageProperty = (index, property, value) => {
                const newImages = [...attributes.images];
                newImages[index] = { ...newImages[index], [property]: value };
                setAttributes({ images: newImages });
            };

            const onDragStart = (index) => {
                setDraggedIndex(index);
            };

            const onDragOver = (e, index) => {
                e.preventDefault();
                if (draggedIndex === null || draggedIndex === index) return;
                
                const newImages = [...attributes.images];
                const draggedImage = newImages[draggedIndex];
                newImages.splice(draggedIndex, 1);
                newImages.splice(index, 0, draggedImage);
                
                setAttributes({ images: newImages });
                setDraggedIndex(index);
            };

            const onDragEnd = () => {
                setDraggedIndex(null);
            };

            const onMoveImage = (fromIndex, direction) => {
                const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
                if (toIndex < 0 || toIndex >= attributes.images.length) return;
                
                const newImages = [...attributes.images];
                const [moved] = newImages.splice(fromIndex, 1);
                newImages.splice(toIndex, 0, moved);
                setAttributes({ images: newImages });
                setSelectedImageIndex(toIndex);
            };

            const onRemoveImage = (index) => {
                const newImages = attributes.images.filter((_, i) => i !== index);
                setAttributes({ images: newImages });
            };

            const onReplaceImage = (index) => {
                const mediaFrame = wp.media({
                    multiple: false,
                    library: { type: 'image' },
                });
                mediaFrame.on('select', function() {
                    const selected = mediaFrame.state().get('selection').first().toJSON();
                    const newImages = [...attributes.images];
                    newImages[index] = {
                        ...newImages[index],
                        id: selected.id,
                        url: selected.url,
                    };
                    setAttributes({ images: newImages });
                });
                mediaFrame.open();
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
                            }, __('Añadir imágenes', 'bootstrap-theme'))
                        ),
                        attributes.images.length > 0 && el('div', { style: { fontSize: '12px', color: '#666', marginBottom: '12px' } },
                            __(`${attributes.images.length} imagen(s) seleccionada(s)`, 'bootstrap-theme')
                        ),
                        
                        // Configuración por imagen seleccionada
                        selectedImageIndex !== null && attributes.images[selectedImageIndex] && el('div', { 
                            style: { 
                                padding: '12px', 
                                background: '#f0f0f0', 
                                borderRadius: '4px',
                                marginTop: '12px'
                            } 
                        },
                            el('div', { style: { marginBottom: '8px', fontWeight: 'bold' } },
                                __(`Configuración de imagen #${selectedImageIndex + 1}`, 'bootstrap-theme')
                            ),
                            el(SelectControl, {
                                label: __('Tamaño de thumbnail', 'bootstrap-theme'),
                                value: attributes.images[selectedImageIndex].thumbnailSize || 'medium',
                                options: sizeOptions,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'thumbnailSize', value)
                            }),
                            el('hr', { style: { margin: '12px 0' } }),
                            el('div', { style: { marginBottom: '8px', fontSize: '11px', color: '#666', fontWeight: 'bold' } },
                                __('Tamaño en el Grid (Layout tipo Mosaico)', 'bootstrap-theme')
                            ),
                            el(RangeControl, {
                                label: __('Columnas que ocupa (Column Span)', 'bootstrap-theme'),
                                value: attributes.images[selectedImageIndex].columnSpan || 1,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'columnSpan', value),
                                min: 1,
                                max: 6,
                                help: __('Cuántas columnas ocupa esta imagen (1 = normal, 2 = doble ancho, etc.)', 'bootstrap-theme')
                            }),
                            el(RangeControl, {
                                label: __('Filas que ocupa (Row Span)', 'bootstrap-theme'),
                                value: attributes.images[selectedImageIndex].rowSpan || 1,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'rowSpan', value),
                                min: 1,
                                max: 4,
                                help: __('Cuántas filas ocupa esta imagen (1 = normal, 2 = doble alto, etc.)', 'bootstrap-theme')
                            }),
                            el('hr', { style: { margin: '12px 0' } }),
                            el(TextControl, {
                                label: __('Caption personalizado', 'bootstrap-theme'),
                                placeholder: __('Ingresa un caption solo para esta imagen (opcional)', 'bootstrap-theme'),
                                value: attributes.images[selectedImageIndex].customCaption || attributes.images[selectedImageIndex].title || '',
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'customCaption', value),
                            }),
                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' } },
                                el('button', {
                                    className: 'button button-primary button-small',
                                    onClick: () => onReplaceImage(selectedImageIndex),
                                    style: { flex: 1 }
                                }, __('🔄 Reemplazar imagen', 'bootstrap-theme')),
                                el('button', {
                                    className: 'button button-small',
                                    onClick: () => onRemoveImage(selectedImageIndex),
                                    style: { flex: 1, color: '#dc3545' }
                                }, __('✕ Quitar', 'bootstrap-theme'))
                            ),
                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
                                selectedImageIndex > 0 && el('button', {
                                    className: 'button button-small',
                                    onClick: () => onMoveImage(selectedImageIndex, 'up')
                                }, '↑ ' + __('Mover arriba', 'bootstrap-theme')),
                                selectedImageIndex < attributes.images.length - 1 && el('button', {
                                    className: 'button button-small',
                                    onClick: () => onMoveImage(selectedImageIndex, 'down')
                                }, '↓ ' + __('Mover abajo', 'bootstrap-theme'))
                            ),
                            el('button', {
                                className: 'button button-small',
                                onClick: () => setSelectedImageIndex(null),
                                style: { marginTop: '8px', width: '100%' }
                            }, __('Cerrar configuración', 'bootstrap-theme'))
                        )
                    ),

                    el(PanelBody, { title: __('Grid', 'bootstrap-theme') },
                        el(RangeControl, {
                            label: __('Columnas Desktop', 'bootstrap-theme'),
                            value: attributes.columns,
                            onChange: (value) => setAttributes({ columns: value }),
                            min: 1,
                            max: 6,
                            help: __('Número de columnas en pantallas grandes', 'bootstrap-theme')
                        }),
                        el(RangeControl, {
                            label: __('Columnas Mobile', 'bootstrap-theme'),
                            value: attributes.columnsMobile,
                            onChange: (value) => setAttributes({ columnsMobile: value }),
                            min: 1,
                            max: 4,
                            help: __('Número de columnas en móviles', 'bootstrap-theme')
                        }),
                        el(SelectControl, {
                            label: __('Espaciado (Gap)', 'bootstrap-theme'),
                            value: attributes.gap,
                            options: gapOptions,
                            onChange: (value) => setAttributes({ gap: value })
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
                            el('p', {}, __('Ninguna imagen seleccionada. Haz clic en "Añadir imágenes" para comenzar.', 'bootstrap-theme'))
                        )
                        :
                        el('div', { 
                            className: 'bs-gallery-editor-preview', 
                            style: {
                                display: 'grid',
                                gridTemplateColumns: `repeat(${attributes.columns}, 1fr)`,
                                gap: '12px'
                            }
                        },
                            attributes.images.map((image, index) =>
                                el('div', {
                                    key: image.id,
                                    draggable: true,
                                    onDragStart: () => onDragStart(index),
                                    onDragOver: (e) => onDragOver(e, index),
                                    onDragEnd: onDragEnd,
                                    onClick: () => setSelectedImageIndex(index),
                                    style: {
                                        position: 'relative',
                                        paddingBottom: '100%',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        border: selectedImageIndex === index ? '3px solid #2271b1' : '1px solid #ddd',
                                        cursor: 'move',
                                        opacity: draggedIndex === index ? 0.5 : 1,
                                        transition: 'opacity 0.2s, border 0.2s'
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
                                            objectFit: 'cover',
                                            pointerEvents: 'none'
                                        }
                                    }),
                                    el('div', {
                                        style: {
                                            position: 'absolute',
                                            top: '4px',
                                            left: '4px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }
                                    }, `#${index + 1}`),
                                    el('div', {
                                        style: {
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            display: 'flex',
                                            gap: '4px'
                                        }
                                    },
                                        el('button', {
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                onRemoveImage(index);
                                            },
                                            style: {
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }
                                        }, '×')
                                    ),
                                    el('div', {
                                        style: {
                                            position: 'absolute',
                                            bottom: '4px',
                                            left: '4px',
                                            right: '4px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '4px',
                                            borderRadius: '3px',
                                            fontSize: '10px',
                                            textAlign: 'center'
                                        }
                                    }, `${image.thumbnailSize || 'medium'} | Col:${image.columnSpan || 1} Row:${image.rowSpan || 1}`)
                                )
                            )
                        )
                )
            );
        },

        save: () => null, // dynamic render in PHP
    });
})(window.wp);
