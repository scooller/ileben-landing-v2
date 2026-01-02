<?php

/**
 * Bootstrap Card Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Card Block
 */
function bootstrap_theme_render_bs_card_block($attributes, $content, $block)
{
    $title = $attributes['title'] ?? '';
    $subtitle = $attributes['subtitle'] ?? '';
    $image = $attributes['image'] ?? '';
    $imageAlt = $attributes['imageAlt'] ?? '';
    $link = $attributes['link'] ?? '';
    $target = $attributes['target'] ?? '_self';
    $variant = $attributes['variant'] ?? '';
    $textAlign = $attributes['textAlign'] ?? '';
    $headerBg = $attributes['headerBg'] ?? '';
    $footerBg = $attributes['footerBg'] ?? '';
    $bodyClasses = $attributes['bodyClasses'] ?? '';
    $titleClasses = $attributes['titleClasses'] ?? '';
    $textClasses = $attributes['textClasses'] ?? '';

    // Build card classes
    $card_classes = array('card');
    if (!empty($variant)) {
        $card_classes[] = $variant;
    }

    // Add custom CSS classes from Advanced panel
    $card_classes = bootstrap_theme_add_custom_classes($card_classes, $attributes, $block);

    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);

    $body_classes = array('card-body');
    if (!empty($textAlign)) {
        $body_classes[] = 'text-' . $textAlign;
    }
    if (!empty($bodyClasses)) {
        $body_classes[] = $bodyClasses;
    }

    $output = '<div class="' . esc_attr(implode(' ', array_unique($card_classes))) . '"' . $animation_attrs . '>';

    // Card image
    if (!empty($image)) {
        if (!empty($link)) {
            $output .= '<a href="' . esc_url($link) . '" target="' . esc_attr($target) . '">';
        }
        $output .= '<img src="' . esc_url($image) . '" class="card-img-top" alt="' . esc_attr($imageAlt) . '">';
        if (!empty($link)) {
            $output .= '</a>';
        }
    }

    // Card header
    if (!empty($headerBg)) {
        $header_classes = 'card-header';
        if (!empty($headerBg)) {
            $header_classes .= ' ' . $headerBg;
        }
        $output .= '<div class="' . esc_attr($header_classes) . '">';
        if (!empty($title)) {
            $output .= '<h5 class="card-title mb-0">' . esc_html($title) . '</h5>';
        }
        $output .= '</div>';
    }

    // Card body
    $output .= '<div class="' . esc_attr(implode(' ', $body_classes)) . '">';

    // Title in body (if not in header)
    if (!empty($title) && empty($headerBg)) {
        $title_class = 'card-title';
        if (!empty($titleClasses)) {
            $title_class .= ' ' . $titleClasses;
        }
        if (!empty($link)) {
            $output .= '<h5 class="' . esc_attr($title_class) . '"><a href="' . esc_url($link) . '" target="' . esc_attr($target) . '" class="text-decoration-none">' . esc_html($title) . '</a></h5>';
        } else {
            $output .= '<h5 class="' . esc_attr($title_class) . '">' . esc_html($title) . '</h5>';
        }
    }

    // Subtitle
    if (!empty($subtitle)) {
        $output .= '<h6 class="card-subtitle mb-2 text-muted">' . esc_html($subtitle) . '</h6>';
    }

    // Content from InnerBlocks
    if (!empty($content)) {
        $text_class = 'card-text';
        if (!empty($textClasses)) {
            $text_class .= ' ' . $textClasses;
        }
        $output .= '<div class="' . esc_attr($text_class) . '">' . $content . '</div>';
    }

    $output .= '</div>'; // End card-body

    // Card footer
    if (!empty($footerBg)) {
        $footer_classes = 'card-footer';
        if (!empty($footerBg)) {
            $footer_classes .= ' ' . $footerBg;
        }
        $output .= '<div class="' . esc_attr($footer_classes) . '">';
        $output .= '<small class="text-muted">' . __('Card footer', 'bootstrap-theme') . '</small>';
        $output .= '</div>';
    }

    $output .= '</div>'; // End card

    return $output;
}

/**
 * Register Bootstrap Card Block
 */
function bootstrap_theme_register_bs_card_block()
{
    register_block_type('bootstrap-theme/bs-card', array(
        'render_callback' => 'bootstrap_theme_render_bs_card_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            'subtitle' => array(
                'type' => 'string',
                'default' => ''
            ),
            'image' => array(
                'type' => 'string',
                'default' => ''
            ),
            'imageAlt' => array(
                'type' => 'string',
                'default' => ''
            ),
            'link' => array(
                'type' => 'string',
                'default' => ''
            ),
            'target' => array(
                'type' => 'string',
                'default' => '_self'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textAlign' => array(
                'type' => 'string',
                'default' => ''
            ),
            'headerBg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'footerBg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bodyClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'titleClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textClasses' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            ),
            // Animation attributes
            'animationType' => array(
                'type' => 'string'
            ),
            'animationTrigger' => array(
                'type' => 'string'
            ),
            'animationDuration' => array(
                'type' => 'number'
            ),
            'animationDelay' => array(
                'type' => 'number'
            ),
            'animationEase' => array(
                'type' => 'string'
            ),
            'animationRepeat' => array(
                'type' => 'number'
            ),
            'animationRepeatDelay' => array(
                'type' => 'number'
            ),
            'animationYoyo' => array(
                'type' => 'boolean'
            ),
            'animationDistance' => array(
                'type' => 'string'
            ),
            'animationRotation' => array(
                'type' => 'number'
            ),
            'animationScale' => array(
                'type' => 'string'
            ),
            'animationParallaxSpeed' => array(
                'type' => 'number'
            ),
            'animationHoverEffect' => array(
                'type' => 'string'
            ),
            'animationMobileEnabled' => array(
                'type' => 'boolean'
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_card_block');
