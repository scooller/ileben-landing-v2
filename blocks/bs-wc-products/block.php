<?php
/**
 * Bootstrap WooCommerce Products Loop Block
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_wc_products_block($attributes, $content, $block) {
    if (!class_exists('WooCommerce')) {
        return '<div class="alert alert-warning">' . esc_html__('WooCommerce is not active', 'bootstrap-theme') . '</div>';
    }

    $use_defaults   = isset($attributes['useThemeDefaults']) ? (bool)$attributes['useThemeDefaults'] : true;

    // Theme options
    $opt_cols       = function_exists('bootstrap_theme_get_woocommerce_option') ? (int) bootstrap_theme_get_woocommerce_option('products_per_row') : 4;
    $opt_cols_mobile= function_exists('bootstrap_theme_get_woocommerce_option') ? (int) bootstrap_theme_get_woocommerce_option('products_per_row_mobile') : 2;
    $opt_per_page   = function_exists('bootstrap_theme_get_woocommerce_option') ? (int) bootstrap_theme_get_woocommerce_option('products_per_page') : 12;
    $opt_orderby    = function_exists('bootstrap_theme_get_woocommerce_option') ? (string) bootstrap_theme_get_woocommerce_option('default_orderby') : 'menu_order';
    $opt_order      = function_exists('bootstrap_theme_get_woocommerce_option') ? (string) bootstrap_theme_get_woocommerce_option('default_order') : 'ASC';
    $opt_show_search= function_exists('bootstrap_theme_get_woocommerce_option') ? bootstrap_theme_get_woocommerce_option('catalog_show_search') : true;

    // Block attributes (override if not using defaults)
    $cols       = $use_defaults ? max(1, $opt_cols) : max(1, (int)($attributes['productsPerRow'] ?? $opt_cols));
    $cols_mobile= $use_defaults ? max(1, $opt_cols_mobile) : max(1, (int)($attributes['productsPerRowMobile'] ?? $opt_cols_mobile));
    $per_page   = $use_defaults ? max(1, $opt_per_page) : max(1, (int)($attributes['productsPerPage'] ?? $opt_per_page));
    $orderbyDef = $use_defaults ? ($opt_orderby ?: 'menu_order') : (string)($attributes['defaultOrderby'] ?? $opt_orderby ?: 'menu_order');
    $orderDef   = $use_defaults ? ($opt_order ?: 'ASC') : (string)($attributes['defaultOrder'] ?? $opt_order ?: 'ASC');

    $show_order = isset($attributes['showOrdering']) ? (bool)$attributes['showOrdering'] : true;
    $show_search= isset($attributes['showSearch']) ? (bool)$attributes['showSearch'] : (bool)$opt_show_search;
    $show_paged = isset($attributes['showPagination']) ? (bool)$attributes['showPagination'] : true;
    $only_in_stock = isset($attributes['onlyInStock']) ? (bool)$attributes['onlyInStock'] : false;
    $categories = isset($attributes['categories']) && is_array($attributes['categories']) ? array_map('intval', $attributes['categories']) : array();

    // Current page (use a dedicated param to avoid conflicts on pages)
    $current_page = isset($_GET['wc_page']) ? max(1, (int) $_GET['wc_page']) : max(1, (int) get_query_var('paged'), (int) get_query_var('page'));

    // Read UI params
    $orderby_param = isset($_GET['orderby']) ? sanitize_text_field(wp_unslash($_GET['orderby'])) : $orderbyDef;
    $order_param   = isset($_GET['order']) ? sanitize_text_field(wp_unslash($_GET['order'])) : $orderDef;
    $search_s      = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

    // Map orderby to WP_Query args
    $query_args = array(
        'post_type'      => 'product',
        'post_status'    => 'publish',
        's'              => $search_s,
        'paged'          => $current_page,
        'posts_per_page' => $per_page,
    );

    switch ($orderby_param) {
        case 'price':
            $query_args['meta_key'] = '_price';
            $query_args['orderby']  = 'meta_value_num';
            $query_args['order']    = ($order_param === 'DESC') ? 'DESC' : 'ASC';
            break;
        case 'popularity':
            $query_args['meta_key'] = 'total_sales';
            $query_args['orderby']  = 'meta_value_num';
            $query_args['order']    = 'DESC';
            break;
        case 'rating':
            $query_args['meta_key'] = '_wc_average_rating';
            $query_args['orderby']  = 'meta_value_num';
            $query_args['order']    = 'DESC';
            break;
        case 'sku':
            $query_args['meta_key'] = '_sku';
            $query_args['orderby']  = 'meta_value';
            $query_args['order']    = ($order_param === 'DESC') ? 'DESC' : 'ASC';
            break;
        case 'date':
            $query_args['orderby'] = 'date';
            $query_args['order']   = ($order_param === 'ASC') ? 'ASC' : 'DESC';
            break;
        case 'modified':
            $query_args['orderby'] = 'modified';
            $query_args['order']   = ($order_param === 'ASC') ? 'ASC' : 'DESC';
            break;
        case 'rand':
            $query_args['orderby'] = 'rand';
            break;
        case 'title':
            $query_args['orderby'] = 'title';
            $query_args['order']   = ($order_param === 'DESC') ? 'DESC' : 'ASC';
            break;
        case 'menu_order':
        default:
            $query_args['orderby'] = 'menu_order title';
            $query_args['order']   = ($order_param === 'DESC') ? 'DESC' : 'ASC';
            break;
    }

    // Exclude hidden categories (theme option)
    if (function_exists('bootstrap_theme_get_hidden_product_cat_ids')) {
        $exclude = bootstrap_theme_get_hidden_product_cat_ids();
        if (!empty($exclude)) {
            $query_args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => $exclude,
                    'operator' => 'NOT IN'
                )
            );
        }
    }

    // Add category filter if categories are selected
    if (!empty($categories)) {
        if (empty($query_args['tax_query'])) {
            $query_args['tax_query'] = array();
        }
        $query_args['tax_query'][] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'term_id',
            'terms'    => $categories,
            'operator' => 'IN'
        );
    }

    // Add stock filter if only in stock products should be shown
    if ($only_in_stock) {
        if (empty($query_args['meta_query'])) {
            $query_args['meta_query'] = array();
        }
        $query_args['meta_query'][] = array(
            'key'     => '_stock_status',
            'value'   => 'instock',
            'compare' => '='
        );
    }

    $q = new WP_Query($query_args);

    // Setup WooCommerce loop props for native templates/result_count
    wc_setup_loop(array(
        'columns'       => $cols,
        'total'         => (int) $q->found_posts,
        'per_page'      => $per_page,
        'current_page'  => $current_page,
        'is_search'     => !empty($search_s),
        'is_paginated'  => $show_paged,
    ));

    // Build classes
    $wrap_classes = array('bs-wc-products');
    if (function_exists('bootstrap_theme_add_custom_classes')) {
        $wrap_classes = bootstrap_theme_add_custom_classes($wrap_classes, $attributes, $block);
    } elseif (!empty($attributes['className'])) {
        $wrap_classes[] = $attributes['className'];
    }	

    // Build ordering choices
    $orderby_choices = array(
        'menu_order' => __('Orden predeterminado', 'bootstrap-theme'),
        'title'      => __('Nombre', 'bootstrap-theme'),
        'date'       => __('Fecha', 'bootstrap-theme'),
        'modified'   => __('Última modificación', 'bootstrap-theme'),
        'price'      => __('Precio', 'bootstrap-theme'),
        'popularity' => __('Popularidad', 'bootstrap-theme'),
        'rating'     => __('Calificación', 'bootstrap-theme'),
        'sku'        => __('SKU', 'bootstrap-theme'),
        'rand'       => __('Aleatorio', 'bootstrap-theme'),
    );

    // Inject animation styles
    wp_add_inline_style('woocommerce-layout', '
        .wow {
            animation-duration: 0.8s;
            animation-fill-mode: both;
        }
        .animate__flipInX {
            animation-name: flipInX;
        }
        @keyframes flipInX {
            from {
                -webkit-perspective: 400px;
                perspective: 400px;
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
                opacity: 0;
                -webkit-transform: rotateY(-90deg);
                transform: rotateY(-90deg);
            }
            40% {
                -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
                -webkit-transform: rotateY(10deg);
                transform: rotateY(10deg);
            }
            60% {
                opacity: 1;
                -webkit-transform: rotateY(-10deg);
                transform: rotateY(-10deg);
            }
            80% {
                -webkit-transform: rotateY(5deg);
                transform: rotateY(5deg);
            }
            to {
                -webkit-perspective: 400px;
                perspective: 400px;
                -webkit-transform: rotateY(0deg);
                transform: rotateY(0deg);
                opacity: 1;
            }
        }
        .page-item.active .page-link {
            background-color: #0d6efd;
            border-color: #0d6efd;
            color: #fff;
        }
    ');
    if ($cols <= 0) $cols = 4;

    ob_start();
    ?>
    <div class="woocommerce <?php echo esc_attr(implode(' ', array_unique($wrap_classes))); ?>">
        <!-- Toolbar: Result count + Search + Ordering -->
        <div class="woocommerce-toolbar d-flex justify-content-between align-items-center mb-4">
            <p class="woocommerce-result-count" role="alert" aria-relevant="all" aria-hidden="false">
                <?php woocommerce_result_count(); ?>
            </p>
            <div class="d-flex align-items-center gap-2 ms-auto">
                <?php if ($show_search) : ?>
                    <div class="woocommerce-catalog-search mb-3">
                        <form role="search" method="get" action="<?php echo esc_url(add_query_arg(array())); ?>" class="d-flex gap-2">
                            <input type="search" name="s" value="<?php echo esc_attr($search_s); ?>" class="form-control" placeholder="<?php echo esc_attr__('Buscar productos…', 'bootstrap-theme'); ?>" aria-label="<?php echo esc_attr__('Buscar productos', 'bootstrap-theme'); ?>" />
                            <input type="hidden" name="post_type" value="product" />
                            <?php if ($current_page > 1) : ?>
                                <input type="hidden" name="wc_page" value="<?php echo esc_attr($current_page); ?>" />
                            <?php endif; ?>
                            <button type="submit" class="btn btn-primary">
                                <?php echo esc_html__('Buscar', 'bootstrap-theme'); ?>
                            </button>
                        </form>
                    </div>
                <?php endif; ?>

                <?php if ($show_order) : ?>
                    <form class="woocommerce-ordering" method="get">
                        <select name="orderby" class="orderby" aria-label="<?php echo esc_attr__('Pedido de la tienda', 'bootstrap-theme'); ?>">
                            <?php foreach ($orderby_choices as $val => $label) : ?>
                                <option value="<?php echo esc_attr($val); ?>" <?php selected($orderby_param, $val); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <input type="hidden" name="paged" value="1" />
                        <?php if (!empty($search_s)) : ?>
                            <input type="hidden" name="s" value="<?php echo esc_attr($search_s); ?>" />
                            <input type="hidden" name="post_type" value="product" />
                        <?php endif; ?>
                    </form>
                <?php endif; ?>
            </div>
        </div>

    <!-- Grid: usar clases de columnas provistas por content-product.php (mobile/desktop) -->
    <div class="products row g-4">
            <?php if ($q->have_posts()) : ?>
                <?php while ($q->have_posts()) : $q->the_post(); ?>
                    <?php wc_get_template_part('content', 'product'); ?>
                <?php endwhile; ?>
            <?php else : ?>
                <div class="col-12">
                    <div class="alert alert-info mb-0"><?php echo esc_html__('No products found.', 'bootstrap-theme'); ?></div>
                </div>
            <?php endif; ?>
        </div>

        <!-- Pagination: Bootstrap styled using theme template approach -->
        <?php if ($show_paged && $q->max_num_pages > 1) : ?>
            <nav aria-label="<?php echo esc_attr__('Navegación de productos', 'bootstrap-theme'); ?>" class="wc-pagination mt-4">
                <ul class="pagination justify-content-center">
                    <?php
                    $big = 999999999;
                    $page_links = paginate_links(array(
                        'base'      => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
                        'format'    => '?wc_page=%#%',
                        'current'   => $current_page,
                        'total'     => (int)$q->max_num_pages,
                        'type'      => 'array',
                        'prev_text' => __('« Anterior', 'bootstrap-theme'),
                        'next_text' => __('Siguiente »', 'bootstrap-theme'),
                    ));

                    if (is_array($page_links)) {
                        foreach ($page_links as $link) {
                            // Handle dots/ellipsis (disabled span)
                            if (strpos($link, '<span class="page-numbers dots">') !== false) {
                                $link = str_replace('<span class="page-numbers dots">', '<li class="page-item disabled"><span class="page-link">', $link);
                                $link = str_replace('</span>', '</span></li>', $link);
                            }
                            // Handle current page (span with aria-current)
                            elseif (strpos($link, '<span aria-current=') !== false || strpos($link, 'class="page-numbers current"') !== false) {
                                $link = str_replace('<span', '<li class="page-item active" aria-current="page"><span class="page-link"', $link);
                                $link = str_replace('</span>', '</span></li>', $link);
                            }
                            // Handle links (a tag)
                            else {
                                // Add aria-label for next/prev links if not present
                                if (strpos($link, 'aria-label=') === false) {
                                    if (strpos($link, 'Siguiente') !== false) {
                                        $link = str_replace('<a ', '<a aria-label="' . esc_attr__('Página siguiente', 'bootstrap-theme') . '" ', $link);
                                    } elseif (strpos($link, 'Anterior') !== false) {
                                        $link = str_replace('<a ', '<a aria-label="' . esc_attr__('Página anterior', 'bootstrap-theme') . '" ', $link);
                                    }
                                }
                                $link = str_replace('<a ', '<li class="page-item"><a class="page-link" ', $link);
                                $link = str_replace('</a>', '</a></li>', $link);
                            }
                            echo $link;
                        }
                    }
                    ?>
                </ul>
            </nav>
        <?php endif; ?>
    </div>
    <?php

    wp_reset_postdata();
    wc_reset_loop();

    return ob_get_clean();
}

function bootstrap_theme_register_bs_wc_products_block() {
    register_block_type('bootstrap-theme/bs-wc-products', array(
        'render_callback' => 'bootstrap_theme_render_bs_wc_products_block',
        'attributes' => array(
            'useThemeDefaults' => array('type' => 'boolean', 'default' => true),
            'productsPerRow'   => array('type' => 'number',  'default' => 4),
            'productsPerRowMobile' => array('type' => 'number', 'default' => 2),
            'productsPerPage'  => array('type' => 'number',  'default' => 12),
            'defaultOrderby'   => array('type' => 'string',  'default' => 'menu_order'),
            'defaultOrder'     => array('type' => 'string',  'default' => 'ASC'),
            'showPagination'   => array('type' => 'boolean', 'default' => true),
            'showOrdering'     => array('type' => 'boolean', 'default' => true),
            'showSearch'       => array('type' => 'boolean', 'default' => true),
            'onlyInStock'      => array('type' => 'boolean', 'default' => false),
            'categories'       => array('type' => 'array',    'default' => array(), 'items' => array('type' => 'number')),
            'className'        => array('type' => 'string',  'default' => ''),
        ),
        'supports' => array(
            'className' => true,
            'anchor'    => true,
            'align'     => true,
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_wc_products_block');
