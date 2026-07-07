<?php

/**
 * Block: Plantas Slider (Swiper)
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_plantas_slider($attributes, $content, $block)
{
    static $is_rendering = false;
    if ($is_rendering) {
        return ''; // Prevents infinite recursion if a Planta post contains this block
    }
    $is_rendering = true;

    $posts_per_page = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : -1;
    $showThumbnail = !empty($attributes['showThumbnail']);
    $buttonLabel = isset($attributes['buttonLabel']) && $attributes['buttonLabel'] !== '' ? sanitize_text_field($attributes['buttonLabel']) : __('Cotizar', 'ileben-landing');
    $disabledButtonLabel = isset($attributes['disabledButtonLabel']) && $attributes['disabledButtonLabel'] !== '' ? sanitize_text_field($attributes['disabledButtonLabel']) : __('No disponible', 'ileben-landing');
    $slidesPerView = isset($attributes['slidesPerView']) ? trim((string)$attributes['slidesPerView']) : '';
    $slidesPerView = $slidesPerView !== '' ? str_replace(',', '.', $slidesPerView) : '';

    // Viewport-specific slides per view
    $slidesPerViewMobile = isset($attributes['slidesPerViewMobile']) ? str_replace(',', '.', trim((string)$attributes['slidesPerViewMobile'])) : '1';
    $slidesPerViewTablet = isset($attributes['slidesPerViewTablet']) ? str_replace(',', '.', trim((string)$attributes['slidesPerViewTablet'])) : '1.5';
    $slidesPerViewDesktop = isset($attributes['slidesPerViewDesktop']) ? str_replace(',', '.', trim((string)$attributes['slidesPerViewDesktop'])) : '3';

    // Navigation options
    $navigationArrows = !empty($attributes['navigationArrows']);
    $paginationType = isset($attributes['paginationType']) ? sanitize_text_field($attributes['paginationType']) : 'bullets';

    // Effect and centering options
    $centered = !empty($attributes['centered']);
    $effect = isset($attributes['effect']) ? sanitize_text_field($attributes['effect']) : 'slide';
    $loop = !empty($attributes['loop']);

    // Show filters option
    $showFilters = !empty($attributes['showFilters']);

    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    // Allow front-end filters via query params overriding block attributes
    $filterDormitorio = isset($_GET['planta_dormitorio']) ? sanitize_text_field(wp_unslash($_GET['planta_dormitorio'])) : (isset($attributes['filterDormitorio']) ? trim((string)$attributes['filterDormitorio']) : '');
    $filterBano = isset($_GET['planta_bano']) ? sanitize_text_field(wp_unslash($_GET['planta_bano'])) : (isset($attributes['filterBano']) ? trim((string)$attributes['filterBano']) : '');
    $filterPiso = isset($_GET['planta_piso']) ? sanitize_text_field(wp_unslash($_GET['planta_piso'])) : (isset($attributes['filterPiso']) ? trim((string)$attributes['filterPiso']) : '');
    $filterOrientacion = isset($_GET['planta_orientacion']) ? sanitize_text_field(wp_unslash($_GET['planta_orientacion'])) : (isset($attributes['filterOrientacion']) ? trim((string)$attributes['filterOrientacion']) : '');
    $filterCategoria = isset($attributes['filterCategoria']) ? trim((string)$attributes['filterCategoria']) : '';

    // Advanced filters toggle
    $showAdvancedFilters = !empty($attributes['showAdvancedFilters']);

    // Options for filters (from ACF options page)
    $dorm_choices = function_exists('ileben_build_choices_from_options_repeater') ? ileben_build_choices_from_options_repeater('dormitorios') : [];
    $bano_choices = function_exists('ileben_build_choices_from_options_repeater') ? ileben_build_choices_from_options_repeater('banos') : [];

    $args = array(
        'post_type' => 'plantas',
        'post_status' => 'publish',
        'posts_per_page' => $posts_per_page,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    );

    // Aplicar filtro de categoría si está seleccionado (solo en backend/bloque)
    if (!empty($filterCategoria)) {
        $terms = strpos($filterCategoria, ',') !== false ? array_map('trim', explode(',', $filterCategoria)) : $filterCategoria;
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'categoria_planta',
                'field' => 'slug',
                'terms' => $terms,
            ),
        );
    }

    // No aplicar filtros en el backend, se filtrarán en el frontend con JS
    $q = new WP_Query($args);
    if (!$q->have_posts()) {
        $is_rendering = false;
        return '';
    }

    // ── Pre-load all post data + ACF fields in a SINGLE pass ──
    // This avoids redundant get_field()/DB calls during the render loop.
    $plantas_data = [];
    $piso_choices = [];
    $orientacion_choices = [];

    foreach ($q->posts as $post) {
        $pid = $post->ID;
        $gf = function_exists('get_field');

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

        // Collect filter choices during the same loop
        if ($planta_piso !== '' && $planta_piso !== null && !isset($piso_choices[$planta_piso])) {
            $piso_choices[$planta_piso] = 'Piso ' . $planta_piso;
        }
        if ($planta_orientacion !== '' && $planta_orientacion !== null && !isset($orientacion_choices[$planta_orientacion])) {
            $orientacion_choices[$planta_orientacion] = $planta_orientacion;
        }

        $thumb_id = get_post_thumbnail_id($pid);
        $plantas_data[] = [
            'id'                  => $pid,
            'title'               => get_the_title($pid),
            'content'             => wpautop(wp_kses_post($post->post_content)),
            'cotizador_activo'    => is_null($cotizador_activo_raw) ? true : (bool)$cotizador_activo_raw,
            'link_cotizador'      => $link_cotizador,
            'dorm'                => $planta_dorm,
            'bano'                => $planta_bano,
            'dorm_num'            => explode(' ', $planta_dorm)[0],
            'bano_num'            => explode(' ', $planta_bano)[0],
            'img_front'           => $planta_img_front,
            'img_back'            => $planta_img_back,
            'piso'                => $planta_piso,
            'orientacion'         => $planta_orientacion,
            'precio_final'        => $planta_precio_final,
            'superficie_total'    => $planta_superficie,
            'has_thumbnail'       => !empty($thumb_id),
            'thumb_html'          => !empty($thumb_id) ? get_the_post_thumbnail($pid, 'medium', ['class' => 'img-fluid w-100']) : '',
            'thumb_full_url'      => !empty($thumb_id) ? wp_get_attachment_image_url($thumb_id, 'full') : '',
        ];
    }
    wp_reset_postdata();

    // Liberar la memoria del WP_Query (ya tenemos todo en $plantas_data)
    unset($q);

    ksort($piso_choices, SORT_NUMERIC);
    ksort($orientacion_choices);

    $gallery_id = function_exists('wp_unique_id') ? wp_unique_id('plantas-slider-') : uniqid('plantas-slider-');

    // Add custom classes from block attributes (Gutenberg className)
    $data_attrs = '';
    if ($slidesPerView !== '') {
        $data_attrs .= ' data-swiper-slides="' . esc_attr($slidesPerView) . '"';
    }
    $data_attrs .= ' data-swiper-slides-mobile="' . esc_attr($slidesPerViewMobile) . '"';
    $data_attrs .= ' data-swiper-slides-tablet="' . esc_attr($slidesPerViewTablet) . '"';
    $data_attrs .= ' data-swiper-slides-desktop="' . esc_attr($slidesPerViewDesktop) . '"';
    $data_attrs .= ' data-swiper-nav-arrows="' . ($navigationArrows ? 'true' : 'false') . '"';
    $data_attrs .= ' data-swiper-pagination-type="' . esc_attr($paginationType) . '"';
    $data_attrs .= ' data-swiper-effect="' . esc_attr($effect) . '"';
    $data_attrs .= ' data-swiper-centered="' . ($centered ? 'true' : 'false') . '"';
    $data_attrs .= ' data-swiper-loop="' . ($loop ? 'true' : 'false') . '"';

    ob_start();

    // Front-end filters UI
?>
    <div class="bs-plantas-filters-wrapper" <?php echo $animation_attrs; ?>
        data-block-attrs="<?php echo esc_attr(wp_json_encode([
                                'postsPerPage' => $posts_per_page,
                                'showThumbnail' => $showThumbnail,
                                'buttonLabel' => $buttonLabel,
                                'disabledButtonLabel' => $disabledButtonLabel,
                                'slidesPerViewMobile' => $slidesPerViewMobile,
                                'slidesPerViewTablet' => $slidesPerViewTablet,
                                'slidesPerViewDesktop' => $slidesPerViewDesktop,
                                'navigationArrows' => $navigationArrows,
                                'paginationType' => $paginationType,
                                'centered' => $centered,
                                'effect' => $effect,
                                'showFilters' => $showFilters,
                                'showAdvancedFilters' => $showAdvancedFilters
                            ])); ?>">
        <?php if ($showFilters) : ?>
            <form class="bs-plantas-filters row g-3 mb-3 text-center text-md-start" data-ajax-filter>
                <div class="col-12 col-md-6">
                    <label class="form-label"><?php echo esc_html__('Dormitorios', 'ileben-landing'); ?></label>
                    <select class="form-select" name="planta_dormitorio" data-filter-select>
                        <option value=""><?php echo esc_html__('Todos', 'ileben-landing'); ?></option>
                        <?php foreach ($dorm_choices as $value => $label) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterDormitorio, $value, false); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label"><?php echo esc_html__('Baños', 'ileben-landing'); ?></label>
                    <select class="form-select" name="planta_bano" data-filter-select>
                        <option value=""><?php echo esc_html__('Todos', 'ileben-landing'); ?></option>
                        <?php foreach ($bano_choices as $value => $label) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterBano, $value, false); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <?php if ($showAdvancedFilters) : ?>
                    <div class="col-12 col-md-6">
                        <label class="form-label"><?php echo esc_html__('Piso', 'ileben-landing'); ?></label>
                        <select class="form-select" name="planta_piso" data-filter-select>
                            <option value=""><?php echo esc_html__('Todos', 'ileben-landing'); ?></option>
                            <?php foreach ($piso_choices as $value => $label) : ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterPiso, $value, false); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label"><?php echo esc_html__('Orientación', 'ileben-landing'); ?></label>
                        <select class="form-select" name="planta_orientacion" data-filter-select>
                            <option value=""><?php echo esc_html__('Todas', 'ileben-landing'); ?></option>
                            <?php foreach ($orientacion_choices as $value => $label) : ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterOrientacion, $value, false); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                <?php endif; ?>
            </form>
        <?php endif; ?>

        <div class="bs-plantas-slider-container <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>">
            <div class="swiper js-swiper" <?php echo $data_attrs; ?> data-slider-id="<?php echo esc_attr($gallery_id); ?>">
                <div class="swiper-wrapper">
                    <?php
                    foreach ($plantas_data as $p) :
                        $cotizador_activo = $p['cotizador_activo'];
                        $link_cotizador = $p['link_cotizador'];
                        $content_html = $p['content'];
                        $planta_dorm = $p['dorm'];
                        $planta_bano = $p['bano'];
                        $planta_dorm_num = $p['dorm_num'];
                        $planta_bano_num = $p['bano_num'];
                        $planta_img_front = $p['img_front'];
                        $planta_img_back  = $p['img_back'];
                        $planta_piso = $p['piso'];
                        $planta_orientacion = $p['orientacion'];
                        $planta_precio_final = $p['precio_final'];
                        $planta_superficie_total = $p['superficie_total'];

                        // Resolver thumbnail
                        $thumb_html = '';
                        $full_url   = '';
                        if ($p['has_thumbnail']) {
                            $full_url = $p['thumb_full_url'];
                            $thumb_html = $p['thumb_html'];
                        } elseif (!empty($planta_img_back)) {
                            $full_url = $planta_img_back;
                            $thumb_html = '<img src="' . esc_url($planta_img_back) . '" class="img-fluid w-100" alt="' . esc_attr($p['title']) . '" loading="lazy" />';
                        } elseif (!empty($planta_img_front)) {
                            $full_url = $planta_img_front;
                            $thumb_html = '<img src="' . esc_url($planta_img_front) . '" class="img-fluid w-100" alt="' . esc_attr($p['title']) . '" loading="lazy" />';
                        }

                        $titulo = esc_html($p['title']);
                        if (!empty($planta_dorm_num) || !empty($planta_bano_num)) {
                            $titulo .= ' | ' . esc_html($planta_dorm_num) . 'D-' . esc_html($planta_bano_num) . 'B';
                        }
                    ?>
                        <div data-post-id="<?php echo esc_attr($p['id']); ?>" data-bano="<?php echo esc_attr($planta_bano); ?>" data-dorm="<?php echo esc_attr($planta_dorm); ?>" data-piso="<?php echo esc_attr($planta_piso); ?>" data-orientacion="<?php echo esc_attr($planta_orientacion); ?>" data-precio="<?php echo esc_attr($planta_precio_final); ?>" data-superficie="<?php echo esc_attr($planta_superficie_total); ?>" class="swiper-slide">
                            <article class="card h-100">
                                <?php
                                if ($showThumbnail && $thumb_html) :
                                ?>
                                    <div class="card-img-top">
                                        <a href="<?php echo esc_url($full_url); ?>" data-fancybox="<?php echo esc_attr($gallery_id); ?>" data-caption="<?php echo esc_html($p['title']); ?> | <?php echo esc_html($planta_dorm_num); ?>D-<?php echo esc_html($planta_bano_num); ?>B <?php echo esc_html(strip_tags($content_html)); ?>">
                                            <?php echo $thumb_html; ?>
                                        </a>
                                    </div>
                                <?php
                                endif;
                                ?>
                                <div class="card-body text-center">
                                    <h3 class="card-title"><?php echo esc_html($titulo); ?></h3>
                                    <div class="card-text">
                                        <?php echo wp_kses_post($content_html); ?>
                                    </div>
                                    <?php
                                    if (!$cotizador_activo) :
                                    ?>
                                        <button class="btn btn-secondary btn-cotiza" type="button" disabled aria-disabled="true"><?php echo esc_html($disabledButtonLabel); ?></button>
                                    <?php
                                    elseif ($link_cotizador) :
                                    ?>
                                        <a class="btn btn-primary btn-cotiza" href="<?php echo esc_url($link_cotizador); ?>" target="_blank" rel="noopener"><?php echo esc_html($buttonLabel); ?></a>
                                    <?php
                                    endif;
                                    ?>
                                </div>
                            </article>
                        </div>
                    <?php
                    endforeach;
                    ?>
                </div><!-- .swiper-wrapper -->
            </div><!-- .swiper -->
            <!-- Add Pagination / Scrollbar and Navigation outside swiper -->
            <?php if ($paginationType !== 'none' && $paginationType !== 'scrollbar') : ?>
                <div class="swiper-pagination swiper-pagination-<?php echo esc_attr($gallery_id); ?>"></div>
            <?php endif; ?>
            <?php if ($paginationType === 'scrollbar') : ?>
                <div class="swiper-scrollbar swiper-scrollbar-<?php echo esc_attr($gallery_id); ?>"></div>
            <?php endif; ?>
            <?php if ($navigationArrows) : ?>
                <div class="swiper-button-prev swiper-button-prev-<?php echo esc_attr($gallery_id); ?>"></div>
                <div class="swiper-button-next swiper-button-next-<?php echo esc_attr($gallery_id); ?>"></div>
            <?php endif; ?>
        </div><!-- .bs-plantas-slider-container -->
    </div><!-- .bs-plantas-filters-wrapper -->
<?php
    $is_rendering = false;
    return ob_get_clean();
}

function bootstrap_theme_register_bs_plantas_slider()
{
    register_block_type('bootstrap-theme/bs-plantas-slider', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_plantas_slider',
        'attributes' => array(
            'postsPerPage' => array('type' => 'number', 'default' => -1),
            'showThumbnail' => array('type' => 'boolean', 'default' => true),
            'buttonLabel' => array('type' => 'string', 'default' => __('Cotizar', 'ileben-landing')),
            'disabledButtonLabel' => array('type' => 'string', 'default' => __('No disponible', 'ileben-landing')),
            'slidesPerView' => array('type' => 'string', 'default' => ''),
            'slidesPerViewMobile' => array('type' => 'string', 'default' => '1'),
            'slidesPerViewTablet' => array('type' => 'string', 'default' => '1.5'),
            'slidesPerViewDesktop' => array('type' => 'string', 'default' => '3'),
            'navigationArrows' => array('type' => 'boolean', 'default' => true),
            'paginationType' => array('type' => 'string', 'default' => 'bullets'),
            'centered' => array('type' => 'boolean', 'default' => false),
            'effect' => array('type' => 'string', 'default' => 'slide'),
            'loop' => array('type' => 'boolean', 'default' => true),
            'showFilters' => array('type' => 'boolean', 'default' => true),
            'showAdvancedFilters' => array('type' => 'boolean', 'default' => false),
            'filterDormitorio' => array('type' => 'string', 'default' => ''),
            'filterBano' => array('type' => 'string', 'default' => ''),
            'filterPiso' => array('type' => 'string', 'default' => ''),
            'filterOrientacion' => array('type' => 'string', 'default' => ''),
            'filterCategoria' => array('type' => 'string', 'default' => ''),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_plantas_slider');
