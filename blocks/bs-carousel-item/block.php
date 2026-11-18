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
    $caption = $attributes['caption'] ?? '';
    $link = $attributes['link'] ?? '';
    $target = $attributes['target'] ?? '_self';
    $fancybox = !empty($attributes['fancybox']);
    $className = $attributes['className'] ?? '';

    $classes = array('wp-block-bootstrap-theme-bs-carousel-item', 'carousel-item', 'swiper-slide');
    if ($active) {
        $classes[] = 'active';
    }
    if ($className) {
        $classes[] = $className;
    }
    $class_string = implode(' ', array_unique($classes));

    // Build inline style from background images
    $style_parts = array();
    $imageUrl = ($backgroundImage && isset($backgroundImage['url'])) ? $backgroundImage['url'] : '';
    if ($imageUrl) {
        $style_parts[] = '--carousel-bg-desktop:url(' . esc_url($imageUrl) . ')';
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

    // Optional link wrapper (custom link or Fancybox gallery)
    if ($link) {
        echo '<a href="' . esc_url($link) . '" target="' . esc_attr($target) . '"' .
            ($target === '_blank' ? ' rel="noopener noreferrer"' : '') . '>';
    } elseif ($fancybox && $imageUrl) {
        echo '<a href="' . esc_url($imageUrl) . '" data-fancybox="carousel-gallery" data-caption="' . esc_attr($caption) . '">';
    }
?>
    <div class="<?php echo esc_attr($class_string); ?>" <?php echo $style_string ? ' style="' . esc_attr($style_string) . '"' : ''; ?><?php echo $data_attrs; ?>>
        <div class="d-flex align-items-center justify-content-center h-100">
            <?php
            $has_caption = $caption !== '';
            $has_content = !empty(trim(strip_tags($content, '<img><svg><video><audio><picture><button><input><form>')));
            if ($has_caption || $has_content) :
            ?>
                <div class="carousel-caption">
                    <?php if ($has_caption) : ?>
                        <p><?php echo esc_html($caption); ?></p>
                    <?php endif; ?>
                    <?php echo $content; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
<?php
    if ($link || ($fancybox && $imageUrl)) {
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
            'caption' => array(
                'type' => 'string',
                'default' => ''
            ),
            'fancybox' => array(
                'type' => 'boolean',
                'default' => false
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
