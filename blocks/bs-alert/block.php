<?php
/**
 * Bootstrap Alert Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Alert Block
 */
function bootstrap_theme_render_bs_alert_block($attributes, $content, $block) {
    $variant = $attributes['variant'] ?? 'primary';
    $dismissible = $attributes['dismissible'] ?? false;
    $heading = $attributes['heading'] ?? '';
    
    // ...existing code...
    
    // Build alert classes
    $classes = array('alert', 'alert-' . $variant);
    
    if ($dismissible) {
        $classes[] = 'alert-dismissible';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($class_string); ?>" role="alert">
        <?php if (!empty($heading)) : ?>
            <h4 class="alert-heading"><?php echo esc_html($heading); ?></h4>
        <?php endif; ?>

        <?php if (!empty($content)) : ?>
            <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        <?php else : ?>
            <p><?php echo esc_html__('Please add content to your alert.', 'ileben-landing'); ?></p>
        <?php endif; ?>

        <?php if ($dismissible) : ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="<?php echo esc_attr__('Close', 'ileben-landing'); ?>"></button>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Alert Block
 */
function bootstrap_theme_register_bs_alert_block() {
    register_block_type('bootstrap-theme/bs-alert', array(
        'render_callback' => 'bootstrap_theme_render_bs_alert_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'variant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'dismissible' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'heading' => array(
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
add_action('init', 'bootstrap_theme_register_bs_alert_block');