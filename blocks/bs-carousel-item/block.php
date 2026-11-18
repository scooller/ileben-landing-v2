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

    $imageUrl = ($backgroundImage && isset($backgroundImage['url'])) ? $backgroundImage['url'] : '';
    $imageUrlMobile = ($backgroundImageMobile && isset($backgroundImageMobile['url'])) ? $backgroundImageMobile['url'] : '';
    $imageAlt = ($backgroundImage && isset($backgroundImage['alt']) && $backgroundImage['alt'] !== '')
        ? $backgroundImage['alt']
        : ($caption !== '' ? $caption : __('Slide image', 'ileben-landing'));

    // Preserve inline background variables for backward compatibility
    $style_parts = array();
    if ($imageUrl) {
        $style_parts[] = '--carousel-bg-desktop:url(' . esc_url($imageUrl) . ')';
    }
    if ($imageUrlMobile) {
        $style_parts[] = '--carousel-bg-mobile:url(' . esc_url($imageUrlMobile) . ')';
    }
    $style_string = implode(';', $style_parts);

    // Data attributes
    $data_attrs = '';
    if ($interval !== '') {
        $data_attrs = ' data-bs-interval="' . esc_attr($interval) . '"';
    }

    ob_start();
?>
    <div class="<?php echo esc_attr($class_string); ?>" <?php echo $style_string ? ' style="' . esc_attr($style_string) . '"' : ''; ?><?php echo $data_attrs; ?>>
        <?php if ($link) : ?>
            <a href="<?php echo esc_url($link); ?>" target="<?php echo esc_attr($target); ?>"<?php echo $target === '_blank' ? ' rel="noopener noreferrer"' : ''; ?> class="carousel-item-link d-block w-100 h-100 position-relative">
        <?php elseif ($fancybox && $imageUrl) : ?>
            <a href="<?php echo esc_url($imageUrl); ?>" data-fancybox="carousel-gallery" data-caption="<?php echo esc_attr($caption); ?>" class="carousel-item-link d-block w-100 h-100 position-relative">
        <?php endif; ?>

        <?php if ($imageUrl) : ?>
            <?php if ($imageUrlMobile && $imageUrlMobile !== $imageUrl) : ?>
                <picture class="carousel-image-picture w-100 h-100 d-block">
                    <source media="(max-width: 767.98px)" srcset="<?php echo esc_url($imageUrlMobile); ?>">
                    <img src="<?php echo esc_url($imageUrl); ?>" alt="<?php echo esc_attr($imageAlt); ?>" class="d-block w-100 h-100 object-fit-cover" loading="lazy">
                </picture>
            <?php else : ?>
                <img src="<?php echo esc_url($imageUrl); ?>" alt="<?php echo esc_attr($imageAlt); ?>" class="d-block w-100 h-100 object-fit-cover" loading="lazy">
            <?php endif; ?>
        <?php endif; ?>

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

        <?php if ($link || ($fancybox && $imageUrl)) : ?>
            </a>
        <?php endif; ?>
    </div>
<?php
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
