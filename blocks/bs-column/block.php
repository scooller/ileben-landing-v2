<?php
/**
 * Bootstrap Column Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Column Block
 */
function bootstrap_theme_render_bs_column_block($attributes, $content, $block) {
    $sm = $attributes['sm'] ?? '';
    $md = $attributes['md'] ?? '';
    $lg = $attributes['lg'] ?? '';
    $xl = $attributes['xl'] ?? '';
    $xxl = $attributes['xxl'] ?? '';
    $auto = $attributes['auto'] ?? false;
    $offset = $attributes['offset'] ?? '';
    $order = $attributes['order'] ?? '';
    $alignSelf = $attributes['alignSelf'] ?? '';
    
    // Build column classes
    $classes = array();
    
    if ($auto) {
        $classes[] = 'col-auto';
    } else {
        $classes[] = 'col';
        
        if (!empty($sm)) {
            $classes[] = 'col-sm-' . $sm;
        }
        
        if (!empty($md)) {
            $classes[] = 'col-md-' . $md;
        }
        
        if (!empty($lg)) {
            $classes[] = 'col-lg-' . $lg;
        }
        
        if (!empty($xl)) {
            $classes[] = 'col-xl-' . $xl;
        }
        
        if (!empty($xxl)) {
            $classes[] = 'col-xxl-' . $xxl;
        }
    }
    
    if (!empty($offset)) {
        $classes[] = $offset;
    }
    
    if (!empty($order)) {
        $classes[] = $order;
    }
    
    if (!empty($alignSelf)) {
        $classes[] = 'align-self-' . $alignSelf;
    }
    
    // Add custom CSS classes from Advanced panel
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    
    // Alternative way to get custom classes from block object
    if (isset($block->attributes['className']) && !empty($block->attributes['className'])) {
        $classes[] = $block->attributes['className'];
    }
    
    $class_string = implode(' ', array_unique($classes));
    
    $output = '<div class="' . esc_attr($class_string) . '">';
    
    // Add content from InnerBlocks
    if (!empty($content)) {
        $output .= $content;
    } else {
        $output .= '<p>' . __('Add content to your column.', 'bootstrap-theme') . '</p>';
    }
    
    $output .= '</div>';
    
    return $output;
}

/**
 * Register Bootstrap Column Block
 */
function bootstrap_theme_register_bs_column_block() {
    register_block_type('bootstrap-theme/bs-column', array(
        'render_callback' => 'bootstrap_theme_render_bs_column_block',
        'attributes' => array(
            'sm' => array(
                'type' => 'string',
                'default' => ''
            ),
            'md' => array(
                'type' => 'string',
                'default' => ''
            ),
            'lg' => array(
                'type' => 'string',
                'default' => ''
            ),
            'xl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'xxl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'auto' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'offset' => array(
                'type' => 'string',
                'default' => ''
            ),
            'order' => array(
                'type' => 'string',
                'default' => ''
            ),
            'alignSelf' => array(
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
add_action('init', 'bootstrap_theme_register_bs_column_block');
