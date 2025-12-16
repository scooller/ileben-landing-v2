<?php
/**
 * Bootstrap Navbar Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Navbar Block
 */
function bootstrap_theme_render_bs_navbar_block($attributes, $content, $block) {
    $brand = $attributes['brand'] ?? '';
    $brandImage = $attributes['brandImage'] ?? '';
    $expand = $attributes['expand'] ?? 'lg';
    $theme = $attributes['theme'] ?? 'light';
    $background = $attributes['background'] ?? 'light';
    $fixed = $attributes['fixed'] ?? '';
    $navbarId = $attributes['navbarId'] ?? 'navbar-' . uniqid();
    
    // Build navbar classes
    $classes = array('navbar');
    
    if (!empty($expand)) {
        $classes[] = 'navbar-expand-' . $expand;
    }
    
    $classes[] = 'navbar-' . $theme;
    $classes[] = 'bg-' . $background;
    
    if (!empty($fixed)) {
        $classes[] = 'fixed-' . $fixed;
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $output = '<nav class="' . esc_attr($class_string) . '">';
    $output .= '<div class="container-fluid">';
    
    // Brand
    if (!empty($brand) || !empty($brandImage)) {
        $output .= '<a class="navbar-brand" href="#">';
        if (!empty($brandImage)) {
            $output .= '<img src="' . esc_url($brandImage) . '" alt="' . esc_attr($brand) . '" width="30" height="24" class="d-inline-block align-text-top">';
            if (!empty($brand)) {
                $output .= ' ' . esc_html($brand);
            }
        } else {
            $output .= esc_html($brand);
        }
        $output .= '</a>';
    }
    
    // Toggler button
    $output .= '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#' . esc_attr($navbarId) . '" aria-controls="' . esc_attr($navbarId) . '" aria-expanded="false" aria-label="' . esc_attr__('Toggle navigation', 'bootstrap-theme') . '">';
    $output .= '<span class="navbar-toggler-icon"></span>';
    $output .= '</button>';
    
    // Collapsible content
    $output .= '<div class="collapse navbar-collapse" id="' . esc_attr($navbarId) . '">';
    $output .= '<div class="wp-block-bootstrap-theme-bs-navbar-content">';
    $output .= $content;
    $output .= '</div>';
    $output .= '</div>';
    
    $output .= '</div>';
    $output .= '</nav>';
    
    return $output;
}

/**
 * Register Bootstrap Navbar Block
 */
function bootstrap_theme_register_bs_navbar_block() {
    register_block_type('bootstrap-theme/bs-navbar', array(
        'render_callback' => 'bootstrap_theme_render_bs_navbar_block',
        'attributes' => array(
            'brand' => array(
                'type' => 'string',
                'default' => ''
            ),
            'brandImage' => array(
                'type' => 'string',
                'default' => ''
            ),
            'expand' => array(
                'type' => 'string',
                'default' => 'lg'
            ),
            'theme' => array(
                'type' => 'string',
                'default' => 'light'
            ),
            'background' => array(
                'type' => 'string',
                'default' => 'light'
            ),
            'fixed' => array(
                'type' => 'string',
                'default' => ''
            ),
            'navbarId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_navbar_block');
