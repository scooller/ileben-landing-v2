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
        title: __('Galer├¡a', 'ileben-landing'),
        description: __('Galer├¡a de im├ígenes con CSS Grid, lightbox y efectos hover', 'ileben-landing'),
        icon: 'format-gallery',
        category: 'ileben-landing',
        keywords: [__('gallery'), __('galer├¡a'), __('grid'), __('lightbox')],
        
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
                    columnSpan: 1, // Cu├íntas columnas ocupa
                    rowSpan: 1, // Cu├íntas filas ocupa
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
                { label: __('Ninguno', 'ileben-landing'), value: 'none' },
                { label: __('XS', 'ileben-landing'), value: 'xs' },
                { label: __('Peque├▒o', 'ileben-landing'), value: 'small' },
                { label: __('Normal', 'ileben-landing'), value: 'default' },
                { label: __('Medio', 'ileben-landing'), value: 'medium' },
                { label: __('Grande', 'ileben-landing'), value: 'large' },
            ];

            const hoverEffects = [
                { label: __('Overlay', 'ileben-landing'), value: 'overlay' },
                { label: __('Zoom', 'ileben-landing'), value: 'zoom' },
                { label: __('Slide', 'ileben-landing'), value: 'slide' },
                { label: __('Fade', 'ileben-landing'), value: 'fade' },
                { label: __('Ninguno', 'ileben-landing'), value: 'none' },
            ];

            const sizeOptions = [
                { label: __('Thumb (150x150)', 'ileben-landing'), value: 'thumb' },
                { label: __('Medio (300x300)', 'ileben-landing'), value: 'medio' },
                { label: __('Largo (600x600)', 'ileben-landing'), value: 'largo' },
                { label: __('Completo', 'ileben-landing'), value: 'completo' },
            ];

            return el(Fragment, {},
                el(BlockControls, {},
                    el(ToolbarGroup, {},
                        el(ToolbarButton, {
                            label: __('A├▒adir im├ígenes', 'ileben-landing'),
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
                    el(PanelBody, { title: __('Im├ígenes', 'ileben-landing'), initialOpen: true },
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
                            }, __('A├▒adir im├ígenes', 'ileben-landing'))
                        ),
                        attributes.images.length > 0 && el('div', { style: { fontSize: '12px', color: '#666', marginBottom: '12px' } },
                            __(`${attributes.images.length} imagen(s) seleccionada(s)`, 'ileben-landing')
                        ),
                        
                        // Configuraci├│n por imagen seleccionada
                        selectedImageIndex !== null && attributes.images[selectedImageIndex] && el('div', { 
                            style: { 
                                padding: '12px', 
                                background: '#f0f0f0', 
                                borderRadius: '4px',
                                marginTop: '12px'
                            } 
                        },
                            el('div', { style: { marginBottom: '8px', fontWeight: 'bold' } },
                                __(`Configuraci├│n de imagen #${selectedImageIndex + 1}`, 'ileben-landing')
                            ),
                            el(SelectControl, {
                                label: __('Tama├▒o de thumbnail', 'ileben-landing'),
                                value: attributes.images[selectedImageIndex].thumbnailSize || 'medium',
                                options: sizeOptions,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'thumbnailSize', value)
                            }),
                            el('hr', { style: { margin: '12px 0' } }),
                            el('div', { style: { marginBottom: '8px', fontSize: '11px', color: '#666', fontWeight: 'bold' } },
                                __('Tama├▒o en el Grid (Layout tipo Mosaico)', 'ileben-landing')
                            ),
                            el(RangeControl, {
                                label: __('Columnas que ocupa (Column Span)', 'ileben-landing'),
                                value: attributes.images[selectedImageIndex].columnSpan || 1,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'columnSpan', value),
                                min: 1,
                                max: 6,
                                help: __('Cu├íntas columnas ocupa esta imagen (1 = normal, 2 = doble ancho, etc.)', 'ileben-landing')
                            }),
                            el(RangeControl, {
                                label: __('Filas que ocupa (Row Span)', 'ileben-landing'),
                                value: attributes.images[selectedImageIndex].rowSpan || 1,
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'rowSpan', value),
                                min: 1,
                                max: 4,
                                help: __('Cu├íntas filas ocupa esta imagen (1 = normal, 2 = doble alto, etc.)', 'ileben-landing')
                            }),
                            el('hr', { style: { margin: '12px 0' } }),
                            el(TextControl, {
                                label: __('Caption personalizado', 'ileben-landing'),
                                placeholder: __('Ingresa un caption solo para esta imagen (opcional)', 'ileben-landing'),
                                value: attributes.images[selectedImageIndex].customCaption || attributes.images[selectedImageIndex].title || '',
                                onChange: (value) => updateImageProperty(selectedImageIndex, 'customCaption', value),
                            }),
                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' } },
                                el('button', {
                                    className: 'button button-primary button-small',
                                    onClick: () => onReplaceImage(selectedImageIndex),
                                    style: { flex: 1 }
                                }, __('­ƒöä Reemplazar imagen', 'ileben-landing')),
                                el('button', {
                                    className: 'button button-small',
                                    onClick: () => onRemoveImage(selectedImageIndex),
                                    style: { flex: 1, color: '#dc3545' }
                                }, __('Ô£ò Quitar', 'ileben-landing'))
                            ),
                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
                                selectedImageIndex > 0 && el('button', {
                                    className: 'button button-small',
                                    onClick: () => onMoveImage(selectedImageIndex, 'up')
                                }, 'Ôåæ ' + __('Mover arriba', 'ileben-landing')),
                                selectedImageIndex < attributes.images.length - 1 && el('button', {
                                    className: 'button button-small',
                                    onClick: () => onMoveImage(selectedImageIndex, 'down')
                                }, 'Ôåô ' + __('Mover abajo', 'ileben-landing'))
                            ),
                            el('button', {
                                className: 'button button-small',
                                onClick: () => setSelectedImageIndex(null),
                                style: { marginTop: '8px', width: '100%' }
                            }, __('Cerrar configuraci├│n', 'ileben-landing'))
                        )
                    ),

                    el(PanelBody, { title: __('Grid', 'ileben-landing') },
                        el(RangeControl, {
                            label: __('Columnas Desktop', 'ileben-landing'),
                            value: attributes.columns,
                            onChange: (value) => setAttributes({ columns: value }),
                            min: 1,
                            max: 6,
                            help: __('N├║mero de columnas en pantallas grandes', 'ileben-landing')
                        }),
                        el(RangeControl, {
                            label: __('Columnas Mobile', 'ileben-landing'),
                            value: attributes.columnsMobile,
                            onChange: (value) => setAttributes({ columnsMobile: value }),
                            min: 1,
                            max: 4,
                            help: __('N├║mero de columnas en m├│viles', 'ileben-landing')
                        }),
                        el(SelectControl, {
                            label: __('Espaciado (Gap)', 'ileben-landing'),
                            value: attributes.gap,
                            options: gapOptions,
                            onChange: (value) => setAttributes({ gap: value })
                        })
                    ),

                    el(PanelBody, { title: __('Efecto Hover', 'ileben-landing') },
                        el(SelectControl, {
                            label: __('Efecto hover', 'ileben-landing'),
                            value: attributes.hoverEffect,
                            options: hoverEffects,
                            onChange: (value) => setAttributes({ hoverEffect: value })
                        }),
                        'overlay' === attributes.hoverEffect && el(Fragment, {},
                            el('div', { style: { marginTop: '12px' } },
                                el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: 'bold' } }, __('Color overlay', 'ileben-landing')),
                                el(ColorPicker, {
                                    color: attributes.overlayColor,
                                    onChangeComplete: (value) => setAttributes({ overlayColor: value.hex }),
                                    disableAlpha: true
                                })
                            ),
                            el(RangeControl, {
                                label: __('Opacidad overlay', 'ileben-landing'),
                                value: attributes.overlayOpacity,
                                onChange: (value) => setAttributes({ overlayOpacity: value }),
                                min: 0,
                                max: 1,
                                step: 0.1
                            })
                        )
                    ),

                    el(PanelBody, { title: __('Contenido', 'ileben-landing') },
                        el(ToggleControl, {
                            label: __('Mostrar captions', 'ileben-landing'),
                            checked: attributes.showCaptions,
                            onChange: (value) => setAttributes({ showCaptions: value })
                        }),
                        el(ToggleControl, {
                            label: __('Lightbox (FancyBox)', 'ileben-landing'),
                            checked: attributes.lightbox,
                            onChange: (value) => setAttributes({ lightbox: value })
                        }),
                        el(RangeControl, {
                            label: __('L├¡mite de im├ígenes a mostrar', 'ileben-landing'),
                            value: attributes.imageLimit,
                            onChange: (value) => setAttributes({ imageLimit: value }),
                            min: 0,
                            max: 100,
                            help: __('0 = sin l├¡mite (mostrar todas)', 'ileben-landing')
                        }),
                        el(ToggleControl, {
                            label: __('Activar filtrado por categor├¡as', 'ileben-landing'),
                            checked: attributes.filterCategories,
                            onChange: (value) => setAttributes({ filterCategories: value }),
                            help: __('Muestra botones de filtro si las im├ígenes tienen categor├¡as asignadas', 'ileben-landing')
                        })
                    )
                ),

                el('div', blockProps,
                    attributes.images.length === 0 ?
                        el('div', { style: { padding: '40px', textAlign: 'center', background: '#f5f5f5', borderRadius: '4px' } },
                            el('p', {}, __('Ninguna imagen seleccionada. Haz clic en "A├▒adir im├ígenes" para comenzar.', 'ileben-landing'))
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
                                        }, '├ù')
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