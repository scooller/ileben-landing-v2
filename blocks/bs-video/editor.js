/**
 * Bootstrap Video Block Editor with Mask Support
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUploadCheck, MediaUpload, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, ToggleControl, Button, __experimentalNumberControl: NumberControl } = wp.components;
    const { createElement: el, Fragment } = wp.element;
    const themeUri = (typeof window.ILEBEN_THEME_URI === 'string') ? window.ILEBEN_THEME_URI : '';

    registerBlockType('bootstrap-theme/bs-video', {
        apiVersion: 3,
        title: __('Video with Mask', 'ileben-landing'),
        description: __('A video block with optional image mask support (e.g., phone frame)', 'ileben-landing'),
        icon: 'format-video',
        category: 'ileben-landing',
        keywords: [__('video'), __('mask'), __('phone'), __('frame')],
        attributes: {
            videoUrl: { type: 'string', default: '' },
            maskUrl: { type: 'string', default: themeUri ? (themeUri + '/assets/images/mask/iphone-back-mask.png') : '' },
            overlayUrl: { type: 'string', default: themeUri ? (themeUri + '/assets/images/mask/apple-iphone-12-pro-medium.png') : '' },
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
                                __('Select a video to preview', 'ileben-landing')
                            )
                    )
                ),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: __('Video Settings', 'ileben-landing'), initialOpen: true },
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
                                            attributes.videoUrl ? __('Change Video', 'ileben-landing') : __('Select Video', 'ileben-landing')
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
                            __('Remove Video', 'ileben-landing')
                        ),
                        el(ToggleControl, {
                            label: __('Autoplay', 'ileben-landing'),
                            checked: attributes.autoplay,
                            onChange: (value) => setAttributes({ autoplay: value }),
                            help: __('Video will start playing automatically', 'ileben-landing'),
                        }),
                        el(ToggleControl, {
                            label: __('Loop', 'ileben-landing'),
                            checked: attributes.loop,
                            onChange: (value) => setAttributes({ loop: value }),
                            help: __('Video will loop continuously', 'ileben-landing'),
                        }),
                        el(ToggleControl, {
                            label: __('Muted', 'ileben-landing'),
                            checked: attributes.muted,
                            onChange: (value) => setAttributes({ muted: value }),
                            help: __('Video will be muted (required for autoplay)', 'ileben-landing'),
                        }),
                        el(ToggleControl, {
                            label: __('Show Controls', 'ileben-landing'),
                            checked: attributes.controls,
                            onChange: (value) => setAttributes({ controls: value }),
                        }),
                        el(
                            'label',
                            { style: { display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '500' } },
                            __('Preload', 'ileben-landing')
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
                            el('option', { value: 'none' }, __('None - Do not preload', 'ileben-landing')),
                            el('option', { value: 'metadata' }, __('Metadata - Load title, duration, etc', 'ileben-landing')),
                            el('option', { value: 'auto' }, __('Auto - Load entire video', 'ileben-landing'))
                        )
                    ),
                    el(
                        PanelBody,
                        { title: __('Mask Settings', 'ileben-landing'), initialOpen: false },
                        el(
                            'p',
                            { style: { fontSize: '13px', margin: '0 0 16px 0', color: '#555' } },
                            __('Upload an image (like a phone frame) to use as a mask over the video', 'ileben-landing')
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
                                            attributes.maskUrl ? __('Change Mask', 'ileben-landing') : __('Select Mask Image', 'ileben-landing')
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
                            __('Remove Mask', 'ileben-landing')
                        ),
                        attributes.maskUrl && el(
                            'div',
                            { style: { marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' } },
                            el('p', { style: { margin: '0 0 8px 0', fontWeight: 'bold' } }, __('Mask Preview:', 'ileben-landing')),
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
                        { title: __('Overlay Image', 'ileben-landing'), initialOpen: false },
                        el(
                            'p',
                            { style: { fontSize: '13px', margin: '0 0 16px 0', color: '#555' } },
                            __('Upload an image to display on top of the video (e.g., phone bezel, frame)', 'ileben-landing')
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
                                            attributes.overlayUrl ? __('Change Overlay Image', 'ileben-landing') : __('Select Overlay Image', 'ileben-landing')
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
                            __('Remove Overlay', 'ileben-landing')
                        ),
                        attributes.overlayUrl && el(
                            'div',
                            { style: { marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' } },
                            el('p', { style: { margin: '0 0 8px 0', fontWeight: 'bold' } }, __('Overlay Preview:', 'ileben-landing')),
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
                        { title: __('Size & Display', 'ileben-landing'), initialOpen: false },
                        el(TextControl, {
                            label: __('Width', 'ileben-landing'),
                            value: attributes.width,
                            onChange: (value) => setAttributes({ width: value }),
                            placeholder: 'e.g., 100%, 400px',
                            help: __('Set as percentage (100%) or pixels (400px)', 'ileben-landing'),
                        }),
                        el(TextControl, {
                            label: __('Height', 'ileben-landing'),
                            value: attributes.height,
                            onChange: (value) => setAttributes({ height: value }),
                            placeholder: 'e.g., 600px, auto',
                            help: __('Set as pixels (600px) or auto', 'ileben-landing'),
                        }),
                        el(
                            'label',
                            { style: { display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '500' } },
                            __('Object Fit', 'ileben-landing')
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
                            el('option', { value: 'cover' }, __('Cover', 'ileben-landing')),
                            el('option', { value: 'contain' }, __('Contain', 'ileben-landing')),
                            el('option', { value: 'fill' }, __('Fill', 'ileben-landing')),
                            el('option', { value: 'scale-down' }, __('Scale Down', 'ileben-landing'))
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