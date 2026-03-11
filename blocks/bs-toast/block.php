<?php
/**
 * Bootstrap Toast Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Toast Block
 */
function bootstrap_theme_render_bs_toast_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? __('Toast', 'ileben-landing');
    $subtitle = $attributes['subtitle'] ?? '';
    $autohide = $attributes['autohide'] ?? true;
    $delay = $attributes['delay'] ?? 5000;
    $position = $attributes['position'] ?? 'top-end';
    $toastId = $attributes['toastId'] ?? 'toast-' . uniqid();
    
    // Build toast container classes
    $container_classes = array('toast-container', 'position-fixed');
    
    switch ($position) {
        case 'top-start':
            $container_classes[] = 'top-0 start-0';
            break;
        case 'top-center':
            $container_classes[] = 'top-0 start-50 translate-middle-x';
            break;
        case 'top-end':
            $container_classes[] = 'top-0 end-0';
            break;
        case 'middle-start':
            $container_classes[] = 'top-50 start-0 translate-middle-y';
            break;
        case 'middle-center':
            $container_classes[] = 'top-50 start-50 translate-middle';
            break;
        case 'middle-end':
            $container_classes[] = 'top-50 end-0 translate-middle-y';
            break;
        case 'bottom-start':
            $container_classes[] = 'bottom-0 start-0';
            break;
        case 'bottom-center':
            $container_classes[] = 'bottom-0 start-50 translate-middle-x';
            break;
        case 'bottom-end':
            $container_classes[] = 'bottom-0 end-0';
            break;
    }
    
    // Add custom CSS classes from Advanced panel
    $container_classes = bootstrap_theme_add_custom_classes($container_classes, $attributes, $block);
    
    $container_class_string = implode(' ', array_unique($container_classes));
    
    $data_attrs = '';
    
    $toast_data = array();
    if ($autohide) {
        $toast_data['data-bs-autohide'] = 'true';
        $toast_data['data-bs-delay'] = $delay;
    } else {
        $toast_data['data-bs-autohide'] = 'false';
    }
    
    foreach ($toast_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($container_class_string); ?>" style="z-index: 1055;">
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="<?php echo esc_attr($toastId); ?>"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
            <div class="toast-header">
                <strong class="me-auto"><?php echo esc_html($title); ?></strong>
                <?php if (!empty($subtitle)) : ?>
                    <small class="text-muted"><?php echo esc_html($subtitle); ?></small>
                <?php endif; ?>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="<?php echo esc_attr__('Close', 'ileben-landing'); ?>"></button>
            </div>

            <div class="toast-body">
                <div class="wp-block-bootstrap-theme-bs-toast-content">
                    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                </div>
            </div>
        </div>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Toast Block
 */
function bootstrap_theme_register_bs_toast_block() {
    register_block_type('bootstrap-theme/bs-toast', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_toast_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Toast'
            ),
            'subtitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'autohide' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'delay' => array(
                'type' => 'integer',
                'default' => 5000
            ),
            'position' => array(
                'type' => 'string',
                'default' => 'top-end'
            ),
            'toastId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_toast_block');