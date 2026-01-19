<?php

/**
 * Gallery Block - CSS Grid + Lightbox
 */

if (! defined('ABSPATH')) {
    exit;
}

// Enqueue gallery scripts and styles
function ileben_enqueue_gallery_assets()
{
    wp_enqueue_script(
        'ileben-gallery-filter',
        get_template_directory_uri() . '/blocks/bs-gallery/gallery-filter.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
    wp_enqueue_style(
        'ileben-gallery-hover',
        get_template_directory_uri() . '/blocks/bs-gallery/hover-effects.css',
        array(),
        wp_get_theme()->get('Version')
    );
    wp_enqueue_style(
        'ileben-gallery-grid',
        get_template_directory_uri() . '/blocks/bs-gallery/grid-layout.css',
        array(),
        rand(), // Forzar recarga durante el desarrollo
    );
}
add_action('wp_enqueue_scripts', 'ileben_enqueue_gallery_assets');

// Register block type
register_block_type(__DIR__ . '/block.json');

/**
 * Dynamic render callback
 */
function ileben_render_bs_gallery($attributes, $content, $block)
{
    // Get attributes
    $images = $attributes['images'] ?? array();
    $columns = absint($attributes['columns'] ?? 3);
    $columns_mobile = absint($attributes['columnsMobile'] ?? 2);
    $lightbox = boolval($attributes['lightbox'] ?? true);
    $gap = sanitize_text_field($attributes['gap'] ?? 'default');
    $hover_effect = sanitize_text_field($attributes['hoverEffect'] ?? 'overlay');
    $filter_categories = boolval($attributes['filterCategories'] ?? false);
    $show_captions = boolval($attributes['showCaptions'] ?? true);
    $overlay_color = sanitize_hex_color($attributes['overlayColor'] ?? '#000000');
    $overlay_opacity = floatval($attributes['overlayOpacity'] ?? 0.5);
    $image_limit = absint($attributes['imageLimit'] ?? 0);
    $className = $attributes['className'] ?? '';

    if (empty($images)) {
        return '<div class="alert alert-info" role="alert">' . __('No images selected', 'bootstrap-theme') . '</div>';
    }

    // Limit images if set
    if ($image_limit > 0) {
        $images = array_slice($images, 0, $image_limit);
    }

    // Get categories from images if filter is enabled
    $all_categories = array();
    $images_by_category = array();
    if ($filter_categories) {
        foreach ($images as $image) {
            $image_id = isset($image['id']) ? absint($image['id']) : 0;
            if (! $image_id) {
                continue;
            }
            $terms = wp_get_object_terms($image_id, 'attachment_category', array('fields' => 'all'));
            if (! is_wp_error($terms) && ! empty($terms)) {
                foreach ($terms as $term) {
                    if (! isset($all_categories[$term->term_id])) {
                        $all_categories[$term->term_id] = $term;
                    }
                }
            }
        }
    }

    // Gap values mapping para CSS Grid
    $gap_values = array(
        'none' => '0',
        'xs' => '0.25rem',
        'small' => '0.5rem',
        'default' => '1rem',
        'medium' => '1.5rem',
        'large' => '2rem',
    );
    $gap_value = $gap_values[$gap] ?? '1rem';

    // Build gallery HTML
    $wrapper_classes = array(
        'gallery-container',
        'gallery-grid-mode',
        $className,
    );

    // Estilos de CSS Grid como variables
    $grid_template_styles = sprintf(
        '--gallery-columns: %d; --gallery-gap: %s; --gallery-columns-mobile: %d;',
        $columns,
        $gap_value,
        $columns_mobile
    );

    ob_start();
?>
    <div class="gallery-wrapper">
        <?php if ($filter_categories && ! empty($all_categories)) : ?>
            <div class="gallery-filters mb-4">
                <button class="gallery-filter-btn active" data-filter="*"><?php esc_html_e('Todas', 'bootstrap-theme'); ?></button>
                <?php foreach ($all_categories as $category) : ?>
                    <button class="gallery-filter-btn" data-filter=".<?php echo esc_attr('cat-' . $category->term_id); ?>">
                        <?php echo esc_html($category->name); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?> gallery-hover-<?php echo esc_attr($hover_effect); ?>"
            style="--gallery-overlay-color: <?php echo esc_attr($overlay_color); ?>; --gallery-overlay-opacity: <?php echo esc_attr($overlay_opacity); ?>; <?php echo esc_attr($grid_template_styles); ?>"
            data-columns="<?php echo esc_attr($columns); ?>"
            data-lightbox="<?php echo esc_attr($lightbox ? 'true' : 'false'); ?>">

            <?php
            $image_index = 0;
            foreach ($images as $image) :
                $image_id = isset($image['id']) ? absint($image['id']) : 0;
                if (! $image_id) {
                    continue;
                }

                // Obtener configuración individual de la imagen
                $img_thumbnail_size = isset($image['thumbnailSize']) ? sanitize_text_field($image['thumbnailSize']) : 'medium';
                $img_column_span = isset($image['columnSpan']) && $image['columnSpan'] > 0 ? absint($image['columnSpan']) : 1;
                $img_row_span = isset($image['rowSpan']) && $image['rowSpan'] > 0 ? absint($image['rowSpan']) : 1;

                // Thumbnail size mapping
                $size_map = array(
                    'thumb'     => 'thumbnail',
                    'medio'     => 'medium',
                    'largo'     => 'large',
                    'completo'  => 'full',
                );
                $img_size = $size_map[$img_thumbnail_size] ?? 'medium';

                $img_src = wp_get_attachment_image_src($image_id, $img_size);
                $img_thumb_src = wp_get_attachment_image_src($image_id, 'thumbnail');
                if (! $img_src) {
                    continue;
                }

                $img_url = $img_src[0];
                $img_thumb_url = $img_thumb_src ? $img_thumb_src[0] : $img_url;
                $img_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '';
                $img_title = get_the_title($image_id) ?: '';
                $img_caption = wp_get_attachment_caption($image_id) ?: '';
                $full_url = wp_get_attachment_image_src($image_id, 'full')[0];
                $custom_caption = isset($image['customCaption']) ? sanitize_text_field($image['customCaption']) : $img_title;
                $display_caption = $custom_caption !== '' ? $custom_caption : $img_caption;

                // Estilos de grid sin forzar relación de aspecto
                $figure_style = sprintf(
                    'grid-column: span %d; grid-row: span %d;',
                    $img_column_span,
                    $img_row_span
                );

                // Build item classes y estilos para Grid
                $item_classes = array(
                    'gallery-item',
                    'overflow-hidden',
                    'gallery-num-' . ($image_index + 1),
                );

                // Agregar estilos de grid span
                $grid_styles = '';
                if (!$enable_masonry) {
                    $grid_styles = sprintf(
                        'grid-column: span %d; grid-row: span %d;',
                        $img_column_span,
                        $img_row_span
                    );
                } else {
                    // Para Masonry, usar las clases de Bootstrap tradicionales basadas en columns global
                    $img_col_class = $col_map[$columns] ?? 'col-md-4';
                    $img_col_mobile_class = $col_mobile_map[$columns_mobile] ?? 'col-6';
                    $item_classes[] = $img_col_mobile_class;
                    $item_classes[] = $img_col_class;
                }

                if (!$enable_masonry) {
                    $item_classes[] = 'position-relative';
                }

                // Add category class if filtering is enabled
                if ($filter_categories) {
                    $terms = wp_get_object_terms($image_id, 'attachment_category', array('fields' => 'ids'));
                    if (! is_wp_error($terms) && ! empty($terms)) {
                        foreach ($terms as $term_id) {
                            $item_classes[] = 'cat-' . $term_id;
                        }
                    }
                }
            ?>

                <figure class="<?php echo esc_attr(implode(' ', $item_classes)); ?>" style="<?php echo esc_attr($figure_style); ?>">
                    <?php if ($lightbox) : ?>
                        <a href="<?php echo esc_url($full_url); ?>"
                            class="gallery-item-link"
                            data-fancybox="gallery"
                            data-thumb="<?php echo esc_url($img_thumb_url); ?>"
                            <?php if ($img_title) : ?>data-caption="<?php echo esc_attr($custom_caption); ?>" <?php endif; ?>>
                        <?php endif; ?>

                        <img src="<?php echo esc_url($img_url); ?>"
                            alt="<?php echo esc_attr($img_alt); ?>"
                            class="gallery-item-img"
                            loading="lazy">

                        <?php if ($lightbox) : ?>
                        </a>
                    <?php endif; ?>

                    <?php if ('overlay' === $hover_effect) : ?>
                        <div class="gallery-overlay">
                            <?php if ($show_captions && ($img_title || $display_caption)) : ?>
                                <div class="gallery-overlay-content">
                                    <div>
                                        <?php if ($img_title) : ?>
                                            <h3><?php echo esc_html($img_title); ?></h3>
                                        <?php endif; ?>
                                        <?php if ($display_caption) : ?>
                                            <p><?php echo esc_html($display_caption); ?></p>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($show_captions && 'overlay' !== $hover_effect && ($img_title || $display_caption)) : ?>
                        <figcaption class="gallery-caption">
                            <?php if ($img_title) : ?>
                                <h4><?php echo esc_html($img_title); ?></h4>
                            <?php endif; ?>
                            <?php if ($display_caption) : ?>
                                <p><?php echo esc_html($display_caption); ?></p>
                            <?php endif; ?>
                        </figcaption>
                    <?php endif; ?>
                </figure>

            <?php
                $image_index++;
            endforeach;
            ?>

        </div><!-- .gallery-grid -->
    </div><!-- .gallery-wrapper -->
<?php
    return ob_get_clean();
}

register_block_type('bootstrap-theme/bs-gallery', array(
    'render_callback' => 'ileben_render_bs_gallery',
    'attributes'      => array(
        'images'              => array(
            'type'  => 'array',
            'items' => array(
                'type'       => 'object',
                'properties' => array(
                    'id'            => array('type' => 'number'),
                    'url'           => array('type' => 'string'),
                    'thumbnailSize' => array('type' => 'string'),
                    'columnSpan'    => array('type' => 'number'),
                    'rowSpan'       => array('type' => 'number'),
                    'customCaption' => array('type' => 'string'),
                ),
            ),
            'default' => array(),
        ),
        'columns'             => array('type' => 'number', 'default' => 3),
        'columnsMobile'       => array('type' => 'number', 'default' => 2),
        'lightbox'            => array('type' => 'boolean', 'default' => true),
        'gap'                 => array('type' => 'string', 'default' => 'default'),
        'hoverEffect'         => array('type' => 'string', 'default' => 'overlay'),
        'crop'                => array('type' => 'boolean', 'default' => true),
        'filterCategories'    => array('type' => 'boolean', 'default' => false),
        'showCaptions'        => array('type' => 'boolean', 'default' => true),
        'overlayColor'        => array('type' => 'string', 'default' => '#000000'),
        'overlayOpacity'      => array('type' => 'number', 'default' => 0.5),
        'imageLimit'          => array('type' => 'number', 'default' => 0),
        'className'           => array('type' => 'string', 'default' => ''),
    ),
));
