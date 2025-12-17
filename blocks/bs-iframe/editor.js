/**
 * Bootstrap Iframe Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, ToggleControl, Notice } = wp.components;
    const { createElement, Fragment } = wp.element;

    const ratioOptions = [
        { label: '1x1', value: '1x1' },
        { label: '4x3', value: '4x3' },
        { label: '16x9', value: '16x9' },
        { label: '21x9', value: '21x9' }
    ];

    registerBlockType('bootstrap-theme/bs-iframe', {
        title: __('Bootstrap Iframe', 'bootstrap-theme'),
        description: __('Iframe responsive usando helper Ratio de Bootstrap 5', 'bootstrap-theme'),
        icon: 'video-alt3',
        category: 'ileben-landing',
        keywords: [__('iframe'), __('embed'), __('video')],
        supports: {
            html: false
        },
        attributes: {
            embedUrl: { type: 'string', default: '' },
            title: { type: 'string', default: '' },
            ratio: { type: 'string', default: '16x9' },
            allowFullscreen: { type: 'boolean', default: true },
            loading: { type: 'string', default: 'lazy' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-iframe-block' });

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Iframe Settings', 'bootstrap-theme'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Embed URL', 'bootstrap-theme'),
                            value: attributes.embedUrl,
                            onChange: (value) => setAttributes({ embedUrl: value }),
                            placeholder: 'https://www.youtube.com/embed/VIDEO_ID'
                        }),
                        createElement(TextControl, {
                            label: __('Title (accessibility)', 'bootstrap-theme'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value }),
                            placeholder: __('Contenido incrustado', 'bootstrap-theme')
                        }),
                        createElement(SelectControl, {
                            label: __('Ratio', 'bootstrap-theme'),
                            value: attributes.ratio,
                            options: ratioOptions,
                            onChange: (value) => setAttributes({ ratio: value })
                        }),
                        createElement(ToggleControl, {
                            label: __('Allow fullscreen', 'bootstrap-theme'),
                            checked: !!attributes.allowFullscreen,
                            onChange: (value) => setAttributes({ allowFullscreen: value })
                        }),
                        createElement(SelectControl, {
                            label: __('Loading', 'bootstrap-theme'),
                            value: attributes.loading,
                            options: [
                                { label: 'lazy', value: 'lazy' },
                                { label: 'eager', value: 'eager' }
                            ],
                            onChange: (value) => setAttributes({ loading: value })
                        })
                    )
                ),
                createElement('div', blockProps,
                    !attributes.embedUrl
                        ? createElement(Notice, { status: 'info', isDismissible: false }, __('Ingresa un Embed URL para previsualizar el iframe.', 'bootstrap-theme'))
                        : createElement('div', { className: `ratio ratio-${attributes.ratio || '16x9'}` },
                            createElement('iframe', {
                                src: attributes.embedUrl,
                                title: attributes.title || __('Contenido incrustado', 'bootstrap-theme'),
                                loading: attributes.loading || 'lazy',
                                style: { border: 0 },
                                ...(attributes.allowFullscreen ? { allowFullScreen: true } : {})
                            })
                        )
                )
            );
        },
        save: function() {
            return null; // Server-side render
        }
    });

})(window.wp);