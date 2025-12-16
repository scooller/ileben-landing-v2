<?php
/**
 * Bootstrap Button Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Button Block
 */
function bootstrap_theme_render_bs_button_block($attributes, $content, $block) {
    $variant       = $attributes['variant'] ?? 'btn-primary';
    $size          = $attributes['size'] ?? '';
    $outline       = $attributes['outline'] ?? false;
    $disabled      = $attributes['disabled'] ?? false;
    // Alinear con editor: aceptar 'link' y fallback a 'href'
    $link          = $attributes['link'] ?? ( $attributes['href'] ?? '' );
    $target        = $attributes['target'] ?? '_self';
    $text          = $attributes['text'] ?? __('Button', 'bootstrap-theme');
    $icon          = $attributes['icon'] ?? '';
    $iconPosition  = $attributes['iconPosition'] ?? 'left'; // 'left' | 'right'
    
    // Build button classes
    $classes = array('btn');
    
    if ($outline) {
        $classes[] = str_replace('btn-', 'btn-outline-', $variant);
    } else {
        $classes[] = $variant;
    }
    
    if (!empty($size)) {
        $classes[] = $size;
    }
    
    if ($disabled) {
        $classes[] = 'disabled';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    // Helper: sanitizar clases de Font Awesome y aplicar espaciado
    $button_content = '';
    if (!empty($icon)) {
        $tokens = preg_split('/\s+/', (string) $icon, -1, PREG_SPLIT_NO_EMPTY);
        $tokens = array_filter($tokens, function($t){ return preg_match('/^fa[\-a-z0-9]+$/i', $t); });
        // Si no incluye ningún prefijo, no forzamos uno: el usuario controla 'fa-solid|fa-regular|fa-brands'
        $icon_class = trim(implode(' ', $tokens));
        // Espaciado Bootstrap según posición si hay texto
        $space_class = ($text !== '') ? ($iconPosition === 'left' ? ' me-2' : ' ms-2') : '';
        $icon_html = '<i class="' . esc_attr($icon_class . $space_class) . '"></i>';

        if ($iconPosition === 'left') {
            $button_content = $icon_html . esc_html($text);
        } else {
            $button_content = esc_html($text) . $icon_html;
        }
    } else {
        $button_content = esc_html($text);
    }
    
    // Render button
    if (!empty($link)) {
        $output = sprintf(
            '<a href="%s" class="%s" target="%s"%s>%s</a>',
            esc_url($link),
            esc_attr($class_string),
            esc_attr($target),
            $disabled ? ' aria-disabled="true"' : '',
            $button_content
        );
    } else {
        $output = sprintf(
            '<button type="button" class="%s"%s>%s</button>',
            esc_attr($class_string),
            $disabled ? ' disabled' : '',
            $button_content
        );
    }
    
    return $output;
}

/**
 * Register Bootstrap Button Block
 */
function bootstrap_theme_register_bs_button_block() {
    register_block_type('bootstrap-theme/bs-button', array(
        'render_callback' => 'bootstrap_theme_render_bs_button_block',
        'attributes' => array(
            'variant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'outline' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'disabled' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'link' => array(
                'type' => 'string',
                'default' => ''
            ),
            // Fallback por compatibilidad con ediciones anteriores
            'href' => array(
                'type' => 'string',
                'default' => ''
            ),
            'target' => array(
                'type' => 'string',
                'default' => '_self'
            ),
            'text' => array(
                'type' => 'string',
                'default' => 'Button'
            ),
            'icon' => array(
                'type' => 'string',
                'default' => ''
            ),
            'iconPosition' => array(
                'type' => 'string',
                'default' => 'left'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_button_block');
