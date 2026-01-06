<?php
/**
 * Gallery Block - Bootstrap + Masonry
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue gallery scripts and styles
function ileben_enqueue_gallery_assets() {
    // Masonry library
    wp_enqueue_script(
        'masonry-layout',
        'https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js',
        array(),
        '4.2.2',
        true
    );
    
    // imagesLoaded (dependency for Masonry)
    wp_enqueue_script(
        'imagesloaded',
        'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js',
        array(),
        '5.0.0',
        true
    );
    
    wp_enqueue_script(
        'ileben-gallery-filter',
        get_template_directory_uri() . '/blocks/bs-gallery/gallery-filter.js',
        array(),
        wp_get_theme()->get( 'Version' ),
        true
    );
    wp_enqueue_style(
        'ileben-gallery-hover',
        get_template_directory_uri() . '/blocks/bs-gallery/hover-effects.css',
        array(),
        wp_get_theme()->get( 'Version' )
    );
}
add_action( 'wp_enqueue_scripts', 'ileben_enqueue_gallery_assets' );

// Register block type
register_block_type( __DIR__ . '/block.json' );

/**
 * Dynamic render callback
 */
function ileben_render_bs_gallery( $attributes, $content, $block ) {
    // Get attributes
    $images = $attributes['images'] ?? array();
    $columns = absint( $attributes['columns'] ?? 3 );
    $columns_mobile = absint( $attributes['columnsMobile'] ?? 2 );
    $lightbox = boolval( $attributes['lightbox'] ?? true );
    $gap = sanitize_text_field( $attributes['gap'] ?? 'default' );
    $gap_mobile = sanitize_text_field( $attributes['gapMobile'] ?? 'default' );
    $hover_effect = sanitize_text_field( $attributes['hoverEffect'] ?? 'overlay' );
    $thumbnail_size = sanitize_text_field( $attributes['thumbnailSize'] ?? 'medium' );
    $crop = boolval( $attributes['crop'] ?? true );
    $aspect_ratio = sanitize_text_field( $attributes['aspectRatio'] ?? '1/1' );
    $alternate_aspect = boolval( $attributes['alternateAspectRatio'] ?? false );
    $aspect_pattern = absint( $attributes['aspectRatioPattern'] ?? 3 );
    $secondary_aspect = sanitize_text_field( $attributes['secondaryAspectRatio'] ?? '2/3' );
    $filter_categories = boolval( $attributes['filterCategories'] ?? false );
    $image_order = sanitize_text_field( $attributes['imageOrder'] ?? 'asc' );
    $show_captions = boolval( $attributes['showCaptions'] ?? true );
    $overlay_color = sanitize_hex_color( $attributes['overlayColor'] ?? '#000000' );
    $overlay_opacity = floatval( $attributes['overlayOpacity'] ?? 0.5 );
    $image_limit = absint( $attributes['imageLimit'] ?? 0 );
    $enable_masonry = boolval( $attributes['enableMasonry'] ?? true );
    $className = $attributes['className'] ?? '';

    if ( empty( $images ) ) {
        return '<div class="alert alert-info" role="alert">' . __( 'No images selected', 'bootstrap-theme' ) . '</div>';
    }
    // Apply image ordering
    if ( 'random' === $image_order ) {
        shuffle( $images );
    } elseif ( 'desc' === $image_order ) {
        $images = array_reverse( $images );
    }
    // 'asc' is default (no sorting needed)

    // Limit images if set
    if ( $image_limit > 0 ) {
        $images = array_slice( $images, 0, $image_limit );
    }

    // Get categories from images if filter is enabled
    $all_categories = array();
    $images_by_category = array();
    if ( $filter_categories ) {
        foreach ( $images as $image ) {
            $image_id = isset( $image['id'] ) ? absint( $image['id'] ) : 0;
            if ( ! $image_id ) {
                continue;
            }
            $terms = wp_get_object_terms( $image_id, 'attachment_category', array( 'fields' => 'all' ) );
            if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
                foreach ( $terms as $term ) {
                    if ( ! isset( $all_categories[ $term->term_id ] ) ) {
                        $all_categories[ $term->term_id ] = $term;
                    }
                }
            }
        }
    }

    // Gap classes mapping
    $gap_map = array(
        'none'      => '-0',
        'xs'        => '-1',
        'small'     => '-2',
        'default'   => '-3',
        'medium'    => '-4',
        'large'     => '-5',
    );
    $gap_class = 'g' . ( $gap_map[ $gap ] ?? '-3' );
    $gap_mobile_class = 'g-xs-' . ( $gap_map[ $gap_mobile ] ?? '-2' );

    // Thumbnail size mapping
    $size_map = array(
        'thumb'     => 'thumbnail',
        'medio'     => 'medium',
        'largo'     => 'large',
        'completo'  => 'full',
    );
    $img_size = $size_map[ $thumbnail_size ] ?? 'medium';

    // Build gallery HTML
    $wrapper_classes = array(
        'row',
        'justify-content-center',
        'gallery-container',
        $gap_class,
        $gap_mobile_class,
        $className,
    );
    
    // Determine Bootstrap column class based on columns setting
    $col_map = array(
        1 => 'col-12',
        2 => 'col-md-6',
        3 => 'col-md-4',
        4 => 'col-md-3',
        5 => 'col-md-auto',
        6 => 'col-md-2',
    );
    
    $col_mobile_map = array(
        1 => 'col-12',
        2 => 'col-6',
        3 => 'col-4',
        4 => 'col-3',
    );
    
    $col_class = $col_map[ $columns ] ?? 'col-md-4';
    $col_mobile_class = $col_mobile_map[ $columns_mobile ] ?? 'col-6';

    ob_start();
    ?>

    <div class="gallery-wrapper mx-auto text-center">
        <?php if ( $filter_categories && ! empty( $all_categories ) ) : ?>
            <div class="d-flex flex-wrap justify-content-center g-2 mb-4">
                <button class="btn btn-outline-secondary btn-sm active" data-filter="*"><?php esc_html_e( 'Todas', 'bootstrap-theme' ); ?></button>
                <?php foreach ( $all_categories as $category ) : ?>
                    <button class="btn btn-outline-secondary btn-sm" data-filter=".<?php echo esc_attr( 'cat-' . $category->term_id ); ?>">
                        <?php echo esc_html( $category->name ); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?> gallery-hover-<?php echo esc_attr( $hover_effect ); ?>"
             style="--gallery-overlay-color: <?php echo esc_attr( $overlay_color ); ?>; --gallery-overlay-opacity: <?php echo esc_attr( $overlay_opacity ); ?>;"
             data-columns="<?php echo esc_attr( $columns ); ?>"
             data-lightbox="<?php echo esc_attr( $lightbox ? 'true' : 'false' ); ?>">

            <?php
            $image_index = 0;
            foreach ( $images as $image ) :
            $image_id = isset( $image['id'] ) ? absint( $image['id'] ) : 0;
            if ( ! $image_id ) {
                continue;
            }

            $img_src = wp_get_attachment_image_src( $image_id, $img_size );
            if ( ! $img_src ) {
                continue;
            }

            $img_url = $img_src[0];
            $img_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true ) ?: '';
            $img_title = get_the_title( $image_id ) ?: '';
            $img_caption = wp_get_attachment_caption( $image_id ) ?: '';
            $full_url = wp_get_attachment_image_src( $image_id, 'full' )[0];

            // Determine aspect ratio for this image
            $current_aspect_ratio = $aspect_ratio;
            if ( $alternate_aspect && $aspect_pattern > 0 ) {
                // Alternate aspect ratio based on pattern
                $position_in_pattern = $image_index % $aspect_pattern;
                if ( $position_in_pattern == ( $aspect_pattern - 1 ) ) {
                    $current_aspect_ratio = $secondary_aspect;
                }
            }

            // Compute aspect ratio (support "auto")
            $is_auto_ratio = ( 'auto' === $current_aspect_ratio );
            $ratio_w = 1;
            $ratio_h = 1;
            if ( ! $is_auto_ratio && strpos( $current_aspect_ratio, '/' ) !== false ) {
                list( $w, $h ) = explode( '/', $current_aspect_ratio );
                $w = floatval( $w );
                $h = floatval( $h );
                if ( $w > 0 && $h > 0 ) {
                    $ratio_w = $w;
                    $ratio_h = $h;
                }
            }

            if ( $is_auto_ratio ) {
                $figure_style = 'margin: var(--bs-gutter-y) var(--bs-gutter-x);';
            } else {
                $figure_style = 'margin: var(--bs-gutter-y) var(--bs-gutter-x); --a-ratio: ' . $ratio_w . ' / ' . $ratio_h . ';';
            }

            // Build item with Bootstrap classes
            $item_classes = array(
                $col_mobile_class,
                $col_class,
                'gallery-item',
                'overflow-hidden',
                'gallery-num-' . ( $image_index + 1 ),
            );

            if(!$enable_masonry){
                $item_classes[] = 'position-relative';
            }

            // Add category class if filtering is enabled
            if ( $filter_categories ) {
                $terms = wp_get_object_terms( $image_id, 'attachment_category', array( 'fields' => 'ids' ) );
                if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
                    foreach ( $terms as $term_id ) {
                        $item_classes[] = 'cat-' . $term_id;
                    }
                }
            }
            ?>

            <figure class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" style="<?php echo esc_attr( $figure_style ); ?>">
                <?php if ( $lightbox ) : ?>
                    <a href="<?php echo esc_url( $full_url ); ?>" 
                       class="d-block w-100" 
                       style="aspect-ratio: var(--a-ratio);"
                       data-fancybox="gallery"
                       <?php if ( $img_title ) : ?>data-caption="<?php echo esc_attr( $img_title ); ?>"<?php endif; ?>>
                <?php endif; ?>

                <img src="<?php echo esc_url( $img_url ); ?>" 
                     alt="<?php echo esc_attr( $img_alt ); ?>" 
                     class="object-fit-cover w-100<?php echo $is_auto_ratio ? ' h-auto' : ' h-100'; ?> d-block"
                     loading="lazy">

                <?php if ( $lightbox ) : ?>
                    </a>
                <?php endif; ?>

                <?php if ( 'overlay' === $hover_effect ) : ?>
                    <div class="gallery-overlay position-absolute top-0 start-0 w-100 h-100" style="z-index: 2;">
                        <?php if ( $show_captions && $img_title ) : ?>
                            <div class="d-flex align-items-center justify-content-center w-100 h-100 text-white text-center p-3">
                                <div>
                                    <h3 class="h5 mb-2"><?php echo esc_html( $img_title ); ?></h3>
                                    <?php if ( $img_caption ) : ?>
                                        <p class="small mb-0"><?php echo esc_html( $img_caption ); ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <?php if ( $show_captions && 'overlay' !== $hover_effect && ( $img_title || $img_caption ) ) : ?>
                    <figcaption class="p-2 bg-light">
                        <?php if ( $img_title ) : ?>
                            <h4 class="h6 mb-1 fw-semibold"><?php echo esc_html( $img_title ); ?></h4>
                        <?php endif; ?>
                        <?php if ( $img_caption ) : ?>
                            <p class="small text-muted mb-0"><?php echo esc_html( $img_caption ); ?></p>
                        <?php endif; ?>
                    </figcaption>
                <?php endif; ?>
            </figure>

            <?php
            $image_index++;
            endforeach;
            ?>

        </div><!-- .row -->
    </div><!-- .gallery-wrapper -->
    <?php if ( $enable_masonry ) : ?>
    <script>
    // layout Masonry after each image loads
    document.addEventListener('DOMContentLoaded', function() {
        var galleryContainers = document.querySelectorAll('.gallery-container');
        galleryContainers.forEach(function(container) {
            var msnry = new Masonry( container, {
                itemSelector: '.gallery-item',
                percentPosition: true,
                columnWidth: '.gallery-item'
            });

            // Center masonry container
            function centerMasonry() {
                if (!msnry || !container) return;
                
                // Force layout first
                msnry.layout();
                
                // Calculate actual width based on item positions
                var items = container.querySelectorAll('.gallery-item');
                var maxRight = 0;
                
                items.forEach(function(item) {
                    var rect = item.getBoundingClientRect();
                    var containerRect = container.getBoundingClientRect();
                    var itemRight = rect.left - containerRect.left + rect.width;
                    if (itemRight > maxRight) {
                        maxRight = itemRight;
                    }
                });
                
                var containerWidth = maxRight;
                var parentWidth = container.parentElement.offsetWidth;
                
                if (containerWidth > 0 && containerWidth < parentWidth) {
                    var offset = (parentWidth - containerWidth) / 2;
                    container.style.transform = 'translateX(' + offset + 'px)';
                } else {
                    container.style.transform = 'translateX(0)';
                }
            }

            // Wait for all images to load
            var imgLoad = imagesLoaded( container );
            
            // Center on each image load progress
            imgLoad.on( 'progress', function() {
                centerMasonry();
            });
            
            // Force center when all images are done loading
            imgLoad.on( 'done', function() {
                // Multiple attempts to ensure proper centering
                centerMasonry();
                setTimeout(function() {
                    centerMasonry();
                }, 50);
                setTimeout(function() {
                    centerMasonry();
                }, 200);
            });

            // Re-center on window resize
            var resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    centerMasonry();
                }, 100);
            });
        });
    });
    </script>
    <?php endif; ?>
    <?php
    return ob_get_clean();
}

