<?php
/**
 * Bootstrap Video Block with Mask Support
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Video Block
 */
function bootstrap_theme_render_bs_video_block($attributes, $content, $block) {
    $video_url     = $attributes['videoUrl'] ?? '';
    $mask_url      = $attributes['maskUrl'] ?? '';
    $overlay_url   = $attributes['overlayUrl'] ?? '';
    $width         = $attributes['width'] ?? '100%';
    $height        = $attributes['height'] ?? 'auto';
    $autoplay      = $attributes['autoplay'] ?? true;
    $loop          = $attributes['loop'] ?? true;
    $muted         = $attributes['muted'] ?? true;
    $controls      = $attributes['controls'] ?? false;
    $preload       = $attributes['preload'] ?? 'metadata';
    $objectFit     = $attributes['objectFit'] ?? 'cover';

    if (empty($video_url)) {
        return '';
    }

    // Build video classes
    $classes = array('bs-video-wrapper','position-relative');
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    $class_string = implode(' ', array_unique($classes));

    // Build inline styles
    $container_styles = array(
        'width: ' . sanitize_text_field($width),
        'height: ' . sanitize_text_field($height),
    );
    $inline_styles = array();

    // Add mask styles if mask is provided
    if (!empty($mask_url)) {
        $inline_styles[] = '-webkit-mask-image: url(' . esc_url($mask_url) . ')';
        $inline_styles[] = 'mask-image: url(' . esc_url($mask_url) . ')';
    }

    $style_string = implode('; ', $inline_styles) . ';';

    // Build video element attributes
    $video_attrs = array(
        // 'style' => $style_string,
        'preload' => sanitize_text_field($preload),
    );

    if ($autoplay) {
        $video_attrs['autoplay'] = 'autoplay';
    }
    if ($loop) {
        $video_attrs['loop'] = 'loop';
    }
    if ($muted) {
        $video_attrs['muted'] = 'muted';
    }
    if ($controls) {
        $video_attrs['controls'] = 'controls';
    }

    // Build video tag attributes string
    $video_attrs_string = '';
    foreach ($video_attrs as $attr_name => $attr_value) {
        if ($attr_value === true || $attr_value === 'true') {
            $video_attrs_string .= ' ' . $attr_name;
        } else {
            $video_attrs_string .= ' ' . $attr_name . '="' . esc_attr($attr_value) . '"';
        }
    }

    // Output HTML using output buffering
    ob_start();
    ?>
    <div class="<?php echo esc_attr($class_string); ?>" style="<?php echo esc_attr(implode('; ', $container_styles)); ?>">
        <?php if (!empty($mask_url)) : ?>
            <div class="w-100 h-100 video-mask" style="<?php echo esc_attr($style_string); ?>overflow: hidden;">
        <?php endif; ?>

        <video<?php echo $video_attrs_string; ?> style="w-100 h-100 object-fit: <?php echo esc_attr($objectFit); ?>;">
            <source src="<?php echo esc_url($video_url); ?>" type="video/mp4">
            <source src="<?php echo esc_url(str_replace('.mp4', '.webm', $video_url)); ?>" type="video/webm">
            <?php echo __('Your browser does not support the video tag.', 'bootstrap-theme'); ?>
        </video>

        <?php if (!empty($mask_url)) : ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($overlay_url)) : ?>
            <img src="<?php echo esc_url($overlay_url); ?>" alt="" class="bs-video-overlay">
        <?php endif; ?>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Video Block
 */
register_block_type(
    'bootstrap-theme/bs-video',
    array(
        'render_callback' => 'bootstrap_theme_render_bs_video_block',
        'attributes'      => array(
            'videoUrl'   => array( 'type' => 'string', 'default' => '' ),
            'maskUrl'    => array( 'type' => 'string', 'default' => '' ),
            'overlayUrl' => array( 'type' => 'string', 'default' => '' ),
            'width'      => array( 'type' => 'string', 'default' => '100%' ),
            'height'     => array( 'type' => 'string', 'default' => 'auto' ),
            'autoplay'   => array( 'type' => 'boolean', 'default' => true ),
            'loop'       => array( 'type' => 'boolean', 'default' => true ),
            'muted'      => array( 'type' => 'boolean', 'default' => true ),
            'controls'   => array( 'type' => 'boolean', 'default' => false ),
            'objectFit'  => array( 'type' => 'string', 'default' => 'cover' ),
            'preload'    => array( 'type' => 'string', 'default' => 'metadata' ),
            'className'  => array( 'type' => 'string', 'default' => '' ),
        ),
    )
);
