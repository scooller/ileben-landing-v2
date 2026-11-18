/**
 * Gallery Slider Block Editor
 */
(function (wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = wp.blockEditor;
    const { PanelBody, ToggleControl, Button, TextControl, SelectControl } = wp.components;
    const { createElement: h, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-gallery-slider', {
        apiVersion: 3,
        title: __('Gallery Slider', 'ileben-landing'),
        description: __('Slider de imágenes con caption (basado en Plantas Slider)', 'ileben-landing'),
        icon: 'images-alt2',
        category: 'ileben-landing',
        keywords: [__('slider'), __('gallery'), __('galeria')],
        attributes: {
            images: { type: 'array', default: [] },
            slidesPerViewMobile: { type: 'string', default: '1' },
            slidesPerViewTablet: { type: 'string', default: '2' },
            slidesPerViewDesktop: { type: 'string', default: '3' },
            navigationArrows: { type: 'boolean', default: true },
            paginationType: { type: 'string', default: 'bullets' },
            loop: { type: 'boolean', default: true },
            fancybox: { type: 'boolean', default: true }
        },

        edit: function ({ attributes, setAttributes }) {
            const blockProps = useBlockProps();
            const images = attributes.images || [];
            const setImages = (list) => setAttributes({ images: list });
            const update = (i, patch) => setImages(images.map((img, n) => (n === i ? { ...img, ...patch } : img)));
            const pick = (media) => setImages(media.map((m) => {
                const old = images.find((i) => i.id === m.id);
                return { id: m.id, url: m.url, alt: m.alt || '', caption: old ? old.caption : (m.caption || '') };
            }));
            const num = (key, label) => h(TextControl, {
                __next40pxDefaultSize: true, label, value: attributes[key],
                onChange: (v) => setAttributes({ [key]: v })
            });

            return h(Fragment, {},
                h(InspectorControls, {},
                    h(PanelBody, { title: __('Imágenes', 'ileben-landing') },
                        images.map((img, i) => h('div', { key: img.id || i, style: { marginBottom: 16 } },
                            h('img', { src: img.url, alt: '', style: { width: '100%', height: 80, objectFit: 'cover' } }),
                            h(TextControl, {
                                __next40pxDefaultSize: true, label: __('Caption', 'ileben-landing'),
                                value: img.caption || '', onChange: (v) => update(i, { caption: v })
                            }),
                            h(Button, { variant: 'link', isDestructive: true, onClick: () => setImages(images.filter((_, n) => n !== i)) }, __('Quitar', 'ileben-landing'))
                        ))
                    ),
                    h(PanelBody, { title: __('Slider', 'ileben-landing'), initialOpen: false },
                        num('slidesPerViewMobile', __('Slides móvil', 'ileben-landing')),
                        num('slidesPerViewTablet', __('Slides tablet', 'ileben-landing')),
                        num('slidesPerViewDesktop', __('Slides desktop', 'ileben-landing')),
                        h(ToggleControl, { label: __('Flechas', 'ileben-landing'), checked: attributes.navigationArrows, onChange: (v) => setAttributes({ navigationArrows: v }) }),
                        h(ToggleControl, { label: __('Loop', 'ileben-landing'), checked: attributes.loop, onChange: (v) => setAttributes({ loop: v }) }),
                        h(ToggleControl, { label: __('Abrir en Fancybox', 'ileben-landing'), checked: attributes.fancybox, onChange: (v) => setAttributes({ fancybox: v }) }),
                        h(SelectControl, {
                            __next40pxDefaultSize: true, label: __('Paginación', 'ileben-landing'), value: attributes.paginationType,
                            options: [
                                { label: 'Bullets', value: 'bullets' },
                                { label: 'Fracción', value: 'fraction' },
                                { label: 'Scrollbar', value: 'scrollbar' },
                                { label: __('Ninguna', 'ileben-landing'), value: 'none' }
                            ],
                            onChange: (v) => setAttributes({ paginationType: v })
                        })
                    )
                ),
                h('div', blockProps,
                    h(MediaUploadCheck, {},
                        h(MediaUpload, {
                            multiple: 'add', gallery: true, allowedTypes: ['image'],
                            value: images.map((i) => i.id),
                            onSelect: pick,
                            render: ({ open }) => h(Button, { variant: 'primary', onClick: open },
                                images.length ? __('Editar galería', 'ileben-landing') : __('Seleccionar imágenes', 'ileben-landing'))
                        })
                    ),
                    h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 } },
                        images.map((img, i) => h('figure', { key: img.id || i, style: { margin: 0, width: 140 } },
                            h('img', { src: img.url, alt: img.alt, style: { width: '100%', height: 100, objectFit: 'cover' } }),
                            img.caption && h('figcaption', { style: { fontSize: 12 } }, img.caption)
                        ))
                    )
                )
            );
        },

        save: () => null
    });
})(window.wp);
