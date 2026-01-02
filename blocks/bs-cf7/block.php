<?php

/**
 * Bootstrap CF7 Block
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render CF7 block with Bootstrap classes and animation data attributes.
 */
function bootstrap_theme_render_bs_cf7_block($attributes, $content, $block)
{
    $form_id = isset($attributes['formId']) ? absint($attributes['formId']) : 0;
    if (!$form_id) {
        return '';
    }

    $classes = ['bs-cf7', 'w-100'];
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    $class_attr = implode(' ', array_filter(array_unique($classes)));

    $anchor_attr = '';
    if (!empty($attributes['anchor'])) {
        $anchor_attr = ' id="' . esc_attr($attributes['anchor']) . '"';
    }

    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    $output  = '<div class="' . esc_attr($class_attr) . '"' . $anchor_attr . $animation_attrs . '>';
    $output .= do_shortcode('[contact-form-7 id="' . $form_id . '"]');
    $output .= '</div>';

    return $output;
}

/**
 * Register block type
 */
function bootstrap_theme_register_bs_cf7_block()
{
    register_block_type('bootstrap-theme/bs-cf7', array(
        'render_callback' => 'bootstrap_theme_render_bs_cf7_block',
        'attributes' => array(
            'formId' => array(
                'type' => 'number',
                'default' => 0,
            ),
            'anchor' => array(
                'type' => 'string',
                'default' => '',
            ),
            'className' => array(
                'type' => 'string',
                'default' => '',
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
add_action('init', 'bootstrap_theme_register_bs_cf7_block');
