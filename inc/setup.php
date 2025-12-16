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