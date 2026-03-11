<?php
/**
 * Custom Post Type: Plantas
 */

if (!defined('ABSPATH')) {
    exit;
}

function ileben_register_cpt_plantas() {
    $labels = array(
        'name' => _x('Plantas', 'Post Type General Name', 'ileben-landing'),
        'singular_name' => _x('Planta', 'Post Type Singular Name', 'ileben-landing'),
        'menu_name' => __('Plantas', 'ileben-landing'),
        'name_admin_bar' => __('Planta', 'ileben-landing'),
        'add_new' => __('A├▒adir nueva', 'ileben-landing'),
        'add_new_item' => __('A├▒adir nueva planta', 'ileben-landing'),
        'edit_item' => __('Editar planta', 'ileben-landing'),
        'new_item' => __('Nueva planta', 'ileben-landing'),
        'view_item' => __('Ver planta', 'ileben-landing'),
        'view_items' => __('Ver plantas', 'ileben-landing'),
        'search_items' => __('Buscar plantas', 'ileben-landing'),
        'not_found' => __('No se encontraron plantas', 'ileben-landing'),
        'not_found_in_trash' => __('No hay plantas en la papelera', 'ileben-landing'),
        'all_items' => __('Todas las plantas', 'ileben-landing'),
    );

    $args = array(
        'label' => __('Plantas', 'ileben-landing'),
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

/**
 * Registro de taxonom├¡a: Categor├¡a de Plantas
 */
function ileben_register_tax_categoria_planta() {
    $labels = array(
        'name' => _x('Categor├¡as de Plantas', 'Taxonomy General Name', 'ileben-landing'),
        'singular_name' => _x('Categor├¡a de Planta', 'Taxonomy Singular Name', 'ileben-landing'),
        'menu_name' => __('Categor├¡as', 'ileben-landing'),
        'all_items' => __('Todas las Categor├¡as', 'ileben-landing'),
        'edit_item' => __('Editar Categor├¡a', 'ileben-landing'),
        'view_item' => __('Ver Categor├¡a', 'ileben-landing'),
        'update_item' => __('Actualizar Categor├¡a', 'ileben-landing'),
        'add_new_item' => __('A├▒adir Nueva Categor├¡a', 'ileben-landing'),
        'new_item_name' => __('Nuevo Nombre de Categor├¡a', 'ileben-landing'),
        'search_items' => __('Buscar Categor├¡as', 'ileben-landing'),
        'not_found' => __('No se encontraron categor├¡as', 'ileben-landing'),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => true,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => false,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'categoria-planta'),
    );

    register_taxonomy('categoria_planta', array('plantas'), $args);
}
add_action('init', 'ileben_register_tax_categoria_planta');