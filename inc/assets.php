<?php
/**
 * Asset loading and helpers.
 */

if (!defined('ABSPATH')) {
    exit;
}

function ileben_hex_to_rgb($hex)
{
    $hex = ltrim($hex, '#');
    if (strlen($hex) === 3) {
        $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
    }
    $int = hexdec($hex);
    return [
        ($int >> 16) & 255,
        ($int >> 8) & 255,
        $int & 255,
    ];
}

function ileben_adjust_color($hex, $factor)
{
    [$r, $g, $b] = ileben_hex_to_rgb($hex);
    $adj = function ($c) use ($factor) {
        $v = (int) round($c * $factor);
        return max(0, min(255, $v));
    };
    return sprintf('#%02x%02x%02x', $adj($r), $adj($g), $adj($b));
}

function ileben_rgb_string($hex, $factor = 1.0)
{
    [$r, $g, $b] = ileben_hex_to_rgb($hex);
    $adj = function ($c) use ($factor) {
        $v = (int) round($c * $factor);
        return max(0, min(255, $v));
    };
    return $adj($r) . ', ' . $adj($g) . ', ' . $adj($b);
}

function ileben_find_asset($pattern)
{
    $dist_path = ILEBEN_THEME_DIR . '/dist/assets/';
    if (!is_dir($dist_path)) {
        return null;
    }

    $files = glob($dist_path . $pattern);
    if (!empty($files)) {
        return ILEBEN_THEME_URI . '/dist/assets/' . basename($files[0]);
    }

    return null;
}

function ileben_google_font_family()
{
    if (function_exists('get_field')) {
        $family = get_field('google_font_family', 'option');
        if ($family) {
            return $family;
        }
    }
    return 'Open Sans:wght@400;600;700';
}

add_action('wp_enqueue_scripts', function () {
    // Enqueue jQuery
    wp_enqueue_script('jquery');

    // Find compiled CSS file
    $css_file = ileben_find_asset('style-*.css');
    if ($css_file) {
        wp_enqueue_style('ileben-style', $css_file, [], ILEBEN_THEME_VERSION, 'all');
    }

    // Find compiled JS file (IIFE bundle)
    $js_file = ileben_find_asset('main-*.js');
    if ($js_file) {
        wp_enqueue_script('ileben-main', $js_file, [], ILEBEN_THEME_VERSION, true);

        // Localize global Swiper config from ACF Options
        if (function_exists('get_field')) {
            $breakpoints_raw = get_field('swiper_breakpoints', 'option');
            $breakpoints = null;
            if (is_string($breakpoints_raw) && $breakpoints_raw !== '') {
                $decoded = json_decode($breakpoints_raw, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $breakpoints = $decoded;
                }
            }
            if (!$breakpoints) {
                $breakpoints = [
                    768 => ['slidesPerView' => 1.5],
                    1024 => ['slidesPerView' => 2.2],
                ];
            }

            $swiper_config = [
                'enableNavigation' => (bool) get_field('swiper_enable_navigation', 'option'),
                'enablePagination' => (bool) get_field('swiper_enable_pagination', 'option'),
                'loop' => (bool) get_field('swiper_loop', 'option'),
                'speed' => (int) (get_field('swiper_speed', 'option') ?: 500),
                'autoplay' => (bool) get_field('swiper_autoplay', 'option'),
                'autoplayDelay' => (int) (get_field('swiper_autoplay_delay', 'option') ?: 4000),
                'spaceBetween' => (int) (get_field('swiper_space_between', 'option') ?: 16),
                'slidesPerView' => (float) (get_field('swiper_slides_per_view', 'option') ?: 1.1),
                'breakpoints' => $breakpoints,
            ];
            wp_localize_script('ileben-main', 'ILEBEN_SWIPER', $swiper_config);

            // Localize GSAP config from ACF Options
            $gsap_config = [
                'enableGsap' => (bool) get_field('enable_gsap', 'option'),
                'enableScrollTrigger' => (bool) get_field('enable_scrolltrigger', 'option'),
                'enableScrollTo' => (bool) get_field('enable_scrollto', 'option'),
                'enableDraggable' => (bool) get_field('enable_draggable', 'option'),
            ];
            wp_localize_script('ileben-main', 'ILEBEN_GSAP', $gsap_config);
        }
    }

    // Google Fonts enqueue
    $family = ileben_google_font_family();
    // Normalize family string: remove quotes, replace + with space
    $family = trim(str_replace('+', ' ', $family), " \t\n\r\0\x0B\"'");
    $google_url = sprintf('https://fonts.googleapis.com/css2?family=%s&display=swap', urlencode($family));
    wp_enqueue_style('ileben-google-fonts', $google_url, [], null);

    // Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', [], '6.4.0');

    // Theme base stylesheet
    wp_enqueue_style('ileben-theme-style', ILEBEN_THEME_URI . '/style.css', [], ILEBEN_THEME_VERSION);
});

