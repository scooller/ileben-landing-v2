<?php
/**
 * Bootstrap Breadcrumb Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Breadcrumb Block
 */
function bootstrap_theme_render_bs_breadcrumb_block($attributes, $content, $block) {
    $divider = $attributes['divider'] ?? '';
    
    // Build breadcrumb classes
    $classes = array('breadcrumb');
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $divider_style = '';
    if (!empty($divider)) {
        $divider_style = "--bs-breadcrumb-divider: '" . esc_attr($divider) . "';";
    }

    ob_start();
    ?>
    <nav aria-label="<?php echo esc_attr__('breadcrumb', 'ileben-landing'); ?>">
        <ol class="<?php echo esc_attr($class_string); ?>"<?php echo $divider_style ? ' style="' . esc_attr($divider_style) . '"' : ''; ?>>
            <?php if (!empty($content)) : ?>
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php else : ?>
                <li class="breadcrumb-item"><a href="#"><?php echo esc_html__('Home', 'ileben-landing'); ?></a></li>
                <li class="breadcrumb-item active" aria-current="page"><?php echo esc_html__('Current Page', 'ileben-landing'); ?></li>
            <?php endif; ?>
        </ol>
    </nav>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Breadcrumb Block
 */
function bootstrap_theme_register_bs_breadcrumb_block() {
    register_block_type('bootstrap-theme/bs-breadcrumb', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_breadcrumb_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'divider' => array(
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
add_action('init', 'bootstrap_theme_register_bs_breadcrumb_block');