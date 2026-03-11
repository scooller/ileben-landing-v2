<?php

/**
 * Theme bootstrap file.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define theme directory constants
define('ILEBEN_THEME_DIR', get_template_directory());
define('ILEBEN_THEME_URI', get_template_directory_uri());

/**
 * Initialize theme constants after ACF is ready
 */
function ileben_init_constants() {
    // Check dev mode from ACF if available
    $dev_mode = false;
    if (function_exists('get_field')) {
        $dev_mode = (bool) get_field('dev_mode', 'option');
    }
    
    // Define dev mode constant
    if (!defined('ILEBEN_DEV_MODE')) {
        define('ILEBEN_DEV_MODE', $dev_mode);
    }
    
    // Define theme version constant
    if (!defined('ILEBEN_THEME_VERSION')) {
        if (ILEBEN_DEV_MODE) {
            // Development versioning for cache busting
            define('ILEBEN_THEME_VERSION', rand(100000, 999999));
        } else {
            // Production versioning
            define('ILEBEN_THEME_VERSION', wp_get_theme()->get('Version'));
        }
    }
}
add_action('after_setup_theme', 'ileben_init_constants', 1);

$theme_includes = [
    '/inc/cache-optimization.php', // Load caching first to benefit all modules
    '/inc/setup.php',
    '/inc/assets.php',
    '/inc/acf.php',
    '/inc/acf-hooks.php',
    '/inc/cpt-plantas.php',
    '/inc/template-tags.php',
    '/inc/shortcodes.php',
    '/inc/bootstrap-navwalker.php',
    '/inc/color-scheme-switcher.php',
    '/inc/cf7.php',
    '/inc/blocks-helpers.php',
    '/inc/animations.php',
    '/inc/core-blocks-animation.php',
    '/inc/github-updater.php',
    '/blocks/blocks.php',
];

foreach ($theme_includes as $file) {
    $filepath = ILEBEN_THEME_DIR . $file;
    if (file_exists($filepath)) {
        require_once $filepath;
    }
}

/**
 * Configure admin bar visibility based on ACF settings
 */
function ileben_configure_admin_bar() {
    if (function_exists('get_field')) {
        $show_admin_bar = get_field('show_admin_bar', 'option');
        if ($show_admin_bar) {
            add_filter('show_admin_bar', '__return_true');
        } else {
            add_filter('show_admin_bar', '__return_false');
        }
    }
}
add_action('after_setup_theme', 'ileben_configure_admin_bar');

function add_custom_logo_class($html)
{
    $html = str_replace('class="custom-logo"', 'class="custom-logo mx-auto"', $html);
    return $html;
}
add_filter('get_custom_logo', 'add_custom_logo_class');

/**
 * Add admin CSS
 */
function ileben_admin_custom_css() {
    ob_start();
    ?>
    <style>
        #side-sortables { position: fixed; }
    </style>
    <?php
    echo ob_get_clean();
}
add_action('admin_head', 'ileben_admin_custom_css');