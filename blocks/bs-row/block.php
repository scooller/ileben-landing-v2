<?php
/**
 * Bootstrap Row Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Row Block
 */
function bootstrap_theme_render_bs_row_block($attributes, $content, $block) {
    $alignItems = $attributes['alignItems'] ?? '';
    $justifyContent = $attributes['justifyContent'] ?? '';
    $gutters = $attributes['gutters'] ?? '';
    $noGutters = $attributes['noGutters'] ?? false;
    
    // Build row classes
    $classes = array('row');
    
    if ($noGutters) {
        $classes[] = 'g-0';
    } else if (!empty($gutters)) {
        $classes[] = 'g-2';
        $classes[] = $gutters;
    }
    
    if (!empty($alignItems)) {
        $classes[] = $alignItems;
    }
    
    if (!empty($justifyContent)) {
        $classes[] = $justifyContent;
    }
    
    // Add custom CSS classes from Advanced panel
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    
    // Alternative way to get custom classes from block object
    if (isset($block->attributes['className']) && !empty($block->attributes['className'])) {
        $classes[] = $block->attributes['className'];
    }
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($class_string); ?>">
        <?php if (!empty($content)) : ?>
            <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        <?php else : ?>
            <div class="col"><p><?php echo esc_html__('Add columns to your row.', 'ileben-landing'); ?></p></div>
        <?php endif; ?>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Row Block
 */
function bootstrap_theme_register_bs_row_block() {
    register_block_type('bootstrap-theme/bs-row', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_row_block',
        'attributes' => array(
            'alignItems' => array(
                'type' => 'string',
                'default' => ''
            ),
            'justifyContent' => array(
                'type' => 'string',
                'default' => ''
            ),
            'gutters' => array(
                'type' => 'string',
                'default' => ''
            ),
            'noGutters' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_row_block');