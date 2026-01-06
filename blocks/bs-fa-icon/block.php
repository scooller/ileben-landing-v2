<?php
/**
 * FontAwesome Icon Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_fa_icon_block($attributes, $content, $block) {
    $icon_style = $attributes['iconStyle'] ?? 'fa-solid';
    $icon_name  = $attributes['iconName'] ?? 'fa-star';
    $size       = $attributes['size'] ?? 'fa-2x';
    $color      = $attributes['color'] ?? '';
    $align      = $attributes['align'] ?? '';

    $icon_classes = array_filter([
        $icon_style,
        $icon_name,
        $size,
    ]);

    $wrapper_classes = ['fa-icon-block'];
    if (!empty($align)) {
        $wrapper_classes[] = 'text-' . $align;
    }

    // Allow custom classes from Advanced panel
    $wrapper_classes = bootstrap_theme_add_custom_classes($wrapper_classes, $attributes, $block);

    $style_attr = '';
    if (!empty($color)) {
        $style_attr = ' style="color: ' . esc_attr($color) . ';"';
    }

    $output  = '<div class="' . esc_attr(implode(' ', array_unique($wrapper_classes))) . '">';
    $output .= '<i class="' . esc_attr(implode(' ', $icon_classes)) . '" aria-hidden="true"' . $style_attr . '></i>';
    $output .= '</div>';

    return $output;
}

function bootstrap_theme_register_bs_fa_icon_block() {
    register_block_type('bootstrap-theme/bs-fa-icon', [
        'render_callback' => 'bootstrap_theme_render_bs_fa_icon_block',
        'attributes' => [
            'iconStyle' => [
                'type' => 'string',
                'default' => 'fa-solid',
            ],
            'iconName' => [
                'type' => 'string',
                'default' => 'fa-star',
            ],
            'size' => [
                'type' => 'string',
                'default' => 'fa-2x',
            ],
            'color' => [
                'type' => 'string',
                'default' => '',
            ],
            'align' => [
                'type' => 'string',
                'default' => '',
            ],
            'className' => [
                'type' => 'string',
                'default' => '',
            ],
        ],
    ]);
}
add_action('init', 'bootstrap_theme_register_bs_fa_icon_block');
