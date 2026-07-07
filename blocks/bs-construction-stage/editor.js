/**
 * Block Editor: Construction Stage
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, RangeControl } = wp.components;
    const { createElement, Fragment } = wp.element;

    registerBlockType('bootstrap-theme/bs-construction-stage', {
        apiVersion: 3,
        title: __('Etapa de Obra', 'ileben-landing'),
        description: __('Una etapa individual en la línea de avance de obra.', 'ileben-landing'),
        icon: 'chart-bar',
        category: 'ileben-landing',
        parent: ['bootstrap-theme/bs-construction-progress-v2'],
        supports: { html: false },
        attributes: {
            title: { type: 'string', default: 'Nueva Etapa' },
            percentage: { type: 'number', default: 0 },
            date: { type: 'string', default: '' },
            status: { type: 'string', default: 'pending' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'bs-construction-stage-preview col text-center border p-3 bg-white rounded mb-2' });

            let barClass = 'bg-secondary';
            let textClass = 'text-muted';
            let icon = 'fa-regular fa-circle';
            let finalPercentage = attributes.percentage;

            if (attributes.status === 'completed') {
                barClass = 'bg-success';
                textClass = 'text-success';
                icon = 'fa-solid fa-circle-check';
                finalPercentage = 100;
            } else if (attributes.status === 'active') {
                barClass = 'bg-primary progress-bar-striped progress-bar-animated';
                textClass = 'text-primary fw-bold';
                icon = 'fa-solid fa-person-digging';
            }

            return createElement(Fragment, {},
                createElement(InspectorControls, {},
                    createElement(PanelBody, { title: __('Configuración de la Etapa', 'ileben-landing'), initialOpen: true },
                        createElement(SelectControl, {
                            label: __('Estado', 'ileben-landing'),
                            value: attributes.status,
                            options: [
                                { label: __('Pendiente', 'ileben-landing'), value: 'pending' },
                                { label: __('En curso (Animado)', 'ileben-landing'), value: 'active' },
                                { label: __('Completado (100%)', 'ileben-landing'), value: 'completed' }
                            ],
                            onChange: (val) => setAttributes({ status: val })
                        }),
                        attributes.status !== 'completed' && createElement(RangeControl, {
                            label: __('Porcentaje de Avance', 'ileben-landing'),
                            value: attributes.percentage,
                            onChange: (val) => setAttributes({ percentage: val }),
                            min: 0,
                            max: 100
                        })
                    )
                ),
                createElement('div', blockProps,
                    createElement('div', { className: `mb-3 ${textClass}`, style: { fontSize: '2rem' } },
                        createElement('i', { className: icon })
                    ),
                    createElement(RichText, {
                        tagName: 'h5',
                        className: 'h6 fw-bold mb-1',
                        value: attributes.title,
                        onChange: (val) => setAttributes({ title: val }),
                        placeholder: __('Nombre de la Etapa', 'ileben-landing')
                    }),
                    createElement(RichText, {
                        tagName: 'small',
                        className: 'd-block text-muted mb-2',
                        value: attributes.date,
                        onChange: (val) => setAttributes({ date: val }),
                        placeholder: __('Fecha opcional (ej: Ago 2024)', 'ileben-landing')
                    }),
                    createElement('div', { className: 'progress mt-3 shadow-sm rounded-pill', style: { height: '12px' } },
                        createElement('div', { className: `progress-bar ${barClass}`, style: { width: `${finalPercentage}%` } })
                    ),
                    createElement('div', { className: `mt-2 small fw-semibold ${textClass}` },
                        `${finalPercentage}%`
                    )
                )
            );
        },
        save: function() { return null; }
    });
})(window.wp);
