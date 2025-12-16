<?php
/**
 * Bootstrap Cart Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Cart Block
 */
function bootstrap_theme_render_bs_cart_block($attributes, $content, $block) {
    if (!function_exists('wc_get_cart_url') || !function_exists('wc_get_checkout_url')) {
        return '<div class="alert alert-warning">' . esc_html__('WooCommerce is not active', 'bootstrap-theme') . '</div>';
    }

    $show_empty_message = $attributes['showEmptyMessage'] ?? true;
    $show_totals = $attributes['showTotals'] ?? true;
    $show_buttons = $attributes['showButtons'] ?? true;
    
    // Build cart classes
    $cart_classes = array('bs-cart');
    if (function_exists('bootstrap_theme_add_custom_classes')) {
        $cart_classes = bootstrap_theme_add_custom_classes($cart_classes, $attributes, $block);
    } elseif (!empty($attributes['className'])) {
        $cart_classes[] = $attributes['className'];
    }
    
    // Get animation data attributes
    $animation_attrs = '';
    if (function_exists('bootstrap_theme_get_animation_attributes')) {
        $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);
    }
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr(implode(' ', array_unique($cart_classes))); ?>" data-cart-block="true" <?php echo $animation_attrs; ?>>
        <div class="cart-items-wrapper">
            <?php
            // Check if cart is empty
            $cart_is_empty = true;
            $cart_items = array();
            $cart_subtotal = 0;
            $cart_total = 0;
            $cart_taxes = array();
            
            // Only initialize cart on frontend, not in REST API/editor
            if (class_exists('WooCommerce') && function_exists('WC') && WC() && WC()->cart) {
                // Asegurar totales calculados (incluye envío cuando procede)
                WC()->cart->calculate_totals();
                $cart_is_empty = WC()->cart->is_empty();
                if (!$cart_is_empty) {
                    $cart_items = WC()->cart->get_cart();
                    $cart_subtotal = WC()->cart->get_subtotal();
                    $cart_total = WC()->cart->get_total();
                    $cart_taxes = WC()->cart->get_taxes();
                    $needs_shipping = WC()->cart->needs_shipping();
                    $shipping_can_show = WC()->cart->show_shipping();
                    $shipping_total = $shipping_can_show ? WC()->cart->get_cart_shipping_total() : '';

                    // Construir etiqueta(s) de método(s) de envío (solo nombre, precio va a la derecha)
                    $shipping_label_html = '';
                    if ($needs_shipping) {
                        $packages = WC()->shipping()->get_packages();
                        $chosen   = WC()->session->get('chosen_shipping_methods');
                        if (is_array($packages) && !empty($packages)) {
                            $labels = array();
                            foreach ($packages as $i => $package) {
                                if (isset($chosen[$i], $package['rates'][$chosen[$i]])) {
                                    $rate = $package['rates'][$chosen[$i]]; // WC_Shipping_Rate
                                    $labels[] = $rate->get_label();
                                }
                            }
                            if (!empty($labels)) {
                                $shipping_label_html = implode('<br>', $labels);
                            }
                        }
                    }
                }
            }
            
            if ($cart_is_empty) {
                if ($show_empty_message) {
                    echo '<div class="alert alert-info">';
                    esc_html_e('Your cart is currently empty', 'bootstrap-theme');
                    echo '</div>';
                }
            } else {
                ?>
                <ul class="list-group cart-items-list">
                    <?php
                    foreach ($cart_items as $cart_item_key => $cart_item) {
                        $product = $cart_item['data'];
                        $quantity = $cart_item['quantity'];
                        $line_total = $cart_item['line_total'];
                        $image = $product->get_image('thumbnail');
                        
                        // Get maximum stock quantity
                        $max_stock = $product->get_stock_quantity();
                        // If stock management is disabled, set to a high number
                        if ($max_stock === null || $max_stock === '') {
                            $max_stock = 9999;
                        } else {
                            $max_stock = intval($max_stock);
                        }
                        
                        // Get product attributes/variations
                        $attributes_html = '';
                        if ($product->is_type('variation')) {
                            $attributes = $product->get_attributes();
                            $attr_parts = array();
                            foreach ($attributes as $attr_name => $attr_value) {
                                $attr_parts[] = $attr_value;
                            }
                            if (!empty($attr_parts)) {
                                $attributes_html = implode('/', $attr_parts);
                            }
                        }
                        ?>
                        <li class="list-group-item">
                            <div class="d-flex gap-3 align-items-start">
                                <!-- Product Image -->
                                <div class="cart-item-image flex-shrink-0">
                                    <?php
                                    if (!empty($image)) {
                                        echo wp_kses_post($image);
                                    } else {
                                        echo '<div class="d-flex align-items-center justify-content-center w-100 h-100 text-muted small">' . esc_html__('No image', 'bootstrap-theme') . '</div>';
                                    }
                                    ?>
                                </div>

                                <!-- Product Info & Controls -->
                                <div class="cart-item-info flex-grow-1 d-flex flex-column">
                                    <!-- Product Name -->
                                    <div class="mb-1">
                                        <a href="<?php echo esc_url($product->get_permalink()); ?>" class="text-decoration-none fw-600">
                                            <?php echo esc_html($product->get_name()); ?>
                                        </a>
                                    </div>
                                    
                                    <!-- Product Details (variations, meta, etc.) -->
                                    <?php
                                    // Use flat formatted data to avoid extra CSS – just Bootstrap utilities
                                    $item_data_text = wc_get_formatted_cart_item_data($cart_item, true);
                                    if (!empty($item_data_text)) :
                                    ?>
                                        <div class="small text-muted mb-2">
                                            <?php echo wp_kses_post($item_data_text); ?>
                                        </div>
                                    <?php endif; ?>

                                    <!-- Product SKU -->
                                    <?php if ($product->get_sku()) : ?>
                                        <div class="text-muted small">
                                            <strong><?php esc_html_e('SKU:', 'bootstrap-theme'); ?></strong> <?php echo esc_html($product->get_sku()); ?>
                                        </div>
                                    <?php endif; ?>

                                    <!-- Quantity & Price Row -->
                                    <div class="d-flex gap-2 align-items-center mt-auto pt-3 border-top">
                                        <!-- Quantity Controls / Rental unique quantity / Sold individually -->
                                        <?php if ($product->get_type() === 'rental_car' || $product->is_sold_individually()) : ?>
                                            <div class="cart-item-quantity sold-individually d-flex align-items-center">
                                                <span class="badge bg-secondary">
                                                    <?php esc_html_e('Cantidad fija: 1', 'bootstrap-theme'); ?>
                                                </span>
                                            </div>
                                        <?php else : ?>
                                            <div class="cart-item-quantity d-flex align-items-center border rounded">
                                                <button type="button" class="cart-qty-minus btn btn-sm btn-link p-0" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>" data-max-stock="<?php echo esc_attr($product->get_stock_quantity()); ?>">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <span class="qty-display px-2 fw-600 flex-grow-1 text-center" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>" data-max-stock="<?php echo esc_attr($product->get_stock_quantity()); ?>">
                                                    <?php echo esc_html($quantity); ?>
                                                </span>
                                                <button type="button" class="cart-qty-plus btn btn-sm btn-link p-0" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>" data-max-stock="<?php echo esc_attr($product->get_stock_quantity()); ?>">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        <?php endif; ?>

                                        <!-- Price -->
                                        <div class="cart-item-price ms-auto fw-600">
                                            <?php
                                            // Get regular and sale prices
                                            $regular_price = $product->get_regular_price();
                                            $sale_price = $product->get_sale_price();
                                            
                                            // Calculate line total for regular price if on sale
                                            if ($product->is_on_sale() && $sale_price) {
                                                $regular_line_total = $regular_price * $quantity;
                                                ?>
                                                <div class="d-flex flex-column align-items-end">
                                                    <span class="text-decoration-line-through text-muted small">
                                                        <?php echo wp_kses_post(wc_price($regular_line_total)); ?>
                                                    </span>
                                                    <span class="text-danger">
                                                        <?php echo wp_kses_post(wc_price($line_total)); ?>
                                                    </span>
                                                </div>
                                                <?php
                                            } else {
                                                echo wp_kses_post(wc_price($line_total));
                                            }
                                            ?>
                                        </div>

                                        <!-- Remove Button -->
                                        <button type="button" class="cart-remove-item btn btn-sm btn-link text-danger p-0" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <?php
                    }
                    ?>
                </ul>

                <?php
                if ($show_totals) {
                    ?>
                    <div class="cart-totals mt-3 pt-3 border-top">
                        <div class="row mb-2">
                            <div class="col"><b><?php esc_html_e('Subtotal:', 'bootstrap-theme'); ?></b></div>
                            <div class="col text-end">
                                <?php echo wp_kses_post(wc_price($cart_subtotal)); ?>
                            </div>
                        </div>
                        <?php if (!empty($needs_shipping)) : ?>
                            <?php
                            // Verificar si hay productos físicos que requieran envío
                            $has_physical_product = false;
                            foreach ($cart_items as $item) {
                                $prod = $item['data'];
                                if ($prod && !$prod->is_virtual() && !$prod->is_downloadable()) {
                                    $has_physical_product = true;
                                    break;
                                }
                            }
                            ?>
                            <?php if ($has_physical_product) : ?>
                            <div class="row mb-2">
                                <div class="col">
                                    <i>
                                    <?php
                                    if (!empty($shipping_label_html)) {
                                        echo wp_kses_post($shipping_label_html);
                                    } else {
                                        esc_html_e('Envío', 'bootstrap-theme');
                                    }
                                    ?>
                                    </i>
                                </div>
                                <div class="col text-end">
                                    <?php
                                    if (!empty($shipping_total)) {
                                        echo wp_kses_post($shipping_total);
                                    } else {
                                        esc_html_e('Calculado al finalizar compra', 'bootstrap-theme');
                                    }
                                    ?>
                                </div>
                            </div>
                            <?php endif; ?>
                        <?php endif; ?>
                        <?php
                        if (!empty($cart_taxes)) {
                            foreach ($cart_taxes as $tax) {
                                ?>
                                <div class="row mb-2">
                                    <div class="col"><b><?php esc_html_e('Tax:', 'bootstrap-theme'); ?></b></div>
                                    <div class="col text-end">
                                        <?php echo wp_kses_post(wc_price($tax)); ?>
                                    </div>
                                </div>
                                <?php
                            }
                        }
                        ?>
                        <div class="row border-top pt-2 fw-bold">
                            <div class="col"><?php esc_html_e('Total:', 'bootstrap-theme'); ?></div>
                            <div class="col text-end">
                                <?php echo wp_kses_post($cart_total); ?>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            }
            ?>
        </div>

        <?php
        if ($show_buttons && !$cart_is_empty) {
            ?>
            <div class="cart-buttons mt-4 d-flex gap-2">
                <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="btn btn-outline-primary flex-grow-1">
                    <?php esc_html_e('View Cart', 'bootstrap-theme'); ?>
                </a>
                <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="btn btn-primary flex-grow-1">
                    <?php esc_html_e('Checkout', 'bootstrap-theme'); ?>
                </a>
            </div>
            <?php
        }
        ?>
    </div>

    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Cart Block
 */
function bootstrap_theme_register_bs_cart_block() {
    register_block_type('bootstrap-theme/bs-cart', array(
        'render_callback' => 'bootstrap_theme_render_bs_cart_block',
        'attributes' => array(
            'showEmptyMessage' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'showTotals' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'showButtons' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        ),
        'supports' => array(
            'className' => true,
            'anchor' => true,
            'align' => true
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_cart_block');
