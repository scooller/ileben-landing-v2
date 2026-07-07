/**
 * Block Editor: Masterplan Hotspot
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, RangeControl, Icon } = wp.components;
    const { createElement, Fragment, useState, useEffect } = wp.element;

    registerBlockType('bootstrap-theme/bs-masterplan-hotspot', {
        apiVersion: 3,
        title: __('Hotspot', 'ileben-landing'),
        description: __('Un punto de interacción en el masterplan.', 'ileben-landing'),
        icon: 'location-alt',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-interactive-masterplan'],
        supports: { html: false },
        attributes: {
            title: { type: 'string', default: 'Lote / Depto' },
            description: { type: 'string', default: '' },
            status: { type: 'string', default: 'disponible' },
            link: { type: 'string', default: '' },
            image: { type: 'object', default: null },
            top: { type: 'number', default: 50 },
            left: { type: 'number', default: 50 }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const [isDragging, setIsDragging] = useState(false);
            const containerRef = wp.element.useRef(null);
            
            // Preview style for positioning in the editor
            const btnColor = attributes.status === 'vendido' ? '#dc3545' : (attributes.status === 'reservado' ? '#ffc107' : '#0d6efd');
            const textColor = attributes.status === 'reservado' ? '#000' : '#fff';
            
            const blockProps = useBlockProps({
                style: {
                    position: 'absolute',
                    top: attributes.top + '%',
                    left: attributes.left + '%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: isDragging ? 100 : 10,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }
            });

            const onMouseDown = (e) => {
                // Prevenir el comportamiento por defecto (que a veces Gutenberg captura)
                e.preventDefault();
                setIsDragging(true);
            };

            useEffect(() => {
                if (!isDragging || !containerRef.current) return;

                const currentWin = containerRef.current.ownerDocument.defaultView;

                const onMouseMove = (e) => {
                    const canvas = containerRef.current.closest('.bs-masterplan-editor-canvas');
                    if (!canvas) return;

                    const rect = canvas.getBoundingClientRect();
                    
                    // Calcular nueva posición relativa al canvas padre
                    let x = e.clientX - rect.left;
                    let y = e.clientY - rect.top;
                    
                    // Limitar entre 0 y 100
                    let left = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    let top = Math.max(0, Math.min(100, (y / rect.height) * 100));
                    
                    setAttributes({ left: parseFloat(left.toFixed(2)), top: parseFloat(top.toFixed(2)) });
                };

                const onMouseUp = () => {
                    setIsDragging(false);
                };

                currentWin.addEventListener('mousemove', onMouseMove);
                currentWin.addEventListener('mouseup', onMouseUp);

                return () => {
                    currentWin.removeEventListener('mousemove', onMouseMove);
                    currentWin.removeEventListener('mouseup', onMouseUp);
                };
            }, [isDragging, setAttributes]);

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración del Punto', 'ileben-landing'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Título / Número', 'ileben-landing'),
                            value: attributes.title,
                            onChange: (val) => setAttributes({ title: val })
                        }),
                        createElement(SelectControl, {
                            label: __('Estado', 'ileben-landing'),
                            value: attributes.status,
                            options: [
                                { label: 'Disponible (Azul)', value: 'disponible' },
                                { label: 'Reservado (Amarillo)', value: 'reservado' },
                                { label: 'Vendido (Rojo)', value: 'vendido' }
                            ],
                            onChange: (val) => setAttributes({ status: val })
                        }),
                        createElement('p', { className: 'components-base-control__help' }, __('También puedes arrastrar el punto directamente en la imagen.', 'ileben-landing')),
                        createElement(RangeControl, {
                            label: __('Posición Top (%)', 'ileben-landing'),
                            value: attributes.top,
                            onChange: (val) => setAttributes({ top: val }),
                            min: 0,
                            max: 100,
                            step: 0.1
                        }),
                        createElement(RangeControl, {
                            label: __('Posición Left (%)', 'ileben-landing'),
                            value: attributes.left,
                            onChange: (val) => setAttributes({ left: val }),
                            min: 0,
                            max: 100,
                            step: 0.1
                        }),
                        createElement(TextControl, {
                            label: __('Descripción', 'ileben-landing'),
                            value: attributes.description,
                            onChange: (val) => setAttributes({ description: val })
                        }),
                        createElement(TextControl, {
                            label: __('Link Botón (Opcional)', 'ileben-landing'),
                            value: attributes.link,
                            onChange: (val) => setAttributes({ link: val })
                        }),
                        createElement(wp.blockEditor.MediaUploadCheck, {},
                            createElement(wp.blockEditor.MediaUpload, {
                                onSelect: (media) => setAttributes({ image: { id: media.id, url: media.url, alt: media.alt } }),
                                allowedTypes: ['image'],
                                value: attributes.image ? attributes.image.id : undefined,
                                render: ({ open }) => createElement(wp.components.Button, {
                                    isSecondary: true,
                                    onClick: open,
                                    style: { width: '100%', justifyContent: 'center', marginTop: '10px', marginBottom: attributes.image ? '10px' : '0' }
                                }, attributes.image ? __('Cambiar Imagen Tooltip', 'ileben-landing') : __('Añadir Imagen a Tooltip', 'ileben-landing'))
                            })
                        ),
                        attributes.image && createElement('div', { style: { marginBottom: '10px', marginTop: '5px' } },
                            createElement('img', { src: attributes.image.url, style: { width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #ddd' } })
                        ),
                        attributes.image && createElement(wp.components.Button, {
                            isDestructive: true,
                            isLink: true,
                            onClick: () => setAttributes({ image: null }),
                            style: { marginTop: '5px' }
                        }, __('Eliminar Imagen', 'ileben-landing'))
                    )
                ),
                createElement('div', { ...blockProps, ref: containerRef },
                    createElement('div', {
                        onMouseDown: onMouseDown,
                        style: {
                            width: '28px',
                            height: '28px',
                            backgroundColor: btnColor,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: textColor,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            pointerEvents: 'auto',
                            position: 'relative'
                        },
                        title: attributes.title
                    }, createElement(Icon, { icon: 'plus', size: 14 })),
                    // Tooltip Preview when selected
                    props.isSelected && createElement('div', {
                        style: {
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '10px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '200px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            pointerEvents: 'none',
                            zIndex: 1000,
                            textAlign: 'center'
                        }
                    },
                        createElement('div', { style: { backgroundColor: '#0d6efd', color: '#fff', padding: '5px 20px 5px 5px', margin: '-10px -10px 10px -10px', borderRadius: '3px 3px 0 0', fontSize: '11px', fontWeight: 'bold' } }, 
                            attributes.title + ' (' + attributes.status.charAt(0).toUpperCase() + attributes.status.slice(1) + ')'
                        ),
                        attributes.image && createElement('img', { src: attributes.image.url, style: { width: '100%', maxHeight: '120px', objectFit: 'cover', marginBottom: '8px', borderRadius: '4px' } }),
                        attributes.description && createElement('p', { style: { fontSize: '12px', marginBottom: 0, color: '#333' } }, attributes.description)
                    )
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);
