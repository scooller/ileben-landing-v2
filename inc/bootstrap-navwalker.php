<?php
/**
 * Bootstrap 5 Walker for WordPress Navigation Menus
 * 
 * @package Bootstrap_Theme
 */

if (!class_exists('WP_Bootstrap_Navwalker')) {
    
    class WP_Bootstrap_Navwalker extends Walker_Nav_Menu {
        
        /**
         * Starts the list before the elements are added.
         */
        public function start_lvl(&$output, $depth = 0, $args = null) {
            if (isset($args->item_spacing) && 'discard' === $args->item_spacing) {
                $t = '';
                $n = '';
            } else {
                $t = "\t";
                $n = "\n";
            }
            $indent = ($depth) ? str_repeat($t, $depth) : '';
            $output .= "{$n}{$indent}<ul class=\"dropdown-menu\">{$n}";
        }
        
        /**
         * Ends the list after the elements are added.
         */
        public function end_lvl(&$output, $depth = 0, $args = null) {
            if (isset($args->item_spacing) && 'discard' === $args->item_spacing) {
                $t = '';
                $n = '';
            } else {
                $t = "\t";
                $n = "\n";
            }
            $indent = ($depth) ? str_repeat($t, $depth) : '';
            $output .= "{$n}{$indent}</ul>{$n}";
        }
        
        /**
         * Starts the element output.
         */
        public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
            if (isset($args->item_spacing) && 'discard' === $args->item_spacing) {
                $t = '';
                $n = '';
            } else {
                $t = "\t";
                $n = "\n";
            }
            $indent = ($depth) ? str_repeat($t, $depth) : '';
            $classes = empty($item->classes) ? array() : (array) $item->classes;
            $classes[] = 'nav-item';
            $has_children = in_array('menu-item-has-children', $classes);
            if ($has_children && $depth === 0) {
                $classes[] = 'dropdown';
            }
            $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));
            $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
            $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args);
            $id = $id ? ' id="' . esc_attr($id) . '"' : '';
            $output .= $indent . '<li' . $id . $class_names . '>';
            $attributes = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
            $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
            $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
            $attributes .= !empty($item->url) ? ' href="' . esc_attr($item->url) . '"' : '';
            // Custom fields: icon, button, style
            $icon = get_post_meta($item->ID, '_menu_item_fa_icon', true);
            $is_button = get_post_meta($item->ID, '_menu_item_is_button', true);
            $button_style = get_post_meta($item->ID, '_menu_item_button_style', true);
            // Link classes
            $link_classes = array();
            if ($has_children && $depth === 0) {
                $link_classes[] = 'dropdown-toggle';
                $attributes .= ' data-bs-toggle="dropdown" aria-expanded="false"';
            }
            if ($depth > 0) {
                $link_classes = array('dropdown-item');
            }
            if ($is_button && $button_style) {
                $link_classes[] = 'btn w-md-auto w-100';
                $link_classes[] = $button_style;
            }else {
                $link_classes[] = 'nav-link w-md-auto w-100';
            }
            $link_class = ' class="' . implode(' ', $link_classes) . '"';
            $item_output = isset($args->before) ? $args->before : '';
            $item_output .= '<a' . $attributes . $link_class . '>';
            if ($icon) {
                $icon_class = strpos($icon, 'fa-') === 0 ? $icon : 'fa-' . $icon;
                $item_output .= '<i class="fas ' . esc_attr($icon_class) . ' me-1"></i>';
            }
            $item_output .= (isset($args->link_before) ? $args->link_before : '') . apply_filters('the_title', $item->title, $item->ID) . (isset($args->link_after) ? $args->link_after : '');
            $item_output .= '</a>';
            $item_output .= isset($args->after) ? $args->after : '';
            
            $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
        }
        
        /**
         * Ends the element output.
         */
        public function end_el(&$output, $item, $depth = 0, $args = null) {
            if (isset($args->item_spacing) && 'discard' === $args->item_spacing) {
                $t = '';
                $n = '';
            } else {
                $t = "\t";
                $n = "\n";
            }
            $output .= "</li>{$n}";
        }
    }
}
