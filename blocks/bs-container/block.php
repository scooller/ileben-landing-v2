<?php
/**
 * Bootstrap Container Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Container Block
 */
function bootstrap_theme_render_bs_container_block($attributes, $content, $block) {
    $type = $attributes['type'] ?? 'container';
    $fluid = $attributes['fluid'] ?? false;
    $breakpoint = $attributes['breakpoint'] ?? '';
    $anchor = isset($attributes['anchor']) ? sanitize_title($attributes['anchor']) : '';
    $backgroundColor = $attributes['backgroundColor'] ?? '';
    $textColor = $attributes['textColor'] ?? '';
    $padding = $attributes['padding'] ?? '';
    $margin = $attributes['margin'] ?? '';
    // New background options
    $bgType = $attributes['bgType'] ?? 'none'; // none|solid|gradient
    $bgColor = $attributes['bgColor'] ?? '';
    $bgGradientFrom = $attributes['bgGradientFrom'] ?? '';
    $bgGradientTo = $attributes['bgGradientTo'] ?? '';
    $bgGradientDirection = $attributes['bgGradientDirection'] ?? 'to right';
    // Swiper toggle + per-instance settings
    $isSwiper = !empty($attributes['isSwiper']);
    $swiperSlidesPerView = isset($attributes['swiperSlidesPerView']) ? $attributes['swiperSlidesPerView'] : '';
    $swiperSpaceBetween = isset($attributes['swiperSpaceBetween']) ? $attributes['swiperSpaceBetween'] : '';
    $swiperLoop = isset($attributes['swiperLoop']) ? (bool)$attributes['swiperLoop'] : null;
    $swiperSpeed = isset($attributes['swiperSpeed']) ? $attributes['swiperSpeed'] : '';
    $swiperAutoplay = isset($attributes['swiperAutoplay']) ? (bool)$attributes['swiperAutoplay'] : null;
    $swiperAutoplayDelay = isset($attributes['swiperAutoplayDelay']) ? $attributes['swiperAutoplayDelay'] : '';
    $swiperPagination = isset($attributes['swiperPagination']) ? (bool)$attributes['swiperPagination'] : null;
    $swiperNavigation = isset($attributes['swiperNavigation']) ? (bool)$attributes['swiperNavigation'] : null;
    
    // Build container classes
    $classes = array();
    
    if ($fluid) {
        $classes[] = 'container-fluid';
    } else if (!empty($breakpoint)) {
        $classes[] = 'container-' . $breakpoint;
    } else {
        $classes[] = 'container';
    }
    
    // Add utility classes
    if (!empty($backgroundColor)) {
        $classes[] = $backgroundColor;
    }
    
    if (!empty($textColor)) {
        $classes[] = $textColor;
    }
    
    if (!empty($padding)) {
        $classes[] = $padding;
    }
    
    if (!empty($margin)) {
        $classes[] = $margin;
    }
    
    // Add custom CSS classes from Advanced panel
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    
    // Alternative way to get custom classes from block object
    if (isset($block->attributes['className']) && !empty($block->attributes['className'])) {
        $classes[] = $block->attributes['className'];
    }
    
    if ($isSwiper) {
        // Add Swiper classes to container
        $classes[] = 'swiper';
        $classes[] = 'js-swiper';
    }

    $class_string = implode(' ', array_unique($classes));

    // Build inline styles for custom background
    $styles = array();
    $sanitize_color = function($color) {
        $color = trim($color);
        if ($color === '') return '';
        // Accept hex (#RGB or #RRGGBB)
        if (preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $color)) return $color;
        // Accept rgb/rgba()
        if (preg_match('/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/', $color)) return $color;
        // Accept hsl/hsla() basic
        if (preg_match('/^hsla?\(.*\)$/', $color)) return $color;
        return '';
    };

    if ($bgType === 'solid') {
        $color = $sanitize_color($bgColor);
        if ($color) {
            $styles['background-color'] = $color;
        }
    } elseif ($bgType === 'gradient') {
        $from = $sanitize_color($bgGradientFrom);
        $to = $sanitize_color($bgGradientTo);
        $dir = in_array($bgGradientDirection, array('to right','to left','to bottom','to top','45deg','135deg'), true) ? $bgGradientDirection : 'to right';
        if ($from && $to) {
            $styles['background-image'] = 'linear-gradient(' . $dir . ', ' . $from . ', ' . $to . ')';
        }
    } elseif ($bgType === 'image') {
        $bgImageURL = isset($attributes['bgImageURL']) ? esc_url_raw($attributes['bgImageURL']) : '';
        if ($bgImageURL) {
            $styles['background-image'] = 'url(' . $bgImageURL . ')';
            $size = isset($attributes['bgImageSize']) ? $attributes['bgImageSize'] : 'cover';
            $pos = isset($attributes['bgImagePosition']) ? $attributes['bgImagePosition'] : 'center center';
            $repeat = isset($attributes['bgImageRepeat']) ? $attributes['bgImageRepeat'] : 'no-repeat';
            $attach = isset($attributes['bgImageAttachment']) ? $attributes['bgImageAttachment'] : 'scroll';

            $allowed_sizes = array('cover','contain','auto');
            $allowed_positions = array('center center','center top','center bottom','left center','right center');
            $allowed_repeats = array('no-repeat','repeat','repeat-x','repeat-y');
            $allowed_attach = array('scroll','fixed');

            $styles['background-size'] = in_array($size, $allowed_sizes, true) ? $size : 'cover';
            $styles['background-position'] = in_array($pos, $allowed_positions, true) ? $pos : 'center center';
            $styles['background-repeat'] = in_array($repeat, $allowed_repeats, true) ? $repeat : 'no-repeat';
            $styles['background-attachment'] = in_array($attach, $allowed_attach, true) ? $attach : 'scroll';
        }
    }

    $style_string = '';
    if (!empty($styles)) {
        $pairs = array();
        foreach ($styles as $k => $v) {
            $pairs[] = $k . ':' . $v;
        }
        $style_string = ' style="' . esc_attr(implode(';', $pairs)) . '"';
    }

    // Data attributes for per-instance swiper config
    $data_attrs = '';
    if ($isSwiper) {
        $map = [];
        if ($swiperSlidesPerView !== '') $map['data-swiper-slides'] = esc_attr($swiperSlidesPerView);
        if ($swiperSpaceBetween !== '') $map['data-swiper-space'] = esc_attr($swiperSpaceBetween);
        if ($swiperLoop !== null) $map['data-swiper-loop'] = $swiperLoop ? 'true' : 'false';
        if ($swiperSpeed !== '') $map['data-swiper-speed'] = esc_attr($swiperSpeed);
        if ($swiperAutoplay !== null) $map['data-swiper-autoplay'] = $swiperAutoplay ? 'true' : 'false';
        if ($swiperAutoplayDelay !== '') $map['data-swiper-autoplay-delay'] = esc_attr($swiperAutoplayDelay);
        if ($swiperPagination !== null) $map['data-swiper-pagination'] = $swiperPagination ? 'true' : 'false';
        if ($swiperNavigation !== null) $map['data-swiper-navigation'] = $swiperNavigation ? 'true' : 'false';
        foreach ($map as $k => $v) {
            $data_attrs .= ' ' . $k . '="' . $v . '"';
        }
    }

    $id_attr = $anchor ? ' id="' . esc_attr($anchor) . '"' : '';
    $output = '<div class="' . esc_attr($class_string) . '"' . $id_attr . $style_string . $data_attrs . '>';
    
    // Add content from InnerBlocks
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<p>' . __('Add content to your container.', 'bootstrap-theme') . '</p>';
    }
    
    // Render default Swiper controls (can be enabled via JS config)
    if ($isSwiper) {
        $output .= '<div class="swiper-pagination"></div>';
        $output .= '<div class="swiper-button-prev"></div>';
        $output .= '<div class="swiper-button-next"></div>';
    }

    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Container Block
 */
