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

// Centralized library versions — single source of truth
define('ILEBEN_FA_VERSION', '7.2.0');
define('ILEBEN_FA_URL', 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@' . ILEBEN_FA_VERSION . '/css/all.min.css');

define('ILEBEN_BS_VERSION', '5.3.3');
define('ILEBEN_BS_CSS_URL', 'https://cdn.jsdelivr.net/npm/bootstrap@' . ILEBEN_BS_VERSION . '/dist/css/bootstrap.min.css');

define('ILEBEN_SELECT2_VERSION', '4.1.0-rc.0');
define('ILEBEN_SELECT2_CSS_URL', 'https://cdn.jsdelivr.net/npm/select2@' . ILEBEN_SELECT2_VERSION . '/dist/css/select2.min.css');
define('ILEBEN_SELECT2_JS_URL', 'https://cdn.jsdelivr.net/npm/select2@' . ILEBEN_SELECT2_VERSION . '/dist/js/select2.min.js');

/**
 * Initialize theme constants after ACF is ready
 */
function ileben_init_constants()
{
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
    '/inc/api-sync.php',
    '/inc/github-updater.php',
    '/inc/showcase-generator.php',
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
function ileben_configure_admin_bar()
{
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
 * Check if the utm-tag-leben plugin is active.
 */
function ileben_is_utm_tag_plugin_active()
{
    return class_exists('UTM_Tag_Leben');
}

/**
 * Append UTM parameters from cookies (set by utm-tag-leben plugin) to a URL.
 * If the URL already has a given UTM param, it won't be overwritten.
 *
 * @param string $url
 * @return string
 */
function ileben_append_utm_params($url)
{
    if (empty($url) || !ileben_is_utm_tag_plugin_active()) {
        return $url;
    }

    // Default UTM keys (matches utm-tag-leben defaults)
    $default_keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    $params       = get_option('utm_tag_leben_params', []);
    $keys         = [];

    if (is_array($params) && !empty($params)) {
        foreach ($params as $item) {
            if (!empty($item['key'])) {
                $keys[] = sanitize_text_field($item['key']);
            }
        }
    }
    if (empty($keys)) {
        $keys = $default_keys;
    }

    // Parse existing query params in the URL
    $parsed     = wp_parse_url($url);
    $existing   = [];
    if (!empty($parsed['query'])) {
        wp_parse_str($parsed['query'], $existing);
    }

    $utm_values = [];
    foreach ($keys as $key) {
        // Skip if URL already has this param
        if (isset($existing[$key])) {
            continue;
        }
        // Read from cookie
        if (isset($_COOKIE[$key]) && !empty($_COOKIE[$key])) {
            $utm_values[$key] = sanitize_text_field(wp_unslash($_COOKIE[$key]));
        }
    }

    if (!empty($utm_values)) {
        $url = add_query_arg($utm_values, $url);
    }

    return $url;
}

/**
 * Warn admin if utm-tag-leben plugin is not active.
 * Without it, UTM parameters will not be appended to cotizar URLs.
 */
function ileben_check_utm_tag_plugin_notice()
{
    if (!ileben_is_utm_tag_plugin_active()) {
?>
        <div class="notice notice-warning is-dismissible">
            <p>
                <strong>⚠️ <?php _e('Plugin requerido', 'ileben-landing'); ?>:</strong>
                <?php
                printf(
                    /* translators: %s: URL to the plugin settings page */
                    __('El plugin <strong>utm-tag-leben</strong> no está instalado o activo. Sin este plugin, los parámetros UTM no se agregarán a los enlaces de cotización de las plantas. <a href="%s">Ver plugins instalados</a>', 'ileben-landing'),
                    esc_url(admin_url('plugins.php'))
                );
                ?>
        </div>
    <?php
    }
}
add_action('admin_notices', 'ileben_check_utm_tag_plugin_notice');

/**
 * Add admin CSS
 */
function ileben_admin_custom_css()
{
    ob_start();
    ?>
    <style>
        #side-sortables {
            position: fixed;
        }
    </style>
<?php
    echo ob_get_clean();
}
add_action('admin_head', 'ileben_admin_custom_css');
