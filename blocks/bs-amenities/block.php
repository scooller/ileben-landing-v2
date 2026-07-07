<?php
/**
 * Block: Amenities Container (Grid)
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_amenities($attributes, $content, $block)
{
    $title = isset($attributes['title']) ? $attributes['title'] : '';
    $colsMobile = isset($attributes['colsMobile']) ? $attributes['colsMobile'] : '2';
    $colsTablet = isset($attributes['colsTablet']) ? $attributes['colsTablet'] : '3';
    $colsDesktop = isset($attributes['colsDesktop']) ? $attributes['colsDesktop'] : '4';
    
    // Get animation data attributes
    $animation_attrs = function_exists('bootstrap_theme_get_animation_attributes') ? bootstrap_theme_get_animation_attributes($attributes, $block) : '';
    
    ob_start();
    ?>
    <div class="bs-amenities-wrapper <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>" <?php echo $animation_attrs; ?>>
        <?php if (!empty($title)): ?>
            <h3 class="bs-amenities-title mb-4"><?php echo esc_html($title); ?></h3>
        <?php endif; ?>

        <div class="row row-cols-<?php echo esc_attr($colsMobile); ?> row-cols-md-<?php echo esc_attr($colsTablet); ?> row-cols-lg-<?php echo esc_attr($colsDesktop); ?> g-4">
            <?php echo $content; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_amenities()
{
    register_block_type('bootstrap-theme/bs-amenities', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_amenities',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => ''),
            'colsMobile' => array('type' => 'string', 'default' => '2'),
            'colsTablet' => array('type' => 'string', 'default' => '3'),
            'colsDesktop' => array('type' => 'string', 'default' => '4'),
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
add_action('init', 'bootstrap_theme_register_bs_amenities');
