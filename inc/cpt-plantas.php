<?php
/**
 * Custom Post Type: Plantas & Helper de Consulta Unificado
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
        'add_new' => __('Añadir nueva', 'ileben-landing'),
        'add_new_item' => __('Añadir nueva planta', 'ileben-landing'),
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
 * Registro de taxonomía: Categoría de Plantas
 */
function ileben_register_tax_categoria_planta() {
    $labels = array(
        'name' => _x('Categorías de Plantas', 'Taxonomy General Name', 'ileben-landing'),
        'singular_name' => _x('Categoría de Planta', 'Taxonomy Singular Name', 'ileben-landing'),
        'menu_name' => __('Categorías', 'ileben-landing'),
        'all_items' => __('Todas las Categorías', 'ileben-landing'),
        'edit_item' => __('Editar Categoría', 'ileben-landing'),
        'view_item' => __('Ver Categoría', 'ileben-landing'),
        'update_item' => __('Actualizar Categoría', 'ileben-landing'),
        'add_new_item' => __('Añadir Nueva Categoría', 'ileben-landing'),
        'new_item_name' => __('Nuevo Nombre de Categoría', 'ileben-landing'),
        'search_items' => __('Buscar Categorías', 'ileben-landing'),
        'not_found' => __('No se encontraron categorías', 'ileben-landing'),
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

/**
 * Obtiene las plantas normalizadas: primero desde el CPT 'plantas',
 * y como fallback desde el plugin ileben_plantas (tabla personalizada / repositorio).
 *
 * @param array $options Opciones de filtrado y etiquetas (posts_per_page, filter_categoria, etc.)
 * @return array Lista de plantas con estructura estandarizada para frontend
 */
function ileben_get_plantas_data($options = array()) {
    $posts_per_page        = isset($options['posts_per_page']) ? intval($options['posts_per_page']) : -1;
    $filter_categoria      = isset($options['filter_categoria']) ? trim((string)$options['filter_categoria']) : '';
    $button_label          = isset($options['button_label']) && $options['button_label'] !== '' ? $options['button_label'] : __('Cotizar', 'ileben-landing');
    $disabled_button_label = isset($options['disabled_button_label']) && $options['disabled_button_label'] !== '' ? $options['disabled_button_label'] : __('No disponible', 'ileben-landing');

    $global_cotiza_url = function_exists('get_field') ? (string) get_field('api_cotiza_url', 'option') : '';
    if (empty($global_cotiza_url)) {
        $global_cotiza_url = (string) get_option('options_api_cotiza_url', '');
    }

    // 1. Intentar CPT 'plantas'
    $args = array(
        'post_type'      => 'plantas',
        'post_status'    => 'publish',
        'posts_per_page' => $posts_per_page,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    );

    if (!empty($filter_categoria)) {
        $terms = strpos($filter_categoria, ',') !== false ? array_map('trim', explode(',', $filter_categoria)) : $filter_categoria;
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'categoria_planta',
                'field'    => 'slug',
                'terms'    => $terms,
            ),
        );
    }

    $q = new WP_Query($args);
    $plantas_data = [];

    if ($q->have_posts()) {
        foreach ($q->posts as $post) {
            $pid = $post->ID;
            $gf  = function_exists('get_field');

            $cotizador_activo_raw = $gf ? get_field('cotizador_activo', $pid) : null;
            $link_cotizador       = $gf ? get_field('link_cotizador', $pid) : '';
            if (empty($link_cotizador) && !empty($global_cotiza_url)) {
                $link_cotizador = $global_cotiza_url;
            }

            $salesforce_id = $gf ? get_field('planta_salesforce_id', $pid) : '';
            if (!empty($salesforce_id) && !empty($link_cotizador)) {
                $link_cotizador = add_query_arg('id', $salesforce_id, $link_cotizador);
            }
            if (!empty($link_cotizador) && function_exists('ileben_append_utm_params')) {
                $link_cotizador = ileben_append_utm_params($link_cotizador);
            }

            $planta_dorm         = $gf ? (string) get_field('planta_dormitorio', $pid) : '';
            $planta_bano         = $gf ? (string) get_field('planta_bano', $pid) : '';
            $planta_img_front    = $gf ? (string) get_field('planta_imagen_front', $pid) : '';
            $planta_img_back     = $gf ? (string) get_field('planta_imagen_back', $pid) : '';
            $planta_piso         = $gf ? (string) get_field('planta_piso', $pid) : '';
            $planta_orientacion  = $gf ? (string) get_field('planta_orientacion', $pid) : '';
            $planta_precio_final = $gf ? (string) get_field('planta_precio_final', $pid) : '';
            $planta_superficie   = $gf ? (string) get_field('planta_superficie_total', $pid) : '';

            $thumb_id   = get_post_thumbnail_id($pid);
            $thumb_url  = !empty($thumb_id) ? wp_get_attachment_image_url($thumb_id, 'medium_large') : '';
            $thumb_full = !empty($thumb_id) ? wp_get_attachment_image_url($thumb_id, 'full') : '';

            $primary_image = $planta_img_front ?: ($thumb_url ?: $planta_img_back);
            $primary_image_fallback = $planta_img_back ?: ($thumb_full ?: $primary_image);
            $interior_image = $planta_img_back ?: ($thumb_full ?: $primary_image);

            $dorm_num = explode(' ', trim($planta_dorm))[0];
            $bano_num = explode(' ', trim($planta_bano))[0];

            $plantas_data[] = [
                'id'                  => $pid,
                'title'               => get_the_title($pid),
                'name'                => get_the_title($pid),
                'planta_label'        => get_the_title($pid),
                'dorm_bano'           => ($dorm_num !== '' ? $dorm_num . 'D' : '') . ($bano_num !== '' ? ' - ' . $bano_num . 'B' : ''),
                'superficie_total'    => $planta_superficie,
                'orientacion'         => $planta_orientacion,
                'piso'                => $planta_piso,
                'dorm'                => $planta_dorm,
                'bano'                => $planta_bano,
                'dorm_num'            => $dorm_num,
                'bano_num'            => $bano_num,
                'precio_final'        => $planta_precio_final,
                'img_front'           => $planta_img_front,
                'img_back'            => $planta_img_back,
                'imagen'              => $primary_image,
                'imagen_fallback'     => $primary_image_fallback,
                'imagen_interior'     => $interior_image,
                'cotizacion_url'      => $link_cotizador,
                'link_cotizador'      => $link_cotizador,
                'cotizador_activo'    => is_null($cotizador_activo_raw) ? true : (bool)$cotizador_activo_raw,
                'content'             => wp_strip_all_tags($post->post_content),
                'has_thumbnail'       => !empty($thumb_id),
                'thumb_html'          => !empty($thumb_id) ? get_the_post_thumbnail($pid, 'medium', ['class' => 'img-fluid w-100']) : '',
                'thumb_full_url'      => $thumb_full,
                'buttonLabel'         => $button_label,
                'disabledButtonLabel' => $disabled_button_label,
            ];
        }
        wp_reset_postdata();
        unset($q);
        return $plantas_data;
    }
    unset($q);

    // 2. Fallback: Plugin ileben_plantas
    $plugin_items = [];
    if (class_exists('Ileben_Api_Repository')) {
        $repo = new Ileben_Api_Repository();
        $per_page = $posts_per_page > 0 ? $posts_per_page : 500;
        $res = $repo->query(['estado' => 'disponible'], 1, $per_page);
        if (!empty($res['items'])) {
            $plugin_items = $res['items'];
        }
    } else {
        global $wpdb;
        $table_name = $wpdb->prefix . 'ileben_plantas';
        if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) === $table_name) {
            $limit_sql = $posts_per_page > 0 ? $wpdb->prepare("LIMIT %d", $posts_per_page) : "";
            $plugin_items = $wpdb->get_results("SELECT * FROM {$table_name} WHERE estado = 'disponible' ORDER BY precio ASC {$limit_sql}", ARRAY_A);
        }
    }

    if (!empty($plugin_items)) {
        foreach ($plugin_items as $item) {
            $id       = (int) ($item['id'] ?? 0);
            $nombre   = (string) ($item['nombre'] ?? '');
            $planta_l = (string) ($item['planta_label'] ?? $nombre);
            $dorm_val = isset($item['dormitorios']) ? (int)$item['dormitorios'] : 0;
            $bano_val = isset($item['banos']) ? (int)$item['banos'] : 0;
            $dorm_str = $dorm_val > 0 ? $dorm_val . ' Dormitorio' . ($dorm_val > 1 ? 's' : '') : '';
            $bano_str = $bano_val > 0 ? $bano_val . ' Baño' . ($bano_val > 1 ? 's' : '') : '';

            $piso = (string) ($item['piso'] ?? '');
            if ($piso === '' && preg_match('/(\d{1,4})/', $planta_l, $matches)) {
                $num = (int) $matches[1];
                $piso = $num >= 100 ? (string) floor($num / 100) : (string) $num;
            }

            $img_front = (string) ($item['foto_portada'] ?? '');
            $img_back  = (string) ($item['foto_interior'] ?? '');
            $primary_image = $img_front ?: $img_back;
            $interior_image = $img_back ?: $img_front;

            $cotiza_url = (string) ($item['cotizacion_url'] ?? '');
            if (empty($cotiza_url) && !empty($global_cotiza_url)) {
                $ext_id = (string) ($item['external_id'] ?? '');
                $cotiza_url = $ext_id ? add_query_arg('id', $ext_id, $global_cotiza_url) : $global_cotiza_url;
            }
            if (!empty($cotiza_url) && function_exists('ileben_append_utm_params')) {
                $cotiza_url = ileben_append_utm_params($cotiza_url);
            }

            $precio = (float) ($item['precio_final'] ?? $item['precio'] ?? 0);
            $precio_str = $precio > 0 ? number_format($precio, 2, ',', '.') . ' UF' : '';
            $superficie = (float) ($item['superficie_total'] ?? 0);
            $superficie_str = $superficie > 0 ? number_format($superficie, 2, ',', '.') . ' m²' : '';

            $plantas_data[] = [
                'id'                  => $id,
                'title'               => $nombre,
                'name'                => $nombre,
                'planta_label'        => $planta_l,
                'dorm_bano'           => ($dorm_val > 0 ? $dorm_val . 'D' : '') . ($bano_val > 0 ? ' - ' . $bano_val . 'B' : ''),
                'superficie_total'    => $superficie_str,
                'orientacion'         => (string) ($item['orientacion'] ?? ''),
                'piso'                => $piso,
                'dorm'                => $dorm_str,
                'bano'                => $bano_str,
                'dorm_num'            => $dorm_val > 0 ? (string)$dorm_val : '',
                'bano_num'            => $bano_val > 0 ? (string)$bano_val : '',
                'precio_final'        => $precio_str,
                'img_front'           => $img_front,
                'img_back'            => $img_back,
                'imagen'              => $primary_image,
                'imagen_fallback'     => $interior_image,
                'imagen_interior'     => $interior_image,
                'cotizacion_url'      => $cotiza_url,
                'link_cotizador'      => $cotiza_url,
                'cotizador_activo'    => ($item['estado'] ?? 'disponible') === 'disponible',
                'content'             => (string) ($item['descripcion'] ?? ''),
                'has_thumbnail'       => !empty($primary_image),
                'thumb_html'          => !empty($primary_image) ? '<img src="' . esc_url($primary_image) . '" class="img-fluid w-100" alt="' . esc_attr($nombre) . '" loading="lazy" />' : '',
                'thumb_full_url'      => $primary_image,
                'buttonLabel'         => $button_label,
                'disabledButtonLabel' => $disabled_button_label,
            ];
        }
    }

    return $plantas_data;
}