register_block_type( 'bootstrap-theme/bs-gallery', array(
    'render_callback' => 'ileben_render_bs_gallery',
    'attributes'      => array(
        'images'              => array(
            'type'  => 'array',
            'items' => array(
                'type'       => 'object',
                'properties' => array(
                    'id'  => array( 'type' => 'number' ),
                    'url' => array( 'type' => 'string' ),
                ),
            ),
            'default' => array(),
        ),
        'columns'             => array( 'type' => 'number', 'default' => 3 ),
        'columnsMobile'       => array( 'type' => 'number', 'default' => 2 ),
        'lightbox'            => array( 'type' => 'boolean', 'default' => true ),
        'gap'                 => array( 'type' => 'string', 'default' => 'default' ),
        'gapMobile'           => array( 'type' => 'string', 'default' => 'default' ),
        'hoverEffect'         => array( 'type' => 'string', 'default' => 'overlay' ),
        'thumbnailSize'       => array( 'type' => 'string', 'default' => 'medium' ),
        'crop'                => array( 'type' => 'boolean', 'default' => true ),
        'aspectRatio'         => array( 'type' => 'string', 'default' => '1/1' ),
        'alternateAspectRatio' => array( 'type' => 'boolean', 'default' => false ),
        'aspectRatioPattern'  => array( 'type' => 'number', 'default' => 3 ),
        'secondaryAspectRatio' => array( 'type' => 'string', 'default' => '2/3' ),
        'enableMasonry'       => array( 'type' => 'boolean', 'default' => true ),
        'filterCategories'    => array( 'type' => 'boolean', 'default' => false ),
        'imageOrder'          => array( 'type' => 'string', 'default' => 'asc' ),
        'showCaptions'        => array( 'type' => 'boolean', 'default' => true ),
        'overlayColor'        => array( 'type' => 'string', 'default' => '#000000' ),
        'overlayOpacity'      => array( 'type' => 'number', 'default' => 0.5 ),
        'imageLimit'          => array( 'type' => 'number', 'default' => 0 ),
        'className'           => array( 'type' => 'string', 'default' => '' ),
    ),
) );
