<?php

/**
 * Block: Plantas Showcase
 *
 * Renders plantas CPT in a carousel + detail panel + lightbox layout
 * inspired by the ileben_plantas plugin front-end, but using the theme's
 * WP_Query + ACF data pipeline (same as bs-plantas-slider).
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_plantas_showcase($attributes, $content, $block)
{
    static $is_rendering = false;
    if ($is_rendering) {
        return '';
    }
    $is_rendering = true;

    $posts_per_page = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : -1;
    $buttonLabel    = isset($attributes['buttonLabel']) && $attributes['buttonLabel'] !== '' ? sanitize_text_field($attributes['buttonLabel']) : __('Cotizar', 'ileben-landing');
    $disabledButtonLabel = isset($attributes['disabledButtonLabel']) && $attributes['disabledButtonLabel'] !== '' ? sanitize_text_field($attributes['disabledButtonLabel']) : __('No disponible', 'ileben-landing');
    $showFilters    = !empty($attributes['showFilters']);
    $filterCategoria = isset($attributes['filterCategoria']) ? trim((string)$attributes['filterCategoria']) : '';

    // Animation
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    // WP_Query
    $args = array(
        'post_type'      => 'plantas',
        'post_status'    => 'publish',
        'posts_per_page' => $posts_per_page,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    );

    if (!empty($filterCategoria)) {
        $terms = strpos($filterCategoria, ',') !== false ? array_map('trim', explode(',', $filterCategoria)) : $filterCategoria;
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'categoria_planta',
                'field'    => 'slug',
                'terms'    => $terms,
            ),
        );
    }

    $q = new WP_Query($args);
    if (!$q->have_posts()) {
        $is_rendering = false;
        return '';
    }

    // ── Single-pass data loading (same as bs-plantas-slider) ──
    $plantas_data  = [];
    $piso_choices  = [];
    $orientacion_choices = [];
    $dorm_choices  = [];
    $bano_choices  = [];

    foreach ($q->posts as $post) {
        $pid = $post->ID;
        $gf  = function_exists('get_field');

        $cotizador_activo_raw = $gf ? get_field('cotizador_activo', $pid) : null;
        $link_cotizador       = $gf ? get_field('link_cotizador', $pid) : '';

        // Fallback: si el link de cotización está vacío, usar el link global de las opciones del tema
        if (empty($link_cotizador)) {
            $global_cotiza_url = $gf ? get_field('api_cotiza_url', 'option') : '';
            if (empty($global_cotiza_url)) {
                $global_cotiza_url = get_option('options_api_cotiza_url', '');
            }
            if (!empty($global_cotiza_url)) {
                $link_cotizador = $global_cotiza_url;
            }
        }

        // Anexar Salesforce Product ID a la URL de cotización
        $salesforce_id = $gf ? get_field('planta_salesforce_id', $pid) : '';
        if (!empty($salesforce_id) && !empty($link_cotizador)) {
            $link_cotizador = add_query_arg('id', $salesforce_id, $link_cotizador);
        }

        // Anexar parámetros UTM desde cookies (set by utm-tag-leben plugin)
        if (!empty($link_cotizador) && function_exists('ileben_append_utm_params')) {
            $link_cotizador = ileben_append_utm_params($link_cotizador);
        }
        $planta_dorm          = $gf ? get_field('planta_dormitorio', $pid) : '';
        $planta_bano          = $gf ? get_field('planta_bano', $pid) : '';
        $planta_img_front     = $gf ? get_field('planta_imagen_front', $pid) : '';
        $planta_img_back      = $gf ? get_field('planta_imagen_back', $pid) : '';
        $planta_piso          = $gf ? get_field('planta_piso', $pid) : '';
        $planta_orientacion   = $gf ? get_field('planta_orientacion', $pid) : '';
        $planta_precio_final  = $gf ? get_field('planta_precio_final', $pid) : '';
        $planta_superficie    = $gf ? get_field('planta_superficie_total', $pid) : '';

        // Collect filter choices
        $dorm_key = trim($planta_dorm);
        if ($dorm_key !== '' && !isset($dorm_choices[$dorm_key])) {
            $dorm_choices[$dorm_key] = $planta_dorm;
        }
        $bano_key = trim($planta_bano);
        if ($bano_key !== '' && !isset($bano_choices[$bano_key])) {
            $bano_choices[$bano_key] = $planta_bano;
        }
        if ($planta_piso !== '' && $planta_piso !== null && !isset($piso_choices[$planta_piso])) {
            $piso_choices[$planta_piso] = 'Piso ' . $planta_piso;
        }
        if ($planta_orientacion !== '' && $planta_orientacion !== null && !isset($orientacion_choices[$planta_orientacion])) {
            $orientacion_choices[$planta_orientacion] = $planta_orientacion;
        }

        $thumb_id = get_post_thumbnail_id($pid);
        $thumb_url = !empty($thumb_id) ? wp_get_attachment_image_url($thumb_id, 'medium_large') : '';
        $thumb_full = !empty($thumb_id) ? wp_get_attachment_image_url($thumb_id, 'full') : '';

        // Primary image: use front image, fallback to thumbnail, then back image
        $primary_image = '';
        $primary_image_fallback = '';
        if (!empty($planta_img_front)) {
            $primary_image = $planta_img_front;
        } elseif (!empty($thumb_url)) {
            $primary_image = $thumb_url;
        } elseif (!empty($planta_img_back)) {
            $primary_image = $planta_img_back;
        }
        if (!empty($planta_img_back)) {
            $primary_image_fallback = $planta_img_back;
        } elseif (!empty($thumb_full)) {
            $primary_image_fallback = $thumb_full;
        }

        // Interior image (for lightbox): prefer back image, fallback to primary
        $interior_image = '';
        if (!empty($planta_img_back)) {
            $interior_image = $planta_img_back;
        } elseif (!empty($thumb_full)) {
            $interior_image = $thumb_full;
        } elseif (!empty($primary_image)) {
            $interior_image = $primary_image;
        }

        $dorm_num = explode(' ', trim($planta_dorm))[0];
        $bano_num = explode(' ', trim($planta_bano))[0];

        $plantas_data[] = [
            'id'               => $pid,
            'name'             => get_the_title($pid),
            'planta_label'     => get_the_title($pid),
            'dorm_bano'        => ($dorm_num !== '' ? $dorm_num . 'D' : '') . ($bano_num !== '' ? ' - ' . $bano_num . 'B' : ''),
            'superficie_total' => $planta_superficie,
            'orientacion'      => $planta_orientacion,
            'piso'             => $planta_piso,
            'dorm'             => $planta_dorm,
            'bano'             => $planta_bano,
            'precio_final'     => $planta_precio_final,
            'imagen'           => $primary_image,
            'imagen_fallback'  => $primary_image_fallback,
            'imagen_interior'  => $interior_image,
            'cotizacion_url'   => $link_cotizador,
            'cotizador_activo' => is_null($cotizador_activo_raw) ? true : (bool)$cotizador_activo_raw,
            'content'          => wp_strip_all_tags($post->post_content),
            'thumb_html'       => !empty($thumb_id) ? get_the_post_thumbnail($pid, 'medium', ['class' => 'img-fluid w-100']) : '',
            'thumb_full_url'   => $thumb_full,
            'buttonLabel'      => $buttonLabel,
            'disabledButtonLabel' => $disabledButtonLabel,
        ];
    }
    wp_reset_postdata();
    unset($q);

    ksort($piso_choices, SORT_NUMERIC);
    ksort($orientacion_choices);
    ksort($dorm_choices, SORT_NATURAL);
    ksort($bano_choices, SORT_NATURAL);

    $instance_id = function_exists('wp_unique_id') ? wp_unique_id('plantas-showcase-') : uniqid('plantas-showcase-');

    $slider_image_type = isset($attributes['sliderImageType']) ? $attributes['sliderImageType'] : 'portada';

    // Build JSON payload for JS
    $json_payload = wp_json_encode(array_values($plantas_data));

    ob_start();
?>
    <div class="bs-plantas-showcase card shadow-sm position-relative overflow-hidden" id="<?php echo esc_attr($instance_id); ?>" <?php echo $animation_attrs; ?>
        data-showcase-instance="<?php echo esc_attr($instance_id); ?>"
        data-image-type="<?php echo esc_attr($slider_image_type); ?>"
        data-fancybox-group="<?php echo esc_attr($instance_id); ?>">

        <div class="position-absolute top-50 start-50 translate-middle z-3 bg-white bg-opacity-85 rounded px-3 py-2 d-flex align-items-center gap-2 bs-plantas-showcase-loader" aria-hidden="true">
            <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
            <span class="fw-medium">Filtrando...</span>
        </div>

        <div class="card-body">
            <?php if (empty($plantas_data)) : ?>
                <div class="alert alert-light border mb-0">No se encontraron plantas disponibles.</div>
            <?php else : ?>

                <?php if ($showFilters) : ?>
                    <div class="row align-items-center mb-4">
                        <div class="col-md-5 col-12 fw-semibold fs-5">
                            <h2>Selecciona filtro</h2>
                        </div>
                        <div class="col-md-7 col-12 d-flex flex-wrap gap-2">
                            <select class="form-select" data-filter="dorm">
                                <option value="">Todos los dormitorios</option>
                                <?php foreach ($dorm_choices as $value => $label) : ?>
                                    <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <select class="form-select" data-filter="bano">
                                <option value="">Todos los baños</option>
                                <?php foreach ($bano_choices as $value => $label) : ?>
                                    <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <select class="form-select" data-filter="piso">
                                <option value="">Todos los pisos</option>
                                <?php foreach ($piso_choices as $value => $label) : ?>
                                    <option value="<?php echo esc_attr($value); ?>">Piso <?php echo esc_html($value); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <select class="form-select" data-filter="orientacion">
                                <option value="">Todas las orientaciones</option>
                                <?php foreach ($orientacion_choices as $value => $label) : ?>
                                    <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap justify-content-end gap-3 mb-4">
                        <button type="button" class="btn btn-outline-secondary btn-sm" data-action="filter"><i class="fa-solid fa-filter"></i> Filtrar</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm" data-action="reset"><i class="fa-solid fa-rotate-left"></i> Borrar filtros</button>
                    </div>
                <?php endif; ?>

                <div class="row g-4 bs-plantas-showcase-grid">
                    <div class="col-12 col-lg-6">
                        <div id="<?php echo esc_attr($instance_id); ?>-carousel" class="carousel slide" data-bs-ride="false">
                            <div class="carousel-inner rounded box-shadow-5"></div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#<?php echo esc_attr($instance_id); ?>-carousel" data-bs-slide="prev"><i class="fa-solid fa-angle-left"></i></button>
                            <button class="carousel-control-next" type="button" data-bs-target="#<?php echo esc_attr($instance_id); ?>-carousel" data-bs-slide="next"><i class="fa-solid fa-angle-right"></i></button>
                        </div>
                    </div>

                    <div class="col-12 col-lg-6 d-flex align-items-center">
                        <div class="w-100">
                            <p class="text-muted mb-2" data-field="descripcion"></p>
                            <div class="row g-2">
                                <div class="col-6">
                                    <span class="d-block text-muted fw-medium mb-1"><i class="fa-regular fa-building"></i> Planta</span>
                                    <span class="d-block fs-3 fw-semibold" data-field="nombre"></span>
                                </div>
                                <div class="col-6">
                                    <span class="d-block text-muted fw-medium mb-1"><i class="fa-solid fa-restroom"></i> Dorm + Baño</span>
                                    <span class="d-block fs-3 fw-semibold" data-field="dorm_bano"></span>
                                </div>
                                <div class="col-12">
                                    <hr class="my-2">
                                </div>
                                <div class="col-6">
                                    <span class="d-block text-muted fw-medium mb-1"><i class="fa-solid fa-compass"></i> Orientación</span>
                                    <span class="d-block fs-3 fw-semibold" data-field="orientacion"></span>
                                </div>
                                <div class="col-6">
                                    <span class="d-block text-muted fw-medium mb-1"><i class="fa-solid fa-ruler-combined"></i> Superficie total</span>
                                    <span class="d-block fs-3 fw-semibold" data-field="superficie_total"></span>
                                </div>
                                <div class="col-12">
                                    <hr class="my-2">
                                </div>
                                <div class="col-6">
                                    <span class="d-block small text-muted fw-medium mb-1"><i class="fa-solid fa-dollar-sign"></i> Precio</span>
                                    <h2 class="d-block fw-bold" data-field="precio_final"></h2>
                                </div>
                                <div class="col-6 text-end d-flex align-items-end justify-content-end">
                                    <div class="btn-group" role="group" aria-label="Acciones">
                                        <a class="btn btn-primary btn-cotiza" data-field="cotizar_btn" data-bs-toggle="tooltip" data-bs-title="Ir al Cotizador" href="#" target="_blank" rel="noopener">
                                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            <?php echo esc_html($buttonLabel); ?>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">
                        Total plantas: <span class="fw-bold show_plantas"><?php echo count($plantas_data); ?></span>
                    </small>
                    <small class="text-muted"><sup>*</sup> Superficie aproximada</small>
                </div>

                <script type="application/json" id="<?php echo esc_attr($instance_id); ?>-data">
                    <?php echo $json_payload; ?>
                </script>

            <?php endif; ?>
        </div>
    </div>
<?php
    $is_rendering = false;
    return ob_get_clean();
}

function bootstrap_theme_register_bs_plantas_showcase()
{
    register_block_type('bootstrap-theme/bs-plantas-showcase', array(
        'api_version'     => 3,
        'render_callback' => 'bootstrap_theme_render_bs_plantas_showcase',
        'attributes'      => array(
            'postsPerPage'          => array('type' => 'number', 'default' => -1),
            'buttonLabel'           => array('type' => 'string', 'default' => __('Cotizar', 'ileben-landing')),
            'disabledButtonLabel'   => array('type' => 'string', 'default' => __('No disponible', 'ileben-landing')),
            'showFilters'           => array('type' => 'boolean', 'default' => true),
            'filterCategoria'       => array('type' => 'string', 'default' => ''),
            'sliderImageType'       => array('type' => 'string', 'default' => 'portada'),
            // Animation
            'animationType'         => array('type' => 'string'),
            'animationTrigger'      => array('type' => 'string'),
            'animationDuration'     => array('type' => 'number'),
            'animationDelay'        => array('type' => 'number'),
            'animationEase'         => array('type' => 'string'),
            'animationRepeat'       => array('type' => 'number'),
            'animationRepeatDelay'  => array('type' => 'number'),
            'animationYoyo'         => array('type' => 'boolean'),
            'animationDistance'     => array('type' => 'string'),
            'animationRotation'     => array('type' => 'number'),
            'animationScale'        => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect'  => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
        ),
    ));
}
add_action('init', 'bootstrap_theme_register_bs_plantas_showcase');
