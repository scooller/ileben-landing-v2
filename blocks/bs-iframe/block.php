<?php
/**
 * Bootstrap Iframe Block (uses Bootstrap 5 ratio helper)
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_iframe_block($attributes, $content, $block) {
    $embed_url = isset($attributes['embedUrl']) ? esc_url($attributes['embedUrl']) : '';
    if (!$embed_url) {
        return '';
    }

    $title = isset($attributes['title']) && $attributes['title'] !== '' ? sanitize_text_field($attributes['title']) : __('Contenido incrustado', 'bootstrap-theme');
    $ratio = isset($attributes['ratio']) ? $attributes['ratio'] : '16x9';
    $allowed_ratios = array('1x1','4x3','16x9','21x9');
    if (!in_array($ratio, $allowed_ratios, true)) {
        $ratio = '16x9';
    }
    $allow_fullscreen = !empty($attributes['allowFullscreen']);
    $loading = isset($attributes['loading']) && in_array($attributes['loading'], array('eager','lazy'), true) ? $attributes['loading'] : 'lazy';

    $class_name = 'ratio ratio-' . $ratio;

    $iframe_attrs = array(
        'src' => $embed_url,
        'title' => $title,
        'loading' => $loading,
        'style' => 'border:0;'
    );

    $attrs_str = '';
    foreach ($iframe_attrs as $k => $v) {
        $attrs_str .= ' ' . $k . '="' . esc_attr($v) . '"';
    }
    if ($allow_fullscreen) {
        $attrs_str .= ' allowfullscreen';
    }

    $html  = '<div class="' . esc_attr($class_name) . '">';
    $html .= '<iframe' . $attrs_str . '></iframe>';
    $html .= '</div>';

    return $html;
}

function bootstrap_theme_register_bs_iframe_block() {
    register_block_type('bootstrap-theme/bs-iframe', array(
        'render_callback' => 'bootstrap_theme_render_bs_iframe_block',
        'attributes' => array(
            'embedUrl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ratio' => array(
                'type' => 'string',
                'default' => '16x9'
            ),
            'allowFullscreen' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'loading' => array(
                'type' => 'string',
                'default' => 'lazy'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_iframe_block');
