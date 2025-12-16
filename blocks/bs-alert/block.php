<?php
/**
 * Bootstrap Alert Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Alert Block
 */
function bootstrap_theme_render_bs_alert_block($attributes, $content, $block) {
    $variant = $attributes['variant'] ?? 'primary';
    $dismissible = $attributes['dismissible'] ?? false;
    $heading = $attributes['heading'] ?? '';
    
    // ...existing code...
    
    // Build alert classes
    $classes = array('alert', 'alert-' . $variant);
    
    if ($dismissible) {
        $classes[] = 'alert-dismissible';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $output = '<div class="' . esc_attr($class_string) . '" role="alert">';
    
    if (!empty($heading)) {
        $output .= '<h4 class="alert-heading">' . esc_html($heading) . '</h4>';
    }
    
    // Process the InnerBlocks content
    if (!empty($content)) {
        // The content should already be processed HTML from InnerBlocks.Content
        $output .= $content;
    } else {
        $output .= '<p>' . __('Please add content to your alert.', 'bootstrap-theme') . '</p>';
    }
    
    if ($dismissible) {
        $output .= '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="' . esc_attr__('Close', 'bootstrap-theme') . '"></button>';
    }
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Alert Block
 */
function bootstrap_theme_register_bs_alert_block() {
    register_block_type('bootstrap-theme/bs-alert', array(
        'render_callback' => 'bootstrap_theme_render_bs_alert_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'variant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'dismissible' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'heading' => array(
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
add_action('init', 'bootstrap_theme_register_bs_alert_block');
