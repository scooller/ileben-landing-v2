<?php
/**
 * Bootstrap Image Block (Desktop & Mobile)
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Image Block
 */
function bootstrap_theme_render_bs_image_block($attributes, $content, $block) {
    $image_desktop = $attributes['imageDesktop'] ?? null;
    $image_mobile  = $attributes['imageMobile'] ?? null;

    $desktop_url = is_array($image_desktop) ? ($image_desktop['url'] ?? '') : (is_string($image_desktop) ? $image_desktop : '');
    $mobile_url  = is_array($image_mobile) ? ($image_mobile['url'] ?? '') : (is_string($image_mobile) ? $image_mobile : '');

    // Fallbacks
    if (empty($desktop_url) && empty($mobile_url)) {
        return '';
    }
    if (empty($desktop_url) && !empty($mobile_url)) {
        $desktop_url = $mobile_url;
    }

    $alt = $attributes['alt'] ?? '';
    if (empty($alt)) {
        if (is_array($image_desktop) && !empty($image_desktop['alt'])) {
            $alt = $image_desktop['alt'];
        } elseif (is_array($image_mobile) && !empty($image_mobile['alt'])) {
            $alt = $image_mobile['alt'];
        }
    }

    $breakpoint = !empty($attributes['breakpoint']) ? $attributes['breakpoint'] : '767.98px';
    $align      = $attributes['align'] ?? 'center';
    $fluid      = !isset($attributes['fluid']) || $attributes['fluid'] === true;
    $rounded    = $attributes['rounded'] ?? '';
    $shadow     = $attributes['shadow'] ?? '';
    $image_class= $attributes['imageClass'] ?? '';
    $link       = $attributes['link'] ?? '';
    $target     = $attributes['target'] ?? '_self';
    $loading    = $attributes['loading'] ?? 'lazy';
    $caption    = $attributes['caption'] ?? '';

    // Animation attributes
    $animation_attrs = function_exists('bootstrap_theme_get_animation_attributes') 
        ? bootstrap_theme_get_animation_attributes($attributes, $block) 
        : '';

    // Wrapper classes
    $wrapper_classes = ['wp-block-bootstrap-theme-bs-image'];
    if ($align === 'center') {
        $wrapper_classes[] = 'text-center';
    } elseif ($align === 'start' || $align === 'left') {
        $wrapper_classes[] = 'text-start';
    } elseif ($align === 'end' || $align === 'right') {
        $wrapper_classes[] = 'text-end';
    }

    if (!empty($attributes['className'])) {
        $wrapper_classes[] = $attributes['className'];
    }

    // Image classes
    $img_classes = [];
    if ($fluid) {
        $img_classes[] = 'img-fluid';
    }
    if (!empty($rounded)) {
        $img_classes[] = $rounded;
    }
    if (!empty($shadow)) {
        $img_classes[] = $shadow;
    }
    if (!empty($image_class)) {
        $img_classes[] = $image_class;
    }

    $img_class_str = implode(' ', array_filter($img_classes));
    $wrapper_class_str = implode(' ', array_filter($wrapper_classes));

    ob_start();
    ?>
    <figure class="<?php echo esc_attr($wrapper_class_str); ?>"<?php echo $animation_attrs; ?>>
        <?php if (!empty($link)): ?>
            <a href="<?php echo esc_url($link); ?>" target="<?php echo esc_attr($target); ?>"<?php echo $target === '_blank' ? ' rel="noopener noreferrer"' : ''; ?>>
        <?php endif; ?>
        <picture>
            <?php if (!empty($mobile_url) && $mobile_url !== $desktop_url): ?>
                <source media="(max-width: <?php echo esc_attr($breakpoint); ?>)" srcset="<?php echo esc_url($mobile_url); ?>">
            <?php endif; ?>
            <img src="<?php echo esc_url($desktop_url); ?>" alt="<?php echo esc_attr($alt); ?>" class="<?php echo esc_attr($img_class_str); ?>" loading="<?php echo esc_attr($loading); ?>" />
        </picture>
        <?php if (!empty($link)): ?>
            </a>
        <?php endif; ?>
        <?php if (!empty($caption)): ?>
            <figcaption class="figure-caption mt-2 text-muted"><?php echo esc_html($caption); ?></figcaption>
        <?php endif; ?>
    </figure>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Image Block
 */
function bootstrap_theme_register_bs_image_block() {
    register_block_type('bootstrap-theme/bs-image', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_image_block',
        'attributes' => array(
            'imageDesktop' => array('type' => 'object', 'default' => null),
            'imageMobile'  => array('type' => 'object', 'default' => null),
            'breakpoint'   => array('type' => 'string', 'default' => '767.98px'),
            'alt'          => array('type' => 'string', 'default' => ''),
            'caption'      => array('type' => 'string', 'default' => ''),
            'align'        => array('type' => 'string', 'default' => 'center'),
            'fluid'        => array('type' => 'boolean', 'default' => true),
            'rounded'      => array('type' => 'string', 'default' => ''),
            'shadow'       => array('type' => 'string', 'default' => ''),
            'imageClass'   => array('type' => 'string', 'default' => ''),
            'link'         => array('type' => 'string', 'default' => ''),
            'target'       => array('type' => 'string', 'default' => '_self'),
            'loading'      => array('type' => 'string', 'default' => 'lazy'),
            'className'    => array('type' => 'string', 'default' => ''),
            // Animation attributes
            'animationType'          => array('type' => 'string'),
            'animationTrigger'       => array('type' => 'string'),
            'animationDuration'      => array('type' => 'number'),
            'animationDelay'         => array('type' => 'number'),
            'animationEase'          => array('type' => 'string'),
            'animationRepeat'        => array('type' => 'number'),
            'animationRepeatDelay'   => array('type' => 'number'),
            'animationYoyo'          => array('type' => 'boolean'),
            'animationDistance'      => array('type' => 'string'),
            'animationRotation'      => array('type' => 'number'),
            'animationScale'         => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect'   => array('type' => 'string'),
            'animationScrollStart'   => array('type' => 'string', 'default' => 'top 70%'),
            'animationScrollEnd'     => array('type' => 'string', 'default' => 'top 10%'),
            'animationScrollMarkers' => array('type' => 'boolean', 'default' => false),
            'animationMobileEnabled' => array('type' => 'boolean'),
        )
    ));
}

add_action('init', 'bootstrap_theme_register_bs_image_block');
