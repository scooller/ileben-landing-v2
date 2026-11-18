<?php

/**
 * Bootstrap Carousel Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Carousel Block
 */
function bootstrap_theme_render_bs_carousel_block($attributes, $content, $block)
{
    $carouselId = $attributes['carouselId'] ?? 'carousel-' . uniqid();

    // Helper para convertir atributos booleanos correctamente
    $to_bool = function ($value, $default) {
        if (!isset($value)) return $default;
        if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
        if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
        return $default;
    };

    $controls = $to_bool($attributes['controls'] ?? null, true);
    $indicators = $to_bool($attributes['indicators'] ?? null, true);
    $ride = $attributes['ride'] ?? 'carousel';
    $interval = $attributes['interval'] ?? '5000';
    $wrap = $to_bool($attributes['wrap'] ?? null, true);
    $fade = $to_bool($attributes['fade'] ?? null, false);
    $touch = $to_bool($attributes['touch'] ?? null, true);
    $items = isset($attributes['items']) ? max(1, min(4, intval($attributes['items']))) : 1;
    $fancybox = $to_bool($attributes['fancybox'] ?? null, false);

    // Build carousel classes
    $classes = array('carousel', 'slide');

    if ($fade && $items === 1) {
        $classes[] = 'carousel-fade';
    }

    if ($items > 1) {
        $classes[] = 'carousel-multiple';
        $classes[] = 'carousel-items-' . $items;
        $classes[] = 'swiper';
        $classes[] = 'js-swiper';
    }

    if ($fancybox) {
        $classes[] = 'has-fancybox';
    }

    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);

    $class_string = implode(' ', array_unique($classes));

    $carousel_data = array();

    if ($items > 1) {
        // Swiper configuration for multi-item slider (reusing plantas-slider pattern)
        $carousel_data['data-slider-id'] = $carouselId;
        $carousel_data['data-swiper-slides'] = (string)$items;
        $carousel_data['data-swiper-slides-mobile'] = '1';
        $carousel_data['data-swiper-slides-desktop'] = (string)$items;
        $carousel_data['data-swiper-loop'] = $wrap ? 'true' : 'false';
        $carousel_data['data-swiper-navigation'] = $controls ? 'true' : 'false';
        $carousel_data['data-swiper-pagination'] = $indicators ? 'true' : 'false';
        $carousel_data['data-swiper-autoplay'] = $ride === 'carousel' ? 'true' : 'false';
        $carousel_data['data-swiper-autoplay-delay'] = (string)$interval;
        if ($fancybox) {
            $carousel_data['data-carousel-fancybox'] = 'true';
            $carousel_data['data-fancybox-gallery'] = $carouselId;
        }
    } else {
        $carousel_data['data-bs-ride'] = $ride;
        $carousel_data['data-bs-interval'] = $interval;
        $carousel_data['data-bs-wrap'] = $wrap ? 'true' : 'false';
        $carousel_data['data-bs-touch'] = $touch ? 'true' : 'false';
        if ($fancybox) {
            $carousel_data['data-carousel-fancybox'] = 'true';
            $carousel_data['data-fancybox-gallery'] = $carouselId;
        }
    }

    $data_attrs = '';
    foreach ($carousel_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }

    // Count carousel items from rendered content to generate indicators
    $item_count = 0;
    $has_active = false;
    if (!empty($content)) {
        $item_count = preg_match_all('/carousel-item(?:\s|"|\')/', $content);
        $has_active = strpos($content, 'carousel-item active') !== false;
    }

    ob_start();
?>
    <div class="<?php echo esc_attr($class_string); ?>" id="<?php echo esc_attr($carouselId); ?>" <?php echo $data_attrs; ?>>

        <?php if ($indicators && $item_count > 0) : ?>
            <div class="carousel-indicators">
                <?php for ($i = 0; $i < $item_count; $i++) : ?>
                    <button type="button" data-bs-target="#<?php echo esc_attr($carouselId); ?>" data-bs-slide-to="<?php echo $i; ?>" <?php echo ($i === 0 && !$has_active) || ($i === 0 && $has_active) ? ' class="active" aria-current="true"' : ''; ?> aria-label="Slide <?php echo $i + 1; ?>"></button>
                <?php endfor; ?>
            </div>
        <?php endif; ?>

        <?php
        $inner_classes = array('carousel-inner', 'h-100');
        if ($items > 1) {
            $inner_classes[] = 'swiper-wrapper';
        }
        $inner_class_string = implode(' ', $inner_classes);
        ?>
        <div class="<?php echo esc_attr($inner_class_string); ?>">
            <?php if (!empty($content)) : ?>
                <?php echo $content; ?>
            <?php else : ?>
                <div class="carousel-item active">
                    <div class="carousel-placeholder d-block w-100" style="min-height: 400px; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                        <span class="text-muted"><?php echo __('Add carousel items...', 'ileben-landing'); ?></span>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <?php if ($controls) : ?>
            <button class="carousel-control-prev" type="button" data-bs-target="#<?php echo esc_attr($carouselId); ?>" data-bs-slide="prev">
                <i class="fa-solid fa-chevron-left"></i>
                <span class="visually-hidden"><?php echo __('Previous', 'ileben-landing'); ?></span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#<?php echo esc_attr($carouselId); ?>" data-bs-slide="next">
                <i class="fa-solid fa-chevron-right"></i>
                <span class="visually-hidden"><?php echo __('Next', 'ileben-landing'); ?></span>
            </button>
        <?php endif; ?>

    </div>
<?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Carousel Block
 */
function bootstrap_theme_register_bs_carousel_block()
{
    register_block_type('bootstrap-theme/bs-carousel', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_carousel_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'items' => array(
                'type' => 'number',
                'default' => 1
            ),
            'fancybox' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'carouselId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'controls' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'indicators' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'ride' => array(
                'type' => 'string',
                'default' => 'carousel'
            ),
            'interval' => array(
                'type' => 'string',
                'default' => '5000'
            ),
            'wrap' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'fade' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'touch' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_carousel_block');
