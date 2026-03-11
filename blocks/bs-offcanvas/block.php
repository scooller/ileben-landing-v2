<?php
/**
 * Bootstrap Offcanvas Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Offcanvas Block
 */
function bootstrap_theme_render_bs_offcanvas_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? __('Offcanvas', 'ileben-landing');
    $placement = $attributes['placement'] ?? 'start';
    $backdrop = $attributes['backdrop'] ?? true;
    $scroll = $attributes['scroll'] ?? false;
    $buttonText = $attributes['buttonText'] ?? __('Toggle Offcanvas', 'ileben-landing');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-primary';
    $offcanvasId = $attributes['offcanvasId'] ?? 'offcanvas-' . uniqid();
    
    // Build offcanvas classes
    $offcanvas_classes = array('offcanvas', 'offcanvas-' . $placement);
    
    // Add custom CSS classes from Advanced panel
    $offcanvas_classes = bootstrap_theme_add_custom_classes($offcanvas_classes, $attributes, $block);
    
    $offcanvas_class_string = implode(' ', array_unique($offcanvas_classes));
    
    $offcanvas_data = array();
    if (!$backdrop) {
        $offcanvas_data['data-bs-backdrop'] = 'false';
    }
    if ($scroll) {
        $offcanvas_data['data-bs-scroll'] = 'true';
    }
    
    $data_attrs = '';
    foreach ($offcanvas_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    ob_start();
    ?>
    <button class="btn <?php echo esc_attr($buttonVariant); ?>" type="button" data-bs-toggle="offcanvas" data-bs-target="#<?php echo esc_attr($offcanvasId); ?>" aria-controls="<?php echo esc_attr($offcanvasId); ?>">
        <?php echo esc_html($buttonText); ?>
    </button>

    <div class="<?php echo esc_attr($offcanvas_class_string); ?>" tabindex="-1" id="<?php echo esc_attr($offcanvasId); ?>" aria-labelledby="<?php echo esc_attr($offcanvasId); ?>Label"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="<?php echo esc_attr($offcanvasId); ?>Label"><?php echo esc_html($title); ?></h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="<?php echo esc_attr__('Close', 'ileben-landing'); ?>"></button>
        </div>

        <div class="offcanvas-body">
            <div class="wp-block-bootstrap-theme-bs-offcanvas-content">
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </div>
        </div>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Offcanvas Block
 */
function bootstrap_theme_register_bs_offcanvas_block() {
    register_block_type('bootstrap-theme/bs-offcanvas', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_offcanvas_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Offcanvas'
            ),
            'placement' => array(
                'type' => 'string',
                'default' => 'start'
            ),
            'backdrop' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'scroll' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Toggle Offcanvas'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'offcanvasId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_offcanvas_block');