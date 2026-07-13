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
<!-- wp:bootstrap-theme/bs-card {"link":"","target":"_self","image":"https://placehold.co/600x400/eeeeee/999999.jpg?text=Card+Image","imageAlt":"Placeholder","title":"Título de la Tarjeta","subtitle":"Subtítulo de ejemplo"} -->
<!-- wp:paragraph -->
<p>Este es un texto descriptivo de la tarjeta de ejemplo. Puedes agregar cualquier bloque aquí adentro como contenido.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-card -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:bootstrap-theme/bs-alert {"variant":"info"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de información (Info).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"success"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de éxito (Success).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"warning"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de advertencia (Warning).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-alert {"variant":"danger"} -->
<!-- wp:paragraph -->
<p>Este es un Alert de error (Danger).</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-alert -->

<!-- wp:bootstrap-theme/bs-button-group -->
<!-- wp:bootstrap-theme/bs-button {"variant":"primary","text":"Botón Primario"} /-->
<!-- wp:bootstrap-theme/bs-button {"variant":"secondary","text":"Secundario"} /-->
<!-- wp:bootstrap-theme/bs-button {"variant":"outline-primary","text":"Outline"} /-->
<!-- /wp:bootstrap-theme/bs-button-group -->

<!-- wp:paragraph -->
<p>Badges Normales:</p>
<!-- /wp:paragraph -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Primary","variant":"primary"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-primary">Primary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Secondary","variant":"secondary"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-secondary">Secondary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Success","variant":"success"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-success">Success</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Danger","variant":"danger"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-danger">Danger</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Warning","variant":"warning"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-warning">Warning</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Info","variant":"info"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-info">Info</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Light","variant":"light"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-light">Light</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Dark","variant":"dark"} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-dark">Dark</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->

<!-- wp:paragraph -->
<p>Badges Pill:</p>
<!-- /wp:paragraph -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Pill Primary","variant":"primary","pill":true} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-primary rounded-pill">Pill Primary</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- wp:bootstrap-theme/bs-badge {"text":"Pill Success","variant":"success","pill":true} -->
<div class="wp-block-bootstrap-theme-bs-badge"><span class="badge bg-success rounded-pill">Pill Success</span></div>
<!-- /wp:bootstrap-theme/bs-badge -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">2. Navegación y Listas</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Breadcrumb</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-breadcrumb -->
<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Inicio","href":"#"} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item"><a href="#"><span>Inicio</span></a></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->
<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Proyectos","href":"#"} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item"><a href="#"><span>Proyectos</span></a></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->
<!-- wp:bootstrap-theme/bs-breadcrumb-item {"text":"Actual","active":true} -->
<li class="wp-block-bootstrap-theme-bs-breadcrumb-item breadcrumb-item active" aria-current="page"><span>Actual</span></li>
<!-- /wp:bootstrap-theme/bs-breadcrumb-item -->
<!-- /wp:bootstrap-theme/bs-breadcrumb -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Paginación</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-pagination -->
<!-- wp:bootstrap-theme/bs-pagination-item {"text":"Anterior","href":"#","disabled":true} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item disabled"><span class="page-link"><span>Anterior</span></span></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->
<!-- wp:bootstrap-theme/bs-pagination-item {"text":"1","href":"#","active":true} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item active" aria-current="page"><a class="page-link" href="#"><span>1</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->
<!-- wp:bootstrap-theme/bs-pagination-item {"text":"2","href":"#"} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item"><a class="page-link" href="#"><span>2</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->
<!-- wp:bootstrap-theme/bs-pagination-item {"text":"Siguiente","href":"#"} -->
<li class="wp-block-bootstrap-theme-bs-pagination-item page-item"><a class="page-link" href="#"><span>Siguiente</span></a></li>
<!-- /wp:bootstrap-theme/bs-pagination-item -->
<!-- /wp:bootstrap-theme/bs-pagination -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">List Group</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-list-group -->
<!-- wp:bootstrap-theme/bs-list-group-item {"text":"Elemento 1 de la lista"} -->
<li class="wp-block-bootstrap-theme-bs-list-group-item list-group-item"><span>Elemento 1 de la lista</span></li>
<!-- /wp:bootstrap-theme/bs-list-group-item -->
<!-- wp:bootstrap-theme/bs-list-group-item {"text":"Elemento 2 de la lista"} -->
<li class="wp-block-bootstrap-theme-bs-list-group-item list-group-item"><span>Elemento 2 de la lista</span></li>
<!-- /wp:bootstrap-theme/bs-list-group-item -->
<!-- /wp:bootstrap-theme/bs-list-group -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">3. Interacción y Acordeones</h2>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-accordion {"accordionId":"accordion-showcase"} -->
<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 1","itemId":"showcase-1"} -->
<div class="wp-block-bootstrap-theme-bs-accordion-item accordion-item"><h2 class="accordion-header" id="heading-showcase-1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-showcase-1" aria-expanded="false" aria-controls="collapse-showcase-1"><span>Elemento 1</span></button></h2><div id="collapse-showcase-1" class="accordion-collapse collapse" aria-labelledby="heading-showcase-1"><div class="accordion-body"><!-- wp:paragraph -->
<p>Contenido del acordeón 1.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:bootstrap-theme/bs-accordion-item -->
<!-- wp:bootstrap-theme/bs-accordion-item {"title":"Elemento 2","itemId":"showcase-2"} -->
<div class="wp-block-bootstrap-theme-bs-accordion-item accordion-item"><h2 class="accordion-header" id="heading-showcase-2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-showcase-2" aria-expanded="false" aria-controls="collapse-showcase-2"><span>Elemento 2</span></button></h2><div id="collapse-showcase-2" class="accordion-collapse collapse" aria-labelledby="heading-showcase-2"><div class="accordion-body"><!-- wp:paragraph -->
<p>Contenido del acordeón 2.</p>
<!-- /wp:paragraph --></div></div></div>
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
<h2 class="wp-block-heading">4. Tabs / Pestañas</h2>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-tabs -->
<!-- wp:bootstrap-theme/bs-navs-tabs {"tabsId":"tabs-showcase"} -->
<!-- wp:bootstrap-theme/bs-tab-pane {"title":"Tab 1","tabId":"tab-1","isActive":true} -->
<!-- wp:paragraph -->
<p>Contenido del Tab 1.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-tab-pane -->
<!-- wp:bootstrap-theme/bs-tab-pane {"title":"Tab 2","tabId":"tab-2"} -->
<!-- wp:paragraph -->
<p>Contenido del Tab 2.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-tab-pane -->
<!-- /wp:bootstrap-theme/bs-navs-tabs -->
<!-- /wp:bootstrap-theme/bs-tabs -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->


<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">5. Carruseles, Galerías e Iframe</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Carrusel Bootstrap</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-carousel -->
<!-- wp:bootstrap-theme/bs-carousel-item {"backgroundImage":{"id":999,"url":"https://placehold.co/1200x600/eeeeee/999999.jpg?text=Slide+1","alt":"Slide 1"},"active":true} -->
<div class="wp-block-bootstrap-theme-bs-carousel-item carousel-item active" style="min-height:400px;--carousel-bg-desktop:url(https://placehold.co/1200x600/eeeeee/999999.jpg?text=Slide+1)"><div class="d-flex align-items-center justify-content-center h-100" style="background-color:rgba(0,0,0,0.3);color:white"><div class="carousel-caption"><!-- wp:paragraph -->
<p>Item 1</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:bootstrap-theme/bs-carousel-item -->
<!-- wp:bootstrap-theme/bs-carousel-item {"backgroundImage":{"id":998,"url":"https://placehold.co/1200x600/cccccc/666666.jpg?text=Slide+2","alt":"Slide 2"}} -->
<div class="wp-block-bootstrap-theme-bs-carousel-item carousel-item" style="min-height:400px;--carousel-bg-desktop:url(https://placehold.co/1200x600/cccccc/666666.jpg?text=Slide+2)"><div class="d-flex align-items-center justify-content-center h-100" style="background-color:rgba(0,0,0,0.3);color:white"><div class="carousel-caption"><!-- wp:paragraph -->
<p>Item 2</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:bootstrap-theme/bs-carousel-item -->
<!-- /wp:bootstrap-theme/bs-carousel -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":12,"marginTop":"mt-5"} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Split Carousel (GSAP Transitions)</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-split-carousel {"carouselId":"split-carousel-showcase","interval":"5000","leftTransition":"fadeLeft","rightTransition":"fadeRight","transitionDuration":0.6,"staggerDelay":0.15} -->
<!-- wp:bootstrap-theme/bs-split-carousel-item {"active":true,"mainImageId":0} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">PUERTO VARAS</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Departamentos con vista al lago Llanquihue</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Proyecto inmobiliario de lujo en el sur de Chile, con amplias superficies y terminaciones de alta calidad.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->
<!-- wp:bootstrap-theme/bs-split-carousel-item {"active":false} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">PUCON</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Vive frente al volcán</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Apartamentos modernos con vista panorámica al Volcán Villarrica y acceso directo a la playa.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->
<!-- wp:bootstrap-theme/bs-split-carousel-item {"active":false} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">SANTIAGO</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"lead text-muted"} -->
<p class="lead text-muted">Diseño urbano contemporáneo</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Departamentos de 2 y 3 ambientes en el corazón del barrio Lastarria, cerca de metro y servicios.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-split-carousel-item -->
<!-- /wp:bootstrap-theme/bs-split-carousel -->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":6} -->
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Galería Fancybox</h4>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-gallery {"images":[{"id":1001,"url":"https://placehold.co/600x400/eeeeee/999999.jpg?text=Galeria+1","thumbnailSize":"medium","columnSpan":1,"rowSpan":1,"customCaption":""},{"id":1002,"url":"https://placehold.co/600x400/cccccc/666666.jpg?text=Galeria+2","thumbnailSize":"medium","columnSpan":1,"rowSpan":1,"customCaption":""}]} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- wp:bootstrap-theme/bs-column {"columnsMd":12,"marginTop":"mt-4"} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Iframe (Mapa)</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-iframe {"url":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.6563095937354!2d-70.6171069!3d-33.432203699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf7c8b1f22e3%3A0xf908cfc82e7848fb!2sDr.%20Manuel%20Barros%20Borgo%C3%B1o%20386%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1783456303101!5m2!1ses!2scl","ratio":"21x9"} /-->
<!-- /wp:bootstrap-theme/bs-column -->

<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->


<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">6. Elementos de Interfaz (Modales, Spinners)</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":4} -->
<!-- wp:bootstrap-theme/bs-modal {"modalId":"modal-showcase-1","title":"Modal de Ejemplo"} -->
<!-- wp:paragraph -->
<p>Contenido del modal.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-modal -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":4} -->
<!-- wp:bootstrap-theme/bs-offcanvas {"offcanvasId":"offcanvas-showcase-1","title":"Offcanvas de Ejemplo"} -->
<!-- wp:paragraph -->
<p>Contenido del offcanvas.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-offcanvas -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":4} -->
<!-- wp:bootstrap-theme/bs-spinner /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">7. Barras de Progreso (Progress)</h2>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-progress {"value":25,"variant":"success"} /-->
<!-- wp:bootstrap-theme/bs-progress {"value":50,"variant":"info","striped":true} /-->
<!-- wp:bootstrap-theme/bs-progress {"value":75,"variant":"warning","striped":true,"animated":true} /-->
<!-- wp:bootstrap-theme/bs-progress {"value":100,"variant":"danger"} /-->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->

<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">8. Sistema de Grillas (Row y Columns)</h2>
<!-- /wp:heading -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-3"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":"4"} -->
<!-- wp:paragraph {"className":"bg-light border p-3 text-center mb-0"} -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":"4"} -->
<!-- wp:paragraph {"className":"bg-light border p-3 text-center mb-0"} -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":"4"} -->
<!-- wp:paragraph {"className":"bg-light border p-3 text-center mb-0"} -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-3"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":"8"} -->
<!-- wp:paragraph {"className":"bg-light border p-3 text-center mb-0"} -->
<p>col-md-8</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":"4"} -->
<!-- wp:paragraph {"className":"bg-light border p-3 text-center mb-0"} -->
<p>col-md-4</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->
<!-- /wp:bootstrap-theme/bs-container -->

