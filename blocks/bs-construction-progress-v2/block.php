<?php

/**
 * Block: Avance de Obra v2
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_construction_progress_v2($attributes, $content, $block)
{
    $cols = isset($attributes['cols']) ? $attributes['cols'] : '4';

    // Get animation data attributes
    $animation_attrs = function_exists('bootstrap_theme_get_animation_attributes') ? bootstrap_theme_get_animation_attributes($attributes, $block) : '';

    ob_start();
?>
    <div class="bs-construction-wrapper <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>" <?php echo $animation_attrs; ?>>
        <div class="row row-cols-1 row-cols-md-<?php echo esc_attr($cols); ?> g-4 bs-construction-stages justify-content-center">
            <?php echo $content; ?>
        </div>
    </div>
<?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_construction_progress_v2()
{
    register_block_type('bootstrap-theme/bs-construction-progress-v2', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_construction_progress_v2',
        'attributes' => array(
            'cols' => array('type' => 'string', 'default' => '4'),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_construction_progress_v2');
