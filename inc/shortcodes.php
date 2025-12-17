<?php
/**
 * Shortcodes for helpers: lazy image and iframe facade
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * [lazy_image id="123" size="large" class="img-fluid" alt="Alt text" width="" height="" loading="lazy"]
 */
function ileben_sc_lazy_image($atts) {
    $atts = shortcode_atts([
        'id' => '',
        'size' => 'large',
        'class' => '',
        'alt' => '',
        'width' => '',
        'height' => '',
        'loading' => '',
    ], $atts, 'lazy_image');

    $image_id = intval($atts['id']);
    if (!$image_id) {
        return '';
    }

    $img_attrs = [];
    foreach (['class','alt','width','height','loading'] as $key) {
        if ($atts[$key] !== '') {
            $img_attrs[$key] = $atts[$key];
        }
    }

    if (!function_exists('ileben_lazy_image')) {
        return '';
    }

    return ileben_lazy_image($image_id, $atts['size'], $img_attrs);
}
add_shortcode('lazy_image', 'ileben_sc_lazy_image');

/**
 * [iframe_facade embed_url="https://www.youtube.com/embed/..." button_label="Reproducir" title="Video" ratio="16x9"]
 */
function ileben_sc_iframe_facade($atts) {
    $atts = shortcode_atts([
        'embed_url' => '',
        'button_label' => '',
        'title' => '',
        'ratio' => '',
    ], $atts, 'iframe_facade');

    if (!function_exists('ileben_iframe_facade')) {
        return '';
    }

    $args = [];
    foreach (['embed_url','button_label','title','ratio'] as $key) {
        if ($atts[$key] !== '') {
            $args[$key] = $atts[$key];
        }
    }

    return ileben_iframe_facade($args);
}
add_shortcode('iframe_facade', 'ileben_sc_iframe_facade');

/**
 * [loader]
 * Renders the site loader markup.
 */
function ileben_sc_loader($atts) {
    if (!function_exists('ileben_render_loader')) {
        return '';
    }
    ob_start();
    ileben_render_loader();
    return ob_get_clean();
}
add_shortcode('loader', 'ileben_sc_loader');
