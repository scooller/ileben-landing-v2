<?php

/**
 * Block: Plantas Slider (Swiper)
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_plantas_slider($attributes, $content, $block)
{
    $posts_per_page = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : -1;
    $showThumbnail = !empty($attributes['showThumbnail']);
    $buttonLabel = isset($attributes['buttonLabel']) && $attributes['buttonLabel'] !== '' ? sanitize_text_field($attributes['buttonLabel']) : __('Cotizar', 'bootstrap-theme');
    $disabledButtonLabel = isset($attributes['disabledButtonLabel']) && $attributes['disabledButtonLabel'] !== '' ? sanitize_text_field($attributes['disabledButtonLabel']) : __('No disponible', 'bootstrap-theme');
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
    $filterCategoria = isset($attributes['filterCategoria']) ? trim((string)$attributes['filterCategoria']) : '';

    // Options for filters (from ACF options page)
    $dorm_choices = function_exists('ileben_build_choices_from_options_repeater') ? ileben_build_choices_from_options_repeater('dormitorios') : [];
    $bano_choices = function_exists('ileben_build_choices_from_options_repeater') ? ileben_build_choices_from_options_repeater('banos') : [];

    $args = array(
        'post_type' => 'plantas',
        'post_status' => 'publish',
        'posts_per_page' => $posts_per_page,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    // Aplicar filtro de categoría si está seleccionado (solo en backend/bloque)
    if (!empty($filterCategoria)) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'categoria_planta',
                'field' => 'slug',
                'terms' => $filterCategoria,
            ),
        );
    }

    // No aplicar filtros en el backend, se filtrarán en el frontend con JS
    $q = new WP_Query($args);
    if (!$q->have_posts()) {
        return '';
    }

    $gallery_id = function_exists('wp_unique_id') ? wp_unique_id('plantas-slider-') : uniqid('plantas-slider-');

    // Add custom classes from block attributes (Gutenberg className)
    $data_attrs = '';
    if ($slidesPerView !== '') {
        $data_attrs .= ' data-swiper-slides="' . esc_attr($slidesPerView) . '"';
    }
    // Pass viewport-specific slides as data attributes
    $data_attrs .= ' data-swiper-slides-mobile="' . esc_attr($slidesPerViewMobile) . '"';
    $data_attrs .= ' data-swiper-slides-tablet="' . esc_attr($slidesPerViewTablet) . '"';
    $data_attrs .= ' data-swiper-slides-desktop="' . esc_attr($slidesPerViewDesktop) . '"';
    // Pass navigation options
    $data_attrs .= ' data-swiper-nav-arrows="' . ($navigationArrows ? 'true' : 'false') . '"';
    $data_attrs .= ' data-swiper-pagination-type="' . esc_attr($paginationType) . '"';
    // Pass effect and centering options
    $data_attrs .= ' data-swiper-effect="' . esc_attr($effect) . '"';
    $data_attrs .= ' data-swiper-centered="' . ($centered ? 'true' : 'false') . '"';
    $data_attrs .= ' data-swiper-loop="' . ($loop ? 'true' : 'false') . '"';

    ob_start();

    // Front-end filters UI
?>
    <div class="bs-plantas-filters-wrapper"<?php echo $animation_attrs; ?>
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
                                'showFilters' => $showFilters
                            ])); ?>">
        <?php if ($showFilters) : ?>
            <form class="bs-plantas-filters row g-3 mb-3 text-center text-md-start" data-ajax-filter>
                <div class="col-12 col-md-6">
                    <label class="form-label"><?php echo esc_html__('Dormitorios', 'bootstrap-theme'); ?></label>
                    <select class="form-select" name="planta_dormitorio" data-filter-select>
                        <option value=""><?php echo esc_html__('Todos', 'bootstrap-theme'); ?></option>
                        <?php foreach ($dorm_choices as $value => $label) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterDormitorio, $value, false); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label"><?php echo esc_html__('Baños', 'bootstrap-theme'); ?></label>
                    <select class="form-select" name="planta_bano" data-filter-select>
                        <option value=""><?php echo esc_html__('Todos', 'bootstrap-theme'); ?></option>
                        <?php foreach ($bano_choices as $value => $label) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php echo selected($filterBano, $value, false); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </form>
        <?php endif; ?>

        <div class="bs-plantas-slider-container <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>">
            <div class="swiper js-swiper" <?php echo $data_attrs; ?> data-slider-id="<?php echo esc_attr($gallery_id); ?>">
                <div class="swiper-wrapper">
                    <?php
                    while ($q->have_posts()) :
                        $q->the_post();
                        $cotizador_activo_raw = function_exists('get_field') ? get_field('cotizador_activo', get_the_ID()) : null;
                        $cotizador_activo = is_null($cotizador_activo_raw) ? true : (bool)$cotizador_activo_raw;
                        $link_cotizador = function_exists('get_field') ? get_field('link_cotizador', get_the_ID()) : '';
                        $content_html = apply_filters('the_content', get_the_content(null, false, get_the_ID()));
                        $planta_dorm = function_exists('get_field') ? get_field('planta_dormitorio', get_the_ID()) : '';
                        $planta_bano = function_exists('get_field') ? get_field('planta_bano', get_the_ID()) : '';
                        // solo mostrar el numero de dormitorios y baños
                        $planta_dorm_num = explode(' ', $planta_dorm)[0];
                        $planta_bano_num = explode(' ', $planta_bano)[0];
                    ?>
                        <div data-post-id="<?php echo esc_attr(get_the_ID()); ?>" data-bano="<?php echo esc_attr($planta_bano); ?>" data-dorm="<?php echo esc_attr($planta_dorm); ?>" class="swiper-slide">
                            <article class="card h-100">
                                <?php
                                if ($showThumbnail && has_post_thumbnail()) :
                                    $thumbnail_id = get_post_thumbnail_id();
                                    $full_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'full') : '';
                                    $thumb_html = get_the_post_thumbnail(get_the_ID(), 'medium', ['class' => 'img-fluid w-100']);
                                    if ($full_url) :
                                ?>
                                        <div class="card-img-top">
                                            <a href="<?php echo esc_url($full_url); ?>" data-fancybox="<?php echo esc_attr($gallery_id); ?>" data-caption="<?php echo esc_html(get_the_title()); ?> | <?php echo esc_html($planta_dorm_num); ?>D-<?php echo esc_html($planta_bano_num); ?>B <?php echo esc_html(strip_tags($content_html)); ?>">
                                                <?php echo $thumb_html; ?>
                                            </a>
                                        </div>
                                    <?php
                                    else :
                                    ?>
                                        <div class="card-img-top"><?php echo $thumb_html; ?></div>
                                <?php
                                    endif;
                                endif;
                                $titulo = esc_html( get_the_title() );
                                if( !empty( $planta_dorm_num ) || !empty( $planta_bano_num ) ) {
                                    $titulo .= ' | ' . esc_html( $planta_dorm_num ) . 'D-' . esc_html( $planta_bano_num ) . 'B';
                                }
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
                    endwhile;
                    wp_reset_postdata();
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
    return ob_get_clean();
}

function bootstrap_theme_register_bs_plantas_slider()
{
    register_block_type('bootstrap-theme/bs-plantas-slider', array(
        'render_callback' => 'bootstrap_theme_render_bs_plantas_slider',
        'attributes' => array(
            'postsPerPage' => array('type' => 'number', 'default' => -1),
            'showThumbnail' => array('type' => 'boolean', 'default' => true),
            'buttonLabel' => array('type' => 'string', 'default' => __('Cotizar', 'bootstrap-theme')),
            'disabledButtonLabel' => array('type' => 'string', 'default' => __('No disponible', 'bootstrap-theme')),
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
            'filterDormitorio' => array('type' => 'string', 'default' => ''),
            'filterBano' => array('type' => 'string', 'default' => ''),
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
