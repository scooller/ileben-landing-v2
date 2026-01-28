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
function bootstrap_theme_add_custom_classes($classes, $attributes, $block)
{
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
function bootstrap_theme_get_animation_attributes($attributes, $block)
{
    $data_attrs = '';

    // Only add animation attributes if animationType is explicitly set and not empty
    if (!isset($attributes['animationType']) || $attributes['animationType'] === '' || $attributes['animationType'] === null) {
        return $data_attrs;
    }

    // Core animation settings
    $data_attrs .= ' data-animate-type="' . esc_attr($attributes['animationType']) . '"';

    // Trigger - use default if not set
    $trigger = isset($attributes['animationTrigger']) && $attributes['animationTrigger'] !== '' && $attributes['animationTrigger'] !== null
        ? $attributes['animationTrigger']
        : 'on-scroll'; // Default to on-scroll
    $data_attrs .= ' data-animate-trigger="' . esc_attr($trigger) . '"';

    // Timing settings - use defaults if not set
    $duration = isset($attributes['animationDuration']) && $attributes['animationDuration'] !== '' && $attributes['animationDuration'] !== null
        ? $attributes['animationDuration']
        : 0.6;
    $data_attrs .= ' data-animate-duration="' . esc_attr($duration) . '"';

    $delay = isset($attributes['animationDelay']) && $attributes['animationDelay'] !== '' && $attributes['animationDelay'] !== null
        ? $attributes['animationDelay']
        : 0;
    $data_attrs .= ' data-animate-delay="' . esc_attr($delay) . '"';

    // Easing - use default if not set
    $ease = isset($attributes['animationEase']) && $attributes['animationEase'] !== '' && $attributes['animationEase'] !== null
        ? $attributes['animationEase']
        : 'linear';
    $data_attrs .= ' data-animate-ease="' . esc_attr($ease) . '"';

    // Repeat settings
    if (isset($attributes['animationRepeat']) && $attributes['animationRepeat'] !== '' && $attributes['animationRepeat'] !== null) {
        $data_attrs .= ' data-animate-repeat="' . esc_attr($attributes['animationRepeat']) . '"';
    }

    if (isset($attributes['animationRepeatDelay']) && $attributes['animationRepeatDelay'] !== '' && $attributes['animationRepeatDelay'] !== null) {
        $data_attrs .= ' data-animate-repeat-delay="' . esc_attr($attributes['animationRepeatDelay']) . '"';
    }

    if (isset($attributes['animationYoyo']) && $attributes['animationYoyo'] === true) {
        $data_attrs .= ' data-animate-yoyo="true"';
    }

    // Specific animation parameters
    if (isset($attributes['animationDistance']) && $attributes['animationDistance'] !== '' && $attributes['animationDistance'] !== null) {
        $data_attrs .= ' data-animate-distance="' . esc_attr($attributes['animationDistance']) . '"';
    }

    if (isset($attributes['animationRotation']) && $attributes['animationRotation'] !== '' && $attributes['animationRotation'] !== null) {
        $data_attrs .= ' data-animate-rotation="' . esc_attr($attributes['animationRotation']) . '"';
    }

    if (isset($attributes['animationScale']) && $attributes['animationScale'] !== '' && $attributes['animationScale'] !== null) {
        $data_attrs .= ' data-animate-scale="' . esc_attr($attributes['animationScale']) . '"';
    }

    if (isset($attributes['animationStaggerDelay']) && $attributes['animationStaggerDelay'] !== '' && $attributes['animationStaggerDelay'] !== null) {
        $data_attrs .= ' data-animate-stagger-delay="' . esc_attr($attributes['animationStaggerDelay']) . '"';
    }

    // Hover settings
    if (isset($attributes['animationHoverEffect']) && $attributes['animationHoverEffect'] !== '' && $attributes['animationHoverEffect'] !== null) {
        $data_attrs .= ' data-animate-hover-effect="' . esc_attr($attributes['animationHoverEffect']) . '"';
    }

    // CountUp settings
    if (isset($attributes['animationCountTo']) && $attributes['animationCountTo'] !== '' && $attributes['animationCountTo'] !== null) {
        $data_attrs .= ' data-animate-count-to="' . esc_attr($attributes['animationCountTo']) . '"';
    }

    if (isset($attributes['animationCountIncrement']) && $attributes['animationCountIncrement'] !== '' && $attributes['animationCountIncrement'] !== null) {
        $data_attrs .= ' data-animate-count-increment="' . esc_attr($attributes['animationCountIncrement']) . '"';
    }

    // Mobile settings
    if (isset($attributes['animationMobileEnabled']) && $attributes['animationMobileEnabled'] !== null) {
        $data_attrs .= ' data-animate-mobile="' . ($attributes['animationMobileEnabled'] ? '1' : '0') . '"';
    }

    return $data_attrs;
}
