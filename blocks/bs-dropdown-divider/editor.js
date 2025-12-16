/**
 * Bootstrap Dropdown Divider Block Editor
 */

(function(wp) {
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
    const { useBlockProps } = wp.blockEditor;
    const { createElement } = wp.element;

    registerBlockType('bootstrap-theme/bs-dropdown-divider', {
        title: __('Bootstrap Dropdown Divider', 'bootstrap-theme'),
        description: __('Divider line for dropdown menus', 'bootstrap-theme'),
        icon: 'minus',
        category: 'ileben-landing',
        keywords: [__('dropdown'), __('divider'), __('separator')],
        parent: ['bootstrap-theme/bs-dropdown'],
        attributes: {
            preview: {
                type: 'boolean',
                default: false
            }
        },
        example: {
            attributes: {
                preview: true
            }
        },
        
        edit: function(props) {
            const { attributes } = props;
            const blockProps = useBlockProps();
            
            // Inserter preview image
            if (attributes.preview) {
                return createElement('img', {
                    src: '/wp-content/themes/bootstrap-theme/blocks/bs-dropdown-divider/example.png',
                    alt: __('Dropdown divider preview', 'bootstrap-theme'),
                    style: { width: '100%', height: 'auto', display: 'block' }
                });
            }
            
            return createElement('li', blockProps,
                createElement('hr', { 
                    className: 'dropdown-divider',
                    style: { margin: '0.5rem 0' }
                })
            );
        },

        save: function(props) {
            const blockProps = useBlockProps.save();
            
            return createElement('li', blockProps,
                createElement('hr', { className: 'dropdown-divider' })
            );
        }
    });

})(window.wp);