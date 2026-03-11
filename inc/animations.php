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

// GSAP runtime is loaded from the Vite bundle via dynamic imports in assets/js/main.js.
// This file only registers block editor controls for animation settings.

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
