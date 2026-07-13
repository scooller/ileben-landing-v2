<?php

/**
 * Split Carousel Item Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_split_carousel_item_block($attributes, $content)
{
    // Helper para booleanos
    $to_bool = function ($value, $default) {
        if (!isset($value)) return $default;
        if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
        if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
        return $default;
    };

    $active = $to_bool($attributes['active'] ?? null, false);
    $bgImageId = $attributes['bgImageId'] ?? 0;
    $mainImageId = $attributes['mainImageId'] ?? 0;
    $className = $attributes['className'] ?? '';

    $classes = array('carousel-item', 'bs-split-carousel-item');
    if ($active) {
        $classes[] = 'active';
    }
    if ($className) {
        $classes[] = $className;
    }

    $class_string = implode(' ', array_unique($classes));

    $bg_style = '';
    if ($bgImageId) {
        $bg_url = wp_get_attachment_image_url($bgImageId, 'full');
        if ($bg_url) {
            $bg_style = 'background-image: url(' . esc_url($bg_url) . ');';
        }
    }

    ob_start();
?>
    <div class="<?php echo esc_attr($class_string); ?>">
        <div class="row g-0 align-items-center h-100 position-relative">
            
            <div class="col-12 col-md-5 split-text-col position-relative z-1">
                <div class="split-text-card box-shadow-1" style="<?php echo esc_attr($bg_style); ?>">
                    <div class="split-text-content">
                        <?php echo $content; ?>
                    </div>
                </div>
            </div>
            
            <div class="col-12 col-md-7 split-image-col position-absolute end-0 top-0 h-100 z-2 d-none d-md-block">
                <?php if ($mainImageId) : ?>
                    <?php echo wp_get_attachment_image($mainImageId, 'full', false, array('class' => 'w-100 h-100 object-fit-cover mt-4')); ?>
                <?php else : ?>
                    <div class="placeholder-img w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <span class="text-muted">Main Image Placeholder</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Mobile image fallback (visible only on small screens) -->
            <div class="col-12 split-image-col-mobile d-md-none mt-3">
                <?php if ($mainImageId) : ?>
                    <?php echo wp_get_attachment_image($mainImageId, 'full', false, array('class' => 'w-100 h-auto img-fluid')); ?>
                <?php endif; ?>
            </div>

        </div>
    </div>
<?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_split_carousel_item_block()
{
    register_block_type('bootstrap-theme/bs-split-carousel-item', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_split_carousel_item_block',
        'attributes' => array(
            'active' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'bgImageId' => array(
                'type' => 'number',
                'default' => 0
            ),
            'mainImageId' => array(
                'type' => 'number',
                'default' => 0
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_split_carousel_item_block');