function bootstrap_theme_register_bs_container_block() {
    register_block_type('bootstrap-theme/bs-container', array(
        'render_callback' => 'bootstrap_theme_render_bs_container_block',
        'supports' => array(
            'anchor' => true,
        ),
        'attributes' => array(
            'type' => array(
                'type' => 'string',
                'default' => 'container'
            ),
            'fluid' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'breakpoint' => array(
                'type' => 'string',
                'default' => ''
            ),
            'anchor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'backgroundColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'padding' => array(
                'type' => 'string',
                'default' => ''
            ),
            'margin' => array(
                'type' => 'string',
                'default' => ''
            ),
            // New background attributes
            'bgType' => array(
                'type' => 'string',
                'default' => 'none'
            ),
            'bgColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgGradientFrom' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgGradientTo' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgGradientDirection' => array(
                'type' => 'string',
                'default' => 'to right'
            ),
            // Swiper toggle
            'isSwiper' => array(
                'type' => 'boolean',
                'default' => false
            ),
            // Image background attributes
            'bgImageID' => array(
                'type' => 'number',
                'default' => 0
            ),
            'bgImageURL' => array(
                'type' => 'string',
                'default' => ''
            ),
            'bgImageSize' => array(
                'type' => 'string',
                'default' => 'cover'
            ),
            'bgImagePosition' => array(
                'type' => 'string',
                'default' => 'center center'
            ),
            'bgImageRepeat' => array(
                'type' => 'string',
                'default' => 'no-repeat'
            ),
            'bgImageAttachment' => array(
                'type' => 'string',
                'default' => 'scroll'
            ),
            // Swiper per-instance attributes
            'swiperSlidesPerView' => array(
                'type' => 'string',
                'default' => ''
            ),
            'swiperSpaceBetween' => array(
                'type' => 'string',
                'default' => ''
            ),
            'swiperLoop' => array(
                'type' => 'boolean',
                'default' => null
            ),
            'swiperSpeed' => array(
                'type' => 'string',
                'default' => ''
            ),
            'swiperAutoplay' => array(
                'type' => 'boolean',
                'default' => null
            ),
            'swiperAutoplayDelay' => array(
                'type' => 'string',
                'default' => ''
            ),
            'swiperPagination' => array(
                'type' => 'boolean',
                'default' => null
            ),
            'swiperNavigation' => array(
                'type' => 'boolean',
                'default' => null
            ),
            'className' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_container_block');
