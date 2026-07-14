<?php

/**
 * Counter Card Block
 *
 * Card with an animated number that counts from 0 to target on scroll.
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Counter Card Block
 */
function bootstrap_theme_render_bs_counter_card_block($attributes, $content, $block)
{
    $target       = isset($attributes['target']) ? (float) $attributes['target'] : 100;
    $prefix       = $attributes['prefix'] ?? '';
    $suffix       = $attributes['suffix'] ?? '';
    $title        = $attributes['title'] ?? '';
    $subtitle     = $attributes['subtitle'] ?? '';
    $variant      = $attributes['variant'] ?? 'primary';
    $text_variant = $attributes['textVariant'] ?? '';
    $duration     = isset($attributes['duration']) ? (float) $attributes['duration'] : 2;
    $ease         = $attributes['ease'] ?? 'power2.out';

    // Animation data attributes for GSAP countup on scroll
    $anim_attrs = sprintf(
        ' data-animate-type="countup" data-animate-trigger="on-scroll" data-animate-count-to="%s" data-animate-duration="%s" data-animate-ease="%s" data-animate-scroll-start="top 80%%"',
        esc_attr($target),
        esc_attr($duration),
        esc_attr($ease)
    );

    $color_mode = $attributes['colorMode'] ?? 'text-bg';

    $classes = array('bs-counter-card', 'card', 'h-100', 'text-center');

    // Keep border-0 only when the card is filled (text-bg mode)
    if ($color_mode === 'text-bg') {
        $classes[] = 'border-0';
    }

    if (!empty($variant) && $variant !== 'none') {
        if ($color_mode === 'text-bg') {
            $classes[] = 'text-bg-' . $variant;
        } elseif ($color_mode === 'border') {
            $classes[] = 'border-' . $variant;
        } elseif ($color_mode === 'border-text') {
            $classes[] = 'border-' . $variant;
            $classes[] = 'text-' . $variant;
        }
    }

    if (!empty($text_variant)) {
        $classes[] = 'text-' . $text_variant;
    }

    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    $class_string = implode(' ', array_unique($classes));

    // Number size class
    $number_size = $attributes['numberSize'] ?? 'display-4';

    ob_start();
?>
    <div class="<?php echo esc_attr($class_string); ?>">
        <div class="card-body p-4 d-flex flex-column justify-content-center align-items-center">
            <?php if (!empty($prefix) || !empty($suffix)): ?>
                <div class="bs-counter-card-number <?php echo esc_attr($number_size); ?> fw-bold mb-0 d-flex align-items-baseline">
                    <?php if ($prefix): ?><span class="bs-counter-prefix me-1"><?php echo esc_html($prefix); ?></span><?php endif; ?>
                    <span class="bs-counter-value" <?php echo $anim_attrs; ?>>0</span>
                    <?php if ($suffix): ?><span class="bs-counter-suffix ms-1"><?php echo esc_html($suffix); ?></span><?php endif; ?>
                </div>
            <?php else: ?>
                <div class="bs-counter-card-number <?php echo esc_attr($number_size); ?> fw-bold mb-0">
                    <span class="bs-counter-value" <?php echo $anim_attrs; ?>>0</span>
                </div>
            <?php endif; ?>

            <?php if ($title): ?>
                <h3 class="bs-counter-card-title h5 mt-3 mb-1"><?php echo esc_html($title); ?></h3>
            <?php endif; ?>
            <?php if ($subtitle): ?>
                <p class="bs-counter-card-subtitle opacity-75 mb-0"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Register Counter Card Block
 */
function bootstrap_theme_register_bs_counter_card_block()
{
    register_block_type('bootstrap-theme/bs-counter-card', array(
        'api_version'     => 3,
        'render_callback' => 'bootstrap_theme_render_bs_counter_card_block',
        'attributes'      => array(
            'target' => array(
                'type'    => 'number',
                'default' => 100,
            ),
            'prefix' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'suffix' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'title' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'subtitle' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'variant' => array(
                'type'    => 'string',
                'default' => 'primary',
            ),
            'colorMode' => array(
                'type'    => 'string',
                'default' => 'text-bg',
            ),
            'textVariant' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'numberSize' => array(
                'type'    => 'string',
                'default' => 'display-4',
            ),
            'duration' => array(
                'type'    => 'number',
                'default' => 2,
            ),
            'ease' => array(
                'type'    => 'string',
                'default' => 'power2.out',
            ),
            'className' => array(
                'type'    => 'string',
                'default' => '',
            ),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_counter_card_block');
