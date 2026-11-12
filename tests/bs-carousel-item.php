<?php

define('ABSPATH', __DIR__);
function add_action($hook, $callback) {}
function esc_attr($value) { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function esc_url($value) { return esc_attr($value); }
function register_block_type($name, $settings) { $GLOBALS['block_settings'] = $settings; }

require __DIR__ . '/../blocks/bs-carousel-item/block.php';

bootstrap_theme_register_bs_carousel_item_block();
if ($GLOBALS['block_settings']['attributes']['caption']['default'] !== '') {
    throw new RuntimeException('Caption must default to empty.');
}

$content = '<p>Existing slide content</p>';
$empty = bootstrap_theme_render_bs_carousel_item_block([], $content);
$caption = bootstrap_theme_render_bs_carousel_item_block(['caption' => '<script>alert("x")</script>'], $content);
$zero = bootstrap_theme_render_bs_carousel_item_block(['caption' => '0'], $content);
if (substr_count($empty, '<p>') !== 1 || strpos($empty, $content) === false || strpos($caption, $content) === false ||
    strpos($caption, '<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>') === false ||
    strpos($zero, '<p>0</p>') === false) {
    throw new RuntimeException('Caption rendering failed.');
}
echo "Carousel caption checks passed.\n";
