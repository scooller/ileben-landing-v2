<?php

/**
 * Block: Interactive Masterplan Container
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_interactive_masterplan($attributes, $content, $block)
{
    $masterplanImage = isset($attributes['masterplanImage']) ? $attributes['masterplanImage'] : null;

    // Get animation data attributes
    $animation_attrs = function_exists('bootstrap_theme_get_animation_attributes') ? bootstrap_theme_get_animation_attributes($attributes, $block) : '';

    ob_start();
?>
    <div class="bs-interactive-masterplan-wrapper <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>" style="text-align: center;" <?php echo $animation_attrs; ?>>
        <?php if (empty($masterplanImage) || empty($masterplanImage['url'])): ?>
            <div class="alert alert-info text-center"><?php esc_html_e('Selecciona una imagen base para el masterplan.', 'ileben-landing'); ?></div>
        <?php else: ?>
            <div class="bs-masterplan-container position-relative overflow-hidden mx-auto" style="max-width: 100%; display: inline-block;">
                <img src="<?php echo esc_url($masterplanImage['url']); ?>" alt="<?php echo esc_attr($masterplanImage['alt'] ?? 'Masterplan'); ?>" class="img-fluid w-100">
                <?php echo $content; ?>
            </div>
        <?php endif; ?>
    </div>
<?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_interactive_masterplan()
{
    register_block_type('bootstrap-theme/bs-interactive-masterplan', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_interactive_masterplan',
        'attributes' => array(
            'masterplanImage' => array('type' => 'object', 'default' => null),
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
add_action('init', 'bootstrap_theme_register_bs_interactive_masterplan');
