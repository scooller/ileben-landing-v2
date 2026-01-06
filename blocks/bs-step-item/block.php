<?php
/**
 * Bootstrap Step Item Block
 * 
 * @package Bootstrap_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Bootstrap Step Item Block
 */
function bootstrap_theme_register_bs_step_item_block() {
    register_block_type('bootstrap-theme/bs-step-item', array(
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Step'
            )
        )
    ));
}
add_action('init', 'bootstrap_theme_register_bs_step_item_block');
