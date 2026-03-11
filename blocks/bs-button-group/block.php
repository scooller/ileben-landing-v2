<?php
/**
 * Bootstrap Button Group Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Bootstrap Button Group Block
 */
function bootstrap_theme_render_bs_button_group_block($attributes, $content, $block) {
    $size = $attributes['size'] ?? '';
    $vertical = $attributes['vertical'] ?? false;
    $buttons = $attributes['buttons'] ?? array();
    
    if (empty($buttons)) {
        $buttons = array(
            array('text' => __('Left', 'ileben-landing'), 'variant' => 'btn-outline-primary', 'link' => ''),
            array('text' => __('Middle', 'ileben-landing'), 'variant' => 'btn-outline-primary', 'link' => ''),
            array('text' => __('Right', 'ileben-landing'), 'variant' => 'btn-outline-primary', 'link' => '')
        );
    }
    
    // Build button group classes
    $classes = array();
    
    if ($vertical) {
        $classes[] = 'btn-group-vertical';
    } else {
        $classes[] = 'btn-group';
    }
    
    if (!empty($size)) {
        $classes[] = 'btn-group-' . $size;
    }
    
    // Add custom CSS classes from Advanced panel
    $classes = bootstrap_theme_add_custom_classes($classes, $attributes, $block);
    
    $class_string = implode(' ', array_unique($classes));
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($class_string); ?>" role="group" aria-label="<?php echo esc_attr__('Button group', 'ileben-landing'); ?>">
        <?php foreach ($buttons as $button) : ?>
            <?php
            $text = $button['text'] ?? '';
            $variant = $button['variant'] ?? 'btn-outline-primary';
            $link = $button['link'] ?? '';
            $disabled = $button['disabled'] ?? false;

            $button_classes = array('btn', $variant);
            if ($disabled) {
                $button_classes[] = 'disabled';
            }
            $button_class_string = implode(' ', $button_classes);
            ?>
            <?php if (!empty($link) && !$disabled) : ?>
                <a href="<?php echo esc_url($link); ?>" class="<?php echo esc_attr($button_class_string); ?>"><?php echo esc_html($text); ?></a>
            <?php else : ?>
                <button type="button" class="<?php echo esc_attr($button_class_string); ?>"<?php echo $disabled ? ' disabled' : ''; ?>><?php echo esc_html($text); ?></button>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Button Group Block
 */
function bootstrap_theme_register_bs_button_group_block() {
    register_block_type('bootstrap-theme/bs-button-group', array(
        'render_callback' => 'bootstrap_theme_render_bs_button_group_block',
        'attributes' => array(
            'size' => array(
                'type' => 'string',
                'default' => ''
            ),
            'vertical' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'buttons' => array(
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
add_action('init', 'bootstrap_theme_register_bs_button_group_block');