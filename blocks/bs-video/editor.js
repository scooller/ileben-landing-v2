/**
 * Bootstrap Video Block Editor with Mask Support
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUploadCheck, MediaUpload, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, ToggleControl, Button, __experimentalNumberControl: NumberControl } = wp.components;
    const { createElement: el, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-video', {
        title: __('Video with Mask', 'bootstrap-theme'),
        description: __('A video block with optional image mask support (e.g., phone frame)', 'bootstrap-theme'),
        icon: 'format-video',
        category: 'ileben-landing',
        keywords: [__('video'), __('mask'), __('phone'), __('frame')],
        attributes: {
            videoUrl: { type: 'string', default: '' },
            maskUrl: { type: 'string', default: '' },
            overlayUrl: { type: 'string', default: '' },
            width: { type: 'string', default: '100%' },
            height: { type: 'string', default: 'auto' },
            autoplay: { type: 'boolean', default: true },
            loop: { type: 'boolean', default: true },
            muted: { type: 'boolean', default: true },
            controls: { type: 'boolean', default: false },
            preload: { type: 'string', default: 'metadata' },
            objectFit: { type: 'string', default: 'cover' },
            className: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            const videoPreviewStyle = {
                width: attributes.width === '100%' ? '100%' : attributes.width,
                height: attributes.height === 'auto' ? '400px' : attributes.height,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
            };

            // Apply mask styles if provided
            if (attributes.maskUrl) {
                videoPreviewStyle.WebkitMaskImage = `url(${attributes.maskUrl})`;
                videoPreviewStyle.maskImage = `url(${attributes.maskUrl})`;
                videoPreviewStyle.WebkitMaskSize = 'contain';
                videoPreviewStyle.maskSize = 'contain';
                videoPreviewStyle.WebkitMaskRepeat = 'no-repeat';
                videoPreviewStyle.maskRepeat = 'no-repeat';
                videoPreviewStyle.WebkitMaskPosition = 'center';
                videoPreviewStyle.maskPosition = 'center';
            }

            return el(
                Fragment,
                {},
                el(
                    'div',
                    blockProps,
                    el(
                        'div',
                        { style: videoPreviewStyle },
                        attributes.videoUrl
                            ? el('video', {
                                src: attributes.videoUrl,
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: attributes.objectFit,
                                },
                                autoPlay: true,
                                muted: true,
                                loop: true,
                                controls: true,
                            })
                            : el(
                                'p',
                                { style: { color: '#999', margin: 0 } },
                                __('Select a video to preview', 'bootstrap-theme')
                            )
                    )
                ),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: __('Video Settings', 'bootstrap-theme'), initialOpen: true },
                        el(
                            MediaUploadCheck,
                            {},
                            el(
                                MediaUpload,
                                {
                                    onSelect: (media) => setAttributes({ videoUrl: media.url }),
                                    allowedTypes: ['video'],
                                    render: ({ open }) =>
                                        el(
                                            Button,
                                            {
                                                onClick: open,
                                                isSecondary: !attributes.videoUrl,
                                                isPrimary: !!attributes.videoUrl,
                                            },
                                            attributes.videoUrl ? __('Change Video', 'bootstrap-theme') : __('Select Video', 'bootstrap-theme')
                                        ),
                                },
                                null
                            )
                        ),
                        attributes.videoUrl && el(
                            Button,
                            {
                                onClick: () => setAttributes({ videoUrl: '' }),
                                isDestructive: true,
                                isSmall: true,
                            },
                            __('Remove Video', 'bootstrap-theme')
                        ),
                        el(ToggleControl, {
                            label: __('Autoplay', 'bootstrap-theme'),
                            checked: attributes.autoplay,
                            onChange: (value) => setAttributes({ autoplay: value }),
                            help: __('Video will start playing automatically', 'bootstrap-theme'),
                        }),
                        el(ToggleControl, {
                            label: __('Loop', 'bootstrap-theme'),
                            checked: attributes.loop,
                            onChange: (value) => setAttributes({ loop: value }),
                            help: __('Video will loop continuously', 'bootstrap-theme'),
                        }),
                        el(ToggleControl, {
                            label: __('Muted', 'bootstrap-theme'),
                            checked: attributes.muted,
                            onChange: (value) => setAttributes({ muted: value }),
                            help: __('Video will be muted (required for autoplay)', 'bootstrap-theme'),
                        }),
                        el(ToggleControl, {
                            label: __('Show Controls', 'bootstrap-theme'),
                            checked: attributes.controls,
                            onChange: (value) => setAttributes({ controls: value }),
                        }),
                        el(
                            'label',
                            { style: { display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '500' } },
                            __('Preload', 'bootstrap-theme')
                        ),
                        el(
                            'select',
                            {
                                value: attributes.preload,
                                onChange: (e) => setAttributes({ preload: e.target.value }),
                                style: {
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                },
                            },
                            el('option', { value: 'none' }, __('None - Do not preload', 'bootstrap-theme')),
                            el('option', { value: 'metadata' }, __('Metadata - Load title, duration, etc', 'bootstrap-theme')),
                            el('option', { value: 'auto' }, __('Auto - Load entire video', 'bootstrap-theme'))
                        )
                    ),
                    el(
                        PanelBody,
                        { title: __('Mask Settings', 'bootstrap-theme'), initialOpen: false },
                        el(
                            'p',
                            { style: { fontSize: '13px', margin: '0 0 16px 0', color: '#555' } },
                            __('Upload an image (like a phone frame) to use as a mask over the video', 'bootstrap-theme')
                        ),
                        el(
                            MediaUploadCheck,
                            {},
                            el(
                                MediaUpload,
                                {
                                    onSelect: (media) => setAttributes({ maskUrl: media.url }),
                                    allowedTypes: ['image'],
                                    render: ({ open }) =>
                                        el(
                                            Button,
                                            {
                                                onClick: open,
                                                isSecondary: !attributes.maskUrl,
                                                isPrimary: !!attributes.maskUrl,
                                            },
                                            attributes.maskUrl ? __('Change Mask', 'bootstrap-theme') : __('Select Mask Image', 'bootstrap-theme')
                                        ),
                                },
                                null
                            )
                        ),
                        attributes.maskUrl && el(
                            Button,
                            {
                                onClick: () => setAttributes({ maskUrl: '' }),
                                isDestructive: true,
                                isSmall: true,
                            },
                            __('Remove Mask', 'bootstrap-theme')
                        ),
                        attributes.maskUrl && el(
                            'div',
                            { style: { marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' } },
                            el('p', { style: { margin: '0 0 8px 0', fontWeight: 'bold' } }, __('Mask Preview:', 'bootstrap-theme')),
                            el('img', {
                                src: attributes.maskUrl,
                                style: {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '4px',
                                    maxHeight: '200px',
                                },
                                alt: 'Mask preview'
                            })
                        )
                    ),
                    el(
                        PanelBody,
                        { title: __('Overlay Image', 'bootstrap-theme'), initialOpen: false },
                        el(
                            'p',
                            { style: { fontSize: '13px', margin: '0 0 16px 0', color: '#555' } },
                            __('Upload an image to display on top of the video (e.g., phone bezel, frame)', 'bootstrap-theme')
                        ),
                        el(
                            MediaUploadCheck,
                            {},
                            el(
                                MediaUpload,
                                {
                                    onSelect: (media) => setAttributes({ overlayUrl: media.url }),
                                    allowedTypes: ['image'],
                                    render: ({ open }) =>
                                        el(
                                            Button,
                                            {
                                                onClick: open,
                                                isSecondary: !attributes.overlayUrl,
                                                isPrimary: !!attributes.overlayUrl,
                                            },
                                            attributes.overlayUrl ? __('Change Overlay Image', 'bootstrap-theme') : __('Select Overlay Image', 'bootstrap-theme')
                                        ),
                                },
                                null
                            )
                        ),
                        attributes.overlayUrl && el(
                            Button,
                            {
                                onClick: () => setAttributes({ overlayUrl: '' }),
                                isDestructive: true,
                                isSmall: true,
                            },
                            __('Remove Overlay', 'bootstrap-theme')
                        ),
                        attributes.overlayUrl && el(
                            'div',
                            { style: { marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' } },
                            el('p', { style: { margin: '0 0 8px 0', fontWeight: 'bold' } }, __('Overlay Preview:', 'bootstrap-theme')),
                            el('img', {
                                src: attributes.overlayUrl,
                                style: {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '4px',
                                    maxHeight: '200px',
                                },
                                alt: 'Overlay preview'
                            })
                        )
                    ),
                    el(
                        PanelBody,
                        { title: __('Size & Display', 'bootstrap-theme'), initialOpen: false },
                        el(TextControl, {
                            label: __('Width', 'bootstrap-theme'),
                            value: attributes.width,
                            onChange: (value) => setAttributes({ width: value }),
                            placeholder: 'e.g., 100%, 400px',
                            help: __('Set as percentage (100%) or pixels (400px)', 'bootstrap-theme'),
                        }),
                        el(TextControl, {
                            label: __('Height', 'bootstrap-theme'),
                            value: attributes.height,
                            onChange: (value) => setAttributes({ height: value }),
                            placeholder: 'e.g., 600px, auto',
                            help: __('Set as pixels (600px) or auto', 'bootstrap-theme'),
                        }),
                        el(
                            'label',
                            { style: { display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '500' } },
                            __('Object Fit', 'bootstrap-theme')
                        ),
                        el(
                            'select',
                            {
                                value: attributes.objectFit,
                                onChange: (e) => setAttributes({ objectFit: e.target.value }),
                                style: {
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                },
                            },
                            el('option', { value: 'cover' }, __('Cover', 'bootstrap-theme')),
                            el('option', { value: 'contain' }, __('Contain', 'bootstrap-theme')),
                            el('option', { value: 'fill' }, __('Fill', 'bootstrap-theme')),
                            el('option', { value: 'scale-down' }, __('Scale Down', 'bootstrap-theme'))
                        )
                    )
                )
            );
        },
        save() {
            // Dynamic blocks render on backend
            return null;
        }
    });
})(window.wp);
