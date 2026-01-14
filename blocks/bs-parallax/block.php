<?php

/**
 * Bootstrap Parallax Container Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Parallax Container Block
 */
function bootstrap_theme_render_bs_parallax_block($attributes, $content, $block)
{
    // Helper para convertir atributos booleanos correctamente
    $to_bool = function($value, $default) {
        if (!isset($value)) return $default;
        if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
        if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
        return $default;
    };

    $enable_parallax = $to_bool($attributes['enableParallax'] ?? null, true);
    $parallax_speed = $attributes['parallaxSpeed'] ?? 0.5;
    $parallax_multiplier = $attributes['parallaxMultiplier'] ?? 120;

    // Build parallax data attributes
    $parallax_attrs = '';
    if ($enable_parallax) {
        $parallax_attrs = ' data-parallax="true" data-parallax-speed="' . esc_attr($parallax_speed) . '" data-parallax-multiplier="' . esc_attr($parallax_multiplier) . '"';
    }

    // Get custom classes
    $classes = array('bs-parallax-container');
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr(implode(' ', $classes)); ?>"<?php echo $parallax_attrs; ?>>
        <?php echo $content; ?>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Parallax Container Block
 */
function bootstrap_theme_register_bs_parallax_block()
{
    register_block_type('bootstrap-theme/bs-parallax', array(
        'render_callback' => 'bootstrap_theme_render_bs_parallax_block',
        'attributes' => array(
            'enableParallax' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'parallaxSpeed' => array(
                'type' => 'number',
                'default' => 0.5
            ),
            'parallaxMultiplier' => array(
                'type' => 'number',
                'default' => 120
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_parallax_block');
