<?php
/**
 * Block Helper Functions
 * 
 * Utility functions for Bootstrap blocks
 * 
 * @package ileben_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add custom CSS classes from block attributes
 * 
 * @param array $classes Base classes array
 * @param array $attributes Block attributes
 * @param WP_Block $block Block instance
 * @return array Modified classes array
 */
function bootstrap_theme_add_custom_classes($classes, $attributes, $block) {
    // Add className from attributes (Advanced panel custom classes)
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    
    // Add anchor/ID support
    if (!empty($attributes['anchor'])) {
        // Anchor is handled separately, not as a class
    }
    
    return $classes;
}

/**
 * Get animation data attributes from block settings
 * 
 * @param array $attributes Block attributes
 * @param WP_Block $block Block instance
 * @return string Data attributes for animations
 */
function bootstrap_theme_get_animation_attributes($attributes, $block) {
    $data_attrs = '';
    
    // Check for animation settings
    if (!empty($attributes['animation'])) {
        $animation = $attributes['animation'];
        $data_attrs .= ' data-animate="' . esc_attr($animation) . '"';
    }
    
    if (!empty($attributes['animationDelay'])) {
        $data_attrs .= ' data-animate-delay="' . esc_attr($attributes['animationDelay']) . '"';
    }
    
    if (!empty($attributes['animationDuration'])) {
        $data_attrs .= ' data-animate-duration="' . esc_attr($attributes['animationDuration']) . '"';
    }
    
    return $data_attrs;
}
