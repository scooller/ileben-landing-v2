<?php
/**
 * Bootstrap Breadcrumb Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Breadcrumb Block
 */
function bootstrap_theme_render_bs_breadcrumb_block($attributes, $content, $block) {
    $divider = $attributes['divider'] ?? '';
    
    // Build breadcrumb classes
    $classes = array('breadcrumb');
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $output = '<nav aria-label="' . esc_attr__('breadcrumb', 'bootstrap-theme') . '">';
    $output .= '<ol class="' . esc_attr($class_string) . '"';
    
    if (!empty($divider)) {
        $output .= ' style="--bs-breadcrumb-divider: \'' . esc_attr($divider) . '\';"';
    }
    
    $output .= '>';
    
    // Process the InnerBlocks content (breadcrumb items)
    if (!empty($content)) {
        // The content should already be processed HTML from InnerBlocks.Content
        $output .= $content;
    } else {
        // Default content if no items
        $output .= '<li class="breadcrumb-item"><a href="#">' . __('Home', 'bootstrap-theme') . '</a></li>';
        $output .= '<li class="breadcrumb-item active" aria-current="page">' . __('Current Page', 'bootstrap-theme') . '</li>';
    }
    
    $output .= '</ol>';
    $output .= '</nav>';
    
    return $output;
}

/**
 * Register Bootstrap Breadcrumb Block
 */
function bootstrap_theme_register_bs_breadcrumb_block() {
    register_block_type('bootstrap-theme/bs-breadcrumb', array(
        'render_callback' => 'bootstrap_theme_render_bs_breadcrumb_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'divider' => array(
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
add_action('init', 'bootstrap_theme_register_bs_breadcrumb_block');
