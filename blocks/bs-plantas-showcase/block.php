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

    // Obtener datos normalizados: CPT 'plantas' con fallback a plugin ileben_plantas
    $plantas_data = function_exists('ileben_get_plantas_data') ? ileben_get_plantas_data([
        'posts_per_page'        => $posts_per_page,
        'filter_categoria'      => $filterCategoria,
        'button_label'          => $buttonLabel,
        'disabled_button_label' => $disabledButtonLabel,
    ]) : [];

    $piso_choices  = [];
    $orientacion_choices = [];
    $dorm_choices  = [];
    $bano_choices  = [];

    foreach ($plantas_data as $p) {
        $dorm_key = trim($p['dorm']);
        if ($dorm_key !== '' && !isset($dorm_choices[$dorm_key])) {
            $dorm_choices[$dorm_key] = $p['dorm'];
        }
        $bano_key = trim($p['bano']);
        if ($bano_key !== '' && !isset($bano_choices[$bano_key])) {
            $bano_choices[$bano_key] = $p['bano'];
        }
        $piso_val = $p['piso'];
        if ($piso_val !== '' && $piso_val !== null && !isset($piso_choices[$piso_val])) {
            $piso_choices[$piso_val] = 'Piso ' . $piso_val;
        }
        $orient_val = $p['orientacion'];
        if ($orient_val !== '' && $orient_val !== null && !isset($orientacion_choices[$orient_val])) {
            $orientacion_choices[$orient_val] = $orient_val;
        }
    }

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
