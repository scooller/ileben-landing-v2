<?php
/**
 * Bootstrap Navbar Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Navbar Block
 */
function bootstrap_theme_render_bs_navbar_block($attributes, $content, $block) {
    $brand = $attributes['brand'] ?? '';
    $brandImage = $attributes['brandImage'] ?? '';
    $expand = $attributes['expand'] ?? 'lg';
    $theme = $attributes['theme'] ?? 'light';
    $background = $attributes['background'] ?? 'light';
    $fixed = $attributes['fixed'] ?? '';
    $navbarId = $attributes['navbarId'] ?? 'navbar-' . uniqid();
    
    // Build navbar classes
    $classes = array('navbar');
    
    if (!empty($expand)) {
        $classes[] = 'navbar-expand-' . $expand;
    }
    
    $classes[] = 'navbar-' . $theme;
    $classes[] = 'bg-' . $background;
    
    if (!empty($fixed)) {
        $classes[] = 'fixed-' . $fixed;
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <nav class="<?php echo esc_attr($class_string); ?>">
        <div class="container-fluid">
            <?php if (!empty($brand) || !empty($brandImage)) : ?>
                <a class="navbar-brand" href="#">
                    <?php if (!empty($brandImage)) : ?>
                        <img src="<?php echo esc_url($brandImage); ?>" alt="<?php echo esc_attr($brand); ?>" width="30" height="24" class="d-inline-block align-text-top">
                        <?php if (!empty($brand)) : ?>
                            <?php echo esc_html($brand); ?>
                        <?php endif; ?>
                    <?php else : ?>
                        <?php echo esc_html($brand); ?>
                    <?php endif; ?>
                </a>
            <?php endif; ?>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#<?php echo esc_attr($navbarId); ?>" aria-controls="<?php echo esc_attr($navbarId); ?>" aria-expanded="false" aria-label="<?php echo esc_attr__('Toggle navigation', 'ileben-landing'); ?>">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="<?php echo esc_attr($navbarId); ?>">
                <div class="wp-block-bootstrap-theme-bs-navbar-content">
                    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                </div>
            </div>
        </div>
    </nav>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Navbar Block
 */
function bootstrap_theme_register_bs_navbar_block() {
    register_block_type('bootstrap-theme/bs-navbar', array(
        'render_callback' => 'bootstrap_theme_render_bs_navbar_block',
        'attributes' => array(
            'brand' => array(
                'type' => 'string',
                'default' => ''
            ),
            'brandImage' => array(
                'type' => 'string',
                'default' => ''
            ),
            'expand' => array(
                'type' => 'string',
                'default' => 'lg'
            ),
            'theme' => array(
                'type' => 'string',
                'default' => 'light'
            ),
            'background' => array(
                'type' => 'string',
                'default' => 'light'
            ),
            'fixed' => array(
                'type' => 'string',
                'default' => ''
            ),
            'navbarId' => array(
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
add_action('init', 'bootstrap_theme_register_bs_navbar_block');