<?php
/**
 * Bootstrap Collapse Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Collapse Block
 */
function bootstrap_theme_render_bs_collapse_block($attributes, $content, $block) {
    $collapseId = $attributes['collapseId'] ?? 'collapse-' . uniqid();
    $buttonText = $attributes['buttonText'] ?? __('Toggle Collapse', 'ileben-landing');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-primary';
    $horizontal = $attributes['horizontal'] ?? false;
    $show = $attributes['show'] ?? false;
    
    // Build collapse classes
    $collapse_classes = array('collapse');
    
    if ($horizontal) {
        $collapse_classes[] = 'collapse-horizontal';
    }
    
    if ($show) {
        $collapse_classes[] = 'show';
    }
    
    // Add custom CSS classes from Advanced panel
    $collapse_classes = bootstrap_theme_add_custom_classes($collapse_classes, $attributes, $block);
    
    $collapse_class_string = implode(' ', array_unique($collapse_classes));
    
    ob_start();
    ?>
    <button class="btn <?php echo esc_attr($buttonVariant); ?>" type="button" data-bs-toggle="collapse" data-bs-target="#<?php echo esc_attr($collapseId); ?>" aria-expanded="<?php echo $show ? 'true' : 'false'; ?>" aria-controls="<?php echo esc_attr($collapseId); ?>">
        <?php echo esc_html($buttonText); ?>
    </button>

    <div class="<?php echo esc_attr($collapse_class_string); ?>" id="<?php echo esc_attr($collapseId); ?>">
        <div class="card card-body">
            <div class="wp-block-bootstrap-theme-bs-collapse-content">
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </div>
        </div>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Collapse Block
 */
function bootstrap_theme_register_bs_collapse_block() {
    register_block_type('bootstrap-theme/bs-collapse', array(
        'api_version' => 3,
        'render_callback' => 'bootstrap_theme_render_bs_collapse_block',
        'attributes' => array(
            'collapseId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Toggle Collapse'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'horizontal' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'show' => array(
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
add_action('init', 'bootstrap_theme_register_bs_collapse_block');