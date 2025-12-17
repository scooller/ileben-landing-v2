<?php
/**
 * Custom Post Type: Plantas
 */

if (!defined('ABSPATH')) {
    exit;
}

function ileben_register_cpt_plantas() {
    $labels = array(
        'name' => _x('Plantas', 'Post Type General Name', 'bootstrap-theme'),
        'singular_name' => _x('Planta', 'Post Type Singular Name', 'bootstrap-theme'),
        'menu_name' => __('Plantas', 'bootstrap-theme'),
        'name_admin_bar' => __('Planta', 'bootstrap-theme'),
        'add_new' => __('Añadir nueva', 'bootstrap-theme'),
        'add_new_item' => __('Añadir nueva planta', 'bootstrap-theme'),
        'edit_item' => __('Editar planta', 'bootstrap-theme'),
        'new_item' => __('Nueva planta', 'bootstrap-theme'),
        'view_item' => __('Ver planta', 'bootstrap-theme'),
        'view_items' => __('Ver plantas', 'bootstrap-theme'),
        'search_items' => __('Buscar plantas', 'bootstrap-theme'),
        'not_found' => __('No se encontraron plantas', 'bootstrap-theme'),
        'not_found_in_trash' => __('No hay plantas en la papelera', 'bootstrap-theme'),
        'all_items' => __('Todas las plantas', 'bootstrap-theme'),
    );

    $args = array(
        'label' => __('Plantas', 'bootstrap-theme'),
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'show_in_rest' => false,
        'menu_icon' => 'dashicons-admin-multisite',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite' => array('slug' => 'plantas'),
    );

    register_post_type('plantas', $args);
}
add_action('init', 'ileben_register_cpt_plantas');
