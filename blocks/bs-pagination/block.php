<?php
/**
 * Bootstrap Pagination Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Pagination Block
 */
function bootstrap_theme_render_bs_pagination_block($attributes, $content, $block) {
    $size = $attributes['size'] ?? '';
    $alignment = $attributes['alignment'] ?? '';
    
    // Build pagination wrapper classes
    $wrapper_classes = array();
    
    if (!empty($alignment)) {
        switch ($alignment) {
            case 'center':
                $wrapper_classes[] = 'justify-content-center';
                break;
            case 'end':
                $wrapper_classes[] = 'justify-content-end';
                break;
        }
    }
    
    // Build pagination classes
    $pagination_classes = array('pagination');
    
    if (!empty($size)) {
        $pagination_classes[] = 'pagination-' . $size;
    }
    
    // Add custom CSS classes from Advanced panel
    $pagination_classes = bootstrap_theme_add_custom_classes($pagination_classes, $attributes, $block);
    
    $wrapper_class_string = !empty($wrapper_classes) ? ' class="' . esc_attr(implode(' ', $wrapper_classes)) . '"' : '';
    $pagination_class_string = implode(' ', array_unique($pagination_classes));
    
    $output = '<nav aria-label="' . esc_attr__('Page navigation', 'bootstrap-theme') . '">';
    $output .= '<ul' . $wrapper_class_string . ' class="' . esc_attr($pagination_class_string) . '">';
    
    // Process the InnerBlocks content (pagination items)
    if (!empty($content)) {
        // The content should already be processed HTML from InnerBlocks.Content
        $output .= $content;
    } else {
        // Default content if no items
        $output .= '<li class="page-item disabled"><a class="page-link" href="#">' . __('Previous', 'bootstrap-theme') . '</a></li>';
        $output .= '<li class="page-item active"><a class="page-link" href="#">1</a></li>';
        $output .= '<li class="page-item"><a class="page-link" href="#">2</a></li>';
        $output .= '<li class="page-item"><a class="page-link" href="#">3</a></li>';
        $output .= '<li class="page-item"><a class="page-link" href="#">' . __('Next', 'bootstrap-theme') . '</a></li>';
    }
    
    $output .= '</ul>';
    $output .= '</nav>';
    
    return $output;
}

/**
 * Register Bootstrap Pagination Block
 */
function bootstrap_theme_register_bs_pagination_block() {
    register_block_type('bootstrap-theme/bs-pagination', array(
        'render_callback' => 'bootstrap_theme_render_bs_pagination_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_pagination_block');
