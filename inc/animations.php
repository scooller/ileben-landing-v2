<?php

/**
 * GSAP Animation Scripts Enqueue
 * 
 * Enqueue de scripts necesarios para animaciones GSAP
 * 
 * @package ileben_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue animation scripts and styles
 */
function bootstrap_theme_enqueue_animation_scripts()
{
    $version = defined('ILEBEN_THEME_VERSION') ? ILEBEN_THEME_VERSION : '0.1.0';

    // GSAP library (CDN)
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        [],
        '3.12.2',
        true
    );

    // ScrollTrigger plugin
    wp_enqueue_script(
        'gsap-scroll-trigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
        ['gsap'],
        '3.12.2',
        true
    );

    // Animation manager script is now bundled in main.js via Vite
    // No need to enqueue separately since it's imported in main.js

}
add_action('wp_enqueue_scripts', 'bootstrap_theme_enqueue_animation_scripts');
add_action('admin_enqueue_scripts', 'bootstrap_theme_enqueue_animation_scripts');

/**
 * Enqueue animation controls for Gutenberg editor
 */
function bootstrap_theme_enqueue_block_editor_assets()
{
    $version = defined('ILEBEN_THEME_VERSION') ? ILEBEN_THEME_VERSION : '0.1.0';

    wp_enqueue_script(
        'bootstrap-animation-controls',
        ILEBEN_THEME_URI . '/blocks/animation-controls.js',
        ['wp-blocks', 'wp-element', 'wp-components', 'wp-i18n'],
        $version,
        false
    );

    // Expose animation controls globally for block editors
    wp_localize_script(
        'bootstrap-animation-controls',
        'AnimationControlsReady',
        [
            'ready' => true
        ]
    );
}
add_action('enqueue_block_editor_assets', 'bootstrap_theme_enqueue_block_editor_assets');
