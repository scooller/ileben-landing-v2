<?php
/**
 * Bootstrap Navs & Tabs Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Navs & Tabs Block
 */
function bootstrap_theme_render_bs_navs_tabs_block($attributes, $content, $block) {
    $type = $attributes['type'] ?? 'tabs';
    $fill = $attributes['fill'] ?? false;
    $justified = $attributes['justified'] ?? false;
    $vertical = $attributes['vertical'] ?? false;
    $navId = $attributes['navId'] ?? 'nav-' . uniqid();

    // Build nav classes
    $nav_classes = array('nav');
    switch ($type) {
        case 'tabs':
            $nav_classes[] = 'nav-tabs';
            break;
        case 'pills':
            $nav_classes[] = 'nav-pills';
            break;
        case 'underline':
            $nav_classes[] = 'nav-underline';
            break;
    }
    if ($fill) {
        $nav_classes[] = 'nav-fill';
    }
    if ($justified) {
        $nav_classes[] = 'nav-justified';
    }
    // Add custom CSS classes from Advanced panel
    $nav_classes = bootstrap_theme_add_custom_classes($nav_classes, $attributes, $block);
    $nav_class_string = implode(' ', array_unique($nav_classes));
    $output = '';
    if ($vertical) {
        $output .= '<div class="d-flex align-items-start">';
        $output .= '<div class="nav flex-column nav-pills me-3" id="' . esc_attr($navId) . '-tab" role="tablist" aria-orientation="vertical">';
    } else {
        $output .= '<ul class="' . esc_attr($nav_class_string) . '" id="' . esc_attr($navId) . '-tab" role="tablist">';
    }
    // Aquí se espera que los elementos de navegación sean InnerBlocks
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<li class="nav-item"><span class="nav-link disabled">Agrega pestañas</span></li>';
    }
    if ($vertical) {
        $output .= '</div>';
        $output .= '<div class="tab-content" id="' . esc_attr($navId) . '-tabContent">';
    } else {
        $output .= '</ul>';
        $output .= '<div class="tab-content" id="' . esc_attr($navId) . '-tabContent">';
    }
    // El contenido de los paneles también debe venir de InnerBlocks
    // (puedes personalizar esto según la estructura de tus bloques hijos)
    $output .= '</div>'; // tab-content
    if ($vertical) {
        $output .= '</div>'; // d-flex container
    }
    return $output;
}

/**
 * Register Bootstrap Navs & Tabs Block
 */
function bootstrap_theme_register_bs_navs_tabs_block() {
    register_block_type('bootstrap-theme/bs-navs-tabs', array(
        'render_callback' => 'bootstrap_theme_render_bs_navs_tabs_block',
        'attributes' => array(
            'type' => array(
                'type' => 'string',
                'default' => 'tabs'
            ),
            'fill' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'justified' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'vertical' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'navId' => array(
                'type' => 'string',
                'default' => ''
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
add_action('init', 'bootstrap_theme_register_bs_navs_tabs_block');
