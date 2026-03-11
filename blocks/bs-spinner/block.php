<?php
/**
 * Bootstrap Spinner Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Spinner Block
 */
function bootstrap_theme_render_bs_spinner_block($attributes, $content, $block) {
    $type = $attributes['type'] ?? 'border';
    $variant = $attributes['variant'] ?? '';
    $size = $attributes['size'] ?? '';
    $label = $attributes['label'] ?? __('Loading...', 'ileben-landing');
    $alignment = $attributes['alignment'] ?? '';
    
    // Build spinner classes
    $classes = array('spinner-' . $type);
    
    if (!empty($variant)) {
        $classes[] = 'text-' . $variant;
    }
    
    if (!empty($size)) {
        $classes[] = 'spinner-' . $type . '-' . $size;
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $wrapper_classes = array();
    
    if (!empty($alignment)) {
        switch ($alignment) {
            case 'center':
                $wrapper_classes[] = 'd-flex justify-content-center';
                break;
            case 'right':
                $wrapper_classes[] = 'd-flex justify-content-end';
                break;
            case 'left':
            default:
                $wrapper_classes[] = 'd-flex justify-content-start';
                break;
        }
    }
    
    $wrapper_class_string = !empty($wrapper_classes) ? implode(' ', $wrapper_classes) : '';

    ob_start();
    ?>
    <?php if (!empty($wrapper_class_string)) : ?>
        <div class="<?php echo esc_attr($wrapper_class_string); ?>">
    <?php endif; ?>

    <div class="<?php echo esc_attr($class_string); ?>" role="status">
        <span class="visually-hidden"><?php echo esc_html($label); ?></span>
    </div>

    <?php if (!empty($wrapper_class_string)) : ?>
        </div>
    <?php endif; ?>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Spinner Block
 */
function bootstrap_theme_register_bs_spinner_block() {
    register_block_type('bootstrap-theme/bs-spinner', array(
        'render_callback' => 'bootstrap_theme_render_bs_spinner_block',
        'attributes' => array(
            'type' => array(
                'type' => 'string',
                'default' => 'border'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => ''
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'label' => array(
                'type' => 'string',
                'default' => 'Loading...'
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
add_action('init', 'bootstrap_theme_register_bs_spinner_block');