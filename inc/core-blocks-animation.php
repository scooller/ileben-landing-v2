<?php
/**
 * Core Blocks Animation Support
 * Adds animation data attributes to core/heading and core/paragraph blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register animation attributes for core blocks
 * 
 * NOTE: Attributes are registered in JavaScript (blocks/core-blocks-extension.js)
 * We don't register them here to avoid WordPress passing empty/null values
 */
// Removed server-side registration to prevent default value pollution

/**
 * Add animation attributes to core blocks on render
 */
function ileben_add_animation_to_core_blocks($block_content, $block) {
    // Debug: see incoming attrs for core blocks
    /*if (in_array($block['blockName'], ['core/heading', 'core/paragraph'], true)) {
        error_log('[core-anim] ' . $block['blockName'] . ' attrs: ' . json_encode($block['attrs'] ?? []));
    }*/
    // Only process heading and paragraph blocks
    if (!in_array($block['blockName'], ['core/heading', 'core/paragraph'])) {
        return $block_content;
    }

    // Check if block has animation type and it's not empty
    if (!isset($block['attrs']['animationType']) || $block['attrs']['animationType'] === '') {
        return $block_content;
    }

    $attrs = $block['attrs'];
    
    // Build data attributes array - only add attributes that are actually set
    $data_attrs = [];
    
    // Required: animation type
    $data_attrs['data-animate-type'] = $attrs['animationType'];
    
    // Optional: only add if set and not empty
    if (!empty($attrs['animationTrigger'])) {
        $data_attrs['data-animate-trigger'] = $attrs['animationTrigger'];
    }
    
    if (isset($attrs['animationDuration']) && $attrs['animationDuration'] !== '') {
        $data_attrs['data-animate-duration'] = $attrs['animationDuration'];
    }
    
    if (isset($attrs['animationDelay']) && $attrs['animationDelay'] !== '') {
        $data_attrs['data-animate-delay'] = $attrs['animationDelay'];
    }
    
    if (!empty($attrs['animationEase'])) {
        $data_attrs['data-animate-ease'] = $attrs['animationEase'];
    }
    
    if (isset($attrs['animationRepeat']) && $attrs['animationRepeat'] !== '') {
        $data_attrs['data-animate-repeat'] = $attrs['animationRepeat'];
    }
    
    if (isset($attrs['animationRepeatDelay']) && $attrs['animationRepeatDelay'] !== '') {
        $data_attrs['data-animate-repeat-delay'] = $attrs['animationRepeatDelay'];
    }
    
    if (isset($attrs['animationYoyo']) && $attrs['animationYoyo'] === true) {
        $data_attrs['data-animate-yoyo'] = 'true';
    }
    
    if (!empty($attrs['animationDistance'])) {
        $data_attrs['data-animate-distance'] = $attrs['animationDistance'];
    }
    
    if (isset($attrs['animationRotation']) && $attrs['animationRotation'] !== '') {
        $data_attrs['data-animate-rotation'] = $attrs['animationRotation'];
    }
    
    if (!empty($attrs['animationScale'])) {
        $data_attrs['data-animate-scale'] = $attrs['animationScale'];
    }
    
    if (isset($attrs['animationParallaxSpeed']) && $attrs['animationParallaxSpeed'] !== '') {
        $data_attrs['data-animate-parallax-speed'] = $attrs['animationParallaxSpeed'];
    }
    
    if (!empty($attrs['animationHoverEffect'])) {
        $data_attrs['data-animate-hover-effect'] = $attrs['animationHoverEffect'];
    }
    
    if (isset($attrs['animationMobileEnabled'])) {
        $data_attrs['data-animate-mobile'] = $attrs['animationMobileEnabled'] ? 'true' : 'false';
    }
    
    // Add SplitText attributes if enabled
    if (!empty($attrs['enableSplitText'])) {
        $data_attrs['data-split-text'] = 'true';
        
        if (!empty($attrs['splitTextType'])) {
            $data_attrs['data-split-type'] = $attrs['splitTextType'];
        }
        
        if (isset($attrs['splitTextStagger']) && $attrs['splitTextStagger'] !== '') {
            $data_attrs['data-split-stagger'] = $attrs['splitTextStagger'];
        }
    }

    // Convert data attributes to string
    $data_attrs_string = '';
    foreach ($data_attrs as $key => $value) {
        $data_attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
    }

    // Find the opening tag and add attributes (allow leading whitespace/newlines)
    if ($block['blockName'] === 'core/heading') {
        $block_content = preg_replace(
            '/\s*<h([1-6])([^>]*)>/i',
            '<h$1$2' . $data_attrs_string . '>',
            $block_content,
            1
        );
    } elseif ($block['blockName'] === 'core/paragraph') {
        $block_content = preg_replace(
            '/\s*<p([^>]*)>/i',
            '<p$1' . $data_attrs_string . '>',
            $block_content,
            1
        );
    }

    return $block_content;
}

add_filter('render_block', 'ileben_add_animation_to_core_blocks', 10, 2);
