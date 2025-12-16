<?php
/**
 * Bootstrap Tooltip Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Tooltip Block
 */
function bootstrap_theme_render_bs_tooltip_block($attributes, $content, $block) {
    $text = $attributes['text'] ?? __('Tooltip text', 'bootstrap-theme');
    $placement = $attributes['placement'] ?? 'top';
    $trigger = $attributes['trigger'] ?? 'hover';
    $element = $attributes['element'] ?? 'button';
    $elementText = $attributes['elementText'] ?? __('Hover me', 'bootstrap-theme');
    $variant = $attributes['variant'] ?? 'btn-secondary';
    
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
    
    $tooltip_data = array(
        'data-bs-toggle' => 'tooltip',
        'data-bs-placement' => $placement,
        'data-bs-trigger' => $trigger,
        'title' => $text
    );
    
    $data_attrs = '';
    foreach ($tooltip_data as $key => $value) {
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
            $output .= '<a href="#" class="' . esc_attr($element_class_string) . '"' . $data_attrs . '>';
            $output .= esc_html($elementText);
            $output .= '</a>';
            break;
        
        case 'span':
        default:
            $output .= '<span class="' . esc_attr($element_class_string) . '"' . $data_attrs . '>';
            $output .= esc_html($elementText);
            $output .= '</span>';
            break;
    }
    
    return $output;
}

/**
 * Register Bootstrap Tooltip Block
 */
function bootstrap_theme_register_bs_tooltip_block() {
    register_block_type('bootstrap-theme/bs-tooltip', array(
        'render_callback' => 'bootstrap_theme_render_bs_tooltip_block',
        'attributes' => array(
            'text' => array(
                'type' => 'string',
                'default' => 'Tooltip text'
            ),
            'placement' => array(
                'type' => 'string',
                'default' => 'top'
            ),
            'trigger' => array(
                'type' => 'string',
                'default' => 'hover'
            ),
            'element' => array(
                'type' => 'string',
                'default' => 'button'
            ),
            'elementText' => array(
                'type' => 'string',
                'default' => 'Hover me'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => 'btn-secondary'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_tooltip_block');
