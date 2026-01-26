<?php

/**
 * Bootstrap Blocks Registration
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

// Polyfill for str_starts_with when running under PHP < 8 (defensive, theme targets PHP 8+)
if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle)
    {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

// Include helper for className support when available
$class_fix_file = ILEBEN_THEME_DIR . '/inc/admin/blocks-className-fix.php';
if (file_exists($class_fix_file)) {
    require_once $class_fix_file;
}

/**
 * Include all Bootstrap blocks (alphabetically ordered)
 */

// Get all block directories
$blocks_dir = get_template_directory() . '/blocks';
if (is_dir($blocks_dir)) {
    $blocks = array_filter(glob($blocks_dir . '/*'), 'is_dir');

    foreach ($blocks as $block) {
        $block_name = basename($block);
        // Skip non-block directories
        if (!str_starts_with($block_name, 'bs-')) {
            continue;
        }

        // Skip WooCommerce blocks if WooCommerce is not active
        $woocommerce_blocks = ['bs-cart', 'bs-wc-products', 'bs-checkout-custom-fields', 'bs-shipping-methods'];
        if (in_array($block_name, $woocommerce_blocks, true) && !class_exists('WooCommerce')) {
            continue;
        }

        $block_file = $block . '/block.php';
        if (file_exists($block_file)) {
            require_once $block_file;
        }
    }
}

/**
 * Enqueue block editor assets
 */
function bootstrap_theme_block_editor_assets()
{
    // List of all Bootstrap blocks that need editor.js loaded
    $blocks_with_editors = [
        'bs-accordion',
        'bs-accordion-item',
        'bs-alert',
        'bs-badge',
        'bs-asesores',
        'bs-breadcrumb',
        'bs-breadcrumb-item',
        'bs-button',
        'bs-button-group',
        'bs-card',
        'bs-carousel',
        'bs-carousel-item',
        'bs-column',
        'bs-container',
        'bs-divider',
        'bs-dropdown',
        'bs-dropdown-divider',
        'bs-dropdown-item',
        'bs-fa-icon',
        'bs-gallery',
        'bs-list-group',
        'bs-list-group-item',
        'bs-menu',
        'bs-modal',
        'bs-offcanvas',
        'bs-pagination',
        'bs-pagination-item',
        'bs-parallax',
        'bs-progress',
        'bs-row',
        'bs-spinner',
        'bs-step-item',
        'bs-steps',
        'bs-tab-pane',
        'bs-tabs',
        'bs-toast',
        'bs-iframe',
        'bs-plantas-slider',
        'bs-cf7'
    ];

    // Add WooCommerce blocks only if WooCommerce is active
    if (class_exists('WooCommerce')) {
        $blocks_with_editors[] = 'bs-cart';
        $blocks_with_editors[] = 'bs-wc-products';
        $blocks_with_editors[] = 'bs-shipping-methods';
    }

    // Load editor.js for each block
    foreach ($blocks_with_editors as $block_name) {
        $editor_file = get_template_directory() . "/blocks/{$block_name}/editor.js";
        if (file_exists($editor_file)) {
            $handle = "bootstrap-theme-{$block_name}-editor";
            $editor_version = filemtime($editor_file) ?: ILEBEN_THEME_VERSION; // cache-bust when files change
            wp_enqueue_script(
                $handle,
                get_template_directory_uri() . "/blocks/{$block_name}/editor.js",
                array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data', 'wp-api-fetch'),
                $editor_version,
                true
            );

            // Pass options for plantas slider (dormitorios/banos) to the editor script
            if ($block_name === 'bs-plantas-slider' && function_exists('get_field')) {
                $build_choices = function ($field_name) {
                    $choices = [];
                    $rows = get_field($field_name, 'option');
                    if (is_array($rows)) {
                        foreach ($rows as $row) {
                            $active = !empty($row['activo']);
                            $text = isset($row['texto']) ? trim(wp_strip_all_tags($row['texto'])) : '';
                            if ($active && $text !== '') {
                                $choices[] = $text;
                            }
                        }
                    }
                    return $choices;
                };
                wp_add_inline_script($handle, 'window.BOOTSTRAP_THEME_PLANTAS_OPTIONS = ' . wp_json_encode([
                    'dorms' => $build_choices('dormitorios'),
                    'banos' => $build_choices('banos'),
                ]) . ';', 'before');
            }
        }
    }

    // Enqueue Bootstrap CSS for block editor (same as frontend)
    wp_enqueue_style(
        'bootstrap-editor',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        array(),
        '5.3.2'
    );

    // Enqueue FontAwesome for block editor
    wp_enqueue_style(
        'font-awesome-editor',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        array(),
        '6.4.0'
    );

    // Enqueue custom block editor styles
    wp_enqueue_style(
        'bootstrap-theme-blocks-editor',
        get_template_directory_uri() . '/blocks/blocks-editor.css',
        array('bootstrap-editor'),
        ILEBEN_THEME_VERSION
    );

    // Enqueue master block definitions (JS registers all block types for inserter)
    $blocks_master_js = ILEBEN_THEME_DIR . '/blocks/blocks.js';
    if (file_exists($blocks_master_js)) {
        wp_enqueue_script(
            'bootstrap-theme-blocks',
            ILEBEN_THEME_URI . '/blocks/blocks.js',
            array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data'),
            ILEBEN_THEME_VERSION,
            true
        );
    }

    // Enqueue animation controls utility
    $animation_controls_js = ILEBEN_THEME_DIR . '/blocks/animation-controls.js';
    if (file_exists($animation_controls_js)) {
        wp_enqueue_script(
            'bootstrap-theme-animation-controls',
            ILEBEN_THEME_URI . '/blocks/animation-controls.js',
            array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'),
            ILEBEN_THEME_VERSION,
            true
        );
    }

    // Enqueue core blocks extension (adds animation to core/heading and core/paragraph)
    $core_blocks_extension_js = ILEBEN_THEME_DIR . '/blocks/core-blocks-extension.js';
    if (file_exists($core_blocks_extension_js)) {
        wp_enqueue_script(
            'bootstrap-theme-core-blocks-extension',
            ILEBEN_THEME_URI . '/blocks/core-blocks-extension.js',
            array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-hooks', 'wp-compose', 'bootstrap-theme-animation-controls'),
            ILEBEN_THEME_VERSION,
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'bootstrap_theme_block_editor_assets');

// Fallback: force-load the master blocks script in the post editor screen in case another plugin/theme stops the standard hook
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'post.php' && $hook !== 'post-new.php') {
        return;
    }

    $blocks_master_js = ILEBEN_THEME_DIR . '/blocks/blocks.js';
    if (file_exists($blocks_master_js)) {
        wp_enqueue_script(
            'bootstrap-theme-blocks',
            ILEBEN_THEME_URI . '/blocks/blocks.js',
            array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'),
            ILEBEN_THEME_VERSION,
            true
        );
    }
});

