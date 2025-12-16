<?php
/**
 * Bootstrap Popover Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Popover Block
 */
function bootstrap_theme_render_bs_popover_block($attributes, $content, $block) {
    $title = $attributes['title'] ?? __('Popover title', 'bootstrap-theme');
    $content_text = $attributes['content'] ?? __('Popover content', 'bootstrap-theme');
    $placement = $attributes['placement'] ?? 'right';
    $trigger = $attributes['trigger'] ?? 'click';
    $element = $attributes['element'] ?? 'button';
    $elementText = $attributes['elementText'] ?? __('Click me', 'bootstrap-theme');
    $variant = $attributes['variant'] ?? 'btn-danger';
    
    // Build element classes
    $element_classes = array();
    
    if ($element === 'button') {
        $element_classes[] = 'btn';
        $element_classes[] = $variant;
    } elseif ($element === 'link') {
        $element_classes[] = 'text-decoration-none';
    }
    
    // Add custom CSS classes from Advanced panel
    $element_classes = bootstrap_theme_add_custom_classes($element_classes, $attributes, $block);
    
    $element_class_string = implode(' ', array_unique($element_classes));
    
    $popover_data = array(
        'data-bs-toggle' => 'popover',
        'data-bs-placement' => $placement,
        'data-bs-trigger' => $trigger,
        'data-bs-title' => $title,
        'data-bs-content' => $content_text
    );
    
    $data_attrs = '';
    foreach ($popover_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    $output = '';
    
    switch ($element) {
        case 'button':
            $output .= '<button type="button" class="' . esc_attr($element_class_string) . '"' . $data_attrs . '>';
            $output .= esc_html($elementText);
            $output .= '</button>';
            break;
        
        case 'link':
            $output .= '<a href="#" class="' . esc_attr($element_class_string) . '" tabindex="0"' . $data_attrs . '>';
            $output .= esc_html($elementText);
            $output .= '</a>';
            break;
        
        case 'span':
        default:
            $output .= '<span class="' . esc_attr($element_class_string) . '" tabindex="0"' . $data_attrs . '>';
            $output .= esc_html($elementText);
            $output .= '</span>';
            break;
    }
    
    return $output;
}

/**
 * Register Bootstrap Popover Block
 */
function bootstrap_theme_register_bs_popover_block() {
    register_block_type('bootstrap-theme/bs-popover', array(
        'render_callback' => 'bootstrap_theme_render_bs_popover_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Popover title'
            ),
            'content' => array(
                'type' => 'string',
                'default' => 'Popover content'
            ),
            'placement' => array(
                'type' => 'string',
                'default' => 'right'
            ),
            'trigger' => array(
                'type' => 'string',
                'default' => 'click'
            ),
            'element' => array(
                'type' => 'string',
                'default' => 'button'
            ),
            'elementText' => array(
                'type' => 'string',
                'default' => 'Click me'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => 'btn-danger'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_popover_block');
