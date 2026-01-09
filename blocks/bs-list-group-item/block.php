<?php

/**
 * Bootstrap List Group Item Block (dynamic render)
 *
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

function bootstrap_theme_render_bs_list_group_item_block($attributes, $content, $block)
{
    $text = $attributes['text'] ?? 'List item';
    $variant = $attributes['variant'] ?? '';
    $active = !empty($attributes['active']);
    $disabled = !empty($attributes['disabled']);
    $actionable = !empty($attributes['actionable']);
    $href = $attributes['href'] ?? '#';
    $openInNewTab = !empty($attributes['openInNewTab']);
    $hasContent = !empty($attributes['hasContent']);

    $classes = array('list-group-item');
    if (!empty($variant)) $classes[] = 'list-group-item-' . $variant;
    if ($active) $classes[] = 'active';
    if ($disabled) $classes[] = 'disabled';
    if ($actionable) $classes[] = 'list-group-item-action';

    // Custom classes from Advanced panel
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }

    $class_string = implode(' ', array_unique($classes));

    // Animation data attrs
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    $tag = $actionable ? 'a' : 'li';
    $rel = ($actionable && $openInNewTab) ? 'noopener noreferrer' : '';
    $target = ($actionable && $openInNewTab) ? '_blank' : '';

    // Render inner content if present (hasContent)
    if ($hasContent && !empty($block->inner_blocks)) {
        $inner_html = '';
        foreach ($block->inner_blocks as $child) {
            $inner_html .= $child->render();
        }
    } else {
        $inner_html = wp_kses_post($text);
    }

    $href_attr = $actionable ? ' href="' . esc_url($href) . '"' : '';
    $target_attr = $target ? ' target="' . esc_attr($target) . '"' : '';
    $rel_attr = $rel ? ' rel="' . esc_attr($rel) . '"' : '';

    return '<' . $tag . ' class="' . esc_attr($class_string) . '"' . $href_attr . $target_attr . $rel_attr . $animation_attrs . '>'
        . $inner_html . '</' . $tag . '>';
}

function bootstrap_theme_register_bs_list_group_item_block()
{
    register_block_type('bootstrap-theme/bs-list-group-item', array(
        'render_callback' => 'bootstrap_theme_render_bs_list_group_item_block',
        'attributes' => array(
            'text' => array('type' => 'string', 'default' => 'List item'),
            'variant' => array('type' => 'string', 'default' => ''),
            'active' => array('type' => 'boolean', 'default' => false),
            'disabled' => array('type' => 'boolean', 'default' => false),
            'actionable' => array('type' => 'boolean', 'default' => false),
            'href' => array('type' => 'string', 'default' => '#'),
            'openInNewTab' => array('type' => 'boolean', 'default' => false),
            'hasContent' => array('type' => 'boolean', 'default' => false),
            'className' => array('type' => 'string', 'default' => ''),
            // Animation attributes
            'animationType' => array('type' => 'string'),
            'animationTrigger' => array('type' => 'string'),
            'animationDuration' => array('type' => 'number'),
            'animationDelay' => array('type' => 'number'),
            'animationEase' => array('type' => 'string'),
            'animationRepeat' => array('type' => 'number'),
            'animationRepeatDelay' => array('type' => 'number'),
            'animationYoyo' => array('type' => 'boolean'),
            'animationDistance' => array('type' => 'string'),
            'animationRotation' => array('type' => 'number'),
            'animationScale' => array('type' => 'string'),
            'animationParallaxSpeed' => array('type' => 'number'),
            'animationHoverEffect' => array('type' => 'string'),
            'animationMobileEnabled' => array('type' => 'boolean'),
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_list_group_item_block');
