<?php
/**
 * Bootstrap Divider Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Divider Block
 */
function bootstrap_theme_render_bs_divider_block($attributes, $content, $block) {
    $text          = $attributes['text'] ?? '';
    $icon          = $attributes['icon'] ?? '';
    $align         = $attributes['align'] ?? 'center'; // start, center, end
    $variant       = $attributes['variant'] ?? 'solid'; // solid, dashed, dotted
    $color         = $attributes['color'] ?? 'secondary'; // secondary, primary, etc.
    $textColor     = $attributes['textColor'] ?? 'secondary';
    $marginY       = $attributes['marginY'] ?? '3';
    
    // Get animation data attributes
    $animation_attrs = bootstrap_theme_get_animation_attributes($attributes, $block);
    
    // Classes for the wrapper
    $wrapper_classes = ['d-flex', 'align-items-center'];
    if (!empty($marginY)) {
        $wrapper_classes[] = 'my-' . $marginY;
    }
    
    // Custom classes
    if (!empty($attributes['className'])) {
        $wrapper_classes[] = $attributes['className'];
    }
    
    // Border style
    $border_class = 'border-' . $color;
    $border_style_style = '';
    if ($variant === 'dashed') {
        $border_style_style = 'border-top-style: dashed !important;';
    } elseif ($variant === 'dotted') {
        $border_style_style = 'border-top-style: dotted !important;';
    }
    
    // Line HTML
    $line_html = sprintf(
        '<div class="flex-grow-1 border-top %s" style="%s"></div>',
        esc_attr($border_class),
        esc_attr($border_style_style)
    );
    
    // Build wrapper output with animation attributes
    $wrapper_open = '<div class="' . esc_attr(implode(' ', $wrapper_classes)) . '"' . $animation_attrs . '>';
    $wrapper_close = '</div>';
    
    // Content HTML (Text or Icon)
    $content_html = '';
    if (!empty($icon) || !empty($text)) {
        $inner_content = '';
        
        // Icon processing
        if (!empty($icon)) {
            $tokens = preg_split('/\s+/', (string) $icon, -1, PREG_SPLIT_NO_EMPTY);
            $tokens = array_filter($tokens, function($t){ return preg_match('/^fa[\-a-z0-9]+$/i', $t); });
            $icon_class = trim(implode(' ', $tokens));
            
            $icon_margin = (!empty($text)) ? 'me-2' : '';
            $inner_content .= '<i class="' . esc_attr($icon_class . ' ' . $icon_margin) . '"></i>';
        }
        
        if (!empty($text)) {
            $inner_content .= esc_html($text);
        }
        
        // Spacing classes based on alignment
        $spacing_class = 'mx-3'; // Default for center
        if ($align === 'start') {
            $spacing_class = 'me-3';
        } elseif ($align === 'end') {
            $spacing_class = 'ms-3';
        }
        
        $text_color_class = 'text-' . $textColor;
        
        $content_html = sprintf(
            '<span class="%s %s fw-medium">%s</span>',
            esc_attr($spacing_class),
            esc_attr($text_color_class),
            $inner_content // Allowed HTML (icon is safe, text is escaped above)
        );
    }
    
    // Construct final output based on alignment
    $output = $wrapper_open;
    
    if (empty($text) && empty($icon)) {
        // Just a simple line
        $output .= $line_html;
    } else {
        if ($align === 'center') {
            $output .= $line_html . $content_html . $line_html;
        } elseif ($align === 'start') {
            $output .= $content_html . $line_html;
        } elseif ($align === 'end') {
            $output .= $line_html . $content_html;
        }
    }
    
    $output .= $wrapper_close;
    
    return $output;
}

/**
 * Register Bootstrap Divider Block
 */
function bootstrap_theme_register_bs_divider_block() {
    register_block_type('bootstrap-theme/bs-divider', array(
        'render_callback' => 'bootstrap_theme_render_bs_divider_block',
        'attributes' => array(
            'text' => array('type' => 'string', 'default' => ''),
            'icon' => array('type' => 'string', 'default' => ''),
            'align' => array('type' => 'string', 'default' => 'center'),
            'variant' => array('type' => 'string', 'default' => 'solid'),
            'color' => array('type' => 'string', 'default' => 'secondary'),
            'textColor' => array('type' => 'string', 'default' => 'secondary'),
            'marginY' => array('type' => 'string', 'default' => '3'),
            'className' => array('type' => 'string', 'default' => ''),
        )
    ));
}

add_action('init', 'bootstrap_theme_register_bs_divider_block');
