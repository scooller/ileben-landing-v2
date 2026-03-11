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
    $text = $attributes['text'] ?? __('Tooltip text', 'ileben-landing');
    $placement = $attributes['placement'] ?? 'top';
    $trigger = $attributes['trigger'] ?? 'hover';
    $element = $attributes['element'] ?? 'button';
    $elementText = $attributes['elementText'] ?? __('Hover me', 'ileben-landing');
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
    
    ob_start();
    ?>
    <?php switch ($element) :
        case 'button': ?>
            <button type="button" class="<?php echo esc_attr($element_class_string); ?>"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html($elementText); ?></button>
            <?php break; ?>
        <?php case 'link': ?>
            <a href="#" class="<?php echo esc_attr($element_class_string); ?>"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html($elementText); ?></a>
            <?php break; ?>
        <?php default: ?>
            <span class="<?php echo esc_attr($element_class_string); ?>"<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html($elementText); ?></span>
    <?php endswitch; ?>
    <?php

    return ob_get_clean();
}

/**
 * Register Bootstrap Tooltip Block
 */
function bootstrap_theme_register_bs_tooltip_block() {
    register_block_type('bootstrap-theme/bs-tooltip', array(
        'api_version' => 3,
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