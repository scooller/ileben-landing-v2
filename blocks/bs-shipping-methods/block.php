<?php
/**
 * Bootstrap Shipping Methods Block
 * Muestra los métodos de envío disponibles de WooCommerce
 *
 * @package Bootstrap_Theme
 */

function bootstrap_theme_render_bs_shipping_methods_block($attributes, $content, $block) {
    if (!class_exists('WooCommerce')) {
        return '<div class="alert alert-warning">WooCommerce no está activo</div>';
    }

    // Verificar que haya carrito y productos que requieran envío
    if (!WC()->cart || !WC()->cart->needs_shipping()) {
        return '';
    }
    
    // Verificar si el carrito tiene al menos un producto no virtual y no descargable
    $has_physical_product = false;
    foreach (WC()->cart->get_cart() as $cart_item) {
        $product = $cart_item['data'];
        if ($product && !$product->is_virtual() && !$product->is_downloadable()) {
            $has_physical_product = true;
            break;
        }
    }
    
    // Si solo hay productos virtuales/descargables, no mostrar métodos de envío
    if (!$has_physical_product) {
        return '';
    }

    // Atributos
    $display_type = isset($attributes['displayType']) ? $attributes['displayType'] : 'radio';
    $show_icon = isset($attributes['showIcon']) ? $attributes['showIcon'] : true;
    $show_description = isset($attributes['showDescription']) ? $attributes['showDescription'] : true;
    $title = isset($attributes['title']) && !empty($attributes['title']) ? $attributes['title'] : __('Métodos de envío', 'bootstrap-theme');
    $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : '';
    
    // Construir clases
    $classes = ['bs-shipping-methods'];
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    if ($alignment) {
        $classes[] = 'text-' . $alignment;
    }
    
    $wrapper_class = implode(' ', $classes);

    // Calcular envío
    WC()->cart->calculate_shipping();
    
    // Obtener paquetes de envío
    $packages = WC()->shipping()->get_packages();
    $chosen_methods = WC()->session->get('chosen_shipping_methods');
    
    if (empty($packages)) {
        return '';
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($wrapper_class); ?>">
        <h3 class="shipping-title mb-3"><?php echo esc_html($title); ?></h3>

        <?php foreach ($packages as $i => $package) : ?>
            <?php
            $available_methods = $package['rates'];
            $chosen_method = isset($chosen_methods[$i]) ? $chosen_methods[$i] : '';
            
            if (empty($available_methods)) {
                continue;
            }
            ?>

            <?php if ($display_type === 'select') : ?>
                <!-- Modo Select Dropdown -->
                <div class="shipping-select-wrapper">
                    <select class="form-select shipping-method-select" 
                            name="shipping_method[<?php echo esc_attr($i); ?>]" 
                            data-package="<?php echo esc_attr($i); ?>"
                            aria-label="<?php esc_attr_e('Seleccionar método de envío', 'bootstrap-theme'); ?>">
                        <?php foreach ($available_methods as $method) : ?>
                            <option value="<?php echo esc_attr($method->id); ?>" 
                                    <?php selected($chosen_method, $method->id); ?>>
                                <?php echo esc_html($method->get_label()); ?> - 
                                <?php echo wp_kses_post(wc_cart_totals_shipping_method_label($method)); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

            <?php else : ?>
                <!-- Modo Radio Buttons -->
                <div class="shipping-radio-wrapper">
                    <?php foreach ($available_methods as $method) : ?>
                        <div class="form-check shipping-method-option mb-2">
                            <input class="form-check-input shipping-method-radio" 
                                   type="radio" 
                                   name="shipping_method[<?php echo esc_attr($i); ?>]" 
                                   id="shipping_method_<?php echo esc_attr($i . '_' . sanitize_title($method->id)); ?>" 
                                   value="<?php echo esc_attr($method->id); ?>"
                                   <?php checked($chosen_method, $method->id); ?>
                                   data-package="<?php echo esc_attr($i); ?>">
                            <label class="form-check-label w-100" 
                                   for="shipping_method_<?php echo esc_attr($i . '_' . sanitize_title($method->id)); ?>">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="shipping-method-name">
                                        <?php if ($show_icon) : ?>
                                            <svg class="icon me-2">
                                                <use xlink:href="#fa-truck"></use>
                                            </svg>
                                        <?php endif; ?>
                                        <?php echo esc_html($method->get_label()); ?>
                                    </span>
                                    <span class="shipping-method-cost fw-bold">
                                        <?php echo wp_kses_post(wc_cart_totals_shipping_method_label($method)); ?>
                                    </span>
                                </div>
                            </label>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        <?php endforeach; ?>
    </div>

    <script>
    (function() {
        document.addEventListener('DOMContentLoaded', function() {
            // Actualizar método de envío seleccionado
            function updateShippingMethod(element) {
                var packageId = element.dataset.package;
                var methodId = element.value;
                
                // Aquí podrías agregar AJAX para actualizar el carrito
                // Por ahora solo actualiza visualmente
                console.log('Shipping method selected:', methodId, 'for package:', packageId);
                
                // Trigger evento para que otros scripts puedan escuchar
                var event = new CustomEvent('shipping_method_changed', {
                    detail: { package: packageId, method: methodId }
                });
                document.dispatchEvent(event);
            }
            
            // Event listeners para select
            var selects = document.querySelectorAll('.shipping-method-select');
            selects.forEach(function(select) {
                select.addEventListener('change', function() {
                    updateShippingMethod(this);
                });
            });
            
            // Event listeners para radio
            var radios = document.querySelectorAll('.shipping-method-radio');
            radios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    updateShippingMethod(this);
                });
            });
        });
    })();
    </script>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_shipping_methods_block() {
    if (!function_exists('register_block_type')) {
        return;
    }

    register_block_type('bootstrap-theme/bs-shipping-methods', array(
        'render_callback' => 'bootstrap_theme_render_bs_shipping_methods_block',
        'attributes' => array(
            'displayType' => array(
                'type' => 'string',
                'default' => 'radio'
            ),
            'showIcon' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'showDescription' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'title' => array(
                'type' => 'string',
                'default' => 'Métodos de envío'
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_shipping_methods_block');
