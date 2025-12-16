<?php
/**
 * Bootstrap Toast Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Toast Block
 */
function bootstrap_theme_render_bs_toast_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? __('Toast', 'bootstrap-theme');
    $subtitle = $attributes['subtitle'] ?? '';
    $autohide = $attributes['autohide'] ?? true;
    $delay = $attributes['delay'] ?? 5000;
    $position = $attributes['position'] ?? 'top-end';
    $toastId = $attributes['toastId'] ?? 'toast-' . uniqid();
    
    // Build toast container classes
    $container_classes = array('toast-container', 'position-fixed');
    
    switch ($position) {
        case 'top-start':
            $container_classes[] = 'top-0 start-0';
            break;
        case 'top-center':
            $container_classes[] = 'top-0 start-50 translate-middle-x';
            break;
        case 'top-end':
            $container_classes[] = 'top-0 end-0';
            break;
        case 'middle-start':
            $container_classes[] = 'top-50 start-0 translate-middle-y';
            break;
        case 'middle-center':
            $container_classes[] = 'top-50 start-50 translate-middle';
            break;
        case 'middle-end':
            $container_classes[] = 'top-50 end-0 translate-middle-y';
            break;
        case 'bottom-start':
            $container_classes[] = 'bottom-0 start-0';
            break;
        case 'bottom-center':
            $container_classes[] = 'bottom-0 start-50 translate-middle-x';
            break;
        case 'bottom-end':
            $container_classes[] = 'bottom-0 end-0';
            break;
    }
    
    // Add custom CSS classes from Advanced panel
    $container_classes = bootstrap_theme_add_custom_classes($container_classes, $attributes, $block);
    
    $container_class_string = implode(' ', array_unique($container_classes));
    
    $output = '<div class="' . esc_attr($container_class_string) . '" style="z-index: 1055;">';
    
    $toast_data = array();
    if ($autohide) {
        $toast_data['data-bs-autohide'] = 'true';
        $toast_data['data-bs-delay'] = $delay;
    } else {
        $toast_data['data-bs-autohide'] = 'false';
    }
    
    $data_attrs = '';
    foreach ($toast_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    $output .= '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="' . esc_attr($toastId) . '"' . $data_attrs . '>';
    
    // Toast header
    $output .= '<div class="toast-header">';
    $output .= '<strong class="me-auto">' . esc_html($title) . '</strong>';
    
    if (!empty($subtitle)) {
        $output .= '<small class="text-muted">' . esc_html($subtitle) . '</small>';
    }
    
    $output .= '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="' . esc_attr__('Close', 'bootstrap-theme') . '"></button>';
    $output .= '</div>';
    
    // Toast body
    $output .= '<div class="toast-body">';
    $output .= '<div class="wp-block-bootstrap-theme-bs-toast-content">';
    $output .= $content;
    $output .= '</div>';
    $output .= '</div>';
    
    $output .= '</div>'; // toast
    $output .= '</div>'; // toast-container
    
    return $output;
}

/**
 * Register Bootstrap Toast Block
 */
function bootstrap_theme_register_bs_toast_block() {
    register_block_type('bootstrap-theme/bs-toast', array(
        'render_callback' => 'bootstrap_theme_render_bs_toast_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Toast'
            ),
            'subtitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'autohide' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'delay' => array(
                'type' => 'integer',
                'default' => 5000
            ),
            'position' => array(
                'type' => 'string',
                'default' => 'top-end'
            ),
            'toastId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_toast_block');
