<?php
/**
 * Theme bootstrap file.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ILEBEN_THEME_VERSION', '0.1.4');
define('ILEBEN_THEME_DIR', get_template_directory());
define('ILEBEN_THEME_URI', get_template_directory_uri());

// Alias to reuse the existing block package versioning without edits across files.
if (!defined('BOOTSTRAP_THEME_VERSION')) {
    define('BOOTSTRAP_THEME_VERSION', ILEBEN_THEME_VERSION);
}

$theme_includes = [
    '/inc/setup.php',
    '/inc/assets.php',
    '/inc/acf.php',
    '/inc/acf-hooks.php',
    '/inc/cpt-plantas.php',
    '/inc/template-tags.php',
    '/inc/shortcodes.php',
    '/inc/bootstrap-navwalker.php',
    '/inc/color-scheme-switcher.php',
    '/inc/blocks-helpers.php',
    '/blocks/blocks.php',
];

foreach ($theme_includes as $file) {
    $filepath = ILEBEN_THEME_DIR . $file;
    if (file_exists($filepath)) {
        require_once $filepath;
    }
}

// Include theme editor styles, our blocks editor styles, and Bootstrap CSS so grid/components preview correctly.
add_editor_style( array(
    'assets/css/editor-style.css',
    'blocks/blocks-editor.css',
) );

function add_custom_logo_class( $html ) {
    $html = str_replace( 'class="custom-logo"', 'class="custom-logo mx-auto"', $html );
    return $html;
}
add_filter( 'get_custom_logo', 'add_custom_logo_class' );

// check if ACF is active
if ( function_exists( 'get_field' ) ) {
    // Show admin bar
    if ( get_field( 'show_admin_bar', 'option' ) == 'Si' ) {
        add_filter( 'show_admin_bar', '__return_true' );
    } else {
        add_filter( 'show_admin_bar', '__return_false' );
    }
}
