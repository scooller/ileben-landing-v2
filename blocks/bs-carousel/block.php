<?php
/**
 * Bootstrap Carousel Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Carousel Block
 */
function bootstrap_theme_render_bs_carousel_block($attributes, $content, $block) {
    $carouselId = $attributes['carouselId'] ?? 'carousel-' . uniqid();
    $showControls = $attributes['showControls'] ?? true;
    $showIndicators = $attributes['showIndicators'] ?? true;
    $autoplay = $attributes['autoplay'] ?? false;
    $interval = $attributes['interval'] ?? 5000;
    $fade = $attributes['fade'] ?? false;
    
    // Build carousel classes
    $classes = array('carousel', 'slide');
    
    if ($fade) {
        $classes[] = 'carousel-fade';
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    $carousel_data = array(
        'data-bs-ride' => $autoplay ? 'carousel' : 'false',
        'data-bs-interval' => $interval
    );
    
    $data_attrs = '';
    foreach ($carousel_data as $key => $value) {
        $data_attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    $output = '<div class="' . esc_attr($class_string) . '" id="' . esc_attr($carouselId) . '"' . $data_attrs . '>';
    
    // Indicators (opcional - pueden agregarse via JS si es necesario contar slides)
    if ($showIndicators) {
        $output .= '<div class="carousel-indicators" id="' . esc_attr($carouselId) . '-indicators"></div>';
    }
    
    // Slides from InnerBlocks
    $output .= '<div class="carousel-inner">';
    
    // Process the InnerBlocks content (carousel items)
    if (!empty($content)) {
        // The content should already be processed HTML from InnerBlocks.Content
        $output .= $content;
    } else {
        // Default content if no items
        $output .= '<div class="carousel-item active">';
        $output .= '<div class="carousel-placeholder d-block w-100" style="height: 400px; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">';
        $output .= '<span class="text-muted">' . __('Add carousel items...', 'bootstrap-theme') . '</span>';
        $output .= '</div>';
        $output .= '</div>';
    }
    $output .= '</div>';
    
    // Controls
    if ($showControls) {
        $output .= '<button class="carousel-control-prev" type="button" data-bs-target="#' . esc_attr($carouselId) . '" data-bs-slide="prev">';
        $output .= '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
        $output .= '<span class="visually-hidden">' . __('Previous', 'bootstrap-theme') . '</span>';
        $output .= '</button>';
        
        $output .= '<button class="carousel-control-next" type="button" data-bs-target="#' . esc_attr($carouselId) . '" data-bs-slide="next">';
        $output .= '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
        $output .= '<span class="visually-hidden">' . __('Next', 'bootstrap-theme') . '</span>';
        $output .= '</button>';
    }
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Carousel Block
 */
function bootstrap_theme_register_bs_carousel_block() {
    register_block_type('bootstrap-theme/bs-carousel', array(
        'render_callback' => 'bootstrap_theme_render_bs_carousel_block',
        'supports' => array(
            'html' => true,
        ),
        'attributes' => array(
            'carouselId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'showControls' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'showIndicators' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'autoplay' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'interval' => array(
                'type' => 'integer',
                'default' => 5000
            ),
            'fade' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_carousel_block');
