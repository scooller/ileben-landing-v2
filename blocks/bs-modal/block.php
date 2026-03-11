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
    $title = $attributes['title'] ?? __('Modal title', 'ileben-landing');
    $buttonText = $attributes['buttonText'] ?? __('Open Modal', 'ileben-landing');
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
    
    $modal_data_attrs = '';
    if ($backdrop !== 'true') {
        $modal_data_attrs .= ' data-bs-backdrop="' . esc_attr($backdrop) . '"';
    }
    if ($keyboard !== 'true') {
        $modal_data_attrs .= ' data-bs-keyboard="' . esc_attr($keyboard) . '"';
    }

    ob_start();
    ?>
    <button type="button" class="btn <?php echo esc_attr($buttonVariant); ?>" data-bs-toggle="modal" data-bs-target="#<?php echo esc_attr($modalId); ?>">
        <?php echo esc_html($buttonText); ?>
    </button>

    <div class="<?php echo esc_attr(implode(' ', array_unique($modal_classes))); ?>" id="<?php echo esc_attr($modalId); ?>" tabindex="-1" aria-labelledby="<?php echo esc_attr($modalId); ?>Label" aria-hidden="true"<?php echo $modal_data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
        <div class="<?php echo esc_attr(implode(' ', $dialog_classes)); ?>">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="<?php echo esc_attr($modalId); ?>Label"><?php echo esc_html($title); ?></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?php echo esc_attr__('Close', 'ileben-landing'); ?>"></button>
                </div>

                <div class="modal-body">
                    <?php if (!empty($content)) : ?>
                        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                    <?php else : ?>
                        <p><?php echo esc_html__('Add content to your modal.', 'ileben-landing'); ?></p>
                    <?php endif; ?>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php echo esc_html__('Close', 'ileben-landing'); ?></button>
                </div>
            </div>
        </div>
    </div>
    <?php

    return ob_get_clean();
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