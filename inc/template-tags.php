<?php
/**
 * Template helpers (lazy images, facades, loader).
 */

if (!defined('ABSPATH')) {
    exit;
}

function ileben_lazy_image($image_id, $size = 'large', $attrs = [])
{
    $image = wp_get_attachment_image_src($image_id, $size);
    if (!$image) {
        return '';
    }

    $defaults = [
        'class' => 'lazyload img-fluid',
        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
        'width' => $image[1],
        'height' => $image[2],
        'loading' => 'lazy',
    ];

    $attrs = wp_parse_args($attrs, $defaults);
    $attr_pairs = [];
    foreach ($attrs as $key => $value) {
        if ($value === '') {
            continue;
        }
        $attr_pairs[] = sprintf('%s="%s"', esc_attr($key), esc_attr($value));
    }

    $placeholder = ILEBEN_THEME_URI . '/assets/images/placeholders/placeholder-image.svg';
    $src = sprintf('<img src="%s" data-src="%s" %s />', esc_url($placeholder), esc_url($image[0]), implode(' ', $attr_pairs));

    return $src;
}

function ileben_iframe_facade($args = [])
{
    $defaults = [
        'title' => __('Abrir contenido', 'ileben-landing-v2'),
        'embed_url' => '',
        'button_label' => __('Reproducir', 'ileben-landing-v2'),
        'ratio' => '16x9', // Bootstrap ratio utility, e.g., 16x9, 4x3
    ];

    $args = wp_parse_args($args, $defaults);
    if (empty($args['embed_url'])) {
        return '';
    }

    $ratio_class = 'ratio ratio-' . preg_replace('/[^0-9x]/', '', $args['ratio']);

    ob_start();
    ?>
    <div class="iframe-facade" data-embed-url="<?php echo esc_url($args['embed_url']); ?>">
        <div class="<?php echo esc_attr($ratio_class); ?> mb-2">
            <div class="placeholder-glow w-100 h-100 d-flex align-items-center justify-content-center bg-body border rounded">
                <div class="w-75">
                    <span class="placeholder col-12 mb-2"></span>
                    <span class="placeholder col-10"></span>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary facade-trigger" aria-label="<?php echo esc_attr($args['button_label']); ?>">
            <span class="facade-label"><?php echo esc_html($args['button_label']); ?></span>
        </button>
    </div>
    <?php
    return ob_get_clean();
}

function ileben_render_loader()
{
    ?>
    <div id="site-loader" class="site-loader" aria-hidden="true">
        <div class="loader-inner text-center">
            <img src="https://ileben.cl/wp-content/uploads/2022/02/logo-leben-solo.svg" alt="<?php esc_attr_e('Ileben', 'ileben-landing-v2'); ?>" class="img-logo">
            <br>
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    <noscript>
        <style>#site-loader{display:none!important;}</style>
    </noscript>
    <?php
}
