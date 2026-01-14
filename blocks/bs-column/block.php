<?php

/**
 * Bootstrap Column Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Column Block
 */
function bootstrap_theme_render_bs_column_block($attributes, $content, $block)
{
    // Align attribute names with editor.js (colXs, colSm, ...)
    $xs = $attributes['colXs'] ?? '';
    $sm = $attributes['colSm'] ?? '';
    $md = $attributes['colMd'] ?? '';
    $lg = $attributes['colLg'] ?? '';
    $xl = $attributes['colXl'] ?? '';
    $xxl = $attributes['colXxl'] ?? '';
    $offset = $attributes['offset'] ?? '';
    $order = $attributes['order'] ?? '';
    $order_mobile = $attributes['orderMobile'] ?? '';

    // Build column classes
    $classes = array();

    // Build bootstrap column sizes

    if (!empty($xs)) {
        $classes[] = 'col-' . $xs;
    } else {
        $classes[] = 'col-auto';
    }
    if (!empty($sm)) {
        $classes[] = 'col-sm-' . $sm;
    }
    if (!empty($md)) {
        $classes[] = 'col-md-' . $md;
    } else {
        $classes[] = 'col-md-auto';
    }
    if (!empty($lg)) {
        $classes[] = 'col-lg-' . $lg;
    }
    if (!empty($xl)) {
        $classes[] = 'col-xl-' . $xl;
    }
    if (!empty($xxl)) {
        $classes[] = 'col-xxl-' . $xxl;
    }

    if (!empty($offset)) {
        $classes[] = $offset;
    }

    // Mobile order (no breakpoint)
    if (!empty($order_mobile)) {
        $classes[] = $order_mobile;
    }

    // Desktop order: map order-* to order-md-*
    if (!empty($order)) {
        $classes[] = preg_replace('/^order-/', 'order-md-', $order);
    }

    // Compose final class string
    $class_string = implode(' ', array_unique($classes));

    // Add custom CSS classes from Advanced panel
    if (!empty($attributes['className'])) {
        $class_string .= ' ' . $attributes['className'];
    }

    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    // Build the output manually to ensure animation attributes are properly included
    $output = '<div class="' . esc_attr($class_string) . '"' . $animation_attrs . '>';

    // Add content from InnerBlocks
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<p>' . __('Add content to your column.', 'bootstrap-theme') . '</p>';
    }

    $output .= '</div>';

    return $output;
}

/**
 * Register Bootstrap Column Block
 */
function bootstrap_theme_register_bs_column_block()
{
    register_block_type('bootstrap-theme/bs-column', array(
        'render_callback' => 'bootstrap_theme_render_bs_column_block',
        'attributes' => array(
            'colXs' => array(
                'type' => 'string',
                'default' => ''
            ),
            'colSm' => array(
                'type' => 'string',
                'default' => ''
            ),
            'colMd' => array(
                'type' => 'string',
                'default' => ''
            ),
            'colLg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'colXl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'colXxl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'offset' => array(
                'type' => 'string',
                'default' => ''
            ),
            'order' => array(
                'type' => 'string',
                'default' => ''
            ),
            'orderMobile' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            ),
            // Animation attributes
            'animationType' => array(
                'type' => 'string'
            ),
            'animationTrigger' => array(
                'type' => 'string'
            ),
            'animationDuration' => array(
                'type' => 'number'
            ),
            'animationDelay' => array(
                'type' => 'number'
            ),
            'animationEase' => array(
                'type' => 'string'
            ),
            'animationRepeat' => array(
                'type' => 'number'
            ),
            'animationRepeatDelay' => array(
                'type' => 'number'
            ),
            'animationYoyo' => array(
                'type' => 'boolean'
            ),
            'animationDistance' => array(
                'type' => 'string'
            ),
            'animationRotation' => array(
                'type' => 'number'
            ),
            'animationScale' => array(
                'type' => 'string'
            ),
            'animationParallaxSpeed' => array(
                'type' => 'number'
            ),
            'animationHoverEffect' => array(
                'type' => 'string'
            ),
            'animationMobileEnabled' => array(
                'type' => 'boolean'
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_column_block');
