<?php
/**
 * Block: Entorno POI
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_entorno_poi($attributes, $content, $block)
{
    $name = isset($attributes['name']) ? $attributes['name'] : 'Nuevo Punto';
    $details = isset($attributes['details']) ? $attributes['details'] : '';
    $icon = isset($attributes['icon']) ? $attributes['icon'] : 'fa-solid fa-map-pin';
    
    ob_start();
    ?>
    <div class="bs-entorno-poi d-flex align-items-center mb-3 <?php echo isset($attributes['className']) ? esc_attr($attributes['className']) : ''; ?>">
        <div class="bs-entorno-poi-icon text-primary me-3 flex-shrink-0" style="width: 24px; text-align: center;">
            <i class="<?php echo esc_attr($icon); ?>"></i>
        </div>
        <div class="bs-entorno-poi-content">
            <strong class="d-block mb-1"><?php echo wp_kses_post($name); ?></strong>
            <?php if (!empty($details)): ?>
                <span class="text-muted small"><?php echo wp_kses_post($details); ?></span>
            <?php endif; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function bootstrap_theme_register_bs_entorno_poi()
{
    register_block_type('bootstrap-theme/bs-entorno-poi', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_entorno_poi',
        'attributes' => array(
            'name' => array('type' => 'string', 'default' => 'Nuevo Punto'),
            'details' => array('type' => 'string', 'default' => ''),
            'icon' => array('type' => 'string', 'default' => 'fa-solid fa-map-pin'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_entorno_poi');
