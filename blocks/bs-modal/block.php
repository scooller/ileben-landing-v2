<?php
/**
 * Bootstrap Modal Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Modal Block
 */
function bootstrap_theme_render_bs_modal_block($attributes, $content, $block) {
    $modalId = $attributes['modalId'] ?? 'modal-' . wp_generate_uuid4();
    $title = $attributes['title'] ?? __('Modal title', 'bootstrap-theme');
    $buttonText = $attributes['buttonText'] ?? __('Open Modal', 'bootstrap-theme');
    $buttonVariant = $attributes['buttonVariant'] ?? 'btn-primary';
    $size = $attributes['size'] ?? '';
    $centered = $attributes['centered'] ?? false;
    $scrollable = $attributes['scrollable'] ?? false;
    $backdrop = $attributes['backdrop'] ?? 'true';
    $keyboard = $attributes['keyboard'] ?? 'true';
    
    // Build modal classes
    $modal_classes = array('modal', 'fade');
    
    // Add custom CSS classes from Advanced panel
    $modal_classes = bootstrap_theme_add_custom_classes($modal_classes, $attributes, $block);
    
    $dialog_classes = array('modal-dialog');
    
    if (!empty($size)) {
        $dialog_classes[] = 'modal-' . $size;
    }
    
    if ($centered) {
        $dialog_classes[] = 'modal-dialog-centered';
    }
    
    if ($scrollable) {
        $dialog_classes[] = 'modal-dialog-scrollable';
    }
    
    // Trigger button
    $output = '<button type="button" class="btn ' . esc_attr($buttonVariant) . '" data-bs-toggle="modal" data-bs-target="#' . esc_attr($modalId) . '">';
    $output .= esc_html($buttonText);
    $output .= '</button>';
    
    // Modal structure
    $output .= '<div class="' . esc_attr(implode(' ', array_unique($modal_classes))) . '" id="' . esc_attr($modalId) . '" tabindex="-1" aria-labelledby="' . esc_attr($modalId) . 'Label" aria-hidden="true"';
    
    if ($backdrop !== 'true') {
        $output .= ' data-bs-backdrop="' . esc_attr($backdrop) . '"';
    }
    
    if ($keyboard !== 'true') {
        $output .= ' data-bs-keyboard="' . esc_attr($keyboard) . '"';
    }
    
    $output .= '>';
    
    $output .= '<div class="' . esc_attr(implode(' ', $dialog_classes)) . '">';
    $output .= '<div class="modal-content">';
    
    // Modal header
    $output .= '<div class="modal-header">';
    $output .= '<h5 class="modal-title" id="' . esc_attr($modalId) . 'Label">' . esc_html($title) . '</h5>';
    $output .= '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="' . esc_attr__('Close', 'bootstrap-theme') . '"></button>';
    $output .= '</div>';
    
    // Modal body
    $output .= '<div class="modal-body">';
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<p>' . __('Add content to your modal.', 'bootstrap-theme') . '</p>';
    }
    $output .= '</div>';
    
    // Modal footer
    $output .= '<div class="modal-footer">';
    $output .= '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">' . __('Close', 'bootstrap-theme') . '</button>';
    $output .= '</div>';
    
    $output .= '</div>'; // modal-content
    $output .= '</div>'; // modal-dialog
    $output .= '</div>'; // modal
    
    return $output;
}

/**
 * Register Bootstrap Modal Block
 */
function bootstrap_theme_register_bs_modal_block() {
    register_block_type('bootstrap-theme/bs-modal', array(
        'render_callback' => 'bootstrap_theme_render_bs_modal_block',
        'attributes' => array(
            'modalId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'title' => array(
                'type' => 'string',
                'default' => 'Modal title'
            ),
            'buttonText' => array(
                'type' => 'string',
                'default' => 'Open Modal'
            ),
            'buttonVariant' => array(
                'type' => 'string',
                'default' => 'btn-primary'
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'centered' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'scrollable' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'backdrop' => array(
                'type' => 'string',
                'default' => 'true'
            ),
            'keyboard' => array(
                'type' => 'string',
                'default' => 'true'
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_modal_block');
