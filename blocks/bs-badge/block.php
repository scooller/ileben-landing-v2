<?php
/**
 * Bootstrap Badge Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Badge Block
 */
function bootstrap_theme_render_bs_badge_block($attributes, $content, $block) {
    $variant = $attributes['variant'] ?? 'primary';
    $is_badge_pill = !empty($attributes['pill']);
    $text = $attributes['text'] ?? __('Badge', 'ileben-landing');
    $size = $attributes['size'] ?? '';
    
    // Build badge classes
    $classes = array('badge', 'bg-' . $variant);
    
    if ($is_badge_pill) {
        $classes[] = 'rounded-pill';
    }
    
    if (!empty($size)) {
        $classes[] = $size;
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <span class="<?php echo esc_attr($class_string); ?>"><?php echo esc_html($text); ?></span>
    <?php
    return ob_get_clean();
}

/**
 * Register Bootstrap Badge Block
 */
function bootstrap_theme_register_bs_badge_block() {
    register_block_type('bootstrap-theme/bs-badge', array(
        'render_callback' => 'bootstrap_theme_render_bs_badge_block',
        'attributes' => array(
            'variant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'pill' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'text' => array(
                'type' => 'string',
                'default' => 'Badge'
            ),
            'size' => array(
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
add_action('init', 'bootstrap_theme_register_bs_badge_block');