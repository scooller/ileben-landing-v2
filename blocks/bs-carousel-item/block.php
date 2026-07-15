<?php

/**
 * Bootstrap Carousel Item Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render callback for bs-carousel-item
 */
function bootstrap_theme_render_bs_carousel_item_block($attributes, $content)
{
    $active = !empty($attributes['active']);
    $backgroundImage = $attributes['backgroundImage'] ?? null;
    $backgroundImageMobile = $attributes['backgroundImageMobile'] ?? null;
    $interval = $attributes['interval'] ?? '';
    $link = $attributes['link'] ?? '';
    $target = $attributes['target'] ?? '_self';
    $className = $attributes['className'] ?? '';

    $classes = array('wp-block-bootstrap-theme-bs-carousel-item', 'carousel-item');
    if ($active) {
        $classes[] = 'active';
    }
    if ($className) {
        $classes[] = $className;
    }
    $class_string = implode(' ', array_unique($classes));

    // Build inline style from background images
    $style_parts = array();
    if ($backgroundImage && isset($backgroundImage['url']) && $backgroundImage['url']) {
        $style_parts[] = '--carousel-bg-desktop:url(' . esc_url($backgroundImage['url']) . ')';
        $style_parts[] = 'min-height:400px';
    }
    if ($backgroundImageMobile && isset($backgroundImageMobile['url']) && $backgroundImageMobile['url']) {
        $style_parts[] = '--carousel-bg-mobile:url(' . esc_url($backgroundImageMobile['url']) . ')';
    }
    $style_string = implode(';', $style_parts);

    // Data attributes
    $data_attrs = '';
    if ($interval !== '') {
        $data_attrs = ' data-bs-interval="' . esc_attr($interval) . '"';
    }

    ob_start();

    // Optional link wrapper
    if ($link) {
        echo '<a href="' . esc_url($link) . '" target="' . esc_attr($target) . '"' .
            ($target === '_blank' ? ' rel="noopener noreferrer"' : '') . '>';
    }
?>
    <div class="<?php echo esc_attr($class_string); ?>" <?php echo $style_string ? ' style="' . esc_attr($style_string) . '"' : ''; ?><?php echo $data_attrs; ?>>
        <div class="d-flex align-items-center justify-content-center h-100">
            <div class="carousel-caption">
                <?php echo $content; ?>
            </div>
        </div>
    </div>
<?php
    if ($link) {
        echo '</a>';
    }

    return ob_get_clean();
}

/**
 * Register the block
 */
function bootstrap_theme_register_bs_carousel_item_block()
{
    register_block_type('bootstrap-theme/bs-carousel-item', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_carousel_item_block',
        'attributes' => array(
            'active' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'backgroundImage' => array(
                'type' => 'object',
                'default' => null
            ),
            'backgroundImageMobile' => array(
                'type' => 'object',
                'default' => null
            ),
            'interval' => array(
                'type' => 'string',
                'default' => ''
            ),
            'link' => array(
                'type' => 'string',
                'default' => ''
            ),
            'target' => array(
                'type' => 'string',
                'default' => '_self'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_carousel_item_block');