<!-- wp:bootstrap-theme/bs-divider {"marginClass":"my-5"} /-->


<!-- wp:bootstrap-theme/bs-container {"fluid":false} -->
<!-- wp:bootstrap-theme/bs-row -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading -->
<h2 class="wp-block-heading">9. Bloques Inmobiliarios Avanzados</h2>
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
<!-- wp:bootstrap-theme/bs-interactive-masterplan {"imageUrl":"https://placehold.co/1200x800/eeeeee/999999.jpg?text=Masterplan+Showcase"} -->
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
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Piscina","iconType":"icon","icon":"fa-solid fa-swimming-pool"} /-->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Gimnasio","iconType":"icon","icon":"fa-solid fa-dumbbell"} /-->
<!-- wp:bootstrap-theme/bs-amenity-item {"title":"Quincho","iconType":"icon","icon":"fa-solid fa-fire"} /-->
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
<!-- wp:bootstrap-theme/bs-entorno {"mapType":"iframe","mapIframeUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.6563095937354!2d-70.6171069!3d-33.432203699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf7c8b1f22e3%3A0xf908cfc82e7848fb!2sDr.%20Manuel%20Barros%20Borgo%C3%B1o%20386%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1783456303101!5m2!1ses!2scl"} -->
<!-- wp:bootstrap-theme/bs-entorno-category {"title":"Educación","icon":"fa-solid fa-graduation-cap"} -->
<!-- wp:bootstrap-theme/bs-entorno-poi {"name":"Colegio Mayor","details":"5 min"} /-->
<!-- wp:bootstrap-theme/bs-entorno-poi {"name":"Universidad Andrés Bello","details":"10 min"} /-->
<!-- /wp:bootstrap-theme/bs-entorno-category -->
<!-- /wp:bootstrap-theme/bs-entorno -->
<!-- /wp:bootstrap-theme/bs-column -->
<!-- /wp:bootstrap-theme/bs-row -->

<!-- wp:bootstrap-theme/bs-row {"marginTop":"mt-4"} -->
<!-- wp:bootstrap-theme/bs-column {"columnsMd":12} -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Pasos (Steps)</h3>
<!-- /wp:heading -->
<!-- wp:bootstrap-theme/bs-steps -->
<!-- wp:bootstrap-theme/bs-step-item {"title":"Paso 1"} -->
<!-- wp:paragraph -->
<p>Contenido paso 1.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-step-item -->
<!-- wp:bootstrap-theme/bs-step-item {"title":"Paso 2"} -->
<!-- wp:paragraph -->
<p>Contenido paso 2.</p>
<!-- /wp:paragraph -->
<!-- /wp:bootstrap-theme/bs-step-item -->
<!-- /wp:bootstrap-theme/bs-steps -->
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
