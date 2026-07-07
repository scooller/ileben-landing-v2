<?php
/**
 * Generador de Página Showcase para revisión de bloques.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Agrega el botón "Generar Showcase" a la barra de administración.
 */
function ileben_add_showcase_admin_bar_node($wp_admin_bar)
{
    // Solo visible para administradores/editores
    if (!current_user_can('edit_pages')) {
        return;
    }

    $url = wp_nonce_url(
        admin_url('admin-post.php?action=ileben_generate_showcase'),
        'ileben_generate_showcase_action'
    );

    $wp_admin_bar->add_node([
        'id'    => 'ileben-showcase-generator',
        'title' => '<span class="ab-icon" style="margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20" fill="currentColor"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 240-64 0 0-240-384 0 0 240-64 0 0-240zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2 0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg></span> ' . __('Generar Showcase', 'ileben-landing'),
        'href'  => $url,
        'meta'  => [
            'title' => __('Crea una página en borrador con todos los bloques', 'ileben-landing'),
        ]
    ]);
}
add_action('admin_bar_menu', 'ileben_add_showcase_admin_bar_node', 999);

/**
 * Procesa la creación de la página Showcase
 */
function ileben_handle_generate_showcase()
{
    if (!current_user_can('edit_pages')) {
        wp_die(__('No tienes permisos para realizar esta acción.', 'ileben-landing'));
    }

    check_admin_referer('ileben_generate_showcase_action');

    $content = <<<HTML
<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center">Showcase de Bloques ileben-landing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Bienvenido al showcase. Aquí puedes inspeccionar las opciones de los bloques en el panel derecho.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">1. Componentes Básicos</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:bootstrap-theme/bs-card -->
<!-- wp:paragraph -->
<p>Este es un bloque Card simple.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-card -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:bootstrap-theme/bs-alert {"variant":"info"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de información.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-button-group -->
<!-- wp:bootstrap-theme/bs-button {"variant":"primary","text":"Botón Primario"} /-->
<!-- wp:bootstrap-theme/bs-button {"variant":"outline-secondary","text":"Outline"} /-->
<!-- /wp:bootstrap-theme/bs-button-group -->

<!-- wp:paragraph -->
<p>Badge: <!-- wp:bootstrap-theme/bs-badge {"text":"Nuevo","variant":"success"} /--></p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">2. Interacción y Acordeones</h2>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-accordion -->
<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 1"} -->
<!-- wp:paragraph -->
<p>Contenido del acordeón 1.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-accordion-item -->
<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 2"} -->
<!-- wp:paragraph -->
<p>Contenido del acordeón 2.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-accordion-item -->
<!-- /wp:bootstrap-theme/bs-accordion -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">3. Bloques Inmobiliarios Avanzados</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Plantas Showcase</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-plantas-showcase /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Plantas Slider</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-plantas-slider /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Masterplan Interactivo</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-interactive-masterplan -->
<!-- wp:bootstrap-theme/bs-masterplan-hotspot {"top":50,"left":50,"tooltipContent":"Prueba tooltip"} /-->
<!-- /wp:bootstrap-theme/bs-interactive-masterplan -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Amenities</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-amenities -->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Piscina","icon":"fa-solid fa-swimming-pool"} /-->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Gimnasio","icon":"fa-solid fa-dumbbell"} /-->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Quincho","icon":"fa-solid fa-fire"} /-->
<!-- /wp:bootstrap-theme/bs-amenities -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Avance de Obra</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-construction-progress-v2 -->
<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Excavación","percentage":100} /-->
<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Obra Gruesa","percentage":50} /-->
<!-- wp:bootstrap-theme/bs-construction-stage {"title":"Terminaciones","percentage":0} /-->
<!-- /wp:bootstrap-theme/bs-construction-progress-v2 -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Asesores</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-asesores /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Entorno</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-entorno -->
<!-- wp:bootstrap-theme/bs-entorno-category {"title":"Educación","icon":"fa-solid fa-graduation-cap"} -->
<!-- wp:bootstrap-theme/bs-entorno-poi {"title":"Colegio Mayor","distance":"5 min"} /-->
<!-- wp:bootstrap-theme/bs-entorno-poi {"title":"Universidad Andrés Bello","distance":"10 min"} /-->
<!-- /wp:bootstrap-theme/bs-entorno-category -->
<!-- /wp:bootstrap-theme/bs-entorno -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->
HTML;

    // Crear la página en estado borrador
    $post_id = wp_insert_post([
        'post_title'   => 'Showcase de Bloques - ' . date('d/m/Y H:i'),
        'post_content' => $content,
        'post_status'  => 'draft',
        'post_type'    => 'page',
    ]);

    if (!is_wp_error($post_id)) {
        // Redirigir al editor de la nueva página
        wp_redirect(get_edit_post_link($post_id, 'raw'));
        exit;
    } else {
        wp_die(__('Error al crear la página showcase.', 'ileben-landing'));
    }
}
add_action('admin_post_ileben_generate_showcase', 'ileben_handle_generate_showcase');
