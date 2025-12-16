<?php
/**
 * Bootstrap Placeholders Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Placeholders Block
 */
function bootstrap_theme_render_bs_placeholders_block($attributes, $content, $block) {
    $animation = $attributes['animation'] ?? '';
    $color = $attributes['color'] ?? '';
    $size = $attributes['size'] ?? '';
    $placeholders = $attributes['placeholders'] ?? array();
    
    if (empty($placeholders)) {
        $placeholders = array(
            array('width' => '6', 'type' => 'placeholder'),
            array('width' => '4', 'type' => 'placeholder'),
            array('width' => '4', 'type' => 'placeholder'),
            array('width' => '6', 'type' => 'placeholder'),
            array('width' => '8', 'type' => 'placeholder')
        );
    }
    
    // Build container classes
    $container_classes = array('placeholder-container');
    
    // Add custom CSS classes from Advanced panel
    $container_classes = bootstrap_theme_add_custom_classes($container_classes, $attributes, $block);
    
    $container_class_string = implode(' ', array_unique($container_classes));
    
    $output = '<div class="' . esc_attr($container_class_string) . '">';
    
    foreach ($placeholders as $placeholder) {
        $width = $placeholder['width'] ?? '12';
        $type = $placeholder['type'] ?? 'placeholder';
        
        if ($type === 'text') {
            $output .= '<p class="placeholder-paragraph">';
            $for_count = intval($width);
            for ($i = 0; $i < $for_count; $i++) {
                $output .= '<span class="placeholder col-' . esc_attr($width) . '"></span> ';
            }
            $output .= '</p>';
        } else {
            // Build placeholder classes
            $classes = array('placeholder');
            
            if (!empty($color)) {
                $classes[] = 'bg-' . $color;
            }
            
            if (!empty($size)) {
                $classes[] = 'placeholder-' . $size;
            }
            
            if (!empty($animation)) {
                $classes[] = 'placeholder-' . $animation;
            }
            
            $classes[] = 'col-' . $width;
            
            $class_string = implode(' ', $classes);
            
            $output .= '<span class="' . esc_attr($class_string) . '"></span>';
        }
    }
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Placeholders Block
 */
function bootstrap_theme_register_bs_placeholders_block() {
    register_block_type('bootstrap-theme/bs-placeholders', array(
        'render_callback' => 'bootstrap_theme_render_bs_placeholders_block',
        'attributes' => array(
            'animation' => array(
                'type' => 'string',
                'default' => ''
            ),
            'color' => array(
                'type' => 'string',
                'default' => ''
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'placeholders' => array(
                'type' => 'array',
                'default' => array()
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_placeholders_block');
