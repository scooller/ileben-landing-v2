<?php
/**
 * Bootstrap Offcanvas Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Offcanvas Block
 */
function bootstrap_theme_render_bs_offcanvas_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? __('Offcanvas', 'bootstrap-theme');
    $placement = $attributes['placement'] ?? 'start';
    $backdrop = $attributes['backdrop'] ?? true;
    $scroll = $attributes['scroll'] ?? false;
    $buttonText = $attributes['buttonText'] ?? __('Toggle Offcanvas', 'bootstrap-theme');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-primary';
    $offcanvasId = $attributes['offcanvasId'] ?? 'offcanvas-' . uniqid();
    
    // Build offcanvas classes
    $offcanvas_classes = array('offcanvas', 'offcanvas-' . $placement);
    
    // Add custom CSS classes from Advanced panel
    $offcanvas_classes = bootstrap_theme_add_custom_classes($offcanvas_classes, $attributes, $block);
    
    $offcanvas_class_string = implode(' ', array_unique($offcanvas_classes));
    
    $offcanvas_data = array();
    if (!$backdrop) {
        $offcanvas_data['data-bs-backdrop'] = 'false';
    }
    if ($scroll) {
        $offcanvas_data['data-bs-scroll'] = 'true';
    }
    
    $data_attrs = '';
    foreach ($offcanvas_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    $output = '';
    
    // Toggle button
    $output .= '<button class="btn ' . esc_attr($buttonVariant) . '" type="button" data-bs-toggle="offcanvas" data-bs-target="#' . esc_attr($offcanvasId) . '" aria-controls="' . esc_attr($offcanvasId) . '">';
    $output .= esc_html($buttonText);
    $output .= '</button>';
    
    // Offcanvas
    $output .= '<div class="' . esc_attr($offcanvas_class_string) . '" tabindex="-1" id="' . esc_attr($offcanvasId) . '" aria-labelledby="' . esc_attr($offcanvasId) . 'Label"' . $data_attrs . '>';
    
    // Offcanvas header
    $output .= '<div class="offcanvas-header">';
    $output .= '<h5 class="offcanvas-title" id="' . esc_attr($offcanvasId) . 'Label">' . esc_html($title) . '</h5>';
    $output .= '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="' . esc_attr__('Close', 'bootstrap-theme') . '"></button>';
    $output .= '</div>';
    
    // Offcanvas body
    $output .= '<div class="offcanvas-body">';
    $output .= '<div class="wp-block-bootstrap-theme-bs-offcanvas-content">';
    $output .= $content;
    $output .= '</div>';
    $output .= '</div>';
    
    $output .= '</div>'; // offcanvas
    
    return $output;
}

/**
 * Register Bootstrap Offcanvas Block
 */
function bootstrap_theme_register_bs_offcanvas_block() {
    register_block_type('bootstrap-theme/bs-offcanvas', array(
        'render_callback' => 'bootstrap_theme_render_bs_offcanvas_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Offcanvas'
            ),
            'placement' => array(
                'type' => 'string',
                'default' => 'start'
            ),
            'backdrop' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'scroll' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Toggle Offcanvas'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'offcanvasId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_offcanvas_block');
