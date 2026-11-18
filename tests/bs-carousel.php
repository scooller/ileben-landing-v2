<?php

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__);
}
function add_action($hook, $callback) {}
function esc_attr($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function esc_url($value) { return esc_attr($value); }
function __($text, $domain = '') { return $text; }
function register_block_type($name, $settings) { $GLOBALS['block_settings'] = $settings; }
function bootstrap_theme_add_custom_classes($classes, $attributes, $block) { return $classes; }

require __DIR__ . '/../blocks/bs-carousel/block.php';

bootstrap_theme_register_bs_carousel_block();
if (!isset($GLOBALS['block_settings']['attributes']['items']) || $GLOBALS['block_settings']['attributes']['items']['default'] !== 1) {
    throw new RuntimeException('Items attribute must default to 1.');
}

$content = '<div class="carousel-item active">Slide 1</div><div class="carousel-item">Slide 2</div>';

// Test default items = 1
$default_render = bootstrap_theme_render_bs_carousel_block([], $content, []);
if (strpos($default_render, 'carousel-multiple') !== false || strpos($default_render, 'data-bs-items') !== false) {
    throw new RuntimeException('Default items = 1 should not have carousel-multiple or data-bs-items.');
}

// Test multiple items = 3
$multi_render = bootstrap_theme_render_bs_carousel_block(['items' => 3], $content, []);
if (strpos($multi_render, 'carousel-multiple') === false || strpos($multi_render, 'carousel-items-3') === false || strpos($multi_render, 'data-bs-items="3"') === false) {
    throw new RuntimeException('Items = 3 should include carousel-multiple, carousel-items-3, and data-bs-items="3".');
}

// Test clamping
$clamped_max = bootstrap_theme_render_bs_carousel_block(['items' => 10], $content, []);
if (strpos($clamped_max, 'carousel-items-4') === false) {
    throw new RuntimeException('Items > 4 should be clamped to 4.');
}

$clamped_min = bootstrap_theme_render_bs_carousel_block(['items' => 0], $content, []);
if (strpos($clamped_min, 'carousel-multiple') !== false) {
    throw new RuntimeException('Items < 1 should be clamped to 1 and not have carousel-multiple.');
}

echo "All bs-carousel tests passed successfully.\n";
