<?php
/**
 * Bootstrap Scrollspy Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Scrollspy Block
 */
function bootstrap_theme_render_bs_scrollspy_block($attributes, $content, $block) {
    $target = $attributes['target'] ?? 'navbar-example';
    $offset = $attributes['offset'] ?? 0;
    $method = $attributes['method'] ?? 'auto';
    $smoothScroll = $attributes['smoothScroll'] ?? true;

    $scrollspy_data = array(
        'data-bs-spy' => 'scroll',
        'data-bs-target' => '#' . $target,
        'data-bs-offset' => $offset,
        'data-bs-method' => $method
    );
    if ($smoothScroll) {
        $scrollspy_data['data-bs-smooth-scroll'] = 'true';
    }
    $data_attrs = '';
    foreach ($scrollspy_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    // Build row classes
    $row_classes = array('row');
    $row_classes = bootstrap_theme_add_custom_classes($row_classes, $attributes, $block);
    $row_class_string = implode(' ', array_unique($row_classes));
    $output = '<div class="' . esc_attr($row_class_string) . '">';
    $output .= '<div class="col-12">';
    $output .= '<div' . $data_attrs . ' style="position: relative; height: 400px; overflow-y: auto;">';
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<h4>' . __('Agrega secciones al scrollspy.', 'bootstrap-theme') . '</h4>';
    }
    $output .= '</div>';
    $output .= '</div>';
    $output .= '</div>';
    return $output;
}

/**
 * Register Bootstrap Scrollspy Block
 */
function bootstrap_theme_register_bs_scrollspy_block() {
    register_block_type('bootstrap-theme/bs-scrollspy', array(
        'render_callback' => 'bootstrap_theme_render_bs_scrollspy_block',
        'attributes' => array(
            'target' => array(
                'type' => 'string',
                'default' => 'navbar-example'
            ),
            'offset' => array(
                'type' => 'integer',
                'default' => 0
            ),
            'method' => array(
                'type' => 'string',
                'default' => 'auto'
            ),
            'smoothScroll' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        ),
        'supports' => array(
            'html' => true
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_scrollspy_block');
