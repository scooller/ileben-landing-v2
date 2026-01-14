<?php
/**
 * Theme setup and supports.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('custom-logo');
    add_theme_support('html5', ['script', 'style']);

    register_nav_menus([
        'primary' => __('Primary Menu', 'ileben-landing-v2'),
        'header-menu' => __('Header Menu', 'ileben-landing-v2'),
        'footer-menu' => __('Footer Menu', 'ileben-landing-v2'),
    ]);

    add_image_size('banner', 1200, 900, true);
    add_image_size('banner_mobile', 750, 1200, true);

    $editor_styles = [
        'style.css',
    ];
    add_editor_style($editor_styles);

    if (!isset($GLOBALS['content_width'])) {
        $GLOBALS['content_width'] = 1200;
    }

    // Add support for editor color palette from ACF Options
    // Helper function to safely get ACF field with fallback
    $get_color = function($field_name, $default) {
        return function_exists('get_field') ? (get_field($field_name, 'option') ?: $default) : $default;
    };
    
    $colors = [
        // Base colors
        'base' => [
            'blue' => $get_color('color_blue', '#0d6efd'),
            'indigo' => $get_color('color_indigo', '#6610f2'),
            'purple' => $get_color('color_purple', '#6f42c1'),
            'pink' => $get_color('color_pink', '#d63384'),
            'red' => $get_color('color_red', '#dc3545'),
            'orange' => $get_color('color_orange', '#fd7e14'),
            'yellow' => $get_color('color_yellow', '#ffc107'),
            'green' => $get_color('color_green', '#198754'),
            'teal' => $get_color('color_teal', '#20c997'),
            'cyan' => $get_color('color_cyan', '#0dcaf0'),
            'black' => $get_color('color_black', '#000'),
            'white' => $get_color('color_white', '#fff'),
            'gray' => $get_color('color_gray', '#6c757d'),
            'gray-dark' => $get_color('color_gray_dark', '#343a40'),
        ],
        // Gray scale
        'gray-scale' => [
            'gray-100' => $get_color('color_gray_100', '#f8f9fa'),
            'gray-200' => $get_color('color_gray_200', '#e9ecef'),
            'gray-300' => $get_color('color_gray_300', '#dee2e6'),
            'gray-400' => $get_color('color_gray_400', '#ced4da'),
            'gray-500' => $get_color('color_gray_500', '#adb5bd'),
            'gray-600' => $get_color('color_gray_600', '#6c757d'),
            'gray-700' => $get_color('color_gray_700', '#495057'),
            'gray-800' => $get_color('color_gray_800', '#343a40'),
            'gray-900' => $get_color('color_gray_900', '#212529'),
        ],
        // Theme colors
        'theme-colors' => [
            'primary' => $get_color('color_primary', '#0d6efd'),
            'secondary' => $get_color('color_secondary', '#6c757d'),
            'success' => $get_color('color_success', '#198754'),
            'info' => $get_color('color_info', '#0dcaf0'),
            'warning' => $get_color('color_warning', '#ffc107'),
            'danger' => $get_color('color_danger', '#dc3545'),
            'light' => $get_color('color_light', '#f8f9fa'),
            'dark' => $get_color('color_dark', '#212529'),
        ],
        // Body colors
        'body-colors' => [
            'body-color' => $get_color('color_body', '#212529'),
            'body-bg' => $get_color('color_body_bg', '#fff'),
        ],
        // Link colors
        'link-colors' => [
            'link-color' => $get_color('color_link', '#0d6efd'),
            'link-hover-color' => $get_color('color_link_hover', '#0a58ca'),
        ],
        // Border
        'border' => [
            'border-color' => $get_color('color_border', '#dee2e6'),
        ],
        // System colors
        'system-colors' => [
            'emphasis-color' => $get_color('color_emphasis', '#000'),
            'secondary-color' => $get_color('color_secondary_color', '#212529'),
            'secondary-bg' => $get_color('color_secondary_bg', '#e9ecef'),
            'tertiary-color' => $get_color('color_tertiary_color', '#212529'),
            'tertiary-bg' => $get_color('color_tertiary_bg', '#f8f9fa'),
            'code-color' => $get_color('color_code', '#d63384'),
            'highlight-color' => $get_color('color_highlight', '#212529'),
            'highlight-bg' => $get_color('color_highlight_bg', '#fff3cd'),
        ],
    ];
    
    
    $color_palette = [];
    foreach ($colors as $group => $colors) {
        foreach ($colors as $name => $color) {
            $color_palette[] = [
                'name'  => ucfirst($name),
                'slug'  => $name,
                'color' => $color,
            ];
        }
    }

    add_theme_support('editor-color-palette', $color_palette);

    //custom theme font sizes rem
    add_theme_support( 'custom-font-sizes', [
        'small' => 12,
        'medium' => 16,
        'large' => 20,
        'x-large' => 24,
    ]);
    add_theme_support( 'custom-units', 'rem', 'px' );
    
});

/**
 * Campos personalizados para ítems de menú: icono FontAwesome, botón y estilo Bootstrap
 */
