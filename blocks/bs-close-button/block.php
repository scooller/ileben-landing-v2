<?php
/**
 * Bootstrap Close Button Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Close Button Block
 */
function bootstrap_theme_render_bs_close_button_block($attributes, $content, $block) {
    $disabled = $attributes['disabled'] ?? false;
    $white = $attributes['white'] ?? false;
    $ariaLabel = $attributes['ariaLabel'] ?? __('Close', 'ileben-landing');
    
    // Build close button classes
    $classes = array('btn-close');
    
    if ($white) {
        $classes[] = 'btn-close-white';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <button type="button" class="<?php echo esc_attr($class_string); ?>" aria-label="<?php echo esc_attr($ariaLabel); ?>"<?php echo $disabled ? ' disabled' : ''; ?>></button>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Close Button Block
 */
function bootstrap_theme_register_bs_close_button_block() {
    register_block_type('bootstrap-theme/bs-close-button', array(
        'render_callback' => 'bootstrap_theme_render_bs_close_button_block',
        'attributes' => array(
            'disabled' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'white' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'ariaLabel' => array(
                'type' => 'string',
                'default' => 'Close'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_close_button_block');