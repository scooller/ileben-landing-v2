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
    'thumb' => ['thumbnail', 150, 150],
    'medio' => ['medium', 300, 200],
    'medium' => ['medium', 300, 200],
    'largo' => ['large', 1024, 683],
    'completo' => ['full', 2400, 1600],
] as $selected => [$size, $width, $height]) {
    foreach ([true, false] as $lightbox) {
        $html = ileben_render_bs_gallery([
            'images' => [['id' => 1, 'thumbnailSize' => $selected]],
            'lightbox' => $lightbox,
        ], '', null);
        if (strpos($html, "max-width: {$width}px; max-height: {$height}px;") === false ||
            strpos($html, "src=\"https://example.test/{$size}.jpg\"") === false ||
            (strpos($html, 'href="https://example.test/full.jpg"') !== false) !== $lightbox) {
            throw new RuntimeException("Gallery rendering failed for {$selected}.");
        }
    }
}
echo "Gallery thumbnail checks passed.\n";