add_filter('wp_nav_menu_item_custom_fields', function($item_id, $item, $depth, $args) {
    // Icono FontAwesome
    $icon = get_post_meta($item_id, '_menu_item_fa_icon', true);
    echo '<p class="field-fa-icon description description-wide">
        <label for="edit-menu-item-fa-icon-' . $item_id . '">' . esc_html__('Icono FontAwesome (ej: fa-home)', 'bootstrap-theme') . '<br />
        <input type="text" id="edit-menu-item-fa-icon-' . $item_id . '" class="widefat code edit-menu-item-fa-icon" style="display: inline-block; width: 80%;" name="menu-item-fa-icon[' . $item_id . ']" value="' . esc_attr($icon) . '" />
        </label>';
    echo '<br><a href="https://fontawesome.com/icons" target="_blank" rel="noopener" style="font-size:13px;">' . esc_html__('Ver todos los iconos FontAwesome', 'bootstrap-theme') . '</a>';
    if ($icon) {
        echo '<span style="display:inline-block;margin-left:10px;vertical-align:middle;">'
            . '<svg class="icon"><use xlink:href="#' . esc_attr($icon) . '"></use></svg></span>';
    }
    echo '</p>';

    // Mostrar como botón
    $is_button = get_post_meta($item_id, '_menu_item_is_button', true);
    echo '<p class="field-is-button description description-wide">
        <label for="edit-menu-item-is-button-' . $item_id . '">
        <input type="checkbox" id="edit-menu-item-is-button-' . $item_id . '" name="menu-item-is-button[' . $item_id . ']" value="1"' . checked($is_button, '1', false) . ' /> '
        . esc_html__('Mostrar como botón Bootstrap', 'bootstrap-theme') . '</label></p>';

    // Estilo de botón Bootstrap
    $button_style = get_post_meta($item_id, '_menu_item_button_style', true);
    $styles = array(
        'btn-primary' => 'Primario',
        'btn-secondary' => 'Secundario',
        'btn-success' => 'Éxito',
        'btn-danger' => 'Peligro',
        'btn-warning' => 'Advertencia',
        'btn-info' => 'Info',
        'btn-light' => 'Claro',
        'btn-dark' => 'Oscuro',
        'btn-outline-primary' => 'Outline Primario',
        'btn-outline-secondary' => 'Outline Secundario',
        'btn-outline-success' => 'Outline Éxito',
        'btn-outline-danger' => 'Outline Peligro',
        'btn-outline-warning' => 'Outline Advertencia',
        'btn-outline-info' => 'Outline Info',
        'btn-outline-light' => 'Outline Claro',
        'btn-outline-dark' => 'Outline Oscuro',
        'icon-link' => 'Link con Icono',
    );
    echo '<p class="field-button-style description description-wide">
        <label for="edit-menu-item-button-style-' . $item_id . '">' . esc_html__('Estilo de botón Bootstrap', 'bootstrap-theme') . '<br />
        <select id="edit-menu-item-button-style-' . $item_id . '" name="menu-item-button-style[' . $item_id . ']">';
    echo '<option value="">' . esc_html__('(Sin estilo)', 'bootstrap-theme') . '</option>';
    foreach ($styles as $class => $label) {
        echo '<option value="' . esc_attr($class) . '"' . selected($button_style, $class, false) . '>' . esc_html($label) . '</option>';
    }
    echo '</select></label>';
    if ($is_button && $button_style) {
        echo '<span style="display:inline-block;margin-left:10px;vertical-align:middle;">'
            . '<button type="button" class="btn ' . esc_attr($button_style) . '">Preview</button></span>';
    }
    echo '</p>';
}, 10, 4);

// Guardar los campos personalizados
add_action('wp_update_nav_menu_item', function($menu_id, $menu_item_db_id, $args) {
    // Icono FontAwesome
    $icon = isset($_POST['menu-item-fa-icon'][$menu_item_db_id]) ? sanitize_text_field($_POST['menu-item-fa-icon'][$menu_item_db_id]) : '';
    update_post_meta($menu_item_db_id, '_menu_item_fa_icon', $icon);

    // Mostrar como botón
    $is_button = isset($_POST['menu-item-is-button'][$menu_item_db_id]) ? '1' : '';
    update_post_meta($menu_item_db_id, '_menu_item_is_button', $is_button);

    // Estilo de botón Bootstrap
    $button_style = isset($_POST['menu-item-button-style'][$menu_item_db_id]) ? sanitize_text_field($_POST['menu-item-button-style'][$menu_item_db_id]) : '';
    update_post_meta($menu_item_db_id, '_menu_item_button_style', $button_style);
}, 10, 3);

/**
 * Output custom CSS based on customizer settings
 */