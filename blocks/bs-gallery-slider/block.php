<?php

/**
 * Block: Gallery Slider (Swiper) — reuses the plantas-slider markup, styles and JS.
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_gallery_slider($attributes, $content, $block)
{
    $images = array_filter((array)($attributes['images'] ?? []), fn($i) => !empty($i['url']));
    if (!$images) {
        return '';
    }

    $num = fn($key, $default) => esc_attr(str_replace(',', '.', trim((string)($attributes[$key] ?? $default))));
    $bool = fn($key) => !empty($attributes[$key]) ? 'true' : 'false';
    $id = wp_unique_id('gallery-slider-');
    $pagination = sanitize_text_field($attributes['paginationType'] ?? 'bullets');
    $fancybox = !empty($attributes['fancybox']);
    $class = esc_attr($attributes['className'] ?? '');

    ob_start();
?>
    <div class="bs-plantas-slider-container bs-gallery-slider <?php echo $class; ?>">
        <div class="swiper js-swiper" data-slider-id="<?php echo esc_attr($id); ?>"
            data-swiper-slides-mobile="<?php echo $num('slidesPerViewMobile', 1); ?>"
            data-swiper-slides-tablet="<?php echo $num('slidesPerViewTablet', 2); ?>"
            data-swiper-slides-desktop="<?php echo $num('slidesPerViewDesktop', 3); ?>"
            data-swiper-nav-arrows="<?php echo $bool('navigationArrows'); ?>"
            data-swiper-pagination-type="<?php echo esc_attr($pagination); ?>"
            data-swiper-loop="<?php echo $bool('loop'); ?>">
            <div class="swiper-wrapper">
                <?php foreach ($images as $img) :
                    $caption = trim((string)($img['caption'] ?? ''));
                    $tag = $fancybox ? 'a' : 'div';
                    $attrs = $fancybox ? ' href="' . esc_url($img['url']) . '" data-fancybox="' . esc_attr($id) . '" data-caption="' . esc_attr($caption) . '"' : '';
                ?>
                    <figure class="swiper-slide m-0">
                        <<?php echo $tag . $attrs; ?> class="d-block">
                            <img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt'] ?? $caption); ?>" class="w-100 object-fit-cover" loading="lazy">
                        </<?php echo $tag; ?>>
                        <?php if ($caption !== '') : ?>
                            <figcaption class="text-center mt-2"><?php echo esc_html($caption); ?></figcaption>
                        <?php endif; ?>
                    </figure>
                <?php endforeach; ?>
            </div>
        </div>
        <?php if ($pagination === 'scrollbar') : ?>
            <div class="swiper-scrollbar swiper-scrollbar-<?php echo esc_attr($id); ?>"></div>
        <?php elseif ($pagination !== 'none') : ?>
            <div class="swiper-pagination swiper-pagination-<?php echo esc_attr($id); ?>"></div>
        <?php endif; ?>
        <?php if (!empty($attributes['navigationArrows'])) : ?>
            <div class="swiper-button-prev swiper-button-prev-<?php echo esc_attr($id); ?>"></div>
            <div class="swiper-button-next swiper-button-next-<?php echo esc_attr($id); ?>"></div>
        <?php endif; ?>
    </div>
<?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_gallery_slider()
{
    register_block_type('bootstrap-theme/bs-gallery-slider', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_gallery_slider',
        'attributes' => array(
            'images' => array('type' => 'array', 'default' => array()),
            'slidesPerViewMobile' => array('type' => 'string', 'default' => '1'),
            'slidesPerViewTablet' => array('type' => 'string', 'default' => '2'),
            'slidesPerViewDesktop' => array('type' => 'string', 'default' => '3'),
            'navigationArrows' => array('type' => 'boolean', 'default' => true),
            'paginationType' => array('type' => 'string', 'default' => 'bullets'),
            'loop' => array('type' => 'boolean', 'default' => true),
            'fancybox' => array('type' => 'boolean', 'default' => true),
            'className' => array('type' => 'string', 'default' => ''),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_gallery_slider');
