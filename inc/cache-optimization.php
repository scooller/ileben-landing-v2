<?php

/**
 * Cache optimization for WordPress
 * Reduces server response time by caching expensive operations
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Cache key generator with versioning
 */
function ileben_cache_key($operation, $args = [])
{
    $key = 'ileben_' . $operation;
    if (!empty($args)) {
        $key .= '_' . md5(json_encode($args));
    }
    return $key;
}

/**
 * Get cached value with fallback
 * Cache only works in production (when ILEBEN_DEV_MODE = false)
 */
function ileben_get_cached($key, $callback, $expiration = 3600)
{
    // Disable cache in development mode
    if (defined('ILEBEN_DEV_MODE') && ILEBEN_DEV_MODE === true) {
        return call_user_func($callback);
    }

    $cache = get_transient($key);

    if ($cache !== false) {
        return $cache;
    }

    // Cache miss - call callback to generate value
    $value = call_user_func($callback);

    if ($value !== false) {
        set_transient($key, $value, $expiration);
    }

    return $value;
}

/**
 * Cache ACF options to reduce database queries
 */
class Ileben_ACF_Cache
{
    private static $cache_expiration = 3600; // 1 hour
    private static $cached = [];

    /**
     * Get ACF field with caching
     * Cache only works in production (when ILEBEN_DEV_MODE = false)
     */
    public static function get_field($field_name, $post_id = 'option')
    {
        if (!function_exists('get_field')) {
            return null;
        }

        // Disable cache in development mode
        if (defined('ILEBEN_DEV_MODE') && ILEBEN_DEV_MODE === true) {
            return get_field($field_name, $post_id);
        }

        $cache_key = 'acf_' . $post_id . '_' . $field_name;

        // Check memory cache first
        if (isset(self::$cached[$cache_key])) {
            return self::$cached[$cache_key];
        }

        // Check transient
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            self::$cached[$cache_key] = $cached;
            return $cached;
        }

        // Get fresh value
        $value = get_field($field_name, $post_id);

        // Store in caches
        if ($value !== false) {
            set_transient($cache_key, $value, self::$cache_expiration);
            self::$cached[$cache_key] = $value;
        }

        return $value;
    }

    /**
     * Clear all ACF caches
     */
    public static function clear_all()
    {
        global $wpdb;

        // Clear ACF transients
        $wpdb->query(
            "DELETE FROM {$wpdb->options} 
            WHERE option_name LIKE '%acf_%' 
            OR option_name LIKE '%_transient_acf_%'
            OR option_name LIKE '%_transient_timeout_acf_%'"
        );

        self::$cached = [];
    }

    /**
     * Clear specific field cache
     */
    public static function clear_field($field_name, $post_id = 'option')
    {
        $cache_key = 'acf_' . $post_id . '_' . $field_name;
        delete_transient($cache_key);
        unset(self::$cached[$cache_key]);
    }
}

/**
 * Hook into ACF save to clear related caches
 */
if (function_exists('get_field')) {
    add_action('acf/save_post', function () {
        // Clear all ACF caches when any ACF field is saved
        // This ensures fresh data after updates
        Ileben_ACF_Cache::clear_all();

        // Clear page-level cache
        wp_cache_flush();
    }, 100);
}

/**
 * Cache expensive queries for color schemes
 */
function ileben_get_cached_color($field_name, $default)
{
    return ileben_get_cached(
        ileben_cache_key('color', ['field' => $field_name]),
        function () use ($field_name, $default) {
            if (function_exists('get_field')) {
                $value = get_field($field_name, 'option');
                return $value ?: $default;
            }
            return $default;
        },
        3600 // 1 hour cache
    );
}

/**
 * Cache boolean options
 */
function ileben_get_cached_option($field_name, $default = false)
{
    return ileben_get_cached(
        ileben_cache_key('option', ['field' => $field_name]),
        function () use ($field_name, $default) {
            if (function_exists('get_field')) {
                return (bool) get_field($field_name, 'option');
            }
            return $default;
        },
        3600
    );
}

/**
 * Cache template data
 */
function ileben_get_cached_template_data($template_id, $callback, $expiration = 3600)
{
    $cache_key = ileben_cache_key('template_' . $template_id);
    return ileben_get_cached($cache_key, $callback, $expiration);
}

/**
 * Preload critical caches on admin
 * Only in production mode
 */
add_action('admin_init', function () {
    // Skip preload in development mode
    if (defined('ILEBEN_DEV_MODE') && ILEBEN_DEV_MODE === true) {
        return;
    }

    // Preload critical color fields to avoid timeout during admin
    if (function_exists('get_field')) {
        $critical_fields = [
            'color_primary',
            'color_secondary',
            'dev_mode',
            'show_admin_bar'
        ];

        foreach ($critical_fields as $field) {
            Ileben_ACF_Cache::get_field($field, 'option');
        }
    }
});

/**
 * Add cache headers to responses
 * Only in production mode
 */
add_action('send_headers', function () {
    // Disable cache headers in development mode
    if (defined('ILEBEN_DEV_MODE') && ILEBEN_DEV_MODE === true) {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        return;
    }

    // Allow browser caching for static resources in production
    if (is_front_page() || is_home()) {
        header('Cache-Control: public, max-age=3600'); // 1 hour cache
    } else {
        header('Cache-Control: public, max-age=1800'); // 30 min for other pages
    }
});

/**
 * Optimize database queries
 */
add_action('init', function () {
    // Prevent unnecessary post meta queries
    add_filter('posts_where', function ($where) {
        // This will be extended as needed for specific queries
        return $where;
    });
});

/**
 * Cache sitemap data
 */
add_filter('wp_sitemaps_posts_query_args', function ($args) {
    // Reduce query load by increasing posts per query
    $args['posts_per_page'] = 500;
    return $args;
});

/**
 * Reduce heartbeat frequency
 */
add_filter('heartbeat_settings', function ($settings) {
    $settings['interval'] = 60; // Reduce to 60 seconds (default is 15-60)
    return $settings;
}, 10, 1);

// Admin only
if (is_admin()) {
    /**
     * Disable heartbeat on non-essential admin pages
     */
    add_action('admin_enqueue_scripts', function () {
        global $pagenow;

        // Disable on most admin pages, keep only on post edit
        if ($pagenow !== 'post.php' && $pagenow !== 'post-new.php') {
            wp_deregister_script('heartbeat');
            // Prevent wp-auth-check notice: it depends on heartbeat
            wp_dequeue_script('wp-auth-check');
            wp_deregister_script('wp-auth-check');
        }
    });
}

/**
 * Provide cache stats for debugging
 */
function ileben_get_cache_stats()
{
    global $wpdb;

    return [
        'transients' => $wpdb->get_var(
            "SELECT COUNT(*) FROM {$wpdb->options} 
            WHERE option_name LIKE '%transient_ileben_%'"
        ),
        'query_count' => $wpdb->num_queries,
        'query_time' => $wpdb->elapsed_time,
    ];
}
