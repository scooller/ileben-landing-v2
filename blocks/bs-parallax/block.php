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
    $to_bool = function ($value, $default) {
        if (!isset($value)) return $default;
        if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
        if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
        return $default;
    };

    $enable_parallax = $to_bool($attributes['enableParallax'] ?? null, true);
    $parallax_content = $to_bool($attributes['parallaxContent'] ?? null, false);
    $show_markers = $to_bool($attributes['showMarkers'] ?? null, false);
    $parallax_speed = $attributes['parallaxSpeed'] ?? 0.5;
    $parallax_start = $attributes['parallaxStart'] ?? 'top bottom';
    $parallax_end = $attributes['parallaxEnd'] ?? 'bottom top';
    $bg_image_url = $attributes['bgImageUrl'] ?? '';
    $bg_video_url = $attributes['bgVideoUrl'] ?? '';
    $overlay_color = $attributes['overlayColor'] ?? '';
    $overlay_opacity = isset($attributes['overlayOpacity']) ? floatval($attributes['overlayOpacity']) : 0;
    $min_height = $attributes['height'] ?? 25;
    $enable_blur = $to_bool($attributes['enableBlur'] ?? null, true);
    $bg_size = $attributes['bgSize'] ?? 'cover';
    $bg_position = $attributes['bgPosition'] ?? 'center center';

    // Build parallax data attributes
    $parallax_attrs = '';
    if ($enable_parallax) {
        $parallax_attrs = ' data-parallax="true" data-parallax-speed="' . esc_attr($parallax_speed) . '" data-parallax-start="' . esc_attr($parallax_start) . '" data-parallax-end="' . esc_attr($parallax_end) . '"';
        if ($show_markers) {
            $parallax_attrs .= ' data-parallax-markers="true"';
        }
    }
    $parallax_attrs .= $enable_blur ? ' data-parallax-blur="true"' : ' data-parallax-blur="false"';

    // Get custom classes
    $classes = array('bs-parallax-container');
    if ($bg_image_url || $bg_video_url) {
        $classes[] = 'has-background';
    }
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }

    // Build inline height style
    $container_style = 'height:' . esc_attr($min_height) . 'dvh;';

    // Background image inline style
    $bg_image_style = 'background-image:url(\'' . esc_url($bg_image_url) . '\');background-size:' . esc_attr($bg_size) . ';background-position:' . esc_attr($bg_position) . ';background-repeat:no-repeat;';

    ob_start();
?>
    <div class="<?php echo esc_attr(implode(' ', $classes)); ?>" style="<?php echo esc_attr($container_style); ?>" <?php echo $parallax_attrs; ?>>
        <?php if ($bg_image_url || $bg_video_url) : ?>
            <div class="bs-parallax-bg" <?php echo $enable_parallax ? ' data-parallax-bg="true"' : ''; ?>>
                <?php if ($bg_video_url) : ?>
                    <video class="bs-parallax-video" autoplay muted loop playsinline preload="metadata">
                        <source src="<?php echo esc_url($bg_video_url); ?>" type="video/mp4">
                    </video>
                <?php elseif ($bg_image_url) : ?>
                    <div class="bs-parallax-image<?php echo $enable_blur ? ' has-blur' : ''; ?>" style="<?php echo esc_attr($bg_image_style); ?>"></div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <?php if ($overlay_color && $overlay_opacity > 0) : ?>
            <div class="bs-parallax-overlay" style="background-color:<?php echo esc_attr($overlay_color); ?>;opacity:<?php echo esc_attr($overlay_opacity / 100); ?>;"></div>
        <?php endif; ?>
        <div class="bs-parallax-content d-flex justify-content-center align-items-center w-100 h-100" <?php echo $enable_parallax ? ' data-parallax-content="true"' : ''; ?> <?php echo $parallax_content ? ' data-parallax-content-move="true"' : ''; ?>>
            <?php echo $content; ?>
        </div>
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
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_parallax_block',
        'attributes' => array(
            'enableParallax' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'parallaxContent' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'parallaxSpeed' => array(
                'type' => 'number',
                'default' => 0.5
            ),
            'parallaxStart' => array(
                'type' => 'string',
                'default' => 'top bottom'
            ),
            'parallaxEnd' => array(
                'type' => 'string',
                'default' => 'bottom top'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgImageId' => array(
                'type' => 'number',
                'default' => 0
            ),
            'bgImageUrl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgVideoUrl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'overlayColor' => array(
                'type' => 'string',
                'default' => '#000000'
            ),
            'overlayOpacity' => array(
                'type' => 'number',
                'default' => 50
            ),
            'height' => array(
                'type' => 'number',
                'default' => 25
            ),
            'showMarkers' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'enableBlur' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'bgSize' => array(
                'type' => 'string',
                'default' => 'cover'
            ),
            'bgPosition' => array(
                'type' => 'string',
                'default' => 'center center'
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_parallax_block');