/**
 * Register Ileben-landing block category
 */
function bootstrap_theme_register_block_category($categories)
{
    // Add Ileben-landing category at the beginning for better visibility
    array_unshift($categories, array(
        'slug'  => 'ileben-landing',
        'title' => __('Ileben-landing', 'bootstrap-theme'),
        'icon'  => 'admin-customizer'
    ));

    return $categories;
}
add_filter('block_categories_all', 'bootstrap_theme_register_block_category');

/**
 * Enqueue block frontend assets
 */
function bootstrap_theme_enqueue_block_assets()
{
    // Blocks frontend CSS is now included in the main compiled CSS (main.scss imports blocks-frontend.scss)

    // Enqueue Steps animation script
    wp_enqueue_script(
        'bootstrap-theme-steps-animation',
        get_template_directory_uri() . '/blocks/bs-steps/steps-animation.js',
        array(),
        ILEBEN_THEME_VERSION,
        true
    );

    // Enqueue WooCommerce block assets only if WooCommerce is active
    if (class_exists('WooCommerce')) {
        // Enqueue cart block specific styles
        wp_enqueue_style(
            'bootstrap-theme-cart-block',
            get_template_directory_uri() . '/blocks/bs-cart/cart-block.css',
            array(),
            ILEBEN_THEME_VERSION
        );

        // Enqueue cart block JavaScript
        wp_enqueue_script(
            'bootstrap-theme-cart-handler',
            get_template_directory_uri() . '/blocks/bs-cart/cart-update-handler.js',
            array('jquery'),
            ILEBEN_THEME_VERSION,
            true
        );

        // Localize script with AJAX URL
        wp_localize_script('bootstrap-theme-cart-handler', 'bootstrapThemeCart', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('bootstrap_theme_cart_nonce')
        ));
    }
}
add_action('enqueue_block_assets', 'bootstrap_theme_enqueue_block_assets');
