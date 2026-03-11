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
    $buttonText = $attributes['buttonText'] ?? __('Dropdown', 'ileben-landing');
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
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($wrapper_class_string); ?>">
        <?php if ($split) : ?>
            <button type="button" class="btn <?php echo esc_attr($buttonVariant); ?>"><?php echo esc_html($buttonText); ?></button>
            <button type="button" class="btn <?php echo esc_attr($buttonVariant); ?> dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" id="<?php echo esc_attr($dropdownId); ?>">
                <span class="visually-hidden"><?php echo esc_html__('Toggle Dropdown', 'ileben-landing'); ?></span>
            </button>
        <?php else : ?>
            <button class="btn <?php echo esc_attr($buttonVariant); ?> dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="<?php echo esc_attr($dropdownId); ?>">
                <?php echo esc_html($buttonText); ?>
            </button>
        <?php endif; ?>

        <ul class="dropdown-menu" aria-labelledby="<?php echo esc_attr($dropdownId); ?>">
            <?php if (!empty($content)) : ?>
                <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php else : ?>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Action', 'ileben-landing'); ?></a></li>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Another action', 'ileben-landing'); ?></a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><?php echo esc_html__('Something else here', 'ileben-landing'); ?></a></li>
            <?php endif; ?>
        </ul>
    </div>
    <?php

    return ob_get_clean();
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