/**
 * Enqueue Block Editor Styles (Gutenberg)
 */
add_action('enqueue_block_editor_assets', function () {
    $editor_css = ILEBEN_THEME_URI . '/dist/assets/editor.css';
    if (file_exists(ILEBEN_THEME_DIR . '/dist/assets/editor.css')) {
        wp_enqueue_style('ileben-editor-styles', $editor_css, ['wp-edit-blocks'], ILEBEN_THEME_VERSION);
    }
});

/**
 * Inject Bootstrap CSS variables from ACF options as inline style (head)
 */
add_action('wp_enqueue_scripts', function () {
    if (!function_exists('get_field')) {
        return;
    }

    $colors = [
        // Base colors
        'base' => [
            'blue' => get_field('color_blue', 'option') ?: '#0d6efd',
            'indigo' => get_field('color_indigo', 'option') ?: '#6610f2',
            'purple' => get_field('color_purple', 'option') ?: '#6f42c1',
            'pink' => get_field('color_pink', 'option') ?: '#d63384',
            'red' => get_field('color_red', 'option') ?: '#dc3545',
            'orange' => get_field('color_orange', 'option') ?: '#fd7e14',
            'yellow' => get_field('color_yellow', 'option') ?: '#ffc107',
            'green' => get_field('color_green', 'option') ?: '#198754',
            'teal' => get_field('color_teal', 'option') ?: '#20c997',
            'cyan' => get_field('color_cyan', 'option') ?: '#0dcaf0',
            'black' => get_field('color_black', 'option') ?: '#000',
            'white' => get_field('color_white', 'option') ?: '#fff',
            'gray' => get_field('color_gray', 'option') ?: '#6c757d',
            'gray-dark' => get_field('color_gray_dark', 'option') ?: '#343a40',
        ],
        // Gray scale
        'gray-scale' => [
            'gray-100' => get_field('color_gray_100', 'option') ?: '#f8f9fa',
            'gray-200' => get_field('color_gray_200', 'option') ?: '#e9ecef',
            'gray-300' => get_field('color_gray_300', 'option') ?: '#dee2e6',
            'gray-400' => get_field('color_gray_400', 'option') ?: '#ced4da',
            'gray-500' => get_field('color_gray_500', 'option') ?: '#adb5bd',
            'gray-600' => get_field('color_gray_600', 'option') ?: '#6c757d',
            'gray-700' => get_field('color_gray_700', 'option') ?: '#495057',
            'gray-800' => get_field('color_gray_800', 'option') ?: '#343a40',
            'gray-900' => get_field('color_gray_900', 'option') ?: '#212529',
        ],
        // Theme colors
        'theme-colors' => [
            'primary' => get_field('color_primary', 'option') ?: '#0d6efd',
            'secondary' => get_field('color_secondary', 'option') ?: '#6c757d',
            'success' => get_field('color_success', 'option') ?: '#198754',
            'info' => get_field('color_info', 'option') ?: '#0dcaf0',
            'warning' => get_field('color_warning', 'option') ?: '#ffc107',
            'danger' => get_field('color_danger', 'option') ?: '#dc3545',
            'light' => get_field('color_light', 'option') ?: '#f8f9fa',
            'dark' => get_field('color_dark', 'option') ?: '#212529',
        ],
        // Body colors
        'body-colors' => [
            'body-color' => get_field('color_body', 'option') ?: '#212529',
            'body-bg' => get_field('color_body_bg', 'option') ?: '#fff',
        ],
        // Link colors
        'link-colors' => [
            'link-color' => get_field('color_link', 'option') ?: '#0d6efd',
            'link-hover-color' => get_field('color_link_hover', 'option') ?: '#0a58ca',
        ],
        // Border
        'border' => [
            'border-color' => get_field('color_border', 'option') ?: '#dee2e6',
        ],
        // System colors
        'system-colors' => [
            'emphasis-color' => get_field('color_emphasis', 'option') ?: '#000',
            'secondary-color' => get_field('color_secondary_color', 'option') ?: '#212529',
            'secondary-bg' => get_field('color_secondary_bg', 'option') ?: '#e9ecef',
            'tertiary-color' => get_field('color_tertiary_color', 'option') ?: '#212529',
            'tertiary-bg' => get_field('color_tertiary_bg', 'option') ?: '#f8f9fa',
            'code-color' => get_field('color_code', 'option') ?: '#d63384',
            'highlight-color' => get_field('color_highlight', 'option') ?: '#212529',
            'highlight-bg' => get_field('color_highlight_bg', 'option') ?: '#fff3cd',
        ],
    ];

    // Borders
    $borders = [
        'border-width' => get_field('border_width', 'option') ?: '1px',
        'border-style' => get_field('border_style', 'option') ?: 'solid',
        'border-radius' => get_field('border_radius', 'option') ?: '0.375rem',
        'border-radius-sm' => get_field('border_radius_sm', 'option') ?: '0.25rem',
        'border-radius-lg' => get_field('border_radius_lg', 'option') ?: '0.5rem',
        'border-radius-xl' => get_field('border_radius_xl', 'option') ?: '1rem',
        'border-radius-xxl' => get_field('border_radius_xxl', 'option') ?: '2rem',
        'border-radius-pill' => get_field('border_radius_pill', 'option') ?: '50rem',
    ];

    // Box shadows
    $shadows = [
        'box-shadow' => get_field('box_shadow', 'option') ?: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        'box-shadow-sm' => get_field('box_shadow_sm', 'option') ?: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        'box-shadow-lg' => get_field('box_shadow_lg', 'option') ?: '0 1rem 3rem rgba(0, 0, 0, 0.175)',
        'box-shadow-inset' => get_field('box_shadow_inset', 'option') ?: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
    ];

    // Focus ring
    $focus = [
        'focus-ring-width' => get_field('focus_ring_width', 'option') ?: '0.25rem',
        'focus-ring-opacity' => get_field('focus_ring_opacity', 'option') ?: '0.25',
    ];
    $focus_ring_color = get_field('focus_ring_color', 'option') ?: '#0d6efd';

    // Typography
    $font_name = get_field('google_font_name', 'option') ?: '"Open Sans", sans-serif';
    $font_size = get_field('body_font_size', 'option') ?: '1rem';
    $font_size_mobile = get_field('body_font_size_mobile', 'option') ?: '14px';
    $font_weight = get_field('body_font_weight', 'option') ?: '400';

    // Build CSS with output buffering, then attach inline for deterministic order
    ob_start();
    ?>
:root {
<?php
    // Colors
    foreach ($colors as $category => $colorGroup) :
        foreach ($colorGroup as $name => $value) :
            if ($value) :
                ?>  --bs-<?php echo $name; ?>: <?php echo $value; ?>;
<?php       endif;
        endforeach;
    endforeach;
    // Borders
    foreach ($borders as $name => $value) :
        if ($value) :
            ?>  --bs-<?php echo $name; ?>: <?php echo $value; ?>;
<?php   endif;
    endforeach;
    // Box Shadows
    foreach ($shadows as $name => $value) :
        if ($value) :
            ?>  --bs-<?php echo $name; ?>: <?php echo $value; ?>;
<?php   endif;
    endforeach;
    // Focus Ring
    foreach ($focus as $name => $value) :
        if ($value) :
            ?>  --bs-<?php echo $name; ?>: <?php echo $value; ?>;
<?php   endif;
    endforeach;
?>  --bs-focus-ring-color: <?php echo $focus_ring_color; ?>;
  --bs-body-font-family: <?php echo $font_name; ?>;
  --bs-body-font-size: <?php echo $font_size; ?>;
  --bs-body-font-weight: <?php echo $font_weight; ?>;
  --swiper-theme-color: var(--bs-primary);
  --swiper-pagination-bullet-border-radius: var(--bs-border-radius-pill);
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-inactive-opacity: var(--bs-secondary-opacity);
  /* Wp Block Editor */
  --wp-block-font-size: 1rem;
   --wp--preset--font-size--small: 12px;
   --wp--preset--font-size--medium: 16px;
   --wp--preset--font-size--large: 20px;
   --wp--preset--font-size--x-large: 24px;
}
<?php
// Btns colors
        foreach ($colors['theme-colors'] as $theme => $value) :
                $base = $value ?: '#0d6efd';
                $hover_bg = ileben_adjust_color($base, 0.93);
                $hover_border = ileben_adjust_color($base, 0.9);
                $active_bg = ileben_adjust_color($base, 0.9);
                $active_border = ileben_adjust_color($base, 0.87);
                $focus_rgb = ileben_rgb_string($base, 1.3);
                ?>
.btn-<?php echo $theme; ?> {
    --bs-btn-bg: <?php echo $base; ?>;
    --bs-btn-border-color: <?php echo $base; ?>;
    --bs-btn-hover-bg: <?php echo $hover_bg; ?>;
    --bs-btn-hover-border-color: <?php echo $hover_border; ?>;
    --bs-btn-focus-shadow-rgb: <?php echo $focus_rgb; ?>;
    --bs-btn-active-bg: <?php echo $active_bg; ?>;
    --bs-btn-active-border-color: <?php echo $active_border; ?>;
    --bs-btn-disabled-bg: <?php echo $base; ?>;
    --bs-btn-disabled-border-color: <?php echo $base; ?>;
}
.btn-<?php echo $theme; ?> {
    --bs-btn-bg: <?php echo $base; ?>;
    --bs-btn-border-color: <?php echo $base; ?>;
    --bs-btn-hover-bg: <?php echo $hover_bg; ?>;
    --bs-btn-hover-border-color: <?php echo $hover_border; ?>;
    --bs-btn-focus-shadow-rgb: <?php echo $focus_rgb; ?>;
    --bs-btn-active-bg: <?php echo $active_bg; ?>;
    --bs-btn-active-border-color: <?php echo $active_border; ?>;
    --bs-btn-disabled-bg: <?php echo $base; ?>;
    --bs-btn-disabled-border-color: <?php echo $base; ?>;
}
.btn-outline-<?php echo $theme; ?> {
  --bs-btn-color: <?php echo $base; ?>;
  --bs-btn-border-color: <?php echo $base; ?>;
  --bs-btn-hover-bg: <?php echo $hover_bg; ?>;
  --bs-btn-hover-border-color: <?php echo $hover_border; ?>;
  --bs-btn-focus-shadow-rgb: <?php echo $focus_rgb; ?>;
  --bs-btn-active-bg: <?php echo $active_bg; ?>;
  --bs-btn-active-border-color: <?php echo $active_border; ?>;
  --bs-btn-disabled-color: <?php echo $base; ?>;
  --bs-btn-disabled-border-color: <?php echo $base; ?>;
}
<?php
        endforeach;
?>
/* inyect all colors from $colors with .has-X-color and .has-X-background-color */
<?php
    foreach ($colors as $category => $colorGroup) :
        foreach ($colorGroup as $name => $value) :
            if ($value) :
                ?>  
                .has-<?php echo $name; ?>-color{
                    color: <?php echo $value; ?>;
                }
                .has-<?php echo $name; ?>-background-color{
                    background-color: <?php echo $value; ?>;
                }
<?php       endif;
        endforeach;
    endforeach;
?>


/* Dark mode support */
[data-bs-theme=dark]{--bs-body-color:var(--bs-white);--bs-body-color-rgb:var(--bs-light-rgb);--bs-body-bg:var(--bs-dark);--bs-body-bg-rgb:var(--bs-dark-rgb);}
[data-bs-theme=light]{--bs-body-color:var(--bs-black);--bs-body-color-rgb:var(--bs-dark-rgb);--bs-body-bg:var(--bs-light);--bs-body-bg-rgb:var(--bs-light-rgb);}
@media (max-width:768px){html{font-size: <?php echo $font_size_mobile; ?>;}}
<?php
    $css = ob_get_clean();
    wp_add_inline_style('ileben-theme-style', $css);
}, 20);

