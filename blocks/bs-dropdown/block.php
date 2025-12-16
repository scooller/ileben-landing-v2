<?php
/**
 * Bootstrap Dropdown Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Dropdown Block
 */
function bootstrap_theme_render_bs_dropdown_block($attributes, $content, $block) {
    $buttonText = $attributes['buttonText'] ?? __('Dropdown', 'bootstrap-theme');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-secondary';
    $split = $attributes['split'] ?? false;
    $direction = $attributes['direction'] ?? '';
    $dropdownId = $attributes['dropdownId'] ?? 'dropdown-' . uniqid();
    
    // Build dropdown wrapper classes
    $wrapper_classes = array();
    
    switch ($direction) {
        case 'up':
            $wrapper_classes[] = 'dropup';
            break;
        case 'end':
            $wrapper_classes[] = 'dropend';
            break;
        case 'start':
            $wrapper_classes[] = 'dropstart';
            break;
        default:
            $wrapper_classes[] = 'dropdown';
            break;
    }
    
    if ($split) {
        $wrapper_classes[] = 'btn-group';
    }
    
    // Add custom CSS classes from Advanced panel
    $wrapper_classes = bootstrap_theme_add_custom_classes($wrapper_classes, $attributes, $block);
    
    $wrapper_class_string = implode(' ', array_unique($wrapper_classes));
    
    $output = '<div class="' . esc_attr($wrapper_class_string) . '">';
    
    if ($split) {
        // Split button dropdown
        $output .= '<button type="button" class="btn ' . esc_attr($buttonVariant) . '">' . esc_html($buttonText) . '</button>';
        $output .= '<button type="button" class="btn ' . esc_attr($buttonVariant) . ' dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" id="' . esc_attr($dropdownId) . '">';
        $output .= '<span class="visually-hidden">' . __('Toggle Dropdown', 'bootstrap-theme') . '</span>';
        $output .= '</button>';
    } else {
        // Regular dropdown
        $output .= '<button class="btn ' . esc_attr($buttonVariant) . ' dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="' . esc_attr($dropdownId) . '">';
        $output .= esc_html($buttonText);
        $output .= '</button>';
    }
    
    // Dropdown menu
    $output .= '<ul class="dropdown-menu" aria-labelledby="' . esc_attr($dropdownId) . '">';
    
    // Process the InnerBlocks content (dropdown items)
    if (!empty($content)) {
        // The content should already be processed HTML from InnerBlocks.Content
        $output .= $content;
    } else {
        // Default content if no items
        $output .= '<li><a class="dropdown-item" href="#">' . __('Action', 'bootstrap-theme') . '</a></li>';
        $output .= '<li><a class="dropdown-item" href="#">' . __('Another action', 'bootstrap-theme') . '</a></li>';
        $output .= '<li><hr class="dropdown-divider"></li>';
        $output .= '<li><a class="dropdown-item" href="#">' . __('Something else here', 'bootstrap-theme') . '</a></li>';
    }
    
    $output .= '</ul>';
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Dropdown Block
 */
function bootstrap_theme_register_bs_dropdown_block() {
    register_block_type('bootstrap-theme/bs-dropdown', array(
        'render_callback' => 'bootstrap_theme_render_bs_dropdown_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Dropdown'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-secondary'
            ),
            'split' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'direction' => array(
                'type' => 'string',
                'default' => ''
            ),
            'dropdownId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_dropdown_block');
