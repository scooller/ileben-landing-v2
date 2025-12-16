<?php
/**
 * Bootstrap Collapse Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Collapse Block
 */
function bootstrap_theme_render_bs_collapse_block($attributes, $content, $block) {
    $collapseId = $attributes['collapseId'] ?? 'collapse-' . uniqid();
    $buttonText = $attributes['buttonText'] ?? __('Toggle Collapse', 'bootstrap-theme');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-primary';
    $horizontal = $attributes['horizontal'] ?? false;
    $show = $attributes['show'] ?? false;
    
    // Build collapse classes
    $collapse_classes = array('collapse');
    
    if ($horizontal) {
        $collapse_classes[] = 'collapse-horizontal';
    }
    
    if ($show) {
        $collapse_classes[] = 'show';
    }
    
    // Add custom CSS classes from Advanced panel
    $collapse_classes = bootstrap_theme_add_custom_classes($collapse_classes, $attributes, $block);
    
    $collapse_class_string = implode(' ', array_unique($collapse_classes));
    
    $output = '';
    
    // Toggle button
    $output .= '<button class="btn ' . esc_attr($buttonVariant) . '" type="button" data-bs-toggle="collapse" data-bs-target="#' . esc_attr($collapseId) . '" aria-expanded="' . ($show ? 'true' : 'false') . '" aria-controls="' . esc_attr($collapseId) . '">';
    $output .= esc_html($buttonText);
    $output .= '</button>';
    
    // Collapsible content
    $output .= '<div class="' . esc_attr($collapse_class_string) . '" id="' . esc_attr($collapseId) . '">';
    $output .= '<div class="card card-body">';
    $output .= '<div class="wp-block-bootstrap-theme-bs-collapse-content">';
    $output .= $content;
    $output .= '</div>';
    $output .= '</div>';
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Collapse Block
 */
function bootstrap_theme_register_bs_collapse_block() {
    register_block_type('bootstrap-theme/bs-collapse', array(
        'render_callback' => 'bootstrap_theme_render_bs_collapse_block',
        'attributes' => array(
            'collapseId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Toggle Collapse'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'horizontal' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'show' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_collapse_block');
