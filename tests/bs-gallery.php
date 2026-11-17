<?php

define('ABSPATH', __DIR__);
function add_action($hook, $callback) {}
function register_block_type($name, $settings) {}
function absint($value) { return abs((int) $value); }
function sanitize_text_field($value) { return $value; }
function sanitize_hex_color($value) { return $value; }
function esc_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return esc_attr($value); }
function esc_url($value) { return esc_attr($value); }
function get_post_meta($id, $key, $single) { return ''; }
function get_the_title($id) { return ''; }
function wp_get_attachment_caption($id) { return ''; }
function wp_get_attachment_image_src($id, $size)
{
    $sizes = [
        'thumbnail' => [150, 150],
        'medium' => [300, 200],
        'large' => [1024, 683],
        'full' => [2400, 1600],
    ];
    return ["https://example.test/{$size}.jpg", ...$sizes[$size]];
}

require __DIR__ . '/../blocks/bs-gallery/block.php';

foreach ([
    'thumb' => 'thumbnail',
    'medio' => 'medium',
    'medium' => 'medium',
    'largo' => 'large',
    'completo' => 'full',
] as $selected => $size) {
    foreach ([true, false] as $lightbox) {
        $html = ileben_render_bs_gallery([
            'images' => [['id' => 1, 'thumbnailSize' => $selected, 'columnSpan' => 2, 'rowSpan' => 2]],
            'lightbox' => $lightbox,
        ], '', null);
        if (strpos($html, 'style="grid-column: span 2; grid-row: span 2;"') === false ||
            strpos($html, "src=\"https://example.test/{$size}.jpg\"") === false ||
            (strpos($html, 'href="https://example.test/full.jpg"') !== false) !== $lightbox) {
            throw new RuntimeException("Gallery rendering failed for {$selected}.");
        }
    }
}
echo "Gallery thumbnail checks passed.\n";
