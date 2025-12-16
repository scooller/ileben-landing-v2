<?php
/**
 * Bootstrap Menu Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Menu Block
 */
function bootstrap_theme_render_bs_menu_block($attributes, $content, $block) {
    $menuId = $attributes['menuId'] ?? '';
    $style = $attributes['style'] ?? 'nav';
    $orientation = $attributes['orientation'] ?? 'horizontal';
    $variant = $attributes['variant'] ?? 'primary';
    $size = $attributes['size'] ?? '';
    $justified = $attributes['justified'] ?? false;
    $fill = $attributes['fill'] ?? false;
    $dividers = $attributes['dividers'] ?? false;
    $activeClass = $attributes['activeClass'] ?? 'active';
    $alignment = $attributes['alignment'] ?? '';
    $textAlign = $attributes['textAlign'] ?? '';
    
    if (empty($menuId)) {
        return '<div class="alert alert-warning">' . __('Please select a menu to display.', 'bootstrap-theme') . '</div>';
    }
    
    // Get the menu
    $menu = wp_get_nav_menu_object($menuId);
    if (!$menu) {
        return '<div class="alert alert-danger">' . __('Selected menu not found.', 'bootstrap-theme') . '</div>';
    }
    
    // Get menu items
    $menu_items = wp_get_nav_menu_items($menu->term_id);
    if (empty($menu_items)) {
        return '<div class="alert alert-info">' . __('This menu has no items.', 'bootstrap-theme') . '</div>';
    }
    
    // Build menu classes based on style
    $menu_classes = array();
    $item_classes = array();
    $link_classes = array();
    
    switch ($style) {
        case 'list-group':
            $menu_classes[] = 'list-group';
            $item_classes[] = 'list-group-item';
            $link_classes[] = 'list-group-item-action';
            if ($orientation === 'horizontal') {
                $menu_classes[] = 'list-group-horizontal';
            }
            break;
            
        case 'button-group':
            $menu_classes[] = 'btn-group';
            if ($orientation === 'vertical') {
                $menu_classes[] = 'btn-group-vertical';
            }
            $link_classes[] = 'btn';
            $link_classes[] = 'btn-' . $variant;
            if (!empty($size)) {
                $link_classes[] = 'btn-' . $size;
            }
            break;
            
        case 'nav':
        default:
            $menu_classes[] = 'nav';
            if ($orientation === 'vertical') {
                $menu_classes[] = 'flex-column';
            }
            $item_classes[] = 'nav-item';
            $link_classes[] = 'nav-link';
            
            // Nav specific options
            if ($justified) {
                $menu_classes[] = 'nav-justified';
            }
            if ($fill) {
                $menu_classes[] = 'nav-fill';
            }
            break;
    }
    
    // Add alignment classes
    if (!empty($alignment) && $orientation === 'horizontal') {
        switch ($alignment) {
            case 'center':
                $menu_classes[] = 'justify-content-center';
                break;
            case 'end':
                $menu_classes[] = 'justify-content-end';
                break;
        }
    }
    
    // Add text alignment classes
    if (!empty($textAlign)) {
        switch ($textAlign) {
            case 'left':
                $menu_classes[] = 'text-start';
                break;
            case 'center':
                $menu_classes[] = 'text-center';
                break;
            case 'right':
                $menu_classes[] = 'text-end';
                break;
            case 'justify':
                $menu_classes[] = 'text-justify';
                break;
        }
    }
    
    // Add custom CSS classes from Advanced panel
    $menu_classes = bootstrap_theme_add_custom_classes($menu_classes, $attributes, $block);
    
    $menu_class_string = implode(' ', array_unique($menu_classes));
    $item_class_string = implode(' ', array_unique($item_classes));
    $link_class_string = implode(' ', array_unique($link_classes));
    
    // Start building output
    $tag = ($style === 'nav') ? 'ul' : 'div';
    $output = '<' . $tag . ' class="' . esc_attr($menu_class_string) . '">';
    
    // Get current URL for active state
    $current_url = home_url($_SERVER['REQUEST_URI']);
    
    foreach ($menu_items as $item) {
        // Skip items with parent (for now - simple menu)
        if ($item->menu_item_parent != 0) {
            continue;
        }
        
        $url = $item->url;
        $title = $item->title;
        $is_current = ($current_url === $url);
        
        // Get icon if exists
        $icon = get_post_meta($item->ID, '_menu_item_fa_icon', true);
        $is_button = get_post_meta($item->ID, '_menu_item_is_button', true);
        $button_style = get_post_meta($item->ID, '_menu_item_button_style', true);
        
        // Build item classes
        $current_item_classes = $item_classes;
        $current_link_classes = $link_classes;
        
        if ($is_current) {
            if ($style === 'list-group') {
                $current_item_classes[] = 'active';
            } else {
                $current_link_classes[] = $activeClass;
            }
        }
        
        // Override link classes if item is marked as button
        if ($is_button && !empty($button_style) && $style !== 'button-group') {
            $current_link_classes = array('btn', $button_style);
        }
        
        $item_class_str = implode(' ', array_unique($current_item_classes));
        $link_class_str = implode(' ', array_unique($current_link_classes));
        
        // Build icon HTML
        $icon_html = '';
        if (!empty($icon)) {
            $icon_class = strpos($icon, 'fa-') === 0 ? $icon : 'fa-' . $icon;
            $icon_html = '<svg class="icon me-2"><use xlink:href="#' . esc_attr($icon_class) . '"></use></svg>';
        }
        
        if ($style === 'nav') {
            $output .= '<li class="' . esc_attr($item_class_str) . '">';
            $output .= '<a href="' . esc_url($url) . '" class="' . esc_attr($link_class_str) . '">';
            $output .= $icon_html . esc_html($title);
            $output .= '</a>';
            $output .= '</li>';
        } elseif ($style === 'list-group') {
            if (!empty($item_class_str)) {
                $all_classes = $item_class_str . ' ' . $link_class_str;
            } else {
                $all_classes = $link_class_str;
            }
            $output .= '<a href="' . esc_url($url) . '" class="' . esc_attr(trim($all_classes)) . '">';
            $output .= $icon_html . esc_html($title);
            $output .= '</a>';
            
            // Add divider if enabled
            if ($dividers && $item !== end($menu_items)) {
                $output .= '<div class="list-group-item list-group-item-divider p-0 border-0"></div>';
            }
        } else { // button-group
            $output .= '<a href="' . esc_url($url) . '" class="' . esc_attr($link_class_str) . '">';
            $output .= $icon_html . esc_html($title);
            $output .= '</a>';
        }
    }
    
    $output .= '</' . $tag . '>';
    
    return $output;
}

/**
 * Register Bootstrap Menu Block
 */
function bootstrap_theme_register_bs_menu_block() {
    register_block_type('bootstrap-theme/bs-menu', array(
        'render_callback' => 'bootstrap_theme_render_bs_menu_block',
        'attributes' => array(
            'menuId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'style' => array(
                'type' => 'string',
                'default' => 'nav'
            ),
            'orientation' => array(
                'type' => 'string',
                'default' => 'horizontal'
            ),
            'variant' => array(
                'type' => 'string',
                'default' => 'primary'
            ),
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'justified' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'fill' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'dividers' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'activeClass' => array(
                'type' => 'string',
                'default' => 'active'
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => ''
            ),
            'textAlign' => array(
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
add_action('init', 'bootstrap_theme_register_bs_menu_block');