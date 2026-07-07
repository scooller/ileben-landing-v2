<?php
/**
 * Block: Entorno Category
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_entorno_category($attributes, $content, $block)
{
    // El renderizado de las clases "tab-pane fade show active" y su id 
    // se maneja desde el contenedor padre (bs-entorno) mediante parseo de innerBlocks.
    // Aquí solo necesitamos retornar el contenido interno, ya que el contenedor padre
    // lo envolverá en el <div> correspondiente del tab-pane.
    // Nota: render_block($inner_block) dentro del padre ejecutará este callback y obtendrá este $content.
    
    return $content;
}

function bootstrap_theme_register_bs_entorno_category()
{
    register_block_type('bootstrap-theme/bs-entorno-category', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_entorno_category',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => 'Categoría'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_entorno_category');